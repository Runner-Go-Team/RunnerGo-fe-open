import React, { useState, useEffect, useRef } from 'react';
import { Switch, Input, Dropdown, Button, Select } from 'adesign-react';
import { More as SvgMore } from 'adesign-react/icons';
import './index.less';
import { Handle, MarkerType } from 'react-flow-renderer';
// import { COMPARE_IF_TYPE } from '@constants/compare';
import { useSelector, useDispatch } from 'react-redux';
import Bus from '@utils/eventBus';

import SvgSuccess from '@assets/logo/success';
import SvgFailed from '@assets/logo/failed';
import SvgRunning from '@assets/logo/running';
import { cloneDeep } from 'lodash';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import SvgClose from '@assets/logo/close';

const { Option } = Select;

const ConditionController = (props) => {
    const { data: { id, from } } = props;
    const refDropdown = useRef(null);
    const { t } = useTranslation();

    const COMPARE_IF_TYPE = [
        { type: 'eq', title: t('apis.compareSelect.eq') },
        { type: 'uneq', title: t('apis.compareSelect.uneq') },
        { type: 'gt', title: t('apis.compareSelect.gt') },
        { type: 'gte', title: t('apis.compareSelect.gte') },
        { type: 'lt', title: t('apis.compareSelect.lt') },
        { type: 'lte', title: t('apis.compareSelect.lte') },
        { type: 'includes', title: t('apis.compareSelect.includes') },
        { type: 'unincludes', title: t('apis.compareSelect.unincludes') },
        { type: 'null', title: t('apis.compareSelect.null') },
        { type: 'notnull', title: t('apis.compareSelect.notnull') },
    ];
    // const dispatch = useDispatch();
    // const node_config = useSelector((store) => store.scene.node_config);

    const run_res_scene = useSelector((store) => store.scene.run_res);
    const node_config_scene = useSelector((store) => store.scene.node_config);
    const edges_scene = useSelector((store) => store.scene.edges);
    const init_scene_scene = useSelector((store) => store.scene.init_scene);
    const success_edge_scene = useSelector((store) => store.scene.success_edge);
    const failed_edge_scene = useSelector((store) => store.scene.failed_edge);
    const to_loading_scene = useSelector((store) => store.scene.to_loading);
    const open_scene_scene = useSelector((store) => store.scene.open_scene);
    const running_scene_scene = useSelector((store) => store.scene.running_scene);
    const select_box_scene = useSelector((store) => store.scene.select_box);

    const run_res_plan = useSelector((store) => store.plan.run_res);
    const edges_plan = useSelector((store) => store.plan.edges);
    const node_config_plan = useSelector((store) => store.plan.node_config);
    const init_scene_plan = useSelector((store) => store.plan.init_scene);
    const success_edge_plan = useSelector((store) => store.plan.success_edge);
    const failed_edge_plan = useSelector((store) => store.plan.failed_edge);
    const to_loading_plan = useSelector((store) => store.plan.to_loading);
    const open_scene_plan = useSelector((store) => store.plan.open_plan_scene);
    const running_scene_plan = useSelector((store) => store.plan.running_scene);
    const select_box_plan = useSelector((store) => store.plan.select_box);

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


    const run_res_case = useSelector((store) => store.case.run_res);
    const edges_case = useSelector((store) => store.case.edges);
    const node_config_case = useSelector((store) => store.case.node_config);
    const init_scene_case = useSelector((store) => store.case.init_scene);
    const success_edge_case = useSelector((store) => store.case.success_edge);
    const failed_edge_case = useSelector((store) => store.case.failed_edge);
    const to_loading_case = useSelector((store) => store.case.to_loading);
    const open_scene_case = useSelector((store) => store.case.open_case);
    const running_scene_case = useSelector((store) => store.case.running_scene);
    const select_box_case = useSelector((store) => store.case.select_box);

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

    const to_loading_list = {
        'scene': to_loading_scene,
        'plan': to_loading_plan,
        'auto_plan': to_loading_auto_plan,
        'case': to_loading_case
    }
    const to_loading = to_loading_list[from];

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
    const dispatch = useDispatch();
    // ??????
    const [_var, setVar] = useState('');
    // ??????
    const [compare, setCompare] = useState('');
    // ?????????
    const [val, setVal] = useState('');
    // ??????
    const [remark, setRemark] = useState('');

    const [status, setStatus] = useState('default');

    useEffect(() => {
        const my_config = node_config[id];
        if (my_config) {
            const { var: _var, compare, val, remark } = my_config;
            _var && setVar(_var);
            compare && setCompare(compare);
            val && setVal(val);
            remark && setRemark(remark);
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

    useEffect(() => {
        if (status === 'success' || status === 'failed') {
            update();
        }
    }, [open_scene]);

    const update = (edges, status) => {
        // const _open_scene = cloneDeep(open_scene);
        let temp = false;
        if (status === 'success') {
            // ??????????????????????????????id
            // const successEdge = [];
            // const Node = [];

            edges.forEach(item => {
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
            // const failed_edge = [];

            edges.forEach(item => {
                if (item.source === id) {
                    temp = true;

                    failed_edge.push(item.id);
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
                }}>???????????????</p>
            </div>
        )
    };

    const onTargetChange = (type, value) => {

        Bus.$emit('updateNodeConfig', type, value, id, node_config, from);

        if (from === 'scene') {
            dispatch({
                type: 'scene/updateIsChanged',
                payload: true
            })
        } else if (from === 'plan') {
            dispatch({
                type: 'plan/updateIsChanged',
                payload: true
            })
        } else if (from === 'auto_plan') {
            dispatch({
                type: 'auto_plan/updateIsChanged',
                payload: true
            })
        } else if (from === 'case') {
            dispatch({
                type: 'case/updateIsChanged',
                payload: true
            })
        }
    }

    const topBgStyle = {
        'default': '',
        'success': 'var(--run-green)',
        'failed': 'var(--run-red)',
        'running': '',
    };

    const topStatus = {
        'default': <></>,
        'success': <SvgSuccess className='default' />,
        'failed': <SvgFailed className='default' />,
        'running': <SvgRunning className='default' />,
    };

    const [selectBox, setSelectBox] = useState(false);

    const condition = document.querySelector('.controller-condition');
    const svgMouse = document.querySelector('.svgMouse');

    useEffect(() => {
        const boxMouseOver = () => {
            svgMouse.style.display = 'none';
        }

        document.addEventListener('click', (e) => clickOutSide(e))
        condition && condition.addEventListener('onmouseover', boxMouseOver);

        return () => {
            document.removeEventListener('click', (e) => clickOutSide(e));
            condition.removeEventListener('onmouseover', boxMouseOver);
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
            <div className="controller-condition"
            >

                <div className={cn('controller-condition-header', { 'white-run-color': status === 'success' || status === 'failed' })} style={{ backgroundColor: topBgStyle[status] }} >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className='type'>
                            {t('scene.condition')}
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
                        <SvgClose onClick={() => {
                            if (from === 'scene') {
                                dispatch({
                                    type: 'scene/updateDeleteNode',
                                    payload: id,
                                });
                                dispatch({
                                    type: 'scene/updateIsChanged',
                                    payload: true
                                })
                            } else if (from === 'plan') {
                                dispatch({
                                    type: 'plan/updateDeleteNode',
                                    payload: id,
                                });
                                dispatch({
                                    type: 'plan/updateIsChanged',
                                    payload: true
                                })
                            } else if (from === 'auto_plan') {
                                dispatch({
                                    type: 'auto_plan/updateDeleteNode',
                                    payload: id,
                                });
                                dispatch({
                                    type: 'auto_plan/updateIsChanged',
                                    payload: true
                                })
                            } else if (from === 'case') {
                                dispatch({
                                    type: 'case/updateDeleteNode',
                                    payload: id,
                                });
                                dispatch({
                                    type: 'case/updateIsChanged',
                                    payload: true
                                })
                            }

                        }} />
                    </div>
                </div>
                <div className='controller-condition-main'>
                    <div className='item'>
                        <p>if</p>
                        <Input value={_var} size="mini" placeholder={t('placeholder.varName')} onChange={(e) => {
                            onTargetChange('var', e);
                            setVar(e);
                        }} />
                    </div>
                    <div className='item'>
                        <Select
                            value={compare}
                            placeholder={t('placeholder.plsSelect')}
                            onChange={(e) => {
                                onTargetChange('compare', e);
                                setCompare(e);
                            }}
                        >
                            {
                                COMPARE_IF_TYPE.map(item => (
                                    <Option value={item.type}>{item.title}</Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className='item'>
                        <Input size="mini" disabled={compare === 'null' || compare === 'notnull'} value={val} onChange={(e) => {
                            setVal(e);
                            onTargetChange('val', e);
                        }} placeholder={t('placeholder.varVal')} />
                    </div>
                    <div className='item'>
                        <Input size="mini" value={remark} onChange={(e) => {
                            setRemark(e);
                            onTargetChange('remark', e);
                        }} placeholder={t('placeholder.remark')} />
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

export default ConditionController;