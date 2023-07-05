import React, { useEffect, useState, useCallback } from 'react';
import { Scale, Drawer, Input, Button, Message } from 'adesign-react';
import { Download as SvgDownload, Explain as SvgExplain, CaretRight as SvgCaretRight } from 'adesign-react/icons'
import { useSelector, useDispatch } from 'react-redux';
import { isObject } from 'lodash';
import Bus from '@utils/eventBus';
import TreeMenu from '@components/TreeMenu';
import { ApisWrapper, ApiManageWrapper } from './style';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import SceneHeader from '@pages/Scene/sceneHeader';
import SceneContainer from '@pages/Scene/sceneContainer';
import DetailHeader from './header';
import TaskConfig from './taskConfig';
import { global$ } from '@hooks/useGlobal/global';
import ApiPicker from '@components/ApiPicker'
import SqlPicker from '@components/SqlPicker';
import { getSqlDataItems } from '@components/SqlPicker/commons';
import { getApiDataItems } from '@components/ApiPicker/commons';
import ApiManage from '@pages/ApisWarper/modules/ApiManage';
import { getPathExpressionObj } from '@constants/pathExpression';
import ScenePicker from './scenePicker';
import './index.less';
import SvgScene from '@assets/icons/Scene1';
import { useTranslation } from 'react-i18next';
import CreateScene from '@modals/CreateScene';
import InputText from '@components/InputText';
import SqlManage from "@pages/ApisWarper/modules/SqlManage";


import SvgClose from '@assets/logo/close';

const { ScalePanel, ScaleItem } = Scale;

