import React, { useState, useEffect, useRef } from 'react';
import './index.less';
import { Drawer, Button, Input, Modal, Message } from 'adesign-react';
import {
    CaretRight as SvgCaretRight
} from 'adesign-react/icons';
// import { Close as SvgClose } from 'adesign-react/icons';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SceneBox from './sceneBox';
import ApiManage from '@pages/ApisWarper/modules/ApiManage';
import { getPathExpressionObj } from '@constants/pathExpression';
import FooterConfig from './footerConfig';
import Bus from '@utils/eventBus';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ApiPicker from './apiPicker';
import { useTranslation } from 'react-i18next';
import InputText from '@components/InputText';
import SvgStop from '../stop';


import SvgClose from '@assets/logo/close';
import { debounce } from 'lodash';

const SceneContainer = (props) => {
    const { from, onChange } = props;
    const { id } = useParams();
    const apiConfig_scene = useSelector((store) => store.scene.showApiConfig);
    const apiConfig_case = useSelector((store) => store.case.showApiConfig);
    const apiConfig = from == 'scene' ? apiConfig_scene : apiConfig_case;
    // const id_apis = useSelector((store) => store.scene.id_apis);
    const api_now_scene = useSelector((store) => store.scene.api_now);
    const api_now_case = useSelector((store) => store.case.api_now);
    const show_assert = useSelector((store) => store.case.show_assert);
    const api_now = from === 'scene' ? api_now_scene : api_now_case;
    const [showDrawer, setDrawer] = useState(false);
    const [showConfig, setConfig] = useState(true);
    const [showApiPicker, setApiPicker] = useState(false);
    const [apiName, setApiName] = useState(api_now ? api_now.name : '新建接口');
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const run_res_scene = useSelector((store) => store.scene.run_res);
    const run_res_plan = useSelector((store) => store.plan.run_res);
    const run_res_auto_plan = useSelector((store) => store.auto_plan.run_res);
    const run_res_case = useSelector((store) => store.case.run_res);

    const run_res_list = {
        'scene': run_res_scene,
        'plan': run_res_plan,
        'auto_plan': run_res_auto_plan,
        'case': run_res_case
    }
    const run_res = run_res_list[from];

    const open_res = useSelector((store) => store.opens.open_res);
    const open_scene_res = useSelector((store) => store.scene.run_api_res);
    const open_plan_res = useSelector((store) => store.plan.run_api_res);
    const open_auto_plan_res = useSelector((store) => store.auto_plan.run_api_res);
    const open_case_res = useSelector((store) => store.case.run_api_res);

    const open_api_now = useSelector((store) => store.opens.open_api_now);

    const id_now = useSelector((store) => store.scene.id_now);
    const id_plan_now = useSelector((store) => store.plan.id_now);
    const id_auto_plan_now = useSelector((store) => store.auto_plan.id_now);
    const id_case_now = useSelector((store) => store.case.id_now);

    const response_list = {
        'apis': open_res && open_res[open_api_now],
        'scene': open_scene_res && open_scene_res[id_now],
        'plan': open_plan_res && open_plan_res[id_plan_now],
        'auto_plan': open_auto_plan_res && open_auto_plan_res[id_auto_plan_now],
        'case': open_case_res && open_case_res[id_case_now]
    }

    const id_now_list = {
        'scene': id_now,
        'plan': id_plan_now,
        'auto_plan': id_auto_plan_now,
        'case': id_case_now
    };


    const scene_result = run_res && run_res.filter(item => item.event_id === (id_now_list[from]))[0];
    const response_data = response_list[from];

    const run_status_scene = useSelector((store) => store.scene.run_status);
    const run_status_case = useSelector((store) => store.case.run_status);
    const run_status_plan = useSelector((store) => store.plan.run_status);
    const run_status_auto_plan = useSelector((store) => store.auto_plan.run_status);

    const run_status_list = {
        'scene': run_status_scene,
        'plan': run_status_plan,
        'auto_plan': run_status_auto_plan,
        'case': run_status_case
    }
    const run_status = run_status_list[from];

    const open_scene_scene = useSelector((store) => store.scene.open_scene);
    const open_scene_case = useSelector((store) => store.case.open_case);
    const open_scene_plan = useSelector((store) => store.plan.open_plan_scene);
    const open_scene_auto_plan = useSelector((store) => store.auto_plan.open_plan_scene);

    const open_scene_list = {
        'scene': open_scene_scene,
        'plan': open_scene_plan,
        'auto_plan': open_scene_auto_plan,
        'case': open_scene_case
    }
    const open_scene = open_scene_list[from];

    const nodes_scene = useSelector((store) => store.scene.nodes);
    const nodes_case = useSelector((store) => store.case.nodes);
    const nodes_plan = useSelector((store) => store.plan.nodes);
    const nodes_auto_plan = useSelector((store) => store.auto_plan.nodes);

    const nodes_list = {
        'scene': nodes_scene,
        'plan': nodes_plan,
        'auto_plan': nodes_auto_plan,
        'case': nodes_case
    }
    const nodes = nodes_list[from];

    const edges_scene = useSelector((store) => store.scene.edges);
    const edges_case = useSelector((store) => store.case.edges);
    const edges_plan = useSelector((store) => store.plan.edges);
    const edges_auto_plan = useSelector((store) => store.auto_plan.edges);

    const edges_list = {
        'scene': edges_scene,
        'plan': edges_plan,
        'auto_plan': edges_auto_plan,
        'case': edges_case
    }
    const edges = edges_list[from];

    const id_apis_scene = useSelector((store) => store.scene.id_apis);
    const id_apis_case = useSelector((store) => store.case.id_apis);
    const id_apis_plan = useSelector((store) => store.plan.id_apis);
    const id_apis_auto_plan = useSelector((store) => store.auto_plan.id_apis);

    const id_apis_list = {
        'scene': id_apis_scene,
        'plan': id_apis_plan,
        'auto_plan': id_apis_auto_plan,
        'case': id_apis_case
    }
    const id_apis = id_apis_list[from];

    const node_config_scene = useSelector((store) => store.scene.node_config);
    const node_config_case = useSelector((store) => store.case.node_config);
    const node_config_plan = useSelector((store) => store.plan.node_config);
    const node_config_auto_plan = useSelector((store) => store.auto_plan.node_config);

    const node_config_list = {
        'scene': node_config_scene,
        'plan': node_config_plan,
        'auto_plan': node_config_auto_plan,
        'case': node_config_case
    }
    const node_config = node_config_list[from];

    useEffect(() => {
        setDrawer(apiConfig);
    }, [apiConfig]);

    useEffect(() => {
        setApiName(api_now.name)
    }, [api_now]);

    const runScene = () => {
        const { scene_id, target_id } = open_scene;
        if (!nodes || nodes.length === 0) {
            Message('error', t('message.emptyScene'));
            return;
        }
        if (from === 'scene') {
            dispatch({
                type: 'scene/updateRunStatus',
                payload: 'running',
            })
            dispatch({
                type: 'scene/updateRunningScene',
                payload: scene_id ? scene_id : target_id,
            })
            dispatch({
                type: 'scene/updateToLoading',
                payload: false,
            })
            // dispatch({
            //     type: 'scene/updateInitScene',
            //     payload: false,
            // });
            // dispatch({
            //     type: 'scene/updateInitScene',
            //     payload: true,
            // });
            dispatch({
                type: 'scene/updateRunRes',
                payload: [],
            })
            dispatch({
                type: 'scene/updateSuccessEdge',
                payload: [],
            });
            dispatch({
                type: 'scene/updateFailedEdge',
                payload: [],
            })
            setTimeout(() => {
                dispatch({
                    type: 'scene/updateToLoading',
                    payload: true,
                })
            }, 200)
        } else if (from === 'plan') {
            dispatch({
                type: 'plan/updateRunStatus',
                payload: 'running',
            })
            dispatch({
                type: 'plan/updateRunningScene',
                payload: scene_id ? scene_id : target_id,
            })
            dispatch({
                type: 'plan/updateToLoading',
                payload: false,
            })
            // dispatch({
            //     type: 'plan/updateInitScene',
            //     payload: true
            // })
            dispatch({
                type: 'plan/updateRunRes',
                payload: []
            })
            dispatch({
                type: 'plan/updateSuccessEdge',
                payload: [],
            });
            dispatch({
                type: 'plan/updateFailedEdge',
                payload: [],
            })
            setTimeout(() => {
                dispatch({
                    type: 'plan/updateToLoading',
                    payload: true,
                })
            }, 200);
        } else if (from === 'auto_plan') {
            dispatch({
                type: 'auto_plan/updateRunStatus',
                payload: 'running',
            })
            dispatch({
                type: 'auto_plan/updateRunningScene',
                payload: scene_id ? scene_id : target_id,
            })
            dispatch({
                type: 'auto_plan/updateToLoading',
                payload: false,
            })
            dispatch({
                type: 'auto_plan/updateRunRes',
                payload: []
            })
            dispatch({
                type: 'auto_plan/updateSuccessEdge',
                payload: [],
            });
            dispatch({
                type: 'auto_plan/updateFailedEdge',
                payload: [],
            })
            setTimeout(() => {
                dispatch({
                    type: 'auto_plan/updateToLoading',
                    payload: true,
                })
            }, 200);
        } else if (from === 'case') {
            dispatch({
                type: 'case/updateRunStatus',
                payload: 'running',
            })
            dispatch({
                type: 'case/updateRunningScene',
                payload: scene_id ? scene_id : target_id,
            })
            dispatch({
                type: 'case/updateToLoading',
                payload: false,
            })
            dispatch({
                type: 'case/updateRunRes',
                payload: []
            })
            dispatch({
                type: 'case/updateSuccessEdge',
                payload: [],
            });
            dispatch({
                type: 'case/updateFailedEdge',
                payload: [],
            })
            setTimeout(() => {
                dispatch({
                    type: 'case/updateToLoading',
                    payload: true,
                })
            }, 200);
        }

        // if (from === 'case') {
        //     Bus.$emit('runCase');
        // } else {
        //     Bus.$emit('runScene', scene_id ? scene_id : target_id, nodes.length, from);
        // }


        const _callback = () => {
            if (from === 'case') {
                Bus.$emit('runCase');
            } else {
                Bus.$emit('runScene', scene_id ? scene_id : target_id, nodes.length, from);
            }
        }
        saveScene(_callback);
    };

    const saveScene = (callback) => {
        if (from === 'scene') {

            Bus.$emit('saveScene', callback);
        } else if (from === 'plan') {

            Bus.$emit('saveScenePlan', nodes, edges, id_apis, node_config, open_scene, id, 'plan', callback);
        } else if (from === 'auto_plan') {

            Bus.$emit('saveSceneAutoPlan', id, callback);
        } else if (from === 'case') {

            const open_scene = open === 'auto_plan' ? open_scene_auto_plan : open_scene_scene;
            Bus.$emit('saveCase', callback);
        }
    };

    const closeApiConfig = (close) => {
        if (from === 'scene') {
            Bus.$emit('saveSceneApi', () => {
                // setDrawer(false)
                if (close) {

                    dispatch({
                        type: 'scene/updateApiRes',
                        payload: null
                    })
                }

                Bus.$emit('saveScene', () => {
                    if (close) {
                        dispatch({
                            type: 'scene/updateApiConfig',
                            payload: false
                        })
                    }
                })
            });
        } else if (from === 'case') {
            Bus.$emit('saveCaseApi', () => {
                // setDrawer(false)
                if (close) {

                    dispatch({
                        type: 'case/updateApiRes',
                        payload: null
                    })
                }

                Bus.$emit('saveCase', () => {
                    if (close) {
                        dispatch({
                            type: 'case/updateApiConfig',
                            payload: false
                        })
                    }
                })
            });
        } else if (from === 'plan') {
            if (close) {
                dispatch({
                    type: 'plan/updateApiRes',
                    payload: null
                })
            }
        } else if (from === 'auto_plan') {
            if (close) {
                dispatch({
                    type: 'auto_plan/updateApiRes',
                    payload: null
                })
            }
        }
    };

    const DrawerHeader = () => {
        return (
            <div className='drawer-header'>
                <div className='drawer-header-left'>
                    <Button className='drawer-close-btn' style={{ marginRight: '8px' }} onClick={(() => {
                        if (apiName.trim().length === 0) {
                            Message('error', t('message.apiNameEmpty'));
                        } else {
                            closeApiConfig(true);
                        }
                    })} >
                        {/* <SvgClose width="16px" height="16px" /> */}
                        <SvgClose />
                    </Button>
                    <InputText
                        maxLength={30}
                        value={apiName}
                        placeholder={t('placeholder.apiName')}
                        onChange={(e) => {
                            if (e.trim().length === 0) {
                                Message('error', t('message.apiNameEmpty'));
                                return;
                            }
                            onTargetChange('name', e.trim());
                        }}
                    />
                </div>
                <div className='drawer-header-right'>
                    {
                        run_status === 'running'
                            ? <Button className='stopBtn' preFix={<SvgStop />} onClick={() => {
                                if (from === 'case') {
                                    Bus.$emit('stopCase', () => {
                                        Message('success', t('message.stopSuccess'));
                                    })
                                } else {
                                    Bus.$emit('stopScene', open_scene.scene_id ? open_scene.scene_id : open_scene.target_id, from, () => {
                                        Message('success', t('message.stopSuccess'));
                                    })
                                }
                            }}>{t('btn.stopRun')}</Button>
                            : <Button className='runBtn' disabled={run_status === 'running'} preFix={<SvgCaretRight />} onClick={() => runScene()}>{from === 'case' ? t('case.runCase') : t('btn.runScene')}</Button>
                    }
                    {
                        (response_data || scene_result) ? <p>{t('scene.runTime')}：{response_data ? response_data.response_time : (scene_result ? scene_result.response_time : '')}</p> : <></>
                    }
                </div>
            </div>
        )
    };


    const onTargetChange = (type, value, extension) => {
        if (from === 'scene') {
            Bus.$emit('updateSceneApi', {
                id: api_now.id,
                pathExpression: getPathExpressionObj(type, extension),
                value,
            }, closeApiConfig);
        } else if (from === 'case') {
            Bus.$emit('updateCaseApi', {
                id: api_now.id,
                pathExpression: getPathExpressionObj(type, extension),
                value,
            }, closeApiConfig);
        }
    }

    // api_now.url = 'http://localhost: 8888'

    const [full, setFull] = useState(false);

    const fullScreenChange = () => {
        if (full) {
            setFull(false);
        } else {
            setFull(true);
        }
    }


    return (
        <div className={`full-screen-container ${full ? 'runnergo-full-screen' : ''}`}>
            <div className='scene-container'>
                {showApiPicker && <ApiPicker from={from} onCancel={() => setApiPicker(false)} />}
                {/* <DndProvider backend={HTML5Backend}> */}
                <SceneBox from={from} />
                {/* </DndProvider> */}
                <div className='api-config-drawer'>
                    {
                        (from === 'scene' || from === 'case') ? <Drawer
                            className='scene-drawer'
                            visible={showDrawer}
                            title={<DrawerHeader />}
                            onCancel={() => setDrawer(false)}
                            footer={null}
                            mask={false}
                        >
                            <ApiManage from={from} apiInfo={api_now} showInfo={false} showAssert={show_assert} onChange={(type, val, extension) => onTargetChange(type, val, extension)} />
                        </Drawer> : <></>
                    }
                </div>
                <FooterConfig from={from} full={full} onChange={(type, e) => {
                    if (from === 'scene' || from === 'case') {
                        setApiPicker(e)
                    } else {
                        onChange(type, e);
                    }
                }} fullScreenChange={fullScreenChange} />
            </div>
        </div>
    )
};

export default SceneContainer;