import { useEffect } from 'react';
import Bus, { useEventBus } from '@utils/eventBus';
import { getBaseCollection } from '@constants/baseCollection';
import { useSelector, useDispatch } from 'react-redux';
import { cloneDeep, isArray, set } from 'lodash';
import { fetchApiDetail, fetchGetResult } from '@services/apis';
import { fetchSceneFlowDetail, fetchGetSceneRes } from '@services/scene';
import { fetchSaveFlow, fetchGetFlow, fetchRunCase, fetchStopCase, fetchCopyCase, fetchDeleteCase, fetchSwitchCase } from '@services/case';
import { isURL, createUrl, GetUrlQueryToArray } from '@utils';
import QueryString from 'qs';
import { v4 } from 'uuid';
import { Message } from 'adesign-react';
import { useTranslation } from 'react-i18next';

const useCase = () => {
    const id_apis = useSelector((store) => store.case.id_apis);
    const node_config = useSelector((store) => store.case.node_config);
    const api_now = useSelector((store) => store.case.api_now);
    const nodes = useSelector((store) => store.case.nodes);
    const edges = useSelector((store) => store.case.edges);
    const open_case = useSelector((store) => store.case.open_case);
    const open_info = useSelector((store) => store.case.open_info);
    const refresh = useSelector((store) => store.case.refresh);

    let case_t = null;

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const addNewCaseApi = (id, api, config) => {
        let ids = isArray(id) ? id : [id];
        let apis = isArray(api) ? api : [api];
        let configs = isArray(config) ? config : [config];
        let new_apis = cloneDeep(id_apis);
        let new_config = cloneDeep(node_config);
        for (let i = 0; i < apis.length; i++) {
            let newApi = cloneDeep(apis[i]);

            if (Object.entries(apis[i]).length < 2) {
                newApi = getBaseCollection('api');
                newApi.method = 'POST';
                newApi.request.body.mode = 'none';
                newApi.is_changed = false;
                newApi.id = apis[i].id;

                delete newApi['target_id'];
                delete newApi['parent_id'];
            }
            new_apis[newApi.id] = newApi;
        }
        // ids.forEach(id => {
        //     let newApi = {};
        //     newApi = getBaseCollection('api');
        //     newApi.method = 'POST';
        //     newApi.request.body.mode = 'none';
        //     newApi.is_changed = false;
        //     newApi.id = id;

        //     delete newApi['target_id'];
        //     delete newApi['parent_id'];

        //     new_apis[id] = newApi;
        //     new_config[id] = {};
        // })

        dispatch({
            type: 'case/updateIdApis',
            payload: new_apis
        });


        for (let i = 0; i < configs.length; i++) {

            new_config[ids[i]] = configs[i];

            dispatch({
                type: 'case/updateNodeConfig',
                payload: new_config,
            })
        }
    };

    const addNewCaseControl = (id) => {
        const new_nodes = cloneDeep(node_config);
        new_nodes[id] = {};

        dispatch({
            type: 'case/updateNodeConfig',
            payload: new_nodes,
        })
    };

    const importCaseApi = (ids) => {
        const query = {
            team_id: localStorage.getItem('team_id'),
            target_ids: ids,
        };
        fetchApiDetail(QueryString.stringify(query, { indices: false })).subscribe({
            next: (res) => {
                const { code, data: { targets } } = res;
                // 1. ??????nodes??????
                // 2. ??????id_apis??????
                dispatch({
                    type: 'case/updateImportNode',
                    payload: targets,
                })
            }
        })
    };

    const updateCaseApi = (data) => {
        const { id, pathExpression, value } = data;

        set(id_apis[id], pathExpression, value);

        if (pathExpression === 'request.url') {
            let reqUrl = value;
            let queryList = [];
            const restfulList = [];
            if (reqUrl) {
                // ????????????url http://
                if (!isURL(reqUrl)) {
                    reqUrl = `http://${reqUrl}`;
                }
                const urlObj = createUrl(reqUrl);
                if (isArray(id_apis[id].request?.query?.parameter)) {
                    // ??????query
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
                            description: obj?.description || '', // ????????????
                            is_checked: obj?.is_checked || 1, // ????????????
                            key: key?.trim(), // ?????????
                            type: obj?.type || 'Text', // ????????????
                            not_null: obj?.not_null || 1, // ?????????-1??????
                            field_type: obj?.field_type || 'String', // ??????
                            value: value?.trim(), // ?????????
                        });
                    });
                    set(id_apis[id], 'request.query.parameter', queryList);
                }

                if (isArray(id_apis[id].request?.resful?.parameter)) {
                    // ??????restful
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
            // set(id_apis[id], 'request.url', reqUrl);
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
        let _api_now = cloneDeep(id_apis[id]);
        _api_now.id = id;

        dispatch({
            type: 'case/updateApiNow',
            payload: _api_now
        });
    };

    const saveCaseApi = (callback) => {
        const _id_apis = cloneDeep(id_apis);
        api_now.is_changed = false;
        const id = api_now.id;
        delete api_now['id'];
        _id_apis[id] = api_now;

        dispatch({
            type: 'case/updateIdApis',
            payload: _id_apis,
        });

        callback && callback();
    };

    const getNewCoordinate = (nodes) => {
        let position = {
            x: 50,
            y: 50,
        };
        nodes.forEach(item => {
            if (item.position.x >= position.x - 10 || item.position.x <= position.x + 10) {
                position.x += 40;
            }
            if (item.position.y >= position.y - 10 || item.position.y <= position.y + 10) {
                position.y += 40;
            }
        });
        return position;
    }

    const cloneCaseNode = (id) => {
        const _clone_api = cloneDeep(id_apis[id]);
        const _nodes = cloneDeep(nodes);
        const _node_config = cloneDeep(node_config);
        const from_node = _nodes.find(item => item.id === id);
        const _from_node = cloneDeep(from_node);

        const _id = v4();
        const _clone_config = {
            ..._node_config[id],
            id: _id
        };

        _from_node.id = _id;
        _from_node.data.id = _id;
        _from_node.data.from === from_node.data.from;
        _from_node.position = getNewCoordinate(_nodes);
        _from_node.dragging = false;
        _from_node.selected = false;
        _from_node.dragHandle = '.drag-content';

        _clone_api.id = _id;
        id_apis[_id] = _clone_api;
        _node_config[_id] = _clone_config;
        _nodes.push(_from_node);

        dispatch({
            type: 'case/updateIdApis',
            payload: id_apis,
        });

        dispatch({
            type: 'case/updateNodeConfig',
            payload: _node_config,
        })

        dispatch({
            type: 'case/updateNodes',
            payload: nodes,
        })

        dispatch({
            type: 'case/updateCloneNode',
            payload: _from_node,
        })
    };

    const updateCaseNodeConfig = (type, value, id) => {
        const _node_config = cloneDeep(node_config);
        _node_config[id][type] = value;
        if (type === 'mode' && value === 4) {
            _node_config[id]['percent_age'] = 90;
        }
        dispatch({
            type: 'case/updateNodeConfig',
            payload: _node_config
        })
    }

    const addCaseItem = async (data, callback) => {
        const { type, pid, param, from, plan_id } = data;
        let newSceneGroup = getBaseCollection(type);
        if (!newSceneGroup) return;
        newSceneGroup.parent_id = parseInt(pid);
        if (isPlainObject(param)) {
            newSceneGroup = { ...newSceneGroup, ...param };
        }
        newSceneGroup['team_id'] = localStorage.getItem('team_id');
        delete newSceneGroup['target_id'];
        const from_list = {
            'scene': 1,
            'plan': 2,
            'auto_plan': 3,
            'case': 4
        }

        newSceneGroup.source = from_list[from];
        plan_id && (newSceneGroup.plan_id = plan_id);
        // return;
        fetchCreateGroup(newSceneGroup).subscribe({
            next: async (resp) => {
                const { code } = resp;
                if (code === 0) {
                    callback && callback();
                    if (from === 'scene') {
                        global$.next({
                            action: 'RELOAD_LOCAL_SCENE',
                        });
                    } else if (from === 'plan') {
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
                }
            }
        })

        // setTimeout(() => {
        //     // ????????????????????????
        //     global$.next({
        //         action: 'RELOAD_LOCAL_COLLECTIONS',
        //     });
        // }, 100);
    }

    const saveCase = (callback) => {
        const { scene_id, case_id } = open_info;
        const get_pre = (id, edges) => {
            const pre_list = [];
            edges.forEach(item => {
                if (item.target === id) {
                    pre_list.push(item.source);
                }
            })

            return pre_list;
        }

        const get_next = (id, edges) => {
            const next_list = [];
            edges.forEach(item => {
                if (item.source === id) {
                    next_list.push(item.target);
                }
            })

            return next_list;
        };

        const _nodes = nodes && nodes.map(item => {
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
            scene_id: scene_id,
            scene_case_id: case_id,
            team_id: localStorage.getItem('team_id'),
            version: 1,
            nodes: _nodes,
            edges,
        };
        // callback && callback();

        // return;

        fetchSaveFlow(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    callback && callback();
                }
            }
        })
    }

    const addOpenCase = (id) => {
        // dispatch({
        //     type: 'scene/updateOpenScene',
        //     payload: null,
        // })
        dispatch({
            type: 'case/updateRunRes',
            payload: null,
        })
        dispatch({
            type: 'case/updateRunningScene',
            payload: '',
        })
        dispatch({
            type: 'case/updateNodes',
            payload: [],
        });
        dispatch({
            type: 'case/updateEdges',
            payload: [],
        })
        dispatch({
            type: 'case/updateCloneNode',
            payload: [],
        })
        dispatch({
            type: 'case/updateSuccessEdge',
            payload: [],
        });
        dispatch({
            type: 'case/updateFailedEdge',
            payload: [],
        });
        dispatch({
            type: 'case/updateApiConfig',
            payload: false,
        })
        dispatch({
            type: 'case/updateBeautify',
            payload: false
        })
        const params = {
            case_id: id
        };
        fetchGetFlow(params).subscribe({
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
                            // api??????
                            api,
                            // node????????????
                            // api
                            weight,
                            mode,
                            error_threshold,
                            response_threshold,
                            request_threshold,
                            percent_age,
                            // ???????????????
                            wait_ms,
                            // ???????????????
                            var: _var,
                            compare,
                            val,
                            remark,
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
                            remark
                        };
                        if (api) {
                            api.id = id;
                            apiList.push(api);
                        }
                        // api && apiList.push(api);
                        configList.push(config);
                        idList.push(id);

                    });
                    Bus.$emit('addNewCaseApi', idList, apiList, configList);
                }

                dispatch({
                    type: 'case/updateOpenCase',
                    payload: data || { target_id: id, },
                })
            }
        })
    }

    const runCase = () => {
        const length = nodes.length;
        const { scene_id, case_id } = open_info;
        const params = {
            team_id: localStorage.getItem('team_id'),
            scene_id,
            scene_case_id: case_id
        };
        fetchRunCase(params).subscribe({
            next: (res) => {
                const { data: { ret_id } } = res;

                const query = {
                    ret_id,
                };
                let getCount = 0;

                case_t = setInterval(() => {

                    fetchGetSceneRes(query).subscribe({
                        next: (res) => {
                            const { data } = res;

                            if (data.scenes) {
                                const { scenes } = data;

                                dispatch({
                                    type: 'case/updateRunRes',
                                    payload: scenes,
                                })


                                if (data.scenes.length === length) {
                                    clearInterval(case_t);
                                    dispatch({
                                        type: 'case/updateRunStatus',
                                        payload: 'finish',
                                    })
                                }
                                getCount++;
                            }
                        }
                    })
                }, 300);
            }
        })
    };

    const stopCase = (callback) => {
        const { scene_id, scene_case_id } = open_case;
        const params = {
            team_id: localStorage.getItem('team_id'),
            scene_id,
            scene_case_id
        };
        fetchStopCase(params).subscribe({
            next: (res) => {
                const { code } = res;

                if (code === 0) {
                    clearInterval(case_t);
                    callback && callback();
                    dispatch({
                        type: 'case/updateRunStatus',
                        payload: 'finish',
                    })
                }
            }
        })
    }

    const cloneCase = (case_id, callback) => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            case_id
        };
        fetchCopyCase(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    Message('success', t('message.copySuccess'));
                    dispatch({
                        type: 'case/updateRefreshMenu',
                        payload: !refresh
                    });
                    callback(3);
                }
            }
        })
    }

    const deleteCase = (case_id, callback) => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            case_id,
        };
        fetchDeleteCase(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    Message('success', t('message.deleteSuccess'));
                    dispatch({
                        type: 'case/updateRunRes',
                        payload: null,
                    })
                    dispatch({
                        type: 'auto_plan/updateRunRes',
                        payload: null,
                    })

                    dispatch({
                        type: 'case/updateRunningScene',
                        payload: '',
                    })
                    dispatch({
                        type: 'auto_plan/updateRunningScene',
                        payload: '',
                    })

                    dispatch({
                        type: 'case/updateNodes',
                        payload: [],
                    });
                    dispatch({
                        type: 'auto_plan/updateNodes',
                        payload: [],
                    });

                    dispatch({
                        type: 'case/updateEdges',
                        payload: [],
                    })
                    dispatch({
                        type: 'auto_plan/updateEdges',
                        payload: [],
                    })

                    dispatch({
                        type: 'case/updateCloneNode',
                        payload: [],
                    })
                    dispatch({
                        type: 'auto_plan/updateCloneNode',
                        payload: [],
                    })

                    dispatch({
                        type: 'case/updateSuccessEdge',
                        payload: [],
                    });
                    dispatch({
                        type: 'auto_plan/updateSuccessEdge',
                        payload: [],
                    });

                    dispatch({
                        type: 'case/updateFailedEdge',
                        payload: [],
                    });
                    dispatch({
                        type: 'auto_plan/updateFailedEdge',
                        payload: [],
                    });

                    dispatch({
                        type: 'case/updateApiConfig',
                        payload: false,
                    })
                    dispatch({
                        type: 'auto_plan/updateApiConfig',
                        payload: false,
                    })

                    dispatch({
                        type: 'case/updateBeautify',
                        payload: false
                    })
                    dispatch({
                        type: 'auto_plan/updateBeautify',
                        payload: false
                    })

                    dispatch({
                        type: 'case/updateOpenCase',
                        payload: null
                    })
                    dispatch({
                        type: 'auto_plan/updateOpenCase',
                        payload: null
                    })

                    callback(2);
                }
            }
        })
    }



    useEventBus('addNewCaseApi', addNewCaseApi, [id_apis, node_config]);
    useEventBus('addNewCaseControl', addNewCaseControl, [node_config]);
    useEventBus('importCaseApi', importCaseApi);
    useEventBus('updateCaseApi', updateCaseApi, [id_apis]);
    useEventBus('saveCaseApi', saveCaseApi, [api_now, id_apis]);
    useEventBus('cloneCaseNode', cloneCaseNode, [id_apis, nodes, node_config]);
    useEventBus('updateCaseNodeConfig', updateCaseNodeConfig, [node_config])
    useEventBus('saveCase', saveCase, [nodes, edges, id_apis, open_case, node_config, open_info])
    useEventBus('addOpenCase', addOpenCase);
    useEventBus('runCase', runCase, [open_case, open_info, nodes]);
    useEventBus('stopCase', stopCase, [open_case]);
    useEventBus('cloneCase', cloneCase);
    useEventBus('deleteCase', deleteCase);

};

export default useCase;