const PlanDetail = () => {
    const { t } = useTranslation();

    const { id } = useParams();
    const [sceneName, setSceneName] = useState('');
    const [importApi, setImportApi] = useState(false);
    const [importScene, setImportScene] = useState(false);
    const [importSql, setImportSql] = useState(false);
    const [configApi, setConfigApi] = useState(false);
    const [showSqlDrawer, setShowSqlDrawer] = useState(false);
    const open_plan_scene = useSelector((store) => store.plan.open_plan_scene);
    const apiConfig = useSelector((store) => store.plan.showApiConfig);
    const { status, type, api_now = {}, id: id_now } = apiConfig || {};
    const id_apis = useSelector((store) => store.plan.id_apis);
    const nodes = useSelector((store) => store.plan.nodes);
    const edges = useSelector((store) => store.plan.edges);
    const node_config = useSelector((store) => store.plan.node_config);

    const hide_config = useSelector((store) => store.plan.hide_config);


    // const node_config = useSelector((store) => store.plan.node_config);

    const [apiName, setApiName] = useState(api_now ? api_now.name : '新建接口');
    const [showCreate, setShowCreate] = useState(false);
    const dispatch = useDispatch();

    const run_res_plan = useSelector((store) => store.plan.run_res);


    const run_res = run_res_plan;


    const open_plan_res = useSelector((store) => store.plan.run_api_res);



    const response_list = {
        'plan': open_plan_res && open_plan_res[id_now],
    }

    const scene_result = run_res && run_res.filter(item => item.event_id === (id_now))[0];
    const response_data = response_list['plan'];

    const api_now_plan = useSelector((store) => store.plan.api_now);

    const scene_env_id = useSelector((store) => store.env.scene_env_id);

    useEffect(() => {
        if (apiConfig) {
            setConfigApi(Boolean(status));
            dispatch({
                type: 'plan/updateApiNow',
                payload: api_now
            })
        }
    }, [apiConfig]);


    useEffect(() => {
        return () => {
            dispatch({
                type: 'plan/updateApiConfig',
                payload: {}
            })
            dispatch({
                type: 'plan/updateHideConfig',
                payload: false
            })
        }
    }, []);

    useEffect(() => {
        setApiName(api_now.name);
    }, [api_now])

    const onTargetChange = (type, value, extension) => {
        if (api_now && api_now.id) {
            Bus.$emit('updatePlanApi', {
                id: api_now.id,
                pathExpression: getPathExpressionObj(type, extension),
                value,
            }, id_apis, closeApiConfig);
        }
    };

    const closeApiConfig = (close) => {
        Bus.$emit('savePlanApi', id_apis, api_now, () => {
            // setDrawer(false)
            Bus.$emit('saveScenePlan', nodes, edges, id_apis, node_config, open_plan_scene, id, 'plan', () => {
                if (close) {
                    dispatch({
                        type: 'plan/updateApiConfig',
                        payload: {}
                    })
                    dispatch({
                        type: 'plan/updateApiRes',
                        payload: null
                    })
                }
            }, scene_env_id);
        });
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

            </div>

        </div>
    };

    const [planDetail, setPlanDetail] = useState({});
    const [layout, setLayout] = useState({});

    useEffect(() => {
        if (Object.entries(open_plan_scene || {}).length > 0 && !hide_config) {
            setLayout({ 0: { width: 325 }, 1: { flex: 1 }, 2: { width: 384 } });
        } else {
            setLayout({ 0: { width: 325 }, 1: { width: 0, flex: 1 } });
        }
    }, [hide_config, open_plan_scene])


    const onApiPickerSubmit = (checkedApiKeys, apiDatas) => {
        const dataList = getApiDataItems(apiDatas, checkedApiKeys);
        dispatch({
            type: 'plan/updateIsChanged',
            payload: true
        })
        Bus.$emit('importSceneApi', dataList, 'plan');
        setImportApi(false)
    };

    const onSqlPickerSubmit = (checkedApiKeys, apiDatas) => {
        const dataList = getSqlDataItems(apiDatas, checkedApiKeys);

        Bus.$emit('importSceneApi', dataList, 'plan');

        setImportSql(false)
    };

    const runSceneMysql = () => {
        Bus.$emit('saveScenePlan', nodes, edges, id_apis, node_config, open_plan_scene, id, 'plan', () => {
            Bus.$emit('sendSceneMysql', open_plan_scene.scene_id || open_plan_scene.target_id, id_now, open_plan_res || {}, 'plan');
        }, scene_env_id);

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
        <div className='plan-detail'>
            <DetailHeader onGetDetail={(e) => setPlanDetail(e)} />
            {importApi && <ApiPicker onSubmit={onApiPickerSubmit} onCancel={() => setImportApi(false)} />}
            {importScene && <ScenePicker from='plan' taskType={Object.entries(planDetail).length > 0 ? planDetail.task_type : 1} onCancel={() => setImportScene(false)} />}
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
                            type === 'sql' ?
                                <SqlManage from='plan' apiInfo={api_now_plan ? api_now_plan : api_now} showInfo={false} onChange={(type, val, extension) => onTargetChange(type, val, extension)} />
                                : <ApiManage from="plan" apiInfo={api_now_plan ? api_now_plan :api_now} showInfo={false} onChange={(type, val, extension) => onTargetChange(type, val, extension)} />
                        }
                    </Drawer>
                </div>
            }
            <div className='plan-container'>
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

                <ScalePanel
                    style={{ marginTop: '2px' }}
                    realTimeRender
                    className={ApisWrapper}
                    defaultLayouts={layout}
                    layouts={layout}
                >

                    <ScaleItem className="left-menus" minWidth={325} maxWidth={350}>
                        <TreeMenu type='plan' taskType={Object.entries(planDetail).length > 0 ? planDetail.task_type : 1} getSceneName={(e) => setSceneName(e)} onChange={(e) => setImportScene(e)} />
                    </ScaleItem>
                    <ScaleItem className="right-apis">
                        {
                            open_plan_scene ? <>
                                <SceneHeader from='plan' sceneName={sceneName} />
                                <SceneContainer from='plan' onChange={(type, e) => {
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
                    <ScaleItem enableScale={false}>
                        {
                            open_plan_scene && <TaskConfig from='default' refresh={open_plan_scene} planDetail={planDetail} />
                        }
                    </ScaleItem>

                </ScalePanel>
            </div>
            {showCreate && <CreateScene from="plan" onCancel={() => setShowCreate(false)} />}
        </div>
    )
};

export default PlanDetail;