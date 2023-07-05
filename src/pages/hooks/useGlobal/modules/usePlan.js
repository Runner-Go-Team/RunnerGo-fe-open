import { useEffect } from 'react';
import Bus, { useEventBus } from '@utils/eventBus';
import { cloneDeep, isArray, set, findIndex } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { tap, filter, map, concatMap, switchMap, from } from 'rxjs';
import { fetchSceneFlowDetail, fetchCreateSceneFlow, fetchSceneDetail, fetchCreateScene, fetchBatchFlowDetail } from '@services/scene';
import { fetchCreatePre, fetchCreatePlan, fetchDeletePlan, fetchRunPlan, fetchStopPlan, fetchImportScene } from '@services/plan';
import {fetchCreateTPlan, fetchDeleteTPlan, fetchRunAutoPlan, fetchStopAutoPlan } from '@services/auto_plan';
import { formatSceneData, isURL, createUrl, GetUrlQueryToArray } from '@utils';
import { getBaseCollection } from '@constants/baseCollection';
import { fetchApiDetail, fetchChangeSort } from '@services/apis';
import { getSceneList$ } from '@rxUtils/scene';
import { getUserConfig$ } from '@rxUtils/user';
import QueryString from 'qs';
import { useParams } from 'react-router-dom';

import { global$ } from '../global';
import { v4 } from 'uuid';

