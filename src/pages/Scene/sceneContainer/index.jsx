import React, { useState, useEffect } from 'react';
import './index.less';
import { Drawer, Button, Input, Modal, Message } from 'adesign-react';
// import { Close as SvgClose } from 'adesign-react/icons';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SceneBox from './sceneBox';
import ApiManage from '@pages/ApisWarper/modules/ApiManage';
import { getPathExpressionObj } from '@constants/pathExpression';
import FooterConfig from './footerConfig';
import Bus from '@utils/eventBus';
import { useSelector, useDispatch } from 'react-redux';
import ApiPicker from './apiPicker';
import { useTranslation } from 'react-i18next';


import SvgClose from '@assets/logo/close';

const SceneContainer = (props) => {
    const { from, onChange } = props;
    const apiConfig_scene = useSelector((store) => store.scene.showApiConfig);
    const apiConfig_case = useSelector((store) => store.case.showApiConfig);
    const apiConfig = from == 'scene' ? apiConfig_scene : apiConfig_case;
    const id_apis = useSelector((store) => store.scene.id_apis);
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



    useEffect(() => {
        setDrawer(apiConfig);
    }, [apiConfig]);

    useEffect(() => {
        setApiName(api_now.name)
    }, [api_now]);

    const closeApiConfig = () => {
        if (from === 'scene') {
            Bus.$emit('saveSceneApi', api_now, id_apis, () => {
                // setDrawer(false)
                Bus.$emit('saveScene', () => {
                    dispatch({
                        type: 'scene/updateApiConfig',
                        payload: false
                    })
                })

                dispatch({
                    type: 'scene/updateApiRes',
                    payload: null
                })
            });
        } else if (from === 'case') {
            Bus.$emit('saveCaseApi', () => {
                // setDrawer(false)
                Bus.$emit('saveCase', () => {
                    dispatch({
                        type: 'case/updateApiConfig',
                        payload: false
                    })
                })

                dispatch({
                    type: 'case/updateApiRes',
                    payload: null
                })
            });
        } else if (from === 'plan') {
            dispatch({
                type: 'plan/updateApiRes',
                payload: null
            })
        } else if (from === 'auto_plan') {
            dispatch({
                type: 'auto_plan/updateApiRes',
                payload: null
            })
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
                            closeApiConfig();
                        }
                    })} >
                        {/* <SvgClose width="16px" height="16px" /> */}
                        <SvgClose />
                    </Button>
                    <Input size="mini" value={apiName} placeholder={t('placeholder.apiName')} onBlur={(e) => {
                        if (e.target.value.trim().length === 0) {
                            Message('error', t('message.apiNameEmpty'));
                        }
                        onTargetChange('name', e.target.value.trim());
                    }} />
                </div>
                <div className='drawer-header-right'>
                    {/* <Button className='drawer-save-btn' onClick={() => {
                        Bus.$emit('saveSceneApi', api_now, id_apis, () => {
                            Message('success', '保存成功!')
                        });
                    }}>保存</Button> */}
                    {
                        (response_data || scene_result) ? <p>{ t('scene.runTime') }：{ response_data ? response_data.response_time : (scene_result ? scene_result.response_time : '') }</p> : <></>
                    }
                </div>
            </div>
        )
    };

    const onTargetChange = (type, value) => {
        if (from === 'scene') {
            Bus.$emit('updateSceneApi', {
                id: api_now.id,
                pathExpression: getPathExpressionObj(type),
                value,
            }, id_apis);
        } else if (from === 'case') {
            Bus.$emit('updateCaseApi', {
                id: api_now.id,
                pathExpression: getPathExpressionObj(type),
                value,
            });
        }
    }

    // api_now.url = 'http://localhost: 8888'

    return (
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
                        <ApiManage from={from} apiInfo={api_now} showInfo={false} showAssert={show_assert} onChange={(type, val) => onTargetChange(type, val)} />
                    </Drawer> : <></>
                }
            </div>
            <FooterConfig from={from} onChange={(type, e) => {
                if (from === 'scene' || from === 'case') {
                    setApiPicker(e)
                } else {
                    onChange(type, e);
                }
            }} />
        </div>
    )
};

export default SceneContainer;