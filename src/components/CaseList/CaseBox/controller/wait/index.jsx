import React, { useState, useEffect, useRef } from 'react';
import { Switch, InputNumber, Dropdown, Button } from 'adesign-react';
import { More as SvgMore } from 'adesign-react/icons';
import './index.less';
import { Handle, MarkerType } from 'react-flow-renderer';
import Bus from '@utils/eventBus';
import { useSelector, useDispatch } from 'react-redux';
import { cloneDeep } from 'lodash';

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

    const run_res = from === 'scene' ? run_res_scene : run_res_plan;
    const edges = from === 'scene' ? edges_scene : edges_plan;
    const node_config = from === 'scene' ? node_config_scene : node_config_plan;
    const init_scene = from === 'scene' ? init_scene_scene : init_scene_plan;
    const to_loading = from === 'scene' ? to_loading_scene : to_loading_plan;
    const success_edge = from === 'scene' ? success_edge_scene : success_edge_plan;
    const failed_edge = from === 'scene' ? failed_edge_scene : failed_edge_plan;
    const open_scene = from === 'scene' ? open_scene_scene : open_scene_plan;
    const running_scene = from === 'scene' ? running_scene_scene : running_scene_plan;
    const select_box = from === 'scene' ? select_box_scene : select_box_plan;
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
            if (to_loading && running_scene === open_scene.scene_id) {
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
        Bus.$emit('updateCaseNodeConfig', type, value, id);
    }

    const update = (edges, status) => {
        // const _open_scene = cloneDeep(open_scene);
        let temp = false;
        if (status === 'success') {
            // 以当前节点为顶点的线id
            // const successEdge = [];
            // const Node = [];

            edges.forEach(item => {
                if (item.source === id && !success_edge.includes(item.id)) {
                    temp = true;
                    success_edge.push(item.id);
                }
            })
            // _open_scene.edges.forEach(item => {
            //     if (item.source === id) {
            //         // success_edge.push(item.id);
            //         temp = true;
            //         item.style = {
            //             stroke: '#2BA58F',
            //         };
            //         item.markerEnd = {
            //             type: MarkerType.ArrowClosed,
            //         };
            //     }
            // })

            if (success_edge.length > 0 && temp) {
                if (from === 'scene') {
                    dispatch({
                        type: 'scene/updateSuccessEdge',
                        payload: success_edge,
                    })
                } else {
                    dispatch({
                        type: 'plan/updateSuccessEdge',
                        payload: success_edge,
                    })
                }
            }
            // if (from === 'scene' && temp) {
            //     // dispatch({
            //     //     type: 'scene/updateSuccessEdge',
            //     //     payload: success_edge,
            //     // })
            //     dispatch({
            //         type: 'scene/updateOpenScene',
            //         payload: _open_scene,
            //     })
            // } else if (from === 'plan' && temp) {
            //     // dispatch({
            //     //     type: 'plan/updateSuccessEdge',
            //     //     payload: success_edge,
            //     // })
            //     dispatch({
            //         type: 'plan/updateOpenScene',
            //         payload: _open_scene,
            //     })
            // }
        } else if (status === 'failed') {
            // const failedEdge = [];

            edges.forEach(item => {
                if (item.source === id && !failed_edge.includes(item.id)) {
                    failed_edge.push(item.id);
                    temp = true;
                }
            })
            // _open_scene.edges.forEach(item => {
            //     if (item.source === id) {
            //         temp = true;
            //         item.style = {
            //             stroke: 'var(--delete-red)',
            //         };
            //         item.markerEnd = {
            //             type: MarkerType.ArrowClosed,
            //         };
            //         // failed_edge.push(item.id);
            //     }
            // })

            // if (from === 'scene' && temp) {
            //     // dispatch({
            //     //     type: 'scene/updateSuccessEdge',
            //     //     payload: success_edge,
            //     // })
            //     dispatch({
            //         type: 'scene/updateOpenScene',
            //         payload: _open_scene,
            //     })
            // } else if (from === 'plan' && temp) {
            //     // dispatch({
            //     //     type: 'plan/updateSuccessEdge',
            //     //     payload: success_edge,
            //     // })
            //     dispatch({
            //         type: 'plan/updateOpenScene',
            //         payload: _open_scene,
            //     })
            // }

            if (failed_edge.length > 0 && temp) {
                if (from === 'scene') {
                    dispatch({
                        type: 'scene/updateFailedEdge',
                        payload: failed_edge,
                    })
                } else {
                    dispatch({
                        type: 'plan/updateFailedEdge',
                        payload: failed_edge,
                    })
                }
            }
        }
    }


    const DropContent = () => {
        return (
            <div className='drop-content'>
                <p onClick={() => {
                    // if (from === 'scene') {
                    //     dispatch({
                    //         type: 'scene/updateDeleteNode',
                    //         payload: id,
                    //     });
                    // } else {
                    //     dispatch({
                    //         type: 'plan/updateDeleteNode',
                    //         payload: id,
                    //     });
                    // }
                    // refDropdown.current.setPopupVisible(false);
                    // const _open_scene = cloneDeep(open_scene);
                    // const index = _open_scene.nodes.findIndex(item => item.id === id);
                    // _open_scene.nodes.splice(index, 1);
                    // const edges_index = [];
                    // _open_scene.edges.forEach((item, index) => {
                    //     if (item.source !== id && item.target !== id) {
                    //         edges_index.push(index);
                    //     }
                    // });
                    // _open_scene.edges = _open_scene.edges.filter((item, index) => !edges_index.includes(index));
                    // _open_scene.edges = edges;

                    if (from === 'scene') {
                        dispatch({
                            type: 'scene/updateDeleteNode',
                            payload: id,
                        });
                        // dispatch({
                        //     type: 'scene/updateOpenScene',
                        //     payload: _open_scene,
                        // })
                    } else {
                        dispatch({
                            type: 'plan/updateDeleteNode',
                            payload: id,
                        });
                        // dispatch({
                        //     type: 'plan/updateOpenScene',
                        //     payload: _open_scene,
                        // })
                    }
                }}>删除控制器</p>
            </div>
        )
    };


    // const topBgStyle = {
    //     'default': '',
    //     'success': '#11811C',
    //     'failed': '#892020',
    //     'running': '',
    // }

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
        console.log(select_box, id, selectBox);
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
            } else {
                dispatch({
                    type: 'plan/updateSelectBox',
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
                            dispatch({
                                type: 'case/updateDeleteNode',
                                payload: id,
                            });
                        }} />
                    </div>
                </div>
                <div className='controller-wait-main'>
                    <div className='item'>
                        <InputNumber value={wait_ms} onChange={(e) => {
                            onTargetChange('wait_ms', parseInt(e));
                            setWait(e);
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