const usePlan = () => {
    const dispatch = useDispatch();
    const env_id = useSelector((store) => store.env.scene_env_id);

    const savePreConfig = ({ task_type, mode, cron_expr, mode_conf }, callback, plan_id) => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            task_type,
            mode,
            cron_expr,
            mode_conf,
            plan_id
        };

        fetchCreatePre(params).subscribe({
            next: (res) => {

                callback && callback();
            }
        })
    };

    const createPlan = ({ name, remark, taskType }, callback) => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            plan_name: name,
            remark,
            task_type: taskType
        };

        fetchCreatePlan(params).subscribe({
            next: (res) => {
                const { code, data: { plan_id } } = res;

                if (code === 0) {
                    dispatch({
                        type: 'plan/updateRefreshList',
                        payload: true
                    })
                }
                callback && callback(code, plan_id);
            }
        })
    }

    const createTPlan = ({ name, remark }, callback) => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            plan_name: name,
            remark,
        };

        fetchCreateTPlan(params).subscribe({
            next: (res) => {
                const { code, data: { plan_id } } = res;

                callback && callback(code, plan_id);
            }
        })
    }

    const deletePlan = (id, callback) => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            plan_id: id,
        };
        fetchDeletePlan(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    dispatch({
                        type: 'plan/updateRefreshList',
                        payload: true
                    })
                }
                callback && callback(code);
            }
        })
    };

    const deleteTPlan = (id, callback) => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            plan_id: id,
        };
        fetchDeleteTPlan(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    dispatch({
                        type: 'plan/updateRefreshList',
                        payload: true
                    })
                }
                callback && callback(code);
            }
        })
    };


    const addOpenPlanScene = (id, id_apis, node_config) => {
        // dispatch({
        //     type: 'plan/updateOpenScene',
        //     payload: {},
        // })
        // dispatch({
        //     type: 'plan/updateOpenScene',
        //     payload: null,
        // })
        dispatch({
            type: 'plan/updateRunRes',
            payload: null,
        })
        dispatch({
            type: 'plan/updateRunningScene',
            payload: ''
        })
        dispatch({
            type: 'plan/updateNodes',
            payload: [],
        });
        dispatch({
            type: 'plan/updateEdges',
            payload: [],
        });
        dispatch({
            type: 'plan/updateCloneNode',
            payload: [],
        });
        dispatch({
            type: 'plan/updateSuccessEdge',
            payload: [],
        });
        dispatch({
            type: 'plan/updateFailedEdge',
            payload: [],
        });
        dispatch({
            type: 'plan/updateApiConfig',
            payload: false,
        })
        dispatch({
            type: 'plan/updateBeautify',
            payload: false
        }) 
        dispatch({
            type: 'plan/updateRunStatus',
            payload: 'finish',
        })
        const { target_id } = id;
        const query = {
            team_id: localStorage.getItem('team_id'),
            scene_id: target_id,
        };
        fetchSceneFlowDetail(query).subscribe({
            next: (res) => {
                const { data } = res;
                if (data && data.nodes && data.nodes.length > 0) {
                    const { nodes } = data;
                    const idList = [];
                    const apiList = [];
                    const configList = [];
                    nodes.forEach(item => {
                        const {
                            id,
                            // api配置
                            api,
                            // node其他配置
                            // api
                            weight,
                            mode,
                            error_threshold,
                            response_threshold,
                            request_threshold,
                            percent_age,
                            // 等待控制器
                            wait_ms,
                            // 条件控制器
                            var: _var,
                            compare,
                            val,
                            remark,
                            is_hide
                        } = item;
                        const config = {
                            weight,
                            mode,
                            error_threshold,
                            response_threshold,
                            request_threshold,
                            percent_age,
                            wait_ms,
                            var: _var,
                            compare,
                            val,
                            remark,
                            is_hide
                        };
                        if (api) {
                            api.id = id;
                            apiList.push(api);
                        }
                        // api && apiList.push(api);
                        config.id = id;
                        configList.push(config);
                        idList.push(id);

                    });
                    Bus.$emit('addNewPlanApi', idList, id_apis, node_config, apiList, configList, 'plan');
                }

                const { env_id } = data;
                dispatch({
                    type: 'env/updateSceneEnvId',
                    payload: env_id
                })


                dispatch({
                    type: 'plan/updateOpenScene',
                    payload: data || { target_id, },
                })
            }
        })
    };


    const addNewPlanApi = (id, id_apis, node_config, api = {}, config = {}, from, callback) => {
        let newApi = cloneDeep(api);

        let _id = isArray(id) ? id : [id];
        let _api = isArray(api) ? api : [api];
        let _config = isArray(config) ? config : [config];
        let length = _config.length;
        let new_apis = cloneDeep(id_apis);
        let new_nodes = cloneDeep(node_config);

        for (let i = 0; i < _api.length; i++) {
            let newApi = cloneDeep(_api[i]);
            if (Object.entries(_api[i]).length < 2) {
                newApi = getBaseCollection('api');
                newApi.method = 'POST';
                newApi.request.body.mode = 'none';
                newApi.is_changed = false;
                newApi.id = _api[i].id;

                delete newApi['target_id'];
                delete newApi['parent_id'];
            } else {

            }

            new_apis[newApi.id] = newApi;

            console.log(new_apis);

            if (from === 'scene') {
                dispatch({
                    type: 'scene/updateIdApis',
                    payload: new_apis,
                })
            } else {
                dispatch({
                    type: 'plan/updateIdApis',
                    payload: new_apis,
                })
            }
        }

        for (let i = 0; i < _config.length; i++) {

            new_nodes[_id[i]] = _config[i];

            if (from === 'scene') {
                dispatch({
                    type: 'scene/updateNodeConfig',
                    payload: new_nodes,
                })
            } else {
                dispatch({
                    type: 'plan/updateNodeConfig',
                    payload: new_nodes,
                })
            }

        }

        callback && callback(new_apis, new_nodes);
    };

    const addNewPlanMysql = (id, id_apis, node_config, api = {}, config = {}, from, callback) => {
        let newApi = cloneDeep(api);

        let _id = isArray(id) ? id : [id];
        let _api = isArray(api) ? api : [api];
        let _config = isArray(config) ? config : [config];
        let length = _config.length;
        let new_apis = cloneDeep(id_apis);
        let new_nodes = cloneDeep(node_config);

        for (let i = 0; i < _api.length; i++) {
            let newApi = cloneDeep(_api[i]);
            if (Object.entries(_api[i]).length < 2) {
                newApi = getBaseCollection('sql');
                newApi.is_changed = false;
                newApi.id = _api[i].id;

                delete newApi['target_id'];
                delete newApi['parent_id'];
            } else {

            }

            new_apis[newApi.id] = newApi;

            console.log(new_apis);

            if (from === 'scene') {
                dispatch({
                    type: 'scene/updateIdApis',
                    payload: new_apis,
                })
            } else {
                dispatch({
                    type: 'plan/updateIdApis',
                    payload: new_apis,
                })
            }
        }

        for (let i = 0; i < _config.length; i++) {

            new_nodes[_id[i]] = _config[i];

            if (from === 'scene') {
                dispatch({
                    type: 'scene/updateNodeConfig',
                    payload: new_nodes,
                })
            } else {
                dispatch({
                    type: 'plan/updateNodeConfig',
                    payload: new_nodes,
                })
            }

        }

        callback && callback(new_apis, new_nodes);
    };


    // function getNodesByLevel(nodes, edges) {
    //     let arr = [];
    //     while (nodes.length > 0) {
    //         let currentLayer = nodes.filter(node => !edges.some(edge => edge.target === node.id));
    //         arr.push(currentLayer);
    //         currentLayer.forEach(node => {
    //             edges = edges.filter(edge => edge.source !== node.id);
    //         });
    //         nodes = nodes.filter(node => !currentLayer.includes(node));
    //     }
    //     return arr;
    // }

    const saveScenePlan = (nodes, edges, id_apis, node_config, open_scene, id, from, callback, env_id = 0) => {
        const get_pre = (id, edges) => {
            const pre_list = [];
            edges && edges.forEach(item => {
                if (item.target === id) {
                    pre_list.push(item.source);
                }
            })

            return pre_list;
        };

        const get_next = (id, edges) => {
            const next_list = [];
            edges && edges.forEach(item => {
                if (item.source === id) {
                    next_list.push(item.target);
                }
            })

            return next_list;
        };

        const _nodes = nodes && nodes.filter(item => item.type !== 'sql').map(item => {
            const api = id_apis[item.id];
            if (api) {
                return {
                    ...item,
                    api,
                    weight: 100,
                    ...node_config[item.id],
                    pre_list: get_pre(item.id, edges),
                    next_list: get_next(item.id, edges),
                }
            } else {
                return {
                    ...item,
                    ...node_config[item.id],
                    pre_list: get_pre(item.id, edges),
                    next_list: get_next(item.id, edges),
                }
            }
        });

        const from_list = {
            'scene': 1,
            'plan': 2,
            'auto_plan': 3,
            'case': 4
        }

        const params = {
            scene_id: open_scene.target_id ? open_scene.target_id : open_scene.scene_id,
            team_id: localStorage.getItem('team_id'),
            version: 1,
            nodes: _nodes,
            edges,
            source: 2,
            plan_id: id,
            env_id,
            prepositions: nodes.filter(item => item.type === 'sql').map(item => {
                const api = id_apis[item.id];
                return {
                    ...item,
                    api,
                    ...node_config[item.id],
                }
            })
            // nodes_round: getNodesByLevel(_nodes, edges ? edges : [])
            // multi_level_nodes: JSON.stringify(formatSceneData(nodes, edges))
            // songsong: formatSceneData(nodes, edges),
        };

        console.log(params);

        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "save_scene_flow",
            param: JSON.stringify(params)
        }))

        callback && callback();
    };


    const copyPlan = (data, callback) => {
        const { name, remark } = data;
        // 1. 创建计划
        // 2. 查询原计划的菜单列表
        // 3. 遍历查询每个目录/场景详情
        // 4. 遍历创建每个目录/场景
        // 5. 遍历查询每个场景流程详情
        // 6. 遍历创建每个场景流程详情
        // 7. 创建任务配置

        const params = {
            name,
            remark,
            team_id: localStorage.getItem('team_id'),
        };
        fetchCreatePlan(params).pipe(
            concatMap((res) => {
                const { data: { plan_id } } = res;
                const query = {
                    page: 1,
                    size: 100,
                    team_id: localStorage.getItem('team_id'),
                    source: 2,
                    plan_id,
                };

                return getSceneList$(query, 'plan');
            }),
            concatMap((res) => {
                const { data: { targets } } = res;
                targets.forEach(item => {
                    const _item = cloneDeep(item);
                    delete _item['target_id'];
                    delete _item['created_user_id'];
                    delete _item['recent_user_id'];


                })
            })
        ).subscribe();
    };

    const updatePlanApi = (data, id_apis, callback) => {
        const { id, pathExpression, value } = data;

        set(id_apis[id], pathExpression, value);

        if (pathExpression === 'request.url') {
            let reqUrl = value;
            let queryList = [];
            const restfulList = [];
            if (reqUrl) {
                // 自动拼接url http://
                if (!isURL(reqUrl)) {
                    reqUrl = `http://${reqUrl}`;
                }
                const urlObj = createUrl(reqUrl);
                if (isArray(id_apis[id].request?.query?.parameter)) {
                    // 提取query
                    const searchParams = GetUrlQueryToArray(urlObj?.search || '');
                    queryList = id_apis[id].request.query.parameter.filter(
                        (item) => item?.is_checked < 0
                    );
                    searchParams.forEach((item) => {
                        const key = item?.key;
                        const value = item?.value;
                        let obj = {};
                        const i = findIndex(id_apis[id].request.query.parameter, { key });
                        if (i !== -1) obj = id_apis[id].request.query.parameter[i];
                        queryList.push({
                            description: obj?.description || '', // 字段描述
                            is_checked: obj?.is_checked || 1, // 是否启用
                            key: key?.trim(), // 参数名
                            type: obj?.type || 'Text', // 字段类型
                            not_null: obj?.not_null || 1, // 必填｜-1选填
                            field_type: obj?.field_type || 'String', // 类型
                            value: value?.trim(), // 参数值
                        });
                    });
                    set(id_apis[id], 'request.query.parameter', queryList);
                }

                if (isArray(id_apis[id].request?.resful?.parameter)) {
                    // 提取restful
                    const paths = urlObj.pathname.split('/');
                    paths.forEach((p) => {
                        if (p.substring(0, 1) === ':' && p.length > 1) {
                            let obj = {};
                            const i = findIndex(id_apis[id].request?.resful?.parameter, {
                                key: p.substring(1, p.length),
                            });
                            if (i !== -1) obj = id_apis[id].request?.resful?.parameter[i];
                            restfulList.push({
                                key: p.substring(1, p.length),
                                description: obj?.description || '',
                                is_checked: 1,
                                type: 'Text',
                                not_null: 1,
                                field_type: 'String',
                                value: obj?.value || '',
                            });
                        }
                    });
                    set(id_apis[id], 'request.resful.parameter', restfulList);
                }
            }
            set(id_apis[id], 'url', value);
        } else if (pathExpression === 'request.query.parameter') {
            let paramsStr = '';
            const url = id_apis[id].request?.url || '';
            if (
                isArray(id_apis[id].request?.query?.parameter) &&
                id_apis[id].request?.query?.parameter.length > 0
            ) {
                id_apis[id].request.query.parameter.forEach((ite) => {
                    if (ite.key !== '' && ite.is_checked == 1)
                        paramsStr += `${paramsStr === '' ? '' : '&'}${ite.key}=${ite.value}`;
                });
                const newUrl = `${url.split('?')[0]}${paramsStr !== '' ? '?' : ''}${paramsStr}`;
                set(id_apis[id], 'url', newUrl);
                set(id_apis[id], 'request.url', newUrl);
            }
        } else if (pathExpression === 'name') {
            set(id_apis[id], 'name', value);
        }

        set(id_apis[id], 'is_changed', true);
        // dispatch({
        //     type: 'scene/updateIdApis',
        //     payload: id_apis,
        // });
        let _api_now = cloneDeep(id_apis[id]);
        _api_now.id = id;
        dispatch({
            type: 'plan/updateApiNow',
            payload: _api_now
        });

        dispatch({
            type: 'plan/updateIdApis',
            payload: id_apis
        });

        dispatch({
            type: 'scene/updateRefreshBox',
            payload: v4()
        })

        callback && callback();
    }

    const dragUpdatePlan = ({ ids, targetList, id }) => {


        const _ids = cloneDeep(ids);
        _ids.forEach(item => {
            if (typeof item.parent_id === 'string') {
                item.parent_id = parseInt(item.parent_id);
            }
        })

        const query = {
            team_id: localStorage.getItem('team_id'),
            target_id: _ids,
            // source: 2,
        };
        const targetDatas = {};
        targetList.forEach(item => {
            targetDatas[item.target_id] = item;
        })
        const params = {
            // parent_id: parseInt(parent_id),
            // sort: parseInt(sort),
            // target_id: target_id,
            targets: targetList,
            // team_id: localStorage.getItem('team_id'),
        };
        fetchChangeSort(params).subscribe({
            next: (res) => {
                global$.next({
                    action: 'RELOAD_LOCAL_PLAN',
                    id,
                });
            }
        });
    };

    const importSceneList = (ids, plan_id, from, callback) => {
        let from_list = {
            'plan': 2,
            'auto_plan': 3
        }
        const params = {
            team_id: localStorage.getItem('team_id'),
            plan_id,
            target_id_list: ids,
            source: from_list[from]
        };

        fetchImportScene(params).subscribe({
            next: (res) => {
                const { code, data: { scenes } } = res;
                if (code === 0) {
                    if (from === 'plan') {
                        global$.next({
                            action: 'RELOAD_LOCAL_PLAN',
                            id: plan_id,
                        });
                    } else if (from === 'auto_plan') {
                        global$.next({
                            action: 'RELOAD_LOCAL_AUTO_PLAN',
                            id: plan_id,
                        });
                    }
                    callback && callback(scenes, code);
                }
            }
        })
    };

    const addNewPlanControl = (id, node_config = {}) => {
        const new_nodes = cloneDeep(node_config);
        new_nodes[id] = {};

        dispatch({
            type: 'plan/updateNodeConfig',
            payload: new_nodes,
        })
    };

    const importSceneApi = (ids, from) => {
        const query = {
            team_id: localStorage.getItem('team_id'),
            target_ids: ids,
        };
        fetchApiDetail(QueryString.stringify(query, { indices: false })).subscribe({
            next: (res) => {
                const { code, data: { targets } } = res;
                // 1. 添加nodes节点
                // 2. 添加id_apis映射
                if (env_id === 0) {
                    for (let item of targets) {
                        item.env_info = {
                            env_id: 0,
                            env_name: "",
                            service_id: 0,
                            service_name: "",
                            pre_url: "",
                            database_id: 0
                        }
                        if (item.target_type === 'sql') {
                            item.sql_detail.sql_database_info = {
                                charset: 'utf8mb4',
                                db_name: '',
                                host: '',
                                password: '',
                                port: 0,
                                server_name: '',
                                user: '',
                                type: item.sql_detail.sql_database_info.type || 'mysql'
                            }
                        }
                    }
                }
                if (from === 'plan') {
                    dispatch({
                        type: 'plan/updateImportNode',
                        payload: targets,
                    })                    
                } else if (from === 'auto_plan') {
                    dispatch({
                        type: 'auto_plan/updateImportNode',
                        payload: targets,
                    })
                }

            }
        })
    };

    const savePlanApi = (id_apis, api_now, callback) => {
        // const _id_apis = cloneDeep(id_apis);
        // api_now.is_changed = false;
        // const id = api_now.id;
        // delete api_now['id'];
        // _id_apis[id] = api_now;

        // dispatch({
        //     type: 'plan/updateIdApis',
        //     payload: _id_apis,
        // });

        callback && callback();
    };



    const runPlan = (plan_id, callback) => {
        const params = {
            plan_id,
            team_id: localStorage.getItem('team_id'),
        };
        fetchRunPlan(params).subscribe({
            next: (res) => {
                const { code } = res;
                callback && callback(code);
            }
        })
    };


    const stopPlan = (plan_id, callback) => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            plan_ids: [plan_id],
        };
        fetchStopPlan(params).subscribe({
            next: (res) => {
                const { code } = res;
                callback && callback(code);
            }
        })
    };

    useEventBus('savePreConfig', savePreConfig);
    useEventBus('createPlan', createPlan);
    useEventBus('createTPlan', createTPlan);
    useEventBus('deletePlan', deletePlan);
    useEventBus('deleteTPlan', deleteTPlan);
    useEventBus('addOpenPlanScene', addOpenPlanScene);
    useEventBus('addNewPlanApi', addNewPlanApi);
    useEventBus('addNewPlanMysql', addNewPlanMysql);
    useEventBus('saveScenePlan', saveScenePlan);
    useEventBus('copyPlan', copyPlan);
    useEventBus('dragUpdatePlan', dragUpdatePlan);
    useEventBus('importSceneList', importSceneList);
    useEventBus('addNewPlanControl', addNewPlanControl);
    useEventBus('importSceneApi', importSceneApi, [env_id]);
    useEventBus('savePlanApi', savePlanApi);
    useEventBus('updatePlanApi', updatePlanApi);
    useEventBus('runPlan', runPlan);
    useEventBus('stopPlan', stopPlan);
};

export default usePlan;