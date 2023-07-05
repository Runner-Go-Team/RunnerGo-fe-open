import React, { useState, useEffect, useRef } from 'react';
import { Switch, Dropdown, InputNumber, Button } from 'adesign-react';
import { More as SvgMore } from 'adesign-react/icons';
import './index.less';
import { Handle, MarkerType } from 'react-flow-renderer';
import Bus from '@utils/eventBus';
import { useSelector, useDispatch } from 'react-redux';
import { cloneDeep, isBoolean } from 'lodash';

import SvgSuccess from '@assets/logo/success';
import SvgFailed from '@assets/logo/failed';
import SvgRunning from '@assets/logo/running';
import { useTranslation } from 'react-i18next';
import SvgClose from '@assets/logo/close';

import cn from 'classnames';

const WaitController = (props) => {
    const { data: { id, from } } = props;
    const [wait_ms, setWait] = useState(0);
    const refDropdown = useRef(null);
    const run_res_scene = useSelector((store) => store.scene.run_res);
    const node_config_scene = useSelector((store) => store.scene.node_config);
    const edges_scene = useSelector((store) => store.scene.edges);
    const init_scene_scene = useSelector((store) => store.scene.init_scene);
    const to_loading_scene = useSelector((store) => store.scene.to_loading);
    const success_edge_scene = useSelector((store) => store.scene.success_edge);
    const failed_edge_scene = useSelector((store) => store.scene.failed_edge);
    const open_scene_scene = useSelector((store) => store.scene.open_scene);
    const running_scene_scene = useSelector((store) => store.scene.running_scene);
    const select_box_scene = useSelector((store) => store.scene.select_box);
    const nodes_scene = useSelector((store) => store.scene.nodes);
    const id_apis_scene = useSelector((store) => store.scene.id_apis);

    const run_res_plan = useSelector((store) => store.plan.run_res);
    const edges_plan = useSelector((store) => store.plan.edges);
    const node_config_plan = useSelector((store) => store.plan.node_config);
    const init_scene_plan = useSelector((store) => store.plan.init_scene);
    const to_loading_plan = useSelector((store) => store.plan.to_loading);
    const success_edge_plan = useSelector((store) => store.plan.success_edge);
    const failed_edge_plan = useSelector((store) => store.plan.failed_edge);
    const open_scene_plan = useSelector((store) => store.plan.open_plan_scene);
    const running_scene_plan = useSelector((store) => store.plan.running_scene);
    const select_box_plan = useSelector((store) => store.plan.select_box);
    const nodes_plan = useSelector((store) => store.plan.nodes);
    const id_apis_plan = useSelector((store) => store.plan.id_apis);

    const run_res_auto_plan = useSelector((store) => store.auto_plan.run_res);
    const edges_auto_plan = useSelector((store) => store.auto_plan.edges);
    const node_config_auto_plan = useSelector((store) => store.auto_plan.node_config);
    const init_scene_auto_plan = useSelector((store) => store.auto_plan.init_scene);
    const success_edge_auto_plan = useSelector((store) => store.auto_plan.success_edge);
    const failed_edge_auto_plan = useSelector((store) => store.auto_plan.failed_edge);
    const to_loading_auto_plan = useSelector((store) => store.auto_plan.to_loading);
    const open_scene_auto_plan = useSelector((store) => store.auto_plan.open_plan_scene);
    const running_scene_auto_plan = useSelector((store) => store.auto_plan.running_scene);
    const select_box_auto_plan = useSelector((store) => store.auto_plan.select_box);
    const nodes_auto_plan = useSelector((store) => store.auto_plan.nodes);
    const id_apis_auto_plan = useSelector((store) => store.auto_plan.id_apis);

    const run_res_case = useSelector((store) => store.case.run_res);
    const edges_case = useSelector((store) => store.case.edges);
    const node_config_case = useSelector((store) => store.case.node_config);
    const init_scene_case = useSelector((store) => store.case.init_scene);
    const success_edge_case = useSelector((store) => store.case.success_edge);
    const failed_edge_case = useSelector((store) => store.case.failed_edge);
    const to_loading_case = useSelector((store) => store.case.to_loading);
    const open_scene_case = useSelector((store) => store.case.open_plan_scene);
    const running_scene_case = useSelector((store) => store.case.running_scene);
    const select_box_case = useSelector((store) => store.case.select_box);
    const nodes_case = useSelector((store) => store.case.nodes);
    const id_apis_case = useSelector((store) => store.case.id_apis);

    const scene_env_id = useSelector((store) => store.env.scene_env_id);

    const run_res_list = {
        'scene': run_res_scene,
        'plan': run_res_plan,
        'auto_plan': run_res_auto_plan,
        'case': run_res_case
    };
    const run_res = run_res_list[from];

    const edges_list = {
        'scene': edges_scene,
        'plan': edges_plan,
        'auto_plan': edges_auto_plan,
        'case': edges_case
    };
    const edges = edges_list[from];

    const node_config_list = {
        'scene': node_config_scene,
        'plan': node_config_plan,
        'auto_plan': node_config_auto_plan,
        'case': node_config_case
    }
    const node_config = node_config_list[from];

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

    const open_scene_list = {
        'scene': open_scene_scene,
        'plan': open_scene_plan,
        'auto_plan': open_scene_auto_plan,
        'case': open_scene_case
    }
    const open_scene = open_scene_list[from];


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

    const dispatch = useDispatch();

    const { t } = useTranslation();

    // 当前节点状态
    const [status, setStatus] = useState('default');
    const [topBg, setTopBg] = useState('');

    useEffect(() => {
        const my_config = node_config[id];

        if (my_config) {
            const { wait_ms } = my_config;

            wait_ms && setWait(wait_ms);
        }
    }, [node_config]);

    useEffect(() => {
        setStatus('default');
    }, [init_scene]);

    useEffect(() => {
        if (open_scene) {
            if (to_loading && running_scene === (open_scene.scene_id ? open_scene.scene_id : open_scene.target_id)) {
                setStatus('running');
            }
        }
    }, [to_loading])

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

    const onTargetChange = (type, value) => {
        Bus.$emit('updateNodeConfig', type, value, id, node_config, from);

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

    const update = (edges, status) => {
        // const _open_scene = cloneDeep(open_scene);
        let temp = false;
        if (status === 'success') {
            // 以当前节点为顶点的线id
            // const successEdge = [];
            // const Node = [];

            edges && edges.forEach(item => {
                if (item.source === id && !success_edge.includes(item.id)) {
                    temp = true;
                    success_edge.push(item.id);
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
                        payload: success_edge,
                    })
                } else if (from === 'auto_plan') {
                    dispatch({
                        type: 'auto_plan/updateSuccessEdge',
                        payload: success_edge,
                    })
                } else if (from === 'case') {
                    dispatch({
                        type: 'case/updateSuccessEdge',
                        payload: success_edge,
                    })
                }
            }
        } else if (status === 'failed') {
            // const failedEdge = [];

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

    const topBgStyle = {
        'default': '',
        'success': 'var(--run-green)',
        'failed': 'var(--run-red)',
        'running': '',
    }

    useEffect(() => {
        setTopBg(topBgStyle[status])
    }, [status]);

    const topStatus = {
        'default': <></>,
        'success': <SvgSuccess className='default' />,
        'failed': <SvgFailed className='default' />,
        'running': <SvgRunning className='default' />,
    };

    const [selectBox, setSelectBox] = useState(false);
    const wait = document.querySelector('.controller-wait');
    const svgMouse = document.querySelector('.svgMouse');

    useEffect(() => {
        const boxMouseOver = () => {
            svgMouse.style.display = 'none';
        }
        document.addEventListener('click', (e) => clickOutSide(e));
        wait && wait.addEventListener('onmouseover', boxMouseOver);


        return () => {
            document.removeEventListener('click', (e) => clickOutSide(e));
            wait.removeEventListener('onmouseover', boxMouseOver);
        }
    }, []);

    const clickOutSide = (e) => {
        let _box = document.querySelector('.selectBox');

        if (_box && !_box.contains(e.target)) {
            setSelectBox(false);
        }
    }

    useEffect(() => {
        if (select_box === id && selectBox === false) {

            setSelectBox(true);
        } else if (select_box !== id) {

            setSelectBox(false);
        }
    }, [select_box]);

    return (
        <div className={cn({
            selectBox: selectBox
        })} onClick={(e) => {
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

        }}>
            <Handle
                type="target"
                position="top"
                id="a"
                className="my_handle"
            />
            <div className="controller-wait"
            >
                <div className='controller-wait-header' style={{ backgroundColor: topBg }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className='type'>
                            {t('scene.wait')}
                        </div>
                        {
                            topStatus[status]
                        }
                    </div>
                    <div className='drag-content'></div>
                    <div className='header-right'>
                        {/* <Switch defaultChecked /> */}
                        {/* <SvgMore /> */}
                        {/* <Dropdown
                            ref={refDropdown}
                            content={
                                <div>
                                    <DropContent />
                                </div>
                            }
                        // style={{ zIndex: 1050 }}
                        >
                            <div><SvgMore className='more-svg' /></div>
                        </Dropdown> */}
                        <SvgClose className='close-icon' onClick={() => {
                            if (from === 'scene') {
                                dispatch({
                                    type: 'scene/updateDeleteNode',
                                    payload: id,
                                });
                            } else if (from === 'plan') {
                                dispatch({
                                    type: 'plan/updateDeleteNode',
                                    payload: id,
                                });
                            } else if (from === 'auto_plan') {
                                dispatch({
                                    type: 'auto_plan/updateDeleteNode',
                                    payload: id,
                                });
                            } else if (from === 'case') {
                                dispatch({
                                    type: 'case/updateDeleteNode',
                                    payload: id,
                                });
                            }
                        }} />
                    </div>
                </div>
                <div className='controller-wait-main'>
                    <div className='item'>
                        <InputNumber value={wait_ms} onChange={(e) => {
                            if (parseInt(e) > 20000) {
                                onTargetChange('wait_ms', 20000);
                                setWait(20000);
                            } else {
                                onTargetChange('wait_ms', parseInt(e));
                                setWait(e);
                            }
                        }} />
                        <p>ms</p>
                    </div>
                </div>
            </div>
            <Handle
                type="source"
                position="bottom"
                id="b"
                className="my_handle"
            />
        </div>
    )
};

export default WaitController;