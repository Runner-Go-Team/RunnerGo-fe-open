import React, { useEffect, useRef, useState, useCallback } from "react";
import { Message } from 'adesign-react';
import { Left as SvgLeft } from 'adesign-react/icons';
import './index.less';
import { cloneDeep, debounce } from 'lodash';
import Box from "./box";
import ConditionController from "./controller/condition";
import WaitController from "./controller/wait";
import MysqlBox from "./mysql";
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
} from "react-flow-renderer";
import { useSelector, useDispatch } from 'react-redux';
import Bus from '@utils/eventBus';
import { v4 } from 'uuid';
import { edges as initialEdges } from './mock';
import CustomEdge from "./customEdge";
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CaseList from "@components/CaseList";

import SvgMouse from '@assets/icons/mouse.svg';

const nodeTypes = {
    api: Box,
    condition_controller: ConditionController,
    wait_controller: WaitController,
    sql: MysqlBox
};

const edgeTypes = {
    common: CustomEdge,
}

const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
};

let drop_loading_time = null;

const SceneBox = (props) => {
    const { from } = props;

    const refBox = useRef();
    const { id } = useParams();
    const refContainer = useRef();
    const dispatch = useDispatch();

    const type_now_scene = useSelector((store) => store.scene.type);
    const saveScene = useSelector((store) => store.scene.saveScene);
    const id_apis_scene = useSelector((store) => store.scene.id_apis);
    const node_config_scene = useSelector((store) => store.scene.node_config);
    const import_node_scene = useSelector((store) => store.scene.import_node);
    const delete_node_scene = useSelector((store) => store.scene.delete_node);
    const clone_node_scene = useSelector((store) => store.scene.clone_node);
    const success_edge_scene = useSelector((store) => store.scene.success_edge);
    const failed_edge_scene = useSelector((store) => store.scene.failed_edge);
    const init_scene_scene = useSelector((store) => store.scene.init_scene);
    const run_res_scene = useSelector((store) => store.scene.run_res);
    const to_loading_scene = useSelector((store) => store.scene.to_loading);
    const scene_nodes = useSelector((store) => store.scene.nodes);
    const scene_edges = useSelector((store) => store.scene.edges);
    const scene_beautify = useSelector((store) => store.scene.beautify);
    const scene_hide = useSelector((store) => store.scene.hide_drop);

    const type_now_plan = useSelector((store) => store.plan.type);
    const id_apis_plan = useSelector((store) => store.plan.id_apis);
    const node_config_plan = useSelector((store) => store.plan.node_config);
    const import_node_plan = useSelector((store) => store.plan.import_node);
    const delete_node_plan = useSelector((store) => store.plan.delete_node);
    const clone_node_plan = useSelector((store) => store.plan.clone_node);
    const success_edge_plan = useSelector((store) => store.plan.success_edge);
    const failed_edge_plan = useSelector((store) => store.plan.failed_edge);
    const init_scene_plan = useSelector((store) => store.plan.init_scene);
    const run_res_plan = useSelector((store) => store.plan.run_res);
    const to_loading_plan = useSelector((store) => store.plan.to_loading);
    const plan_nodes = useSelector((store) => store.plan.nodes);
    const plan_edges = useSelector((store) => store.plan.edges);
    const plan_beautify = useSelector((store) => store.plan.beautify);
    const plan_hide = useSelector((store) => store.plan.hide_drop);

    const type_now_auto_plan = useSelector((store) => store.auto_plan.type);
    const id_apis_auto_plan = useSelector((store) => store.auto_plan.id_apis);
    const node_config_auto_plan = useSelector((store) => store.auto_plan.node_config);
    const import_node_auto_plan = useSelector((store) => store.auto_plan.import_node);
    const delete_node_auto_plan = useSelector((store) => store.auto_plan.delete_node);
    const clone_node_auto_plan = useSelector((store) => store.auto_plan.clone_node);
    const success_edge_auto_plan = useSelector((store) => store.auto_plan.success_edge);
    const failed_edge_auto_plan = useSelector((store) => store.auto_plan.failed_edge);
    const init_scene_auto_plan = useSelector((store) => store.auto_plan.init_scene);
    const run_res_auto_plan = useSelector((store) => store.auto_plan.run_res);
    const to_loading_auto_plan = useSelector((store) => store.auto_plan.to_loading);
    const auto_plan_nodes = useSelector((store) => store.auto_plan.nodes);
    const auto_plan_edges = useSelector((store) => store.auto_plan.edges);
    const auto_plan_beautify = useSelector((store) => store.auto_plan.beautify);
    const auto_plan_hide = useSelector((store) => store.auto_plan.hide_drop);

    const type_now_case = useSelector((store) => store.case.type);
    const id_apis_case = useSelector((store) => store.case.id_apis);
    const node_config_case = useSelector((store) => store.case.node_config);
    const import_node_case = useSelector((store) => store.case.import_node);
    const delete_node_case = useSelector((store) => store.case.delete_node);
    const clone_node_case = useSelector((store) => store.case.clone_node);
    const success_edge_case = useSelector((store) => store.case.success_edge);
    const failed_edge_case = useSelector((store) => store.case.failed_edge);
    const init_scene_case = useSelector((store) => store.case.init_scene);
    const run_res_case = useSelector((store) => store.case.run_res);
    const to_loading_case = useSelector((store) => store.case.to_loading);
    const case_nodes = useSelector((store) => store.case.nodes);
    const case_edges = useSelector((store) => store.case.edges);
    const case_beautify = useSelector((store) => store.case.beautify);
    const case_hide = useSelector((store) => store.case.hide_drop);


    const open_scene = useSelector((store) => store.scene.open_scene);
    const open_plan_scene = useSelector((store) => store.plan.open_plan_scene);
    const open_auto_plan_scene = useSelector((store) => store.auto_plan.open_plan_scene);
    const open_case = useSelector((store) => store.case.open_case);

    const scene_env_id = useSelector((store) => store.env.scene_env_id);

    const open_data_list = {
        'scene': open_scene,
        'plan': open_plan_scene,
        'auto_plan': open_auto_plan_scene,
        'case': open_case
    }
    const open_data = open_data_list[from];

    const id_apis_list = {
        'scene': id_apis_scene,
        'plan': id_apis_plan,
        'auto_plan': id_apis_auto_plan,
        'case': id_apis_case
    }
    const id_apis = id_apis_list[from];

    const node_config_list = {
        'scene': node_config_scene,
        'plan': node_config_plan,
        'auto_plan': node_config_auto_plan,
        'case': node_config_case
    }
    const node_config = node_config_list[from];

    const type_now_list = {
        'scene': type_now_scene,
        'plan': type_now_plan,
        'auto_plan': type_now_auto_plan,
        'case': type_now_case
    }
    const type_now = type_now_list[from];

    const delete_node_list = {
        'scene': delete_node_scene,
        'plan': delete_node_plan,
        'auto_plan': delete_node_auto_plan,
        'case': delete_node_case
    }
    const delete_node = delete_node_list[from];

    const clone_node_list = {
        'scene': clone_node_scene,
        'plan': clone_node_plan,
        'auto_plan': clone_node_auto_plan,
        'case': clone_node_case
    }
    const clone_node = clone_node_list[from];
    const update_edge = useSelector((store) => store.scene.update_edge);

    const import_node_list = {
        'scene': import_node_scene,
        'plan': import_node_plan,
        'auto_plan': import_node_auto_plan,
        'case': import_node_case
    }
    const import_node = import_node_list[from];

    const success_edge_list = {
        'scene': success_edge_scene,
        'plan': success_edge_plan,
        'auto_plan': success_edge_auto_plan,
        'case': success_edge_case
    }
    const success_edge = success_edge_list[from];

    const failed_edge_list = {
        'scene': failed_edge_scene,
        'plan': failed_edge_plan,
        'auto_plan': failed_edge_auto_plan,
        'case': failed_edge_case
    }
    const failed_edge = failed_edge_list[from];

    const nodes_list = {
        'scene': scene_nodes,
        'plan': plan_nodes,
        'auto_plan': auto_plan_nodes,
        'case': case_nodes
    }
    const _nodes = nodes_list[from];

    const beautify_list = {
        'scene': scene_beautify,
        'plan': plan_beautify,
        'auto_plan': auto_plan_beautify,
        'case': case_beautify
    }
    const beautify = beautify_list[from];

    const edges_list = {
        'scene': scene_edges,
        'plan': plan_edges,
        'auto_plan': auto_plan_edges,
        'case': case_edges
    }
    const _edges = edges_list[from];




    const init_scene_list = {
        'scene': init_scene_scene,
        'plan': init_scene_plan,
        'auto_plan': init_scene_auto_plan,
        'case': init_scene_case
    }
    const init_scene = init_scene_list[from];
    const run_res = from === 'scene' ? run_res_scene : run_res_plan;

    const to_loading_list = {
        'scene': to_loading_scene,
        'plan': to_loading_plan,
        'auto_plan': to_loading_auto_plan,
        'case': to_loading_case
    }
    const to_loading = to_loading_list[from];

    const hide_drop_list = {
        'scene': scene_hide,
        'plan': plan_hide,
        'auto_plan': auto_plan_hide,
        'case': case_hide
    };
    const hide_drop = hide_drop_list[from];

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const [flowInstance, setFlowInstance] = useState(null);

    const onInit = (reactFlowInstance) => {
        setFlowInstance(reactFlowInstance);
    };

    const { t } = useTranslation();


    useEffect(() => {
        if (_nodes && _nodes.length > 0 && beautify) {
            let _open_data = cloneDeep(open_data);
            _open_data.nodes = _nodes;
            _open_data.edges = _edges;

            flowInstance.fitView();
            if (from === 'scene') {
                dispatch({
                    type: 'scene/updateBeautify',
                    payload: false
                })
                dispatch({
                    type: 'scene/updateOpenScene',
                    payload: _open_data,
                })
                setTimeout(() => {
                    Bus.$emit('saveScene');
                }, 100);
            } else if (from === 'plan') {
                dispatch({
                    type: 'plan/updateBeautify',
                    payload: false
                })
                dispatch({
                    type: 'plan/updateOpenScene',
                    payload: _open_data,
                })
                setTimeout(() => {
                    Bus.$emit('saveScenePlan', _nodes, _edges, id_apis, node_config, open_data, id, 'plan', null, scene_env_id);
                }, 100);
            } else if (from === 'auto_plan') {
                dispatch({
                    type: 'auto_plan/updateBeautify',
                    payload: false
                })
                dispatch({
                    type: 'auto_plan/updateOpenScene',
                    payload: _open_data,
                })
                setTimeout(() => {
                    Bus.$emit('saveSceneAutoPlan', id);
                }, 100);
            } else if (from === 'case') {
                dispatch({
                    type: 'case/updateBeautify',
                    payload: false
                })
                dispatch({
                    type: 'case/updateOpenScene',
                    payload: _open_data,
                })
                setTimeout(() => {
                    Bus.$emit('saveCase');
                }, 100);
            }
        }
    }, [_nodes, _edges, open_data, id, beautify]);


    const getFather = (a, b) => {
        let obj = {};
        a.forEach(item => {
            obj[item.id] = [];
        })
        b.forEach(item => {
            obj[item.target].push(item.source);
        })

        return obj;
    }

    const onConnect = useCallback((params) => {

        const _params = cloneDeep(params);
        const _open_data = cloneDeep(open_data);
        _params.type = 'common';
        _params.data = {
            from
        }
        if (_params.target === _params.source) {
            Message('error', t('message.closeLoop'));
            return;
        }
        let id_obj = getFather(nodes, edges);
        const res = check([_params.source], _params.target, id_obj);
        if (res) {

            return setEdges((eds) => {
                let _edges = addEdge(_params, eds);
                _open_data.edges = _edges;
                if (from === 'scene') {
                    dispatch({
                        type: 'scene/updateEdges',
                        payload: _edges,
                    })
                    dispatch({
                        type: 'scene/updateOpenScene',
                        payload: _open_data,
                    })
                    setTimeout(() => {
                        Bus.$emit('saveScene');
                    }, 100);
                } else if (from === 'plan') {
                    dispatch({
                        type: 'plan/updateEdges',
                        payload: _edges,
                    })
                    dispatch({
                        type: 'plan/updateOpenScene',
                        payload: _open_data,
                    })
                    setTimeout(() => {
                        Bus.$emit('saveScenePlan', nodes, _edges, id_apis, node_config, open_data, id, 'plan', null, scene_env_id);
                    }, 100);
                } else if (from === 'auto_plan') {
                    dispatch({
                        type: 'auto_plan/updateEdges',
                        payload: _edges,
                    })
                    dispatch({
                        type: 'auto_plan/updateOpenScene',
                        payload: _open_data,
                    })
                    setTimeout(() => {
                        Bus.$emit('saveSceneAutoPlan', id);
                    }, 100);
                } else if (from === 'case') {
                    dispatch({
                        type: 'case/updateEdges',
                        payload: _edges,
                    })
                    dispatch({
                        type: 'case/updateOpenScene',
                        payload: _open_data,
                    })
                    setTimeout(() => {
                        Bus.$emit('saveCase');
                    }, 100);
                }
                return _edges;
            })
        } else {
            Message('error', t('message.closeLoop'))
        }

    }, [nodes, edges, id_apis, node_config, open_data, id, from]);

    const check = (sources, target, id_obj) => {
        for (const source of sources) {
            if (id_obj[source].length > 0) {
                if (id_obj[source].includes(target)) {
                    return false;
                } else {
                    return check(id_obj[source], target, id_obj);
                }
            } else {
                return true;
            }
        }
    }

    useEffect(() => {
        if (edges.length > 0 && to_loading) {
            const _edges = cloneDeep(edges);
            _edges.forEach(item => {
                item.style = {};
                item.markerEnd = {};
            });
            setEdges(_edges);
        }
    }, [to_loading]);

    useEffect(() => {
        if (edges.length) {
            const _edges = cloneDeep(edges);
            _edges.forEach(item => {
                item.style = {};
                item.markerEnd = {};
            });
            setEdges(_edges);
        }
    }, [init_scene])


    const getNewCoordinate = (nodes) => {
        let position = {
            x: 50,
            y: 50,
        };
        nodes.forEach(item => {
            if (item.position.x > position.x - 10 || item.position.x < position.x + 10) {
                position.x += 30;
            }
            if (item.position.y > position.y - 10 || item.position.y < position.y + 10) {
                position.y += 30;
            }
        });
        return position;
    }

    useEffect(() => {
        const _open_data = cloneDeep(open_data);
        let ids = [];
        let _nodes = cloneDeep(nodes);
        // 来判断导入的是不是前置条件
        if (import_node && import_node.length) {
            let mysql_node = import_node.filter(item => item.target_type === 'sql');
            if (mysql_node.length > 0) {
                mysql_node.forEach(item => {
                    const id = v4();
                    const new_node = {
                        id,
                        type: 'sql',
                        data: {
                            id,
                            from
                        },
                        position: {
                            x: 0,
                            y: 0
                        },
                        positionAbsolute: {
                            x: 0,
                            y: 0
                        },
                        dragHandle: '.drag-content',
                    };

                    _nodes.push(new_node);
                    _open_data.nodes = _nodes;

                    ids.push(id);

                    item.id = id;
                })
                if (from === 'scene') {
                    Bus.$emit('addNewSceneMysql', ids, mysql_node, ids.map(item => new Object()), from, () => {
                        dispatch({
                            type: 'scene/updateImportNode',
                            payload: [],
                        })
                        dispatch({
                            type: 'scene/updateNodes',
                            payload: _nodes,
                        })
                        dispatch({
                            type: 'scene/updateOpenScene',
                            payload: _open_data
                        })
                        setTimeout(() => {
                            Bus.$emit('saveScene');
                        }, 100);
                    });

                } else if (from === 'plan') {
                    Bus.$emit('addNewPlanMysql', ids, id_apis, node_config, mysql_node, ids.map(item => new Object()), from, (id_apis, node_config) => {
                        dispatch({
                            type: 'plan/updateImportNode',
                            payload: [],
                        })
                        dispatch({
                            type: 'plan/updateNodes',
                            payload: _nodes,
                        })
                        dispatch({
                            type: 'plan/updateOpenScene',
                            payload: _open_data
                        })
                        setTimeout(() => {
                            Bus.$emit('saveScenePlan', _nodes, edges, id_apis, node_config, open_data, id, 'plan', null, scene_env_id);
                        }, 100);
                    });

                } else if (from === 'auto_plan') {
                    Bus.$emit('addNewAutoPlanMysql', ids, mysql_node, ids.map(item => new Object()), () => {
                        dispatch({
                            type: 'auto_plan/updateImportNode',
                            payload: [],
                        })
                        dispatch({
                            type: 'auto_plan/updateNodes',
                            payload: _nodes,
                        })
                        dispatch({
                            type: 'auto_plan/updateOpenScene',
                            payload: _open_data
                        })
                        setTimeout(() => {
                            Bus.$emit('saveSceneAutoPlan', id);
                        }, 100);
                    });
                } else if (from === 'case') {
                    Bus.$emit('addNewCaseMysql', ids, mysql_node, ids.map(item => new Object()), () => {
                        dispatch({
                            type: 'case/updateImportNode',
                            payload: [],
                        })
                        dispatch({
                            type: 'case/updateNodes',
                            payload: _nodes,
                        })
                        dispatch({
                            type: 'case/updateOpenScene',
                            payload: _open_data
                        })
                        setTimeout(() => {
                            Bus.$emit('saveCase');
                        }, 100);
                    });

                }
            } else {
                let _position = [];
                import_node.forEach(item => {
                    const id = v4();
                    let position = getNewCoordinate(nodes.concat(_position));
                    _position.push({ position })
                    const new_node = {
                        id,
                        type: 'api',
                        data: {
                            id,
                            from,
                        },
                        position,
                        dragHandle: '.drag-content',
                    }
                    item.id = id;
                    ids.push(id);
                    setNodes((nds) => nds.concat(new_node));

                    _nodes.push(new_node);
                    _open_data.nodes = _nodes;

                    // if (_open_data.nodes) {
                    //     _open_data.nodes.push(new_node);
                    // } else {
                    //     _open_data.nodes = [new_node];
                    //     _open_data.edges = [];
                    // }
                });
                if (from === 'scene') {
                    Bus.$emit('addNewSceneApi', ids, import_node, ids.map(item => new Object()), from, () => {
                        dispatch({
                            type: 'scene/updateImportNode',
                            payload: [],
                        })
                        dispatch({
                            type: 'scene/updateNodes',
                            payload: _nodes,
                        })
                        dispatch({
                            type: 'scene/updateOpenScene',
                            payload: _open_data
                        })
                        setTimeout(() => {
                            Bus.$emit('saveScene');
                        }, 100);
                    });

                } else if (from === 'plan') {
                    Bus.$emit('addNewPlanApi', ids, id_apis, node_config, import_node, ids.map(item => new Object()), from, (id_apis, node_config) => {
                        dispatch({
                            type: 'plan/updateImportNode',
                            payload: [],
                        })
                        dispatch({
                            type: 'plan/updateNodes',
                            payload: _nodes,
                        })
                        dispatch({
                            type: 'plan/updateOpenScene',
                            payload: _open_data
                        })
                        setTimeout(() => {
                            Bus.$emit('saveScenePlan', _nodes, edges, id_apis, node_config, open_data, id, 'plan', null, scene_env_id);
                        }, 100);
                    });

                } else if (from === 'auto_plan') {
                    Bus.$emit('addNewAutoPlanApi', ids, import_node, {}, () => {
                        dispatch({
                            type: 'auto_plan/updateImportNode',
                            payload: [],
                        })
                        dispatch({
                            type: 'auto_plan/updateNodes',
                            payload: _nodes,
                        })
                        dispatch({
                            type: 'auto_plan/updateOpenScene',
                            payload: _open_data
                        })
                        setTimeout(() => {
                            Bus.$emit('saveSceneAutoPlan', id);
                        }, 100);
                    });
                } else if (from === 'case') {
                    Bus.$emit('addNewCaseApi', ids, import_node, {}, () => {
                        dispatch({
                            type: 'case/updateImportNode',
                            payload: [],
                        })
                        dispatch({
                            type: 'case/updateNodes',
                            payload: _nodes,
                        })
                        dispatch({
                            type: 'case/updateOpenScene',
                            payload: _open_data
                        })
                        setTimeout(() => {
                            Bus.$emit('saveCase');
                        }, 100);
                    });

                }
            }

        }
    }, [import_node]);

    useEffect(() => {

        formatSuccess();
        formatFailed();
    }, [nodes, success_edge, failed_edge])

    useEffect(() => {
        if (Object.entries((open_data || {})).length > 0) {
            const { nodes, edges } = open_data;
            // 1. 对nodes进行赋值, 渲染视图
            // 2. 对id_apis进行赋值, 建立id和api的映射关系
            // 3. 对node_config进行赋值, 建立id和config的映射关系
            const old_nodes = nodes && nodes.map(item => {
                const {
                    // node基本配置
                    data,
                    dragging,
                    id,
                    is_check,
                    position,
                    positionAbsolute,
                    selected,
                    type,
                    dragHandle,
                } = item;
                return {
                    data,
                    dragging,
                    id,
                    is_check,
                    position,
                    positionAbsolute,
                    selected,
                    type,
                    dragHandle,
                };
            });
            // edges && (edges[0].animated = true);
            setNodes(old_nodes || []);
            setEdges(edges || []);

            if (from === 'scene') {
                dispatch({
                    type: 'scene/updateNodes',
                    payload: nodes,
                });
                dispatch({
                    type: 'scene/updateEdges',
                    payload: edges,
                })
            } else if (from === 'plan') {
                dispatch({
                    type: 'plan/updateNodes',
                    payload: nodes,
                });
                dispatch({
                    type: 'plan/updateEdges',
                    payload: edges,
                })
            } else if (from === 'auto_plan') {
                dispatch({
                    type: 'auto_plan/updateNodes',
                    payload: nodes,
                });
                dispatch({
                    type: 'auto_plan/updateEdges',
                    payload: edges,
                })
            } else if (from === 'case') {
                dispatch({
                    type: 'case/updateNodes',
                    payload: nodes,
                });
                dispatch({
                    type: 'case/updateEdges',
                    payload: edges,
                })
            }

        }
    }, [open_data]);

    useEffect(() => {
        if (delete_node.length > 0) {
            const _open_data = cloneDeep(open_data);
            const node_index = nodes.findIndex(item => item.id === delete_node);
            const edge_index = edges.map((item, index) => {
                if (item.source === delete_node || item.target === delete_node) {
                    return index;
                }
            });
            let _nodes = cloneDeep(nodes);
            let _edges = cloneDeep(edges);
            _nodes.splice(node_index, 1);

            setNodes(_nodes);
            _open_data.nodes = _nodes;
            // edge_index.forEach(item => {
            //     typeof item === 'number' && _edges.splice(item, 1);
            // })
            _edges = _edges.filter((item, index) => !edge_index.includes(index));
            setEdges(_edges);
            _open_data.edges = _edges;
            // if (_nodes.length === 0) {
            if (from === 'scene') {
                dispatch({
                    type: 'scene/updateNodes',
                    payload: _nodes,
                });
                dispatch({
                    type: 'scene/updateEdges',
                    payload: _edges,
                })
                dispatch({
                    type: 'scene/updateDeleteNode',
                    payload: '',
                });
                dispatch({
                    type: 'scene/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveScene');
                }, 100);
            } else if (from === 'plan') {
                dispatch({
                    type: 'plan/updateNodes',
                    payload: _nodes,
                });
                dispatch({
                    type: 'plan/updateEdges',
                    payload: _edges,
                })
                dispatch({
                    type: 'plan/updateDeleteNode',
                    payload: '',
                });
                dispatch({
                    type: 'plan/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveScenePlan', _nodes, edges, id_apis, node_config, open_data, id, 'plan', null, scene_env_id);
                }, 100);
            } else if (from === 'auto_plan') {
                dispatch({
                    type: 'auto_plan/updateNodes',
                    payload: _nodes,
                });
                dispatch({
                    type: 'auto_plan/updateEdges',
                    payload: _edges,
                })
                dispatch({
                    type: 'auto_plan/updateDeleteNode',
                    payload: '',
                });
                dispatch({
                    type: 'auto_plan/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveSceneAutoPlan', id);
                }, 100);
            } else if (from === 'case') {
                dispatch({
                    type: 'case/updateNodes',
                    payload: _nodes,
                });
                dispatch({
                    type: 'case/updateEdges',
                    payload: _edges,
                })
                dispatch({
                    type: 'case/updateDeleteNode',
                    payload: '',
                });
                dispatch({
                    type: 'case/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveCase');
                }, 100);
            }
            // }
        }

    }, [delete_node]);

    useEffect(() => {
        if (Object.entries(clone_node).length > 0) {
            const _open_data = cloneDeep(open_data);
            const _nodes = cloneDeep(nodes);

            _nodes.push(clone_node);
            setNodes(_nodes);
            _open_data.nodes = _nodes;

            if (from === 'scene') {
                dispatch({
                    type: 'scene/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveScene');
                }, 100);
            } else if (from === 'plan') {
                dispatch({
                    type: 'plan/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveScenePlan', _nodes, edges, id_apis, node_config, open_data, id, 'plan', null, scene_env_id);
                }, 100);
            } else if (from === 'auto_plan') {
                dispatch({
                    type: 'auto_plan/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveSceneAutoPlan', id);
                }, 100);
            } else if (from === 'case') {
                dispatch({
                    type: 'case/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveCase');
                }, 100);
            }
        }
    }, [clone_node]);

    useEffect(() => {
        if (Object.entries(update_edge).length > 0) {
            const _edges = cloneDeep(edges);
            const index = _edges.findIndex(item => item.id === update_edge.id);
            _edges[index] = update_edge;
            setEdges(_edges);
        }
    }, [update_edge]);

    const formatSuccess = () => {
        if (success_edge.length > 0 && edges.length > 0) {
            // const _edges = cloneDeep(edges);
            // _edges.forEach(item => {
            //     if (success_edge.includes(item.id)) {
            //         item.style = {
            //             stroke: '#2BA58F',
            //         };
            //         item.markerEnd = {
            //             type: MarkerType.ArrowClosed,
            //         };
            //     }
            // });
            // setEdges(_edges);
            setEdges((nds) => {
                const _nds = cloneDeep(nds);
                _nds.forEach(item => {
                    if (success_edge.includes(item.id)) {
                        item.style = {
                            stroke: '#2BA58F',
                        };
                        item.markerEnd = {
                            type: MarkerType.ArrowClosed,
                        };
                    }
                })
                return _nds;
            });
        }
    }

    const formatFailed = () => {
        if (failed_edge.length > 0 && edges.length > 0) {
            // const _edges = cloneDeep(edges);
            // _edges.forEach(item => {
            //     if (failed_edge.includes(item.id)) {
            //         item.style = {
            //             stroke: 'var(--delete-red)',
            //         };
            //         item.markerEnd = {
            //             type: MarkerType.ArrowClosed,
            //         };
            //     }
            // })
            // setEdges(_edges);

            setEdges((nds) => {
                const _nds = cloneDeep(nds);
                _nds.forEach(item => {
                    if (failed_edge.includes(item.id)) {
                        item.style = {
                            stroke: 'var(--delete-red)',
                        };
                        item.markerEnd = {
                            type: MarkerType.ArrowClosed,
                        };
                    }
                })
                return _nds;
            });
        }
    }


    const [showMouse, setShowMouse] = useState(false);
    const [position, setPosition] = useState([]);

    useEffect(() => {
        const [action, type] = type_now;

        const id = v4();
        const _open_data = cloneDeep(open_data);
        if (action === 'add' && type === 'api') {
            const new_node = {
                id,
                type: 'api',
                data: {
                    id,
                    from,
                },
                position: {
                    x: position[0],
                    y: position[1]
                },
                positionAbsolute: {
                    x: position[0],
                    y: position[1]
                },
                mode: 1,
                dragHandle: '.drag-content',
            };
            setPosition([]);
            let _nodes = cloneDeep(nodes);
            _nodes.push(new_node);
            _open_data.nodes = _nodes;
            if (from === 'scene') {
                Bus.$emit('addNewSceneApi', new_node.id, { id }, { id }, from);
                dispatch({
                    type: 'scene/updateNodes',
                    payload: _nodes,
                })
                dispatch({
                    type: 'scene/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveScene');
                }, 100);
            } else if (from === 'plan') {
                Bus.$emit('addNewPlanApi', new_node.id, id_apis, node_config, { id }, { id }, from, (id_apis, node_config) => {
                    dispatch({
                        type: 'plan/updateNodes',
                        payload: _nodes,
                    })
                    dispatch({
                        type: 'plan/updateOpenScene',
                        payload: _open_data
                    })
                    setTimeout(() => {
                        Bus.$emit('saveScenePlan', _nodes, edges, id_apis, node_config, open_data, id, 'plan', null, scene_env_id);
                    }, 300);
                });
            } else if (from === 'auto_plan') {
                Bus.$emit('addNewAutoPlanApi', new_node.id, { id }, { id });
                dispatch({
                    type: 'auto_plan/updateNodes',
                    payload: _nodes,
                })
                dispatch({
                    type: 'auto_plan/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveSceneAutoPlan', id);
                }, 100);
            } else if (from === 'case') {
                Bus.$emit('addNewCaseApi', new_node.id, { id }, { id });
                dispatch({
                    type: 'case/updateNodes',
                    payload: _nodes,
                })
                dispatch({
                    type: 'case/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveCase');
                }, 100);
            }
            setNodes((nds) => nds.concat(new_node));
        } else if (action === 'add' && type === 'condition_controller') {
            const new_node = {
                id,
                type: 'condition_controller',
                data: {
                    id,
                    from,
                },
                position: {
                    x: position[0],
                    y: position[1]
                },
                positionAbsolute: {
                    x: position[0],
                    y: position[1]
                },
                dragHandle: '.drag-content',
            }

            setPosition([]);
            let _nodes = cloneDeep(nodes);
            _nodes.push(new_node);
            _open_data.nodes = _nodes;

            if (from === 'scene') {
                Bus.$emit('addNewSceneControl', new_node.id, node_config);
                dispatch({
                    type: 'scene/updateNodes',
                    payload: _nodes,
                })
                dispatch({
                    type: 'scene/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveScene');
                }, 100);
            } else if (from === 'plan') {
                Bus.$emit('addNewPlanControl', new_node.id, node_config);
                dispatch({
                    type: 'plan/updateNodes',
                    payload: _nodes,
                })
                dispatch({
                    type: 'plan/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveScenePlan', _nodes, edges, id_apis, node_config, open_data, id, 'plan', null, scene_env_id);
                }, 100);
            } else if (from === 'auto_plan') {
                Bus.$emit('addNewAutoPlanControl', new_node.id);
                dispatch({
                    type: 'auto_plan/updateNodes',
                    payload: _nodes,
                })
                dispatch({
                    type: 'auto_plan/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveSceneAutoPlan', id);
                }, 100);
            } else if (from === 'case') {
                Bus.$emit('addNewCaseControl', new_node.id);
                dispatch({
                    type: 'case/updateNodes',
                    payload: _nodes,
                })
                dispatch({
                    type: 'case/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveCase');
                }, 100);
            }

            setNodes((nds) => nds.concat(new_node));
        } else if (action === 'add' && type === 'wait_controller') {
            const new_node = {
                id,
                type: 'wait_controller',
                data: {
                    id,
                    from,
                },
                position: {
                    x: position[0],
                    y: position[1]
                },
                positionAbsolute: {
                    x: position[0],
                    y: position[1]
                },
                dragHandle: '.drag-content',
            }
            setPosition([]);
            let _nodes = cloneDeep(nodes);
            _nodes.push(new_node);
            _open_data.nodes = _nodes;

            if (from === 'scene') {
                Bus.$emit('addNewSceneControl', new_node.id, node_config);
                dispatch({
                    type: 'scene/updateNodes',
                    payload: _nodes,
                })
                dispatch({
                    type: 'scene/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveScene');
                }, 100);
            } else if (from === 'plan') {
                Bus.$emit('addNewPlanControl', new_node.id, node_config);
                dispatch({
                    type: 'plan/updateNodes',
                    payload: _nodes,
                })
                dispatch({
                    type: 'plan/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveScenePlan', _nodes, edges, id_apis, node_config, open_data, id, 'plan', null, scene_env_id);
                }, 100);
            } else if (from === 'auto_plan') {
                Bus.$emit('addNewAutoPlanControl', new_node.id);
                dispatch({
                    type: 'auto_plan/updateNodes',
                    payload: _nodes,
                })
                dispatch({
                    type: 'auto_plan/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveSceneAutoPlan', id);
                }, 100);
            } else if (from === 'case') {
                Bus.$emit('addNewCaseControl', new_node.id);
                dispatch({
                    type: 'case/updateNodes',
                    payload: _nodes,
                })
                dispatch({
                    type: 'case/updateOpenScene',
                    payload: _open_data
                })
                setTimeout(() => {
                    Bus.$emit('saveCase');
                }, 100);
            }

            setNodes((nds) => nds.concat(new_node));
        } else if (action === 'add' && type === 'sql') {
            const new_node = {
                id,
                type: 'sql',
                data: {
                    id,
                    from,
                },
                position: {
                    x: 0,
                    y: 0
                },
                positionAbsolute: {
                    x: 0,
                    y: 0
                },
                dragHandle: '.drag-content',
            };
            let _nodes = cloneDeep(nodes);
            _nodes.push(new_node);
            _open_data.nodes = _nodes;
            if (from === 'scene') {
                Bus.$emit('addNewSceneMysql', new_node.id, { id }, { id }, from, (id_apis) => {
                    dispatch({
                        type: 'scene/updateNodes',
                        payload: _nodes,
                    })
                    dispatch({
                        type: 'scene/updateOpenScene',
                        payload: _open_data
                    })
                    setTimeout(() => {
                        Bus.$emit('saveScene');
                    }, 100);

                    // 新建前置条件自动打开
                    const api_now = cloneDeep(id_apis[id]);
                    api_now.id = id;

                    dispatch({
                        type: 'scene/updateApiNow',
                        payload: api_now,
                    })
                    dispatch({
                        type: 'scene/updateShowMysqlConfig',
                        payload: true
                    })
                    dispatch({
                        type: 'scene/updateIdNow',
                        payload: id,
                    })
                });

            } else if (from === 'plan') {
                Bus.$emit('addNewPlanMysql', new_node.id, id_apis, node_config, { id }, { id }, from, (id_apis, node_config) => {
                    dispatch({
                        type: 'plan/updateNodes',
                        payload: _nodes,
                    })
                    dispatch({
                        type: 'plan/updateOpenScene',
                        payload: _open_data
                    })
                    setTimeout(() => {
                        Bus.$emit('saveScenePlan', _nodes, edges, id_apis, node_config, open_data, id, 'plan', null, scene_env_id);
                    }, 300);

                    // 新建前置条件后自动打开
                    const api_now = cloneDeep(id_apis[id]);
                    api_now.id = id;

                    dispatch({
                        type: 'plan/updateApiNow',
                        payload: api_now,
                    })
                    dispatch({
                        type: 'plan/updateShowMysqlConfig',
                        payload: true
                    })
                    dispatch({
                        type: 'plan/updateIdNow',
                        payload: id,
                    })
                });
            } else if (from === 'auto_plan') {
                Bus.$emit('addNewAutoPlanMysql', new_node.id, { id }, { id }, (id_apis) => {
                    dispatch({
                        type: 'auto_plan/updateNodes',
                        payload: _nodes,
                    })
                    dispatch({
                        type: 'auto_plan/updateOpenScene',
                        payload: _open_data
                    })
                    setTimeout(() => {
                        Bus.$emit('saveSceneAutoPlan', id);
                    }, 100);

                    // 新建前置条件自动打开
                    const api_now = cloneDeep(id_apis[id]);
                    api_now.id = id;

                    dispatch({
                        type: 'auto_plan/updateApiNow',
                        payload: api_now,
                    })
                    dispatch({
                        type: 'auto_plan/updateShowMysqlConfig',
                        payload: true
                    })
                    dispatch({
                        type: 'auto_plan/updateIdNow',
                        payload: id,
                    })
                });

            } else if (from === 'case') {
                Bus.$emit('addNewCaseMysql', new_node.id, { id }, { id }, (id_apis) => {
                    dispatch({
                        type: 'case/updateNodes',
                        payload: _nodes,
                    })
                    dispatch({
                        type: 'case/updateOpenScene',
                        payload: _open_data
                    })
                    setTimeout(() => {
                        Bus.$emit('saveCase');
                    }, 100);

                    // 新建前置条件默认打开
                    const api_now = cloneDeep(id_apis[id]);
                    api_now.id = id;

                    dispatch({
                        type: 'case/updateApiNow',
                        payload: api_now,
                    })
                    dispatch({
                        type: 'case/updateShowMysqlConfig',
                        payload: true
                    })
                    dispatch({
                        type: 'case/updateIdNow',
                        payload: id,
                    })
                });

            }
            setNodes((nds) => nds.concat(new_node));
        }

        if (type_now.length > 0) {
            if (from === 'scene') {
                dispatch({
                    type: 'scene/updateType',
                    payload: [],
                });
            } else if (from === 'plan') {
                dispatch({
                    type: 'plan/updateType',
                    payload: [],
                });
            } else if (from === 'auto_plan') {
                dispatch({
                    type: 'auto_plan/updateType',
                    payload: [],
                });
            } else if (from === 'case') {
                dispatch({
                    type: 'case/updateType',
                    payload: [],
                });
            }
        }

        if (from === 'scene') {
            dispatch({
                type: 'scene/updateBeautify',
                payload: false
            })
        } else if (from === 'plan') {
            dispatch({
                type: 'plan/updateBeautify',
                payload: false
            })
        } else if (from === 'auto_plan') {
            dispatch({
                type: 'auto_plan/updateBeautify',
                payload: false
            })
        } else if (from === 'case') {
            dispatch({
                type: 'case/updateBeautify',
                payload: false
            })
        }
    }, [type_now, position]);

    const scene_edge_right = useSelector((store) => store.scene.edge_right_id);
    const plan_edge_right = useSelector((store) => store.plan.edge_right_id);
    const auto_plan_edge_right = useSelector((store) => store.auto_plan.edge_right_id);

    const edge_right_list = {
        'scene': scene_edge_right,
        'plan': plan_edge_right,
        'auto_plan': auto_plan_edge_right
    }
    const edge_right = edge_right_list[from];


    useEffect(() => {
        const rightMenu = document.getElementsByClassName('scene-right-menu')[0];
        let rightMenuHandle = (e) => {
            const __edges = cloneDeep(_edges);
            if (edge_right) {
                const _index = __edges.findIndex(item => item.id === edge_right);
                if (_index !== -1) {
                    __edges.splice(_index, 1);

                    if (from === 'scene') {
                        dispatch({
                            type: 'scene/updateEdges',
                            payload: __edges
                        });
                        setTimeout(() => {
                            Bus.$emit('saveScene');
                        }, 100);
                    } else if (from === 'plan') {

                        dispatch({
                            type: 'plan/updateEdges',
                            payload: __edges
                        });
                        setTimeout(() => {
                            Bus.$emit('saveScenePlan', nodes, __edges, id_apis, node_config, open_data, id, 'plan', null, scene_env_id);
                        }, 100);
                    } else if (from === 'auto_plan') {

                        dispatch({
                            type: 'auto_plan/updateEdges',
                            payload: __edges
                        });
                        setTimeout(() => {
                            Bus.$emit('saveSceneAutoPlan', id);
                        }, 100);
                    } else if (from === 'case') {
                        dispatch({
                            type: 'case/updateEdges',
                            payload: __edges
                        });
                        setTimeout(() => {
                            Bus.$emit('saveCase');
                        }, 100);
                    }
                }

                setEdges(__edges);
            }

            rightMenu.style.display = 'none';
        }

        if (rightMenu) {
            rightMenu.addEventListener('click', rightMenuHandle);
        }

        return () => {
            if (rightMenu) {
                rightMenu.removeEventListener('click', rightMenuHandle);
            }
        }
    }, [edge_right, _edges, from]);

    const add_new_scene = useSelector((store) => store.scene.add_new);
    const add_new_plan = useSelector((store) => store.plan.add_new);
    const add_new_auto_plan = useSelector((store) => store.auto_plan.add_new);
    const add_new_case = useSelector((store) => store.case.add_new);

    const add_new_list = {
        'scene': add_new_scene,
        'plan': add_new_plan,
        'auto_plan': add_new_auto_plan,
        'case': add_new_case
    }
    const add_new = add_new_list[from];

    const svgMouse = document.getElementsByClassName('svg-mouse')[0];

    const [zoom, setZoom] = useState(1);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);


    if (add_new === 'api' || add_new === 'wait_controller' || add_new === 'condition_controller') {

        svgMouse && (svgMouse.style.display = 'block')
    } else if (!add_new) {
        svgMouse && (svgMouse.style.display = 'none')
    }

    const createMysqlPreCondition = () => {

    }

    useEffect(() => {

        const flow = document.getElementsByClassName('react-flow')[0];

        const mousemove = (e) => {
            const { pageX, pageY, offsetX, offsetY } = e;
            if (add_new === 'api' || add_new === 'wait_controller' || add_new === 'condition_controller') {
                setShowMouse(true);

                svgMouse.style.top = offsetY + 'px';
                svgMouse.style.left = offsetX + 'px';
                // svgMouse.style.display = 'block';
            }
        }

        const click = (e) => {
            const { offsetX, offsetY, clientX, clientY } = e;
            const reactFlowBounds = refContainer.current.getBoundingClientRect();

            const position = flowInstance.project({
                x: clientX - reactFlowBounds.left,
                y: clientY - reactFlowBounds.top
            });
            if (add_new === 'api') {

                setPosition([position.x, position.y]);
                if (from === 'scene') {
                    dispatch({
                        type: 'scene/updateType',
                        payload: ['add', 'api']
                    })
                    dispatch({
                        type: 'scene/updateAddNew',
                        payload: ''
                    })
                } else if (from === 'plan') {
                    dispatch({
                        type: 'plan/updateType',
                        payload: ['add', 'api']
                    })
                    dispatch({
                        type: 'plan/updateAddNew',
                        payload: ''
                    })
                } else if (from === 'auto_plan') {
                    dispatch({
                        type: 'auto_plan/updateType',
                        payload: ['add', 'api']
                    })
                    dispatch({
                        type: 'auto_plan/updateAddNew',
                        payload: ''
                    })
                } else if (from === 'case') {
                    dispatch({
                        type: 'case/updateType',
                        payload: ['add', 'api']
                    })
                    dispatch({
                        type: 'case/updateAddNew',
                        payload: ''
                    })
                }
                svgMouse.style.display = 'none';
            } else if (add_new === 'wait_controller') {
                setPosition([position.x, position.y]);
                if (from === 'scene') {
                    dispatch({
                        type: 'scene/updateType',
                        payload: ['add', 'wait_controller']
                    })
                    dispatch({
                        type: 'scene/updateAddNew',
                        payload: ''
                    })
                } else if (from === 'plan') {
                    dispatch({
                        type: 'plan/updateType',
                        payload: ['add', 'wait_controller']
                    })
                    dispatch({
                        type: 'plan/updateAddNew',
                        payload: ''
                    })
                } else if (from === 'auto_plan') {
                    dispatch({
                        type: 'auto_plan/updateType',
                        payload: ['add', 'wait_controller']
                    })
                    dispatch({
                        type: 'auto_plan/updateAddNew',
                        payload: ''
                    })
                } else if (from === 'case') {
                    dispatch({
                        type: 'case/updateType',
                        payload: ['add', 'wait_controller']
                    })
                    dispatch({
                        type: 'case/updateAddNew',
                        payload: ''
                    })
                }
                svgMouse.style.display = 'none';
            } else if (add_new === 'condition_controller') {
                setPosition([position.x, position.y]);
                if (from === 'scene') {
                    dispatch({
                        type: 'scene/updateType',
                        payload: ['add', 'condition_controller']
                    })
                    dispatch({
                        type: 'scene/updateAddNew',
                        payload: ''
                    })
                } else if (from === 'plan') {
                    dispatch({
                        type: 'plan/updateType',
                        payload: ['add', 'condition_controller']
                    })
                    dispatch({
                        type: 'plan/updateAddNew',
                        payload: ''
                    })
                } else if (from === 'auto_plan') {
                    dispatch({
                        type: 'auto_plan/updateType',
                        payload: ['add', 'condition_controller']
                    })
                    dispatch({
                        type: 'auto_plan/updateAddNew',
                        payload: ''
                    })
                } else if (from === 'case') {
                    dispatch({
                        type: 'case/updateType',
                        payload: ['add', 'condition_controller']
                    })
                    dispatch({
                        type: 'case/updateAddNew',
                        payload: ''
                    })
                }
                svgMouse.style.display = 'none';
            }

        }

        flow.addEventListener('mousemove', mousemove);

        flow.addEventListener('click', click);

        flow.oncontextmenu = () => {
            if (add_new) {
                if (from === 'scene') {
                    dispatch({
                        type: 'scene/updateAddNew',
                        payload: ''
                    })
                } else if (from === 'plan') {
                    dispatch({
                        type: 'plan/updateAddNew',
                        payload: ''
                    })
                } else if (from === 'auto_plan') {
                    dispatch({
                        type: 'auto_plan/updateAddNew',
                        payload: ''
                    })
                } else if (from === 'case') {
                    dispatch({
                        type: 'case/updateAddNew',
                        payload: ''
                    })
                }
                svgMouse.style.display = 'none';
            }
        }

        return () => {
            flow.removeEventListener('mousemove', mousemove);
            flow.removeEventListener('click', click);
        }
    }, [add_new, zoom]);

    const hide_config = useSelector((store) => store.plan.hide_config);


    const updateSceneWs = (param) => {
        if (drop_loading_time !== param) {
            return;
        }
        const _open_data = cloneDeep(open_data);
        _open_data.nodes = nodes;
        if (from === 'scene') {
            dispatch({
                type: 'scene/updateNodes',
                payload: nodes,
            })
            dispatch({
                type: 'scene/updateOpenScene',
                payload: _open_data,
            })
            setTimeout(() => {
                Bus.$emit('saveScene');
            }, 100);
        } else if (from === 'plan') {
            dispatch({
                type: 'plan/updateNodes',
                payload: nodes,
            })
            dispatch({
                type: 'plan/updateOpenScene',
                payload: _open_data,
            })
            setTimeout(() => {
                Bus.$emit('saveScenePlan', nodes, edges, id_apis, node_config, open_data, id, 'plan', null, scene_env_id);
            }, 100);
        } else if (from === 'auto_plan') {
            dispatch({
                type: 'auto_plan/updateNodes',
                payload: nodes,
            })
            dispatch({
                type: 'auto_plan/updateOpenScene',
                payload: _open_data,
            })
            setTimeout(() => {
                Bus.$emit('saveSceneAutoPlan', id);
            }, 100);
        } else if (from === 'case') {
            dispatch({
                type: 'case/updateNodes',
                payload: nodes,
            })
            dispatch({
                type: 'case/updateOpenScene',
                payload: _open_data,
            })
            setTimeout(() => {
                Bus.$emit('saveCase');
            }, 100);
        }
    }

    const nodeDragDebounce = () => {
        drop_loading_time = new Date().getTime();

        debounce((drop_loading_time) => updateSceneWs(drop_loading_time), 1000)(drop_loading_time);
    };

    return (
        <div ref={refContainer} style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* <div className="scene-box" ref={refBox}>
                <div className="scene-box-item">
                    <div className="scene-box-top"></div>
                    SceneBox
                    <div className="scene-box-bottom"></div>
                </div>
            </div> */}
            {/* <Box /> */}
            {/* <WaitController /> */}
            {
                (from === 'scene' || from === 'auto_plan') && <CaseList from={from} />
            }
            <ReactFlow
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={onInit}
                onMove={(e, viewport) => {
                    const { x, y, zoom } = viewport;
                    setX(x);
                    setY(y);
                    setZoom(zoom);

                    if (from === 'scene') {
                        dispatch({
                            type: 'scene/updateHideDrop',
                            payload: !hide_drop
                        })
                    } else if (from === 'plan') {
                        dispatch({
                            type: 'plan/updateHideDrop',
                            payload: !hide_drop
                        })
                    } else if (from === 'auto_plan') {
                        dispatch({
                            type: 'auto_plan/updateHideDrop',
                            payload: !hide_drop
                        })
                    } else if (from === 'case') {
                        dispatch({
                            type: 'case/updateHideDrop',
                            payload: !hide_drop
                        })
                    }
                }}
                onNodeDrag={nodeDragDebounce}
                onNodesDelete={(e) => {
                    const _nodes = cloneDeep(nodes);
                    const _open_data = cloneDeep(open_data);
                    const _index = _nodes.findIndex(item => item.id === e[0].id);
                    if (_index !== -1) {
                        _nodes.splice(_index, 1);
                    }

                    const edge_index = edges.map((item, index) => {
                        if (item.source === e[0].id || item.target === e[0].id) {
                            return index;
                        }
                    });
                    let _edges = cloneDeep(edges);
                    _edges = _edges.filter((item, index) => !edge_index.includes(index));
                    setEdges(_edges);

                    _open_data.nodes = _nodes;
                    _open_data.edges = _edges;

                    if (from === 'scene') {
                        dispatch({
                            type: 'scene/updateNodes',
                            payload: _nodes
                        })
                        dispatch({
                            type: 'scene/updateEdges',
                            payload: _edges
                        })
                        dispatch({
                            type: 'scene/updateOpenScene',
                            payload: _open_data,
                        })
                        setNodes(_nodes);
                        setEdges(_edges);
                        setTimeout(() => {
                            Bus.$emit('saveScene');
                        }, 100);
                    } else if (from === 'plan') {
                        dispatch({
                            type: 'plan/updateNodes',
                            payload: _nodes
                        })
                        dispatch({
                            type: 'plan/updateEdges',
                            payload: _edges
                        })
                        dispatch({
                            type: 'plan/updateOpenScene',
                            payload: _open_data,
                        })
                        setNodes(_nodes);
                        setEdges(_edges);

                        setTimeout(() => {
                            Bus.$emit('saveScenePlan', _nodes, _edges, id_apis, node_config, open_data, id, 'plan', null, scene_env_id);
                        }, 100);
                    } else if (from === 'auto_plan') {
                        dispatch({
                            type: 'auto_plan/updateNodes',
                            payload: _nodes
                        })
                        dispatch({
                            type: 'auto_plan/updateEdges',
                            payload: _edges
                        })
                        dispatch({
                            type: 'auto_plan/updateOpenScene',
                            payload: _open_data,
                        })
                        setNodes(_nodes);
                        setEdges(_edges);

                        setTimeout(() => {
                            Bus.$emit('saveSceneAutoPlan', id);
                        }, 100);
                    } else if (from === 'case') {
                        dispatch({
                            type: 'case/updateNodes',
                            payload: _nodes
                        })
                        dispatch({
                            type: 'case/updateEdges',
                            payload: _edges
                        })
                        dispatch({
                            type: 'case/updateOpenScene',
                            payload: _open_data,
                        })
                        setNodes(_nodes);
                        setEdges(_edges);

                        setTimeout(() => {
                            Bus.$emit('saveCase');
                        }, 100);
                    }
                }}
                onEdgesDelete={(e) => {
                    const _edges = cloneDeep(edges);
                    const _open_data = cloneDeep(open_data);
                    const _index = _edges.findIndex(item => item.id === e[0].id);
                    if (_index !== -1) {
                        _edges.splice(_index, 1);
                    }

                    setEdges(_edges);

                    _open_data.edges = _edges;

                    if (from === 'scene') {
                        dispatch({
                            type: 'scene/updateEdges',
                            payload: _edges
                        })
                        dispatch({
                            type: 'scene/updateOpenScene',
                            payload: _open_data,
                        })
                        setTimeout(() => {
                            Bus.$emit('saveScene');
                        }, 100);
                    } else if (from === 'plan') {
                        dispatch({
                            type: 'plan/updateEdges',
                            payload: _edges
                        })
                        dispatch({
                            type: 'plan/updateOpenScene',
                            payload: _open_data,
                        })
                        setTimeout(() => {
                            Bus.$emit('saveScenePlan', nodes, _edges, id_apis, node_config, open_data, id, 'plan', null, scene_env_id);
                        }, 100);
                    } else if (from === 'auto_plan') {
                        dispatch({
                            type: 'auto_plan/updateEdges',
                            payload: _edges
                        })
                        dispatch({
                            type: 'auto_plan/updateOpenScene',
                            payload: _open_data,
                        })
                        setTimeout(() => {
                            Bus.$emit('saveSceneAutoPlan', id);
                        }, 100);
                    } else if (from === 'case') {
                        dispatch({
                            type: 'case/updateEdges',
                            payload: _edges
                        })
                        dispatch({
                            type: 'case/updateOpenScene',
                            payload: _open_data,
                        })
                        setTimeout(() => {
                            Bus.$emit('saveCase');
                        }, 100);
                    }
                }}
                onPaneMouseMove={(e) => {
                }}
            // fitView
            >
                {/* <MiniMap
                    nodeStrokeColor={(n) => {
                        if (n.style?.background) return n.style.background;
                        if (n.type === 'input') return '#0041d0';
                        if (n.type === 'output') return '#ff0072';
                        if (n.type === 'default') return '#1a192b';

                        return '#eee';
                    }}
                    nodeColor={(n) => {
                        if (n.style?.background) return n.style.background;

                        return 'var(--font-1)';
                    }}
                    nodeBorderRadius={2}
                >
                    <Controls />
                    <Background color="#aaa" gap={16} />
                </MiniMap> */}
                {/* <Controls /> */}
                <Background style={{ backgroundColor: 'var(--module)' }} />
            </ReactFlow>

            {
                <SvgMouse className='svg-mouse' />
            }

            {
                (hide_config && from === 'plan') && <div class='plan-task-config-hideing' onClick={() => {
                    dispatch({
                        type: 'plan/updateHideConfig',
                        payload: false
                    })
                }}>
                    <p>{t('plan.taskConfig')}</p>
                    <SvgLeft />
                </div>
            }

            <div className="scene-right-menu" style={{ display: 'none' }}>
                {t('index.delete')}
            </div>
        </div>
    )
};

export default SceneBox;