import React, { useState, useRef, useEffect } from 'react';
import './index.less';
import {
    Apis as SvgApi,
    Down as SvgDown,
    More as SvgMore,
    Right as SvgRight
} from 'adesign-react/icons';
import {
    Button,
    Collapse as Col,
    // Select,
    Dropdown,
    Message,
    Tooltip
} from 'adesign-react';
import { useDispatch, useSelector } from 'react-redux';
import { Handle, MarkerType } from 'react-flow-renderer';
import { cloneDeep, isBoolean, isNumber } from 'lodash';
import Bus from '@utils/eventBus';
import SvgSuccess from '@assets/logo/success';
import SvgFailed from '@assets/logo/failed';
import SvgRunning from '@assets/logo/running';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { fetchTeamPackage } from '@services/pay';
import SvgMode from './mode';
import { Select, Input } from '@arco-design/web-react';


const { CollapseItem, Collapse } = Col;

const { Option } = Select;

const nodeBaseStyle = {
    background: "#0FA9CC",
    width: '8px',
    height: '8px',
};

const nodeLeftTopStyle = {
    ...nodeBaseStyle,
    top: 60,
};

// 点
// 1. 普通, 未涉及任何操作
// 2. 运行中, 正在跑这个接口
// 3. 成功, 接口跑通过
// 4. 失败, 接口跑失败
// 5. 未进行, 此节点的依赖节点跑失败, 未运行到这里

// 线
// 1. 普通, 为涉及任何操作
// 2. 运行中, 蓝色的流动的带箭头的线
// 3. 成功, 此线的前节点跑成功
// 4. 失败, 此线的千节点跑失败


