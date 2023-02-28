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
    Input,
    Select,
    Dropdown,
    Message,
    Tooltip
} from 'adesign-react';
import { useDispatch, useSelector } from 'react-redux';
import { Handle, MarkerType } from 'react-flow-renderer';
import { cloneDeep } from 'lodash';
import Bus from '@utils/eventBus';
import SvgSuccess from '@assets/logo/success';
import SvgFailed from '@assets/logo/failed';
import SvgRunning from '@assets/logo/running';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';


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
    // const {
    //     nodes: nodes_scene,
    //     id_apis: id_apis_scene,
    //     node_config: node_config_scene,
    //     open_scene: open_scene_scene,
    //     run_res: run_res_scene,

    //     edges: edges_scene,
    //     init_scene: init_scene_scene,
    //     to_loading: to_loading_scene,
    //     success_edge: success_edge_scene,
    //     failed_edge: failed_edge_scene,
    //     running_scene: running_scene_scene,
    // } = useSelector((store) => store.scene);

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


    const nodes = from === 'scene' ? nodes_scene : nodes_plan;
    const id_apis = useSelector((store) => store.case.id_apis);
    const node_config = useSelector((store) => store.case.node_config);
    const open_scene = useSelector((store) => store.case.open_case);
    const run_res = useSelector((store) => store.case.run_res);

    const edges = useSelector((store) => store.case.edges);
    const init_scene = useSelector((store) => store.case.init_scene);
    const to_loading = useSelector((store) => store.case.to_loading);
    const success_edge = useSelector((store) => store.case.success_edge);
    const failed_edge = useSelector((store) => store.case.failed_edge);

    const running_scene = useSelector((store) => store.case.running_scene);

    const select_box = useSelector((store) => store.case.select_box);

    const theme = useSelector((store) => store.user.theme);
    const [showApi, setShowApi] = useState(true);
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
            const { weight, error_threshold, response_threshold, request_threshold, percent_age, mode } = my_config;
            weight && setWeight(weight);
            error_threshold && setError(error_threshold);
            response_threshold && setRes(response_threshold);
            request_threshold && setReq(request_threshold);
            percent_age && setPercent(percent_age);
            mode && setMode(mode);
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
            if (to_loading && running_scene === open_scene.scene_id) {
                setStatus('running');
            }
        }
    }, [to_loading])

    const DropContent = () => {
        return (
            <div className='drop-content'>
                <p onClick={() => {
                    changeApiConfig(id);
                    refDropdown.current.setPopupVisible(false);
                }}>{t('scene.editApi')}</p>
                <p onClick={() => {
                    Bus.$emit('cloneCaseNode', id);
                    refDropdown.current.setPopupVisible(false);
                }}>{t('scene.copyApi')}</p>
                <p onClick={() => {
                    dispatch({
                        type: 'case/updateDeleteNode',
                        payload: id,
                    });
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
        let temp = false;
        if (status === 'success') {

            edges.forEach(item => {
                if (item.source === id && !success_edge.includes(item.id)) {
                    success_edge.push(item.id);
                    temp = true;
                }
            })
            if (success_edge.length > 0 && temp) {
                dispatch({
                    type: 'case/updateSuccessEdge',
                    payload: success_edge,
                })
            }

        } else if (status === 'failed') {
            edges.forEach(item => {
                if (item.source === id && !failed_edge.includes(item.id)) {
                    failed_edge.push(item.id);
                    temp = true;
                }
            })

            if (failed_edge.length > 0 && temp) {
                dispatch({
                    type: 'case/updateFailedEdge',
                    payload: failed_edge,
                })
            }
        }
    }


    const Header = () => {
        return (
            <div className={cn('box-item', { 'white-run-color': theme === 'white' ? status === 'success' || status === 'failed' : false })} style={{ backgroundColor: topBgStyle[status] }}>
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
                    <p className='drop-down' onClick={(e) => setShowApi(!showApi)}>
                        {showApi ? <SvgDown /> : <SvgRight />}
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
                            setSelectBox(true);
                            setTimeout(() => {
                                refDropdown.current.setPopupVisible(true);
                            }, 100);
                        }} /></div>
                    </Dropdown>
                </div>
            </div>
        )
    };

    // 错误率模式
    const ErrMode = () => {
        return (
            <div className='common-flex'>
                <span>错误率阈值</span>
                <Input size="mini" value={error_threshold} onChange={(e) => {
                    setError(parseInt(e));
                    onTargetChange('error_threshold', parseInt(e));
                }} placeholder="示例: 0-1之间, 如0.001" />
            </div>
        )
    };

    // 响应时间模式
    const ResTimeMode = () => {
        return (
            <div className='time-mode'>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <span>线: </span>
                    <Select
                        className='config-line'
                        data-module="select-diy-example"
                        dropdownRender={(menu) => (
                            <>
                                <div className="menulist">{menu}</div>
                                <div className="diybox">
                                    <input size="mini" placeholder='大于等于50, 小于100' ref={refInput} className="input" />
                                    <Button
                                        size="mini"
                                        type="primary"
                                        className="add"
                                        onClick={() => {
                                            if (!refInput?.current?.value) {
                                                return;
                                            }
                                            if (refInput.current.value < 50 || refInput.current.value > 99) {
                                                Message('error', '输入数字只能大于等于50, 小于100');
                                                return;
                                            }
                                            setMenuList([...menuList, refInput?.current?.value]);
                                            if (refInput?.current) {
                                                refInput.current.value = '';
                                            }
                                        }}
                                    >
                                        添加
                                    </Button>
                                </div>
                            </>
                        )}
                        onChange={(e) => {
                            setPercent(parseInt(e));
                            onTargetChange('percent_age', parseInt(e));
                        }}
                        defaultValue={percent_age}

                    >
                        {menuList.map((d, index) => (
                            <Option key={index} value={d}>
                                {d}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div className='common-flex'>
                    <span>响应时间阈值</span>
                    <Input size="mini" value={response_threshold} onChange={(e) => {
                        setRes(parseInt(e));
                        onTargetChange('response_threshold', parseInt(e));
                    }} placeholder="阈值" />
                </div>
                {/* <div className='common-flex'>
                    <span>请求数阈值</span>
                    <Input size="mini" value={request_threshold} onChange={(e) => {
                        setReq(parseInt(e));
                        onTargetChange('request_threshold', parseInt(e));
                    }} placeholder="阈值" />
                </div> */}
            </div>
        )
    }

    // 每秒请求数模式
    const ReqCountMode = () => {
        return (
            <div className='common-flex'>
                <span>请求数阈值</span>
                <Input size="mini" placeholder="阈值" />
            </div>
        )
    };

    const RenderContent = () => {
        const obj = {
            '1': <></>,
            '3': <ErrMode />,
            '2': <></>,
            '4': <ResTimeMode />,
            '5': <ReqCountMode />
        };

        return obj[mode];
    };

    const changeApiConfig = (id) => {
        // e.preventDefault();
        // e.stopPropagation();
        const api_now = cloneDeep(id_apis[id]);
        api_now.id = id;

        dispatch({
            type: 'case/updateApiNow',
            payload: api_now,
        })
        dispatch({
            type: 'case/updateApiConfig',
            payload: true
        })
        dispatch({
            type: 'case/updateIdNow',
            payload: id,
        })
    };

    const onTargetChange = (type, value) => {
        Bus.$emit('updateNodeConfig', type, value, id, node_config, from);
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

        if (select_box === id && selectBox === false) {

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
                dispatch({
                    type: 'case/updateSelectBox',
                    payload: id,
                })

                const api_now = cloneDeep(id_apis[id]);
                api_now.id = id;

                dispatch({
                    type: 'case/updateApiNow',
                    payload: api_now,
                })
                dispatch({
                    type: 'case/updateIdNow',
                    payload: id,
                })
            }}
        >
            <Handle
                type="target"
                position="top"
                id="a"
                className="my_handle"
            />

            <div className='collapse'>
                <Header />
                {showApi && <div className='collapse-body'>
                    <div className='api-weight'>
                        <span>{t('scene.weight')}</span>
                        <Input size="mini" value={weight} onChange={(e) => {
                            if (parseInt(e) > 100 || parseInt(e) < 0) {
                                Message('error', t('message.apiWeight'));
                                setWeight(parseInt(e) > 100 ? '100' : '0');
                                onTargetChange('weight', parseInt(e) > 100 ? 100 : 0);
                                // setWeight();
                                // onTargetChange('weight', parseInt(e));
                            } else {
                                setWeight(parseInt(e));
                                onTargetChange('weight', parseInt(e));
                            }
                        }} placeholder={t('scene.value')} />
                    </div>
                    <Select
                        formatRender={(value, childList, text) => (
                            <>
                                <SvgApi />
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
                                setError(parseFloat(e));
                                onTargetChange('error_threshold', parseFloat(e));
                            }} placeholder={t('scene.errorRate')} />
                        </div>
                    }
                    {
                        mode === 4 && <div className='time-mode'>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                <span>{t('scene.line')}: </span>
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
                                    setRes(parseInt(e));
                                    onTargetChange('response_threshold', parseInt(e));
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
                                setReq(parseInt(e));
                                onTargetChange('request_threshold', parseInt(e));
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
            </div>

            {/* <Collapse defaultActiveKey="api" onChange={() => setShowApi(!showApi)}>
                <CollapseItem name="api" header={<Header />}>
                    <div className='api-weight'>
                        <span>接口权重</span>
                        <Input size="mini" placeholder="数值" />
                    </div>
                    <Select
                        formatRender={(value, childList, text) => (
                            <>
                                <SvgApi />
                                <span style={{ paddingLeft: '10px' }}>{text}</span>
                            </>
                        )}
                        defaultValue="1"
                        onChange={(e) => setMode(e)}
                    >
                        <Option value="1">默认模式</Option>
                        <Option value="2">错误率模式</Option>
                        <Option value="3">每秒事务数模式</Option>
                        <Option value="4">响应时间模式</Option>
                        <Option value="5">每秒请求数模式</Option>
                    </Select>
                    {<RenderContent />}
                </CollapseItem>
            </Collapse> */}
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