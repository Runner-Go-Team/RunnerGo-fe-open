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

const useAutoPlan = () => {
    const dispatch = useDispatch();
    const nodes = useSelector((store) => store.auto_plan.nodes);
    const edges = useSelector((store) => store.auto_plan.edges);
    const id_apis = useSelector((store) => store.auto_plan.id_apis);
    const node_config = useSelector((store) => store.auto_plan.node_config);
    const open_plan_scene = useSelector((store) => store.auto_plan.open_plan_scene);
    const api_now = useSelector((store) => store.auto_plan.api_now);
    const env_id = useSelector((store) => store.env.scene_env_id);

    const addOpenAutoPlanScene = (id) => {
        dispatch({
            type: 'auto_plan/updateRunRes',
            payload: null,
        })
        dispatch({
            type: 'auto_plan/updateRunningScene',
            payload: ''
        })
        dispatch({
            type: 'auto_plan/updateNodes',
            payload: [],
        });
        dispatch({
            type: 'auto_plan/updateEdges',
            payload: [],
        });
        dispatch({
            type: 'auto_plan/updateCloneNode',
            payload: [],
        });
        dispatch({
            type: 'auto_plan/updateSuccessEdge',
            payload: [],
        });
        dispatch({
            type: 'auto_plan/updateFailedEdge',
            payload: [],
        });
        dispatch({
            type: 'auto_plan/updateApiConfig',
            payload: false,
        })
        dispatch({
            type: 'auto_plan/updateBeautify',
            payload: false
        })
        dispatch({
            type: 'auto_plan/updateRunStatus',
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
                    Bus.$emit('addNewAutoPlanApi', idList, apiList, configList);
                }

                const { env_id } = data;
                dispatch({
                    type: 'env/updateSceneEnvId',
                    payload: env_id
                })


                dispatch({
                    type: 'auto_plan/updateOpenScene',
                    payload: data || { target_id, },
                })
            }
        })
    };

    const addNewAutoPlanApi = (id, api = {}, config = {}, callback) => {

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

            dispatch({
                type: 'auto_plan/updateIdApis',
                payload: new_apis,
            })
        }

        for (let i = 0; i < _config.length; i++) {

            new_nodes[_id[i]] = _config[i];

            dispatch({
                type: 'auto_plan/updateNodeConfig',
                payload: new_nodes,
            })

        }

        callback && callback();
    };

    const addNewAutoPlanMysql = (id, api = {}, config = {}, callback) => {

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

            dispatch({
                type: 'auto_plan/updateIdApis',
                payload: new_apis,
            })
        }

        for (let i = 0; i < _config.length; i++) {

            new_nodes[_id[i]] = _config[i];

            dispatch({
                type: 'auto_plan/updateNodeConfig',
                payload: new_nodes,
            })

        }

        callback && callback(new_apis);
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

    const saveSceneAutoPlan = (id, callback) => {
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

        const params = {
            scene_id: open_plan_scene.target_id ? open_plan_scene.target_id : open_plan_scene.scene_id,
            team_id: localStorage.getItem('team_id'),
            version: 1,
            nodes: _nodes,
            edges,
            source: 3,
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

        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "save_scene_flow",
            param: JSON.stringify(params)
        }))

        callback && callback();
        // fetchCreateSceneFlow(params).subscribe({
        //     next: (res) => {
        //         const { code } = res;
        //         if (code === 0) {
        //             callback && callback();
        //         }
        //     }
        // })
    };

    const saveAutoPlanApi = (callback) => {
        // const _id_apis = cloneDeep(id_apis);
        // api_now.is_changed = false;
        // const id = api_now.id;
        // delete api_now['id'];
        // _id_apis[id] = api_now;

        // dispatch({
        //     type: 'auto_plan/updateIdApis',
        //     payload: _id_apis,
        // });

        callback && callback();
    };

    const updateAutoPlanApi = (data, callback) => {
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
            type: 'auto_plan/updateApiNow',
            payload: _api_now
        });
        dispatch({
            type: 'auto_plan/updateIdApis',
            payload: id_apis
        });
        dispatch({
            type: 'scene/updateRefreshBox',
            payload: v4()
        })


        callback && callback();
    }


    const addNewAutoPlanControl = (id) => {
        const new_nodes = cloneDeep(node_config);
        new_nodes[id] = {};

        dispatch({
            type: 'auto_plan/updateNodeConfig',
            payload: new_nodes,
        })
    };

    const dragUpdateAutoPlan = ({ ids, targetList, id }) => {


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
                    action: 'RELOAD_LOCAL_AUTO_PLAN',
                    id,
                });
            }
        });
    };

    const runAutoPlan = (id, callback) => {
        console.log(id);
        const params = {
            team_id: localStorage.getItem('team_id'),
            plan_id: id
        };
        fetchRunAutoPlan(params).subscribe({
            next: (res) => {
                const { code, data } = res;
                callback && callback(code, data);
            }
        })
    }

    const stopAutoPlan = (id, callback) => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            plan_id: id
        };
        fetchStopAutoPlan(params).subscribe({
            next: (res) => {
                const { code } = res;
                callback && callback(code);
            }
        })
    }

    useEventBus('addOpenAutoPlanScene', addOpenAutoPlanScene, [id_apis, node_config]);
    useEventBus('addNewAutoPlanApi', addNewAutoPlanApi, [id_apis, node_config]);
    useEventBus('addNewAutoPlanMysql', addNewAutoPlanMysql, [id_apis, node_config]);
    useEventBus('saveSceneAutoPlan', saveSceneAutoPlan, [nodes, edges, id_apis, node_config, open_plan_scene, env_id]);
    useEventBus('saveAutoPlanApi', saveAutoPlanApi, [api_now, id_apis]);
    useEventBus('updateAutoPlanApi', updateAutoPlanApi, [id_apis]);
    useEventBus('addNewAutoPlanControl', addNewAutoPlanControl, [node_config]);
    useEventBus('dragUpdateAutoPlan', dragUpdateAutoPlan);
    useEventBus('runAutoPlan', runAutoPlan);
    useEventBus('stopAutoPlan', stopAutoPlan);
};

export default useAutoPlan;