const Box = (props) => {
    const { data: { showOne, id, from } } = props;
    const dispatch = useDispatch();
    const refInput = useRef(null);
    const refDropdown = useRef(null);
    const { t } = useTranslation();


    const nodes_scene = useSelector((store) => store.scene.nodes);
    const id_apis_scene = useSelector((store) => store.scene.id_apis);
    const node_config_scene = useSelector((store) => store.scene.node_config);
    const open_scene_scene = useSelector((store) => store.scene.open_scene);
    const run_res_scene = useSelector((store) => store.scene.run_res);
    const edges_scene = useSelector((store) => store.scene.edges);
    const init_scene_scene = useSelector((store) => store.scene.init_scene);
    const to_loading_scene = useSelector((store) => store.scene.to_loading);
    const success_edge_scene = useSelector((store) => store.scene.success_edge);
    const failed_edge_scene = useSelector((store) => store.scene.failed_edge);
    const running_scene_scene = useSelector((store) => store.scene.running_scene);
    const select_box_scene = useSelector((store) => store.scene.select_box);
    const scene_hide = useSelector((store) => store.scene.hide_drop);
    const id_now_scene = useSelector((store) => store.scene.id_now);
    const refresh_box = useSelector((store) => store.scene.refresh_box);
    const run_status_scene = useSelector((store) => store.scene.run_status);


    const nodes_plan = useSelector((store) => store.plan.nodes);
    const id_apis_plan = useSelector((store) => store.plan.id_apis);
    const node_config_plan = useSelector((store) => store.plan.node_config);
    const open_scene_plan = useSelector((store) => store.plan.open_plan_scene);
    const run_res_plan = useSelector((store) => store.plan.run_res);
    const edges_plan = useSelector((store) => store.plan.edges);
    const init_scene_plan = useSelector((store) => store.plan.init_scene);
    const to_loading_plan = useSelector((store) => store.plan.to_loading);
    const success_edge_plan = useSelector((store) => store.plan.success_edge);
    const failed_edge_plan = useSelector((store) => store.plan.failed_edge);
    const running_scene_plan = useSelector((store) => store.plan.running_scene);
    const select_box_plan = useSelector((store) => store.plan.select_box);
    const plan_hide = useSelector((store) => store.plan.hide_drop);
    const id_now_plan = useSelector((store) => store.plan.id_now);
    const run_status_plan = useSelector((store) => store.plan.run_status);


    const nodes_auto_plan = useSelector((store) => store.auto_plan.nodes);
    const id_apis_auto_plan = useSelector((store) => store.auto_plan.id_apis);
    const node_config_auto_plan = useSelector((store) => store.auto_plan.node_config);
    const open_scene_auto_plan = useSelector((store) => store.auto_plan.open_plan_scene);
    const run_res_auto_plan = useSelector((store) => store.auto_plan.run_res);
    const edges_auto_plan = useSelector((store) => store.auto_plan.edges);
    const init_scene_auto_plan = useSelector((store) => store.auto_plan.init_scene);
    const to_loading_auto_plan = useSelector((store) => store.auto_plan.to_loading);
    const success_edge_auto_plan = useSelector((store) => store.auto_plan.success_edge);
    const failed_edge_auto_plan = useSelector((store) => store.auto_plan.failed_edge);
    const running_scene_auto_plan = useSelector((store) => store.auto_plan.running_scene);
    const select_box_auto_plan = useSelector((store) => store.auto_plan.select_box);
    const auto_plan_hide = useSelector((store) => store.auto_plan.hide_drop);
    const id_now_auto_plan = useSelector((store) => store.auto_plan.id_now);
    const run_status_auto_plan = useSelector((store) => store.auto_plan.run_status);

    const nodes_case = useSelector((store) => store.case.nodes);
    const id_apis_case = useSelector((store) => store.case.id_apis);
    const node_config_case = useSelector((store) => store.case.node_config);
    const open_scene_case = useSelector((store) => store.case.open_case);
    const run_res_case = useSelector((store) => store.case.run_res);
    const edges_case = useSelector((store) => store.case.edges);
    const init_scene_case = useSelector((store) => store.case.init_scene);
    const to_loading_case = useSelector((store) => store.case.to_loading);
    const success_edge_case = useSelector((store) => store.case.success_edge);
    const failed_edge_case = useSelector((store) => store.case.failed_edge);
    const running_scene_case = useSelector((store) => store.case.running_scene);
    const select_box_case = useSelector((store) => store.case.select_box);
    const case_hide = useSelector((store) => store.case.hide_drop);
    const id_now_case = useSelector((store) => store.case.id_now);
    const run_status_case = useSelector((store) => store.case.run_status);

    const scene_env_id = useSelector((store) => store.env.scene_env_id);

    const nodes_list = {
        'scene': nodes_scene,
        'plan': nodes_plan,
        'auto_plan': nodes_auto_plan,
        'case': nodes_case
    };
    const nodes = nodes_list[from];

    const id_apis_list = {
        'scene': id_apis_scene,
        'plan': id_apis_plan,
        'auto_plan': id_apis_auto_plan,
        'case': id_apis_case
    };
    const id_apis = id_apis_list[from];

    const node_config_list = {
        'scene': node_config_scene,
        'plan': node_config_plan,
        'auto_plan': node_config_auto_plan,
        'case': node_config_case
    }
    const node_config = node_config_list[from];

    const open_scene_list = {
        'scene': open_scene_scene,
        'plan': open_scene_plan,
        'auto_plan': open_scene_auto_plan,
        'case': open_scene_case
    }
    const open_scene = open_scene_list[from];

    const run_res_list = {
        'scene': run_res_scene,
        'plan': run_res_plan,
        'auto_plan': run_res_auto_plan,
        'case': run_res_case
    }
    const run_res = run_res_list[from];

    const edges_list = {
        'scene': edges_scene,
        'plan': edges_plan,
        'auto_plan': edges_auto_plan,
        'case': edges_case
    }
    const edges = edges_list[from];

    const init_scene_list = {
        'scene': init_scene_scene,
        'plan': init_scene_plan,
        'auto_plan': init_scene_auto_plan,
        'case': init_scene_case
    }
    const init_scene = init_scene_list[from];

    const to_loading_list = {
        'scene': to_loading_scene,
        'plan': to_loading_plan,
        'auto_plan': to_loading_auto_plan,
        'case': to_loading_case
    }
    const to_loading = to_loading_list[from];

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

    const running_scene_list = {
        'scene': running_scene_scene,
        'plan': running_scene_plan,
        'auto_plan': running_scene_auto_plan,
        'case': running_scene_case
    }
    const running_scene = running_scene_list[from];

    const select_box_list = {
        'scene': select_box_scene,
        'plan': select_box_plan,
        'auto_plan': select_box_auto_plan,
        'case': select_box_case
    }
    const select_box = select_box_list[from];

    const hide_drop_list = {
        'scene': scene_hide,
        'plan': plan_hide,
        'auto_plan': auto_plan_hide,
        'case': case_hide
    };
    const hide_drop = hide_drop_list[from];

    const id_now_list = {
        'scene': id_now_scene,
        'plan': id_now_plan,
        'auto_plan': id_now_auto_plan,
        'case': id_now_case
    };

    const id_now = id_now_list[from];


    const run_status_list = {
        'scene': run_status_scene,
        'plan': run_status_plan,
        'auto_plan': run_status_auto_plan,
        'case': run_status_case
    }
    const run_status = run_status_list[from];


    const theme = useSelector((store) => store.user.theme);
    const [isHide, setIsHide] = useState(false);
    const [showMode, setShowMode] = useState(false);
    const [showModeTime, setShowModeTime] = useState(false);
    // 1. 默认模式
    // 2. 错误率模式
    // 3. 每秒事务数模式
    // 4. 响应时间模式
    // 5. 每秒请求数模式
    const [mode, setMode] = useState(1);
    const [menuList, setMenuList] = useState([50, 90, 95, 100, 101]);
    // 接口权重
    const [weight, setWeight] = useState(100);
    // 错误率阈值
    const [error_threshold, setError] = useState(0);
    // 响应时间阈值
    const [response_threshold, setRes] = useState(0);
    // 请求数阈值
    const [request_threshold, setReq] = useState(0);
    // 响应时间占比
    const [percent_age, setPercent] = useState(90);

    // 当前节点状态
    const [status, setStatus] = useState('default');

    useEffect(() => {
        const my_config = node_config[id];
        if (my_config) {
            const { weight, error_threshold, response_threshold, request_threshold, percent_age, mode, is_hide } = my_config;
            isNumber(weight) && setWeight(weight);
            isNumber(error_threshold) && setError(error_threshold);
            isNumber(response_threshold) && setRes(response_threshold);
            isNumber(request_threshold) && setReq(request_threshold);
            isNumber(percent_age) && setPercent(percent_age);
            isNumber(mode) && setMode(mode === 0 ? 1 : mode);
            setIsHide(!!is_hide);
        }
    }, [node_config]);

    useEffect(() => {
        setStatus('default');
    }, [init_scene]);

    useEffect(() => {
        if (run_res) {
            const now_res = run_res.filter(item => item.event_id === id)[0];
            if (now_res) {
                const { status } = now_res;
                setStatus(status);

                update(edges, status);
            }
        }
    }, [run_res]);

    useEffect(() => {
        if (open_scene) {
            if (to_loading && running_scene === (open_scene.scene_id ? open_scene.scene_id : open_scene.target_id)) {
                setStatus('running');
            }
        }
    }, [to_loading])

    useEffect(() => {
        refDropdown.current.setPopupVisible(false);
    }, [hide_drop]);

    const DropContent = () => {
        const api_now = cloneDeep(id_apis[id]);
        api_now.id = id;
        return (
            <div className='drop-content'>
                <p onClick={() => {
                    changeApiConfig(id);
                    refDropdown.current.setPopupVisible(false);
                }}>{t('scene.editApi')}</p>
                <p onClick={() => {
                    if (from === 'case') {
                        Bus.$emit('cloneCaseNode', id);
                    } else {
                        Bus.$emit('cloneNode', id, nodes, node_config, id_apis, open_scene, from);
                    }

                    refDropdown.current.setPopupVisible(false);

                }}>{t('scene.copyApi')}</p>
                <p onClick={() => {
                    if (from === 'scene') {
                        dispatch({
                            type: 'scene/updateDeleteNode',
                            payload: id,
                        });

                        if (id_now === id) {
                            dispatch({
                                type: 'scene/updateApiConfig',
                                payload: {
                                    type: 'api',
                                    status: false,
                                    id,
                                    api_now,
                                }
                            })
                        }
                    } else if (from === 'plan') {
                        dispatch({
                            type: 'plan/updateDeleteNode',
                            payload: id,
                        });

                        if (id_now === id) {
                            dispatch({
                                type: 'plan/updateApiConfig',
                                payload: {
                                    type: 'api',
                                    status: false,
                                    id,
                                    api_now,
                                }
                            })
                        }
                    } else if (from === 'auto_plan') {
                        dispatch({
                            type: 'auto_plan/updateDeleteNode',
                            payload: id,
                        });

                        if (id_now === id) {
                            dispatch({
                                type: 'auto_plan/updateApiConfig',
                                payload: {
                                    type: 'api',
                                    status: false,
                                    id,
                                    api_now,
                                }
                            })
                        }
                    } else if (from === 'case') {
                        dispatch({
                            type: 'case/updateDeleteNode',
                            payload: id,
                        });

                        if (id_now === id) {
                            dispatch({
                                type: 'case/updateApiConfig',
                                payload: {
                                    type: 'api',
                                    status: false,
                                    id,
                                    api_now,
                                }
                            })
                        }
                    }

                    refDropdown.current.setPopupVisible(false);
                }}>{t('scene.deleteApi')}</p>
            </div>
        )
    };

    const topBgStyle = {
        'default': '',
        'success': 'var(--run-green)',
        'failed': 'var(--run-red)',
        'running': '',
        'not-run': '',
        'not-hit': '',
    }

    const topStatus = {
        'default': <></>,
        'success': <SvgSuccess className='default' />,
        'failed': <SvgFailed className='default' />,
        'running': <SvgRunning className='default' />,
        'not-run': <></>,
        'not-hit': <></>,
    };

    // 1. 运行场景
    // 2. 所有根节点进入running状态
    // 3. 轮询查结果, 查到结果都更新到redux
    // 4. 结果集中有更新后, 节点中进行自身检查, 结果集中是否有本节点的信息, 如果有, 根据status进行自身更新  
    // 5. 如果当前节点状态是success, 将此节点和所有next_list中的节点有关联的线变成绿色, 所有next_list中的节点为顶点的线变为loading
    // 6. 如果当前节点状态是failed, 将此节点和所有next_list中的节点有关联的线变成红色

    const update = (edges, status) => {
        // const _open_scene = cloneDeep(open_scene);
        let temp = false;
        // const { edges } = open_scene;
        if (status === 'success') {
            // 以当前节点为顶点的线id
            // const successEdge = [];
            // const Node = [];

            edges && edges.forEach(item => {
                if (item.source === id && !success_edge.includes(item.id)) {
                    success_edge.push(item.id);
                    temp = true;
                    // item.style = {
                    //     stroke: '#2BA58F',
                    // };
                    // item.markerEnd = {
                    //     type: MarkerType.ArrowClosed,
                    // };
                }
            })
            if (success_edge.length > 0 && temp) {
                if (from === 'scene') {
                    dispatch({
                        type: 'scene/updateSuccessEdge',
                        payload: success_edge,
                    })
                } else if (from === 'plan') {
                    dispatch({
                        type: 'plan/updateSuccessEdge',
                        payload: success_edge
                    })
                } else if (from === 'auto_plan') {
                    dispatch({
                        type: 'auto_plan/updateSuccessEdge',
                        payload: success_edge
                    })
                } else if (from === 'case') {
                    dispatch({
                        type: 'case/updateSuccessEdge',
                        payload: success_edge
                    })
                }
            }
        } else if (status === 'failed') {

            edges && edges.forEach(item => {
                if (item.source === id && !failed_edge.includes(item.id)) {
                    failed_edge.push(item.id);
                    temp = true;
                }
            })

            if (failed_edge.length > 0 && temp) {
                if (from === 'scene') {
                    dispatch({
                        type: 'scene/updateFailedEdge',
                        payload: failed_edge,
                    })
                } else if (from === 'plan') {
                    dispatch({
                        type: 'plan/updateFailedEdge',
                        payload: failed_edge,
                    })
                } else if (from === 'auto_plan') {
                    dispatch({
                        type: 'auto_plan/updateFailedEdge',
                        payload: failed_edge,
                    })
                } else if (from === 'case') {
                    dispatch({
                        type: 'case/updateFailedEdge',
                        payload: failed_edge,
                    })
                }
            }
        }
    }

    const Header = () => {
        return (
            <div className={cn('box-item', { 'white-run-color': theme === 'white' ? (status === 'success' || status === 'failed') : false })} style={{ backgroundColor: topBgStyle[status] }}>
                <div className='box-item-left'>
                    <SvgApi />
                    <span className='name'>{id_apis[id] ? id_apis[id]?.name : '新建接口'}</span>
                    {
                        topStatus[status]
                    }
                </div>
                <div className='drag-content'>

                </div>
                <div className='box-item-right'>
                    <p className='drop-down' onClick={(e) => {
                        onTargetChange('is_hide', !isHide);
                        setIsHide(!isHide);
                    }}>
                        {!isHide ? <SvgDown /> : <SvgRight />}
                    </p>
                    <Dropdown
                        ref={refDropdown}
                        content={
                            <div>
                                <DropContent />
                            </div>
                        }
                    // style={{ zIndex: 1050 }}
                    >
                        <div ><SvgMore className='more-svg' onClick={(e) => {

                            e.preventDefault();
                            e.stopPropagation();

                            if (run_status === 'running') {
                                Message('error', t('message.runningSceneCanNotHandle'));
                                return;
                            }

                            setSelectBox(true);


                            const api_now = cloneDeep(id_apis[id]);
                            api_now.id = id;

                            if (from === 'scene') {
                                dispatch({
                                    type: 'scene/updateApiNow',
                                    payload: api_now,
                                })
                                dispatch({
                                    type: 'scene/updateIdNow',
                                    payload: id,
                                })
                            } else if (from === 'plan') {
                                dispatch({
                                    type: 'plan/updateApiNow',
                                    payload: api_now,
                                })
                                dispatch({
                                    type: 'plan/updateIdNow',
                                    payload: id,
                                })
                            } else if (from === 'auto_plan') {
                                dispatch({
                                    type: 'auto_plan/updateApiNow',
                                    payload: api_now,
                                })
                                dispatch({
                                    type: 'auto_plan/updateIdNow',
                                    payload: id,
                                })
                            } else if (from === 'case') {
                                dispatch({
                                    type: 'case/updateApiNow',
                                    payload: api_now,
                                })
                                dispatch({
                                    type: 'case/updateIdNow',
                                    payload: id,
                                })
                            }

                            setTimeout(() => {
                                refDropdown.current.setPopupVisible(true);
                            }, 100);
                        }} /></div>
                    </Dropdown>
                </div>
            </div>
        )
    };


    const changeApiConfig = (id, showAssert) => {
        // e.preventDefault();
        // e.stopPropagation();
        const api_now = cloneDeep(id_apis[id]);
        api_now.id = id;

        if (from === 'scene') {
            dispatch({
                type: 'scene/updateApiConfig',
                payload: {
                    type: 'api',
                    status: true,
                    id,
                    api_now
                }
            })
        } else if (from === 'plan') {
            dispatch({
                type: 'plan/updateApiConfig',
                payload: {
                    type: 'api',
                    status: true,
                    id,
                    api_now
                }
            })
        } else if (from === 'auto_plan') {
            dispatch({
                type: 'auto_plan/updateApiConfig',
                payload: {
                    type: 'api',
                    status: true,
                    id,
                    api_now
                }
            })
            dispatch({
                type: 'auto_plan/updateShowAssert',
                payload: !!showAssert
            })
        } else if (from === 'case') {
            dispatch({
                type: 'case/updateApiConfig',
                payload: {
                    type: 'api',
                    status: true,
                    id,
                    api_now
                }
            })
            dispatch({
                type: 'case/updateShowAssert',
                payload: !!showAssert
            })
        }
    };

    const onTargetChange = (type, value) => {
        const callback = (node_config) => {
            if (from === 'scene') {
                setTimeout(() => {
                    Bus.$emit('saveScene');
                }, 100);
            } else if (from === 'plan') {
                setTimeout(() => {
                    Bus.$emit('saveScenePlan', nodes, edges, id_apis, node_config, open_scene, id, 'plan', null, scene_env_id);
                }, 100);
            } else if (from === 'auto_plan') {
                setTimeout(() => {
                    Bus.$emit('saveSceneAutoPlan');
                }, 100);
            } else if (from === 'case') {
                setTimeout(() => {
                    Bus.$emit('saveCase');
                }, 100);
            }
        }

        if (from === 'case') {
            Bus.$emit('updateCaseNodeConfig', type, value, id, callback);
        } else {
            Bus.$emit('updateNodeConfig', type, value, id, node_config, from, callback);
        }
    }

    const [selectBox, setSelectBox] = useState(false);

    const box = document.querySelector('.box');
    const svgMouse = document.querySelector('.svgMouse');

    useEffect(() => {
        const boxMouseOver = () => {
            svgMouse.style.display = 'none';
        }

        document.addEventListener('click', (e) => clickOutSide(e));
        box && box.addEventListener('onmouseover', boxMouseOver);


        return () => {
            document.removeEventListener('click', (e) => clickOutSide(e));
            box.removeEventListener('onmouseover', boxMouseOver);
        }
    }, []);

    const clickOutSide = (e) => {

        let _box = document.querySelector('.selectBox');
        let _drawer = document.querySelector('.api-config-drawer');


        if (_box && !_box.contains(e.target) && _drawer && !_drawer.contains(e.target) && ![...e.target.classList].includes('drawer-save-btn') && ![...e.target.classList].includes('drawer-close-btn')) {

            setSelectBox(false);
        }
    }

    useEffect(() => {

        if (select_box === id && !selectBox) {

            setSelectBox(true);
        } else if (select_box !== id) {

            setSelectBox(false);
        }
    }, [select_box]);


    return (
        <div
            className={cn('box', {
                selectBox: selectBox
            })}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectBox(true);

                if (from === 'scene') {
                    dispatch({
                        type: 'scene/updateSelectBox',
                        payload: id,
                    })
                } else if (from === 'plan') {
                    dispatch({
                        type: 'plan/updateSelectBox',
                        payload: id,
                    })
                } else if (from === 'auto_plan') {
                    dispatch({
                        type: 'auto_plan/updateSelectBox',
                        payload: id,
                    })
                } else if (from === 'case') {
                    dispatch({
                        type: 'case/updateSelectBox',
                        payload: id,
                    })
                }

                const api_now = cloneDeep(id_apis[id]);
                api_now.id = id;

                if (from === 'scene') {
                    dispatch({
                        type: 'scene/updateApiNow',
                        payload: api_now,
                    })
                    dispatch({
                        type: 'scene/updateIdNow',
                        payload: id,
                    })
                } else if (from === 'plan') {
                    dispatch({
                        type: 'plan/updateApiNow',
                        payload: api_now,
                    })
                    dispatch({
                        type: 'plan/updateIdNow',
                        payload: id,
                    })
                } else if (from === 'auto_plan') {
                    dispatch({
                        type: 'auto_plan/updateApiNow',
                        payload: api_now,
                    })
                    dispatch({
                        type: 'auto_plan/updateIdNow',
                        payload: id,
                    })
                } else if (from === 'case') {
                    dispatch({
                        type: 'case/updateApiNow',
                        payload: api_now,
                    })
                    dispatch({
                        type: 'case/updateIdNow',
                        payload: id,
                    })
                }
            }}
        >
            <Handle
                type="target"
                position="top"
                id="a"
                className="my_handle"
            />

            {
                (from === 'scene' || from === 'plan') ? <div className='collapse'>
                    <Header />
                    {!isHide && <div className='collapse-body'>
                        <div className='api-weight'>
                            <span>{t('scene.weight')}</span>
                            <Input size="mini" value={weight} onChange={(e) => {
                                if (parseInt(e) <= 100 && parseInt(e) >= 1) {
                                    setWeight(parseInt(e));
                                    onTargetChange('weight', parseInt(e));
                                } else {
                                    Message('error', t('message.apiWeight'));
                                    setWeight(parseInt(e) > 100 ? 100 : 1);
                                    onTargetChange('weight', parseInt(e) > 100 ? 100 : 1);
                                }
                            }} placeholder={t('scene.value')} />
                        </div>
                        <Select
                            formatRender={(value, childList, text) => (
                                <>
                                    <SvgMode className="svg-mode" style={{ fill: 'none' }} />
                                    <span style={{ paddingLeft: '10px' }}>{text}</span>
                                </>
                            )}
                            value={mode}
                            onChange={(e) => {
                                setMode(parseInt(e));
                                onTargetChange('mode', parseInt(e));

                                setPercent(90);
                            }}
                        >
                            <Option value={1}>{t('scene.modeList.1')}</Option>
                            <Option value={3}>{t('scene.modeList.3')}</Option>
                            {/* <Option value="3">每秒事务数模式</Option> */}
                            <Option value={4}>{t('scene.modeList.4')}</Option>
                            <Option value={5}>{t('scene.modeList.5')}</Option>
                        </Select>
                        {/* {<RenderContent />} */}
                        {/* todo: 高阶组件input onchange导致失焦 */}
                        {
                            mode === 3 && <div className='common-flex'>
                                <span>{t('scene.errorValue')}</span>
                                <Input size="mini" value={error_threshold} onChange={(e) => {
                                    setError(e);
                                }} onBlur={(e) => {
                                    const { value } = e.target;
                                    if (value.length === 0) {
                                        setError(0);
                                        onTargetChange('error_threshold', 0);
                                    } else if (parseFloat(value) > 1) {
                                        setError(1);
                                        onTargetChange('error_threshold', 1);
                                    } else {
                                        setError(parseFloat(value));
                                        onTargetChange('error_threshold', parseFloat(value));
                                    }
                                }} placeholder={t('scene.errorRate')} />
                            </div>
                        }
                        {
                            mode === 4 && <div className='time-mode'>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    {/* <span>{t('scene.line')}: </span> */}
                                    <Select
                                        className='config-line'
                                        data-module="select-diy-example"
                                        dropdownRender={(menu) => (
                                            <>
                                                <div className="menulist">{menu}</div>
                                                <div className="diybox">
                                                    <input size="mini" placeholder={t('placeholder.line')} ref={refInput} className="input" />
                                                    <Button
                                                        size="mini"
                                                        type="primary"
                                                        className="add"
                                                        onClick={() => {
                                                            if (!refInput?.current?.value) {
                                                                return;
                                                            }
                                                            if (refInput.current.value < 50 || refInput.current.value > 99) {
                                                                Message('error', t('message.lineError'));
                                                                return;
                                                            }
                                                            setMenuList([...menuList, refInput?.current?.value]);
                                                            if (refInput?.current) {
                                                                refInput.current.value = '';
                                                            }
                                                        }}
                                                    >
                                                        {t('btn.add')}
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                        onChange={(e) => {
                                            setPercent(parseInt(e));
                                            onTargetChange('percent_age', parseInt(e));
                                        }}
                                        value={percent_age}

                                    >
                                        {menuList.map((d, index) => (
                                            <Option key={index} value={d}>
                                                {d === 101 ? `101(${t('scene.avgTime')})` : d}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className='common-flex'>
                                    <span>{t('scene.resTime')}</span>
                                    <Input size="mini" value={response_threshold} onChange={(e) => {
                                        setRes(e);
                                    }} onBlur={(e) => {
                                        const { value } = e.target;
                                        // 0-10w之间的值
                                        if (value.trim().length === 0) {
                                            setRes(0);
                                            onTargetChange('response_threshold', 0);
                                        } else if (parseInt(value) >= 0 && parseInt(value) <= 100000) {
                                            setRes(parseInt(value));
                                            onTargetChange('response_threshold', parseInt(value));
                                        } else if (parseInt(value) < 0) {
                                            setRes(0);
                                            onTargetChange('response_threshold', 0);
                                        } else if (parseInt(value) > 100000) {
                                            setRes(100000);
                                            onTargetChange('response_threshold', 100000);
                                        } else {
                                            setRes(0);
                                            onTargetChange('response_threshold', 0);
                                        }
                                    }} placeholder={t('scene.thresholdTime')} />
                                </div>
                                {/* <div className='common-flex'>
                            <span>请求数阈值</span>
                            <Input size="mini" value={request_threshold} onChange={(e) => {
                                setReq(parseInt(e));
                                onTargetChange('request_threshold', parseInt(e));
                            }} placeholder="阈值" />
                        </div> */}
                            </div>
                        }
                        {
                            mode === 5 && <div className='common-flex'>
                                <span>{t('scene.reqValue')}</span>
                                <Input size="mini" value={request_threshold} placeholder={t('scene.threshold')} onChange={(e) => {
                                    setReq(e);
                                }} onBlur={(e) => {
                                    const { value } = e.target;
                                    if (value.trim().length === 0) {
                                        setReq(0);
                                        onTargetChange('request_threshold', 0);
                                    } else {
                                        setReq(parseInt(value));
                                        onTargetChange('request_threshold', parseInt(value));
                                    }
                                }} />
                            </div>
                        }
                    </div>}
                    {
                        (status === 'success' || status === 'failed') &&
                        <div className='show-result'>
                            <Button onClick={() => changeApiConfig(id)}>{t('btn.seeResult')}</Button>
                        </div>
                    }
                </div> :
                    <div className='auto-plan-box'>
                        <Header />
                        {
                            !isHide && <>
                                <div className='box-container'>
                                    <p className='label'>{t('scene.apiAssert')}</p>
                                    <div className='assert-num'>
                                        <p className='num'>{id_apis[id] ? (id_apis[id].request.assert ? id_apis[id].request.assert.length : 0) : 0}</p>
                                        <Button onClick={() => changeApiConfig(id, true)}>
                                            <SvgRight />
                                        </Button>
                                    </div>
                                </div>
                                {
                                    (status === 'success' || status === 'failed') &&
                                    <div className='show-result'>
                                        <Button onClick={() => changeApiConfig(id)}>{t('btn.seeResult')}</Button>
                                    </div>
                                }</>
                        }
                    </div>
            }

            <Handle
                type="source"
                position="bottom"
                id="b"
                className="my_handle"
            />
        </div>
    )
};

export default React.memo(Box);