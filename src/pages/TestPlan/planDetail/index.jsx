import React, { useEffect, useState } from "react";
import { Scale, Drawer, Input, Button, Message } from 'adesign-react';
import { Download as SvgDownload, Explain as SvgExplain, CaretRight as SvgCaretRight } from 'adesign-react/icons';
import { useSelector, useDispatch } from 'react-redux';
import Bus from '@utils/eventBus';
import TreeMenu from '@components/TreeMenu';
import { ApisWrapper, ApiManageWrapper } from './style';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import SceneHeader from '@pages/Scene/sceneHeader';
import SceneContainer from '@pages/Scene/sceneContainer';
import TPlanDetailHeader from "./detailHeader";
import { global$ } from '@hooks/useGlobal/global';
import ApiPicker from '@components/ApiPicker';
import SqlPicker from "@components/SqlPicker";
import { getSqlDataItems } from '@components/SqlPicker/commons';
import { getApiDataItems } from '@components/ApiPicker/commons';
import ApiManage from '@pages/ApisWarper/modules/ApiManage';
import { getPathExpressionObj } from '@constants/pathExpression';
import ScenePicker from './scenePicker';
import SvgScene from '@assets/icons/Scene1';
import { useTranslation } from 'react-i18next';
import CreateScene from '@modals/CreateScene';
import TPlanConfig from "./taskConfig";
import CaseMenu from '@components/CaseMenu';
import CreateCase from '@modals/CreateCase';
import InputText from "@components/InputText";
import SqlManage from "@pages/ApisWarper/modules/SqlManage";

import SvgClose from '@assets/logo/close';

const { ScalePanel, ScaleItem } = Scale;

import './index.less';

const TestPlanDetail = () => {
    const { t } = useTranslation();

    const { id } = useParams();
    const [sceneName, setSceneName] = useState('');
    const [importApi, setImportApi] = useState(false);
    const [importScene, setImportScene] = useState(false);
    const [importSql, setImportSql] = useState(false);
    const [configApi, setConfigApi] = useState(false);
    const [showSqlDrawer, setShowSqlDrawer] = useState(false);
    const open_plan_scene = useSelector((store) => store.auto_plan.open_plan_scene);
    const apiConfig = useSelector((store) => store.auto_plan.showApiConfig);
    console.log(apiConfig, '111111111111');
    const { status, type, api_now = {}, id: id_now } = apiConfig || {};
    const id_apis = useSelector((store) => store.auto_plan.id_apis);
    const show_assert = useSelector((store) => store.auto_plan.show_assert);
    const nodes = useSelector((store) => store.auto_plan.nodes);
    const edges = useSelector((store) => store.auto_plan.edges);
    const node_config = useSelector((store) => store.auto_plan.node_config);

    const scene_env_id = useSelector((store) => store.env.scene_env_id);

    // const node_config = useSelector((store) => store.plan.node_config);

    const [apiName, setApiName] = useState(api_now ? api_now.name : '新建接口');
    const [showCreate, setShowCreate] = useState(false);
    const dispatch = useDispatch();

    const run_res_auto_plan = useSelector((store) => store.auto_plan.run_res);

    const run_res_list = {
        'auto_plan': run_res_auto_plan
    }
    const run_res = run_res_list['auto_plan'];

    const open_auto_plan_res = useSelector((store) => store.auto_plan.run_api_res);


    const response_list = {
        'auto_plan': open_auto_plan_res && open_auto_plan_res[id_now],
    }

    const scene_result = run_res && run_res.filter(item => item.event_id === (id_now))[0];
    const response_data = response_list['auto_plan'];

    const api_now_auto = useSelector((store) => store.auto_plan.api_now);

    useEffect(() => {

        // const open_plan = JSON.parse(localStorage.getItem('open_plan') || '{}');
        // if (open_plan && open_plan[id]) {
        //     if (open_plan_scene) {
        //         if (`${open_plan_scene.scene_id}` !== `${open_plan[id]}`) {
        //             Bus.$emit('addOpenPlanScene', { target_id: open_plan[id] })
        //         }
        //     } else {
        //         Bus.$emit('addOpenPlanScene', { target_id: open_plan[id] })
        //     }
        // }
    }, [open_plan_scene]);


    useEffect(() => {
        console.log(apiConfig, '222222222222');

        if (apiConfig) {

            setConfigApi(Boolean(status));
            dispatch({
                type: 'auto_plan/updateApiNow',
                payload: api_now
            })

            // dispatch({
            //     type: 'auto_plan/updateIdNow',
            //     payload: id_now
            // })
        }
    }, [apiConfig]);


    useEffect(() => {
        return () => {
            dispatch({
                type: 'auto_plan/updateApiConfig',
                payload: {}
            })
        }
    }, []);

    useEffect(() => {
        setApiName(api_now.name);
    }, [api_now])

    const onTargetChange = (type, value, extension) => {
        if (api_now && api_now.id) {
            Bus.$emit('updateAutoPlanApi', {
                id: api_now.id,
                pathExpression: getPathExpressionObj(type, extension),
                value,
            }, closeApiConfig);
        }
    };

    const closeApiConfig = (close) => {
        Bus.$emit('saveAutoPlanApi', () => {
            // setDrawer(false)
            Bus.$emit('saveScenePlan', nodes, edges, id_apis, node_config, open_plan_scene, id, 'auto_plan', () => {

                if (close) {
                    dispatch({
                        type: 'auto_plan/updateApiConfig',
                        payload: {}
                    })
                    dispatch({
                        type: 'auto_plan/updateApiRes',
                        payload: null
                    })
                }
            }, scene_env_id)
        }, id_apis);
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
                        {/* <p style={{ fontSize: '16px' }}>x</p> */}
                        <SvgClose />
                    </Button>
                    <InputText
                        maxLength={30}
                        value={apiName}
                        placeholder={t('placeholder.apiName')}
                        onChange={(e) => {
                            if (e.trim().length === 0) {
                                Message('error', t('message.apiNameEmpty'));
                            }
                            onTargetChange('name', e.trim());
                        }}

                    />
                </div>
                <div className='drawer-header-right'>
                    {/* <Button onClick={() => {
                        Bus.$emit('savePlanApi', api_now);
                    }}>{ t('btn.save') }</Button> */}

                    {
                        (response_data || scene_result) ? <p>{t('scene.runTime')}：{response_data ? response_data.response_time : (scene_result ? scene_result.response_time : '')}</p> : <></>
                    }
                </div>
            </div>
        )
    };

    const CaseEmpty = () => {
        return (
            <div className="welcome-page">
                <div className="newTarget">
                    <Button
                        type="primary"
                        onClick={() => {
                            setCreateCase(true)
                        }}
                    >
                        <SvgScene />
                        <h3>{t('case.createCase')}</h3>
                    </Button>
                </div>
            </div>
        )
    }

    const EmptyContent = () => {
        return <div className="welcome-page">
            <div className="newTarget">
                <Button
                    type="primary"
                    onClick={() => {
                        setShowCreate(true)
                    }}
                >
                    <SvgScene />
                    <h3>{t('btn.createScene')}</h3>
                </Button>
                <Button
                    type="primary"
                    onClick={() => {
                        setImportScene(true)
                    }}
                >
                    <SvgDownload />
                    <h3>{t('plan.importScene')}</h3>
                </Button>
                {/* <Button
                    type="primary"
                    onClick={() => {
                        Bus.$emit('addOpenItem', { type: 'grpc' });
                    }}
                >
                    <SvgGrpc />
                    <h3>新建 Grpc 接口</h3>
                </Button> */}
                {/* <Button
                type="primary"
                onClick={() => {
                    Bus.$emit('addOpenItem', { type: 'websocket' });
                }}
            >
                <SvgWebsocket />
                <h3>新建 WebSocket 接口</h3>
            </Button> */}
            </div>
            {/* <div className="importProject">
            <Button
                type="primary"
                className="apipost-blue-btn"
                onClick={() => {
                    Bus.$emit('openModal', 'ImportProject');
                }}
            >
                快速导入项目
            </Button>
        </div> */}
        </div>
    };

    const [planDetail, setPlanDetail] = useState({});

    const open_case = useSelector((store) => store.case.open_case);
    const show_case = useSelector((store) => store.case.show_case);
    const [layouts, setLayouts] = useState({});
    const [createCase, setCreateCase] = useState(false);

    useEffect(() => {
        if (show_case) {
            setLayouts({ 0: { width: 325 }, 1: { width: 160, marginLeft: '2px' }, 2: { flex: 1, width: 0 } });
        } else {
            setLayouts({ 0: { width: 325 }, 1: { flex: 1, width: 0 } })
        }
    }, [show_case, open_case]);

    const onApiPickerSubmit = (checkedApiKeys, apiDatas) => {
        const dataList = getApiDataItems(apiDatas, checkedApiKeys);
        dispatch({
            type: 'auto_plan/updateIsChanged',
            payload: true
        })
        Bus.$emit('importSceneApi', dataList, 'auto_plan');
        setImportApi(false)
    };

    const onSqlPickerSubmit = (checkedApiKeys, apiDatas) => {
        const dataList = getSqlDataItems(apiDatas, checkedApiKeys);

        Bus.$emit('importSceneApi', dataList, 'auto_plan');
        setImportSql(false)
    };

    const runSceneMysql = () => {
        Bus.$emit('saveScenePlan', nodes, edges, id_apis, node_config, open_plan_scene, id, 'auto_plan', () => {
            Bus.$emit('sendSceneMysql', open_plan_scene.scene_id || open_plan_scene.target_id, id_now, open_auto_plan_res || {}, 'auto_plan');
        }, scene_env_id)
    }

    const MysqlDrawerHeader = () => (
        <div className="mysql-drawer-header">
            <div className="left">
                <Button className='close-btn' onClick={() => {
                    if (api_now.name.trim().length === 0) {
                        Message('error', t('message.apiNameEmpty'));
                    } else {
                        closeApiConfig(true);
                    }
                }}>
                    <SvgClose />
                </Button>
                <InputText
                    maxLength={30}
                    value={api_now ? api_now.name : ''}
                    placeholder={t('placeholder.sqlName')}
                    onChange={(e) => {
                        if (e.trim().length === 0) {
                            Message('error', t('message.sqlNameEmpty'));
                            return;
                        }
                        onTargetChange('name', e.trim());
                    }}
                />
            </div>
            <div className='right'>
                <Button preFix={<SvgCaretRight />} className='run-btn' onClick={runSceneMysql}>执行</Button>
                {/* <Button preFix={<SvgSave />} className='save-btn' onClick={() => saveScene()}>保存</Button> */}
            </div>
        </div>
    );

    return (
        <div className='tplan-detail'>
            <TPlanDetailHeader onGetDetail={(e) => setPlanDetail(e)} />
            {/* <TPlanConfig /> */}
            {importApi && <ApiPicker onSubmit={onApiPickerSubmit} onCancel={() => setImportApi(false)} />}
            {importScene && <ScenePicker from='auto_plan' onCancel={() => setImportScene(false)} />}
            {importSql && <SqlPicker onSubmit={onSqlPickerSubmit} onCancel={() => setImportSql(false)} />}
            {
                <div className='api-config'>
                    <Drawer
                        className='plan-drawer'
                        visible={configApi}
                        title={type === 'sql' ? <MysqlDrawerHeader /> : <DrawerHeader />}
                        // onCancel={() => setDrawer(false)} 
                        footer={null}
                        mask={false}
                    >
                        {
                            type === 'sql' ? <SqlManage from='auto_plan' apiInfo={api_now_auto ? api_now_auto : api_now} showInfo={false} onChange={(type, val, extension) => onTargetChange(type, val, extension)} />
                                : <ApiManage from="auto_plan" apiInfo={api_now_auto ? api_now_auto : api_now} showInfo={false} showAssert={show_assert} onChange={(type, val, extension) => onTargetChange(type, val, extension)} />
                        }
                    </Drawer>
                </div>
            }
            <div className="plan-container">
                {
                    planDetail.status === 2 && <>
                        <div className='plan-mask'>

                        </div>

                        <div className='plan-mask-container'>
                            <SvgExplain />
                            <p>{t('plan.showMask')}</p>
                        </div>
                    </>
                }

                {
                    show_case ? <ScalePanel
                        style={{ marginTop: '2px' }}
                        realTimeRender
                        className={ApisWrapper}
                        layouts={layouts}
                    >
                        <ScaleItem className="left-menus" minWidth={325} maxWidth={350}>
                            <TreeMenu type='auto_plan' getSceneName={(e) => setSceneName(e)} onChange={(e) => setImportScene(e)} />
                        </ScaleItem>
                        <ScaleItem>
                            <CaseMenu from='auto_plan' />
                        </ScaleItem>
                        <ScaleItem className="right-apis" enableScale={false}>
                            {
                                show_case && Object.entries(open_case || {}).length > 0 ? <>
                                    <SceneHeader from='case' open='auto_plan' sceneName={sceneName} />
                                    <SceneContainer from='case' onChange={(type, e) => {
                                        if (type === 'api') {
                                            setImportApi(e)
                                        } else if (type === 'scene') {
                                            setImportScene(e)
                                        } else if (type === 'sql') {
                                            setImportSql(e);
                                        }
                                    }} />
                                </> : <CaseEmpty />
                            }
                        </ScaleItem>
                    </ScalePanel>
                        : <ScalePanel
                            style={{ marginTop: '2px' }}
                            realTimeRender
                            className={ApisWrapper}
                            layouts={layouts}
                        >
                            <ScaleItem className="left-menus" minWidth={325} maxWidth={350}>
                                <TreeMenu type='auto_plan' getSceneName={(e) => setSceneName(e)} onChange={(e) => setImportScene(e)} />
                            </ScaleItem>
                            <ScaleItem className="right-apis" enableScale={false}>
                                {
                                    open_plan_scene ? <>
                                        <SceneHeader from='auto_plan' sceneName={sceneName} />
                                        <SceneContainer from='auto_plan' onChange={(type, e) => {
                                            if (type === 'api') {
                                                setImportApi(e)
                                            } else if (type === 'scene') {
                                                setImportScene(e)
                                            } else if (type === 'sql') {
                                                setImportSql(e);
                                            }
                                        }} />
                                    </> : <EmptyContent />
                                }
                            </ScaleItem>
                        </ScalePanel>
                }
            </div>
            {createCase && <CreateCase from="auto_plan" onCancel={() => setCreateCase(false)} />}
            {showCreate && <CreateScene from="auto_plan" onCancel={() => setShowCreate(false)} />}
        </div>
    )
};

export default TestPlanDetail;