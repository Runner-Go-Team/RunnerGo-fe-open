import React, { useState, useEffect } from 'react';
import { Apis as SvgApis, Add as SvgAdd, Download as SvgDownload } from 'adesign-react/icons';
import './index.less';
import Bus from '@utils/eventBus';
import { Message } from 'adesign-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const FooterConfig = (props) => {
    const { onChange, from = 'scene' } = props;
    const { t } = useTranslation();
    const [showControl, setShowControl] = useState(false);
    const dispatch = useDispatch();
    const scene_nodes = useSelector((store) => store.scene.nodes);
    const plan_nodes = useSelector((store) => store.plan.nodes);
    const auto_plan_nodes = useSelector((store) => store.auto_plan.nodes);
    const case_nodes = useSelector((store) => store.case.nodes);

    const nodes_list = {
        'scene': scene_nodes,
        'plan': plan_nodes,
        'auto_plan': auto_plan_nodes,
        'case': case_nodes
    }
    const _nodes = nodes_list[from];


    useEffect(() => {
        document.addEventListener('click', (e) => clickOutSide(e))

        return () => {
            document.removeEventListener('click', (e) => clickOutSide(e));
        }
    }, []);

    const clickOutSide = (e) => {
        let _box = document.querySelector('.footer-config');

        if (_box && !_box.contains(e.target)) {
            setShowControl(false);
        }
    }

    const init_scene_scene = useSelector((store) => store.scene.init_scene);
    const init_scene_plan = useSelector((store) => store.plan.init_scene);
    const init_scene_auto_plan = useSelector((store) => store.auto_plan.init_scene);
    const init_scene_case = useSelector((store) => store.case.init_scene);

    const init_list = {
        'scene': init_scene_scene,
        'plan': init_scene_plan,
        'auto_plan': init_scene_auto_plan,
        'case': init_scene_case
    };

    const init_scene = init_list[from];

    const initScene = () => {
        if (from === 'scene') {
            dispatch({
                type: 'scene/updateRunRes',
                payload: null,
            });
            dispatch({
                type: 'scene/updateRunningScene',
                payload: '',
            });
            dispatch({
                type: 'scene/updateSuccessEdge',
                payload: [],
            });
            dispatch({
                type: 'scene/updateFailedEdge',
                payload: [],
            });
            dispatch({
                type: 'scene/updateBeautify',
                payload: false
            });
            dispatch({
                type: 'scene/updateInitScene',
                payload: !init_scene
            })
        } else if (from === 'plan') {
            dispatch({
                type: 'plan/updateRunRes',
                payload: null,
            });
            dispatch({
                type: 'plan/updateRunningScene',
                payload: '',
            });
            dispatch({
                type: 'plan/updateSuccessEdge',
                payload: [],
            });
            dispatch({
                type: 'plan/updateFailedEdge',
                payload: [],
            });
            dispatch({
                type: 'plan/updateBeautify',
                payload: false
            });
            dispatch({
                type: 'plan/updateInitScene',
                payload: !init_scene
            })
        } else if (from === 'auto_plan') {
            dispatch({
                type: 'auto_plan/updateRunRes',
                payload: null,
            });
            dispatch({
                type: 'auto_plan/updateRunningScene',
                payload: '',
            });
            dispatch({
                type: 'auto_plan/updateSuccessEdge',
                payload: [],
            });
            dispatch({
                type: 'auto_plan/updateFailedEdge',
                payload: [],
            });
            dispatch({
                type: 'auto_plan/updateBeautify',
                payload: false
            });
            dispatch({
                type: 'auto_plan/updateInitScene',
                payload: !init_scene
            })
        } else if (from === 'case') {
            dispatch({
                type: 'case/updateRunRes',
                payload: null,
            });
            dispatch({
                type: 'case/updateRunningScene',
                payload: '',
            });
            dispatch({
                type: 'case/updateSuccessEdge',
                payload: [],
            });
            dispatch({
                type: 'case/updateFailedEdge',
                payload: [],
            });
            dispatch({
                type: 'case/updateBeautify',
                payload: false
            });
            dispatch({
                type: 'case/updateInitScene',
                payload: !init_scene
            })
        }
    }

    return (
        <div className='footer-config'>
            {showControl && <div className='add-controller'>
                <div className='wait' onClick={() => {
                    if (from === 'scene') {
                        dispatch({
                            type: 'scene/updateAddNew',
                            payload: 'wait_controller'
                        })
                    } else if (from === 'plan') {
                        dispatch({
                            type: 'plan/updateAddNew',
                            payload: 'wait_controller'
                        })
                    } else if (from == 'auto_plan') {
                        dispatch({
                            type: 'auto_plan/updateAddNew',
                            payload: 'wait_controller'
                        }) 
                    } else if (from === 'case') {
                        dispatch({
                            type: 'case/updateAddNew',
                            payload: 'wait_controller'
                        }) 
                    }
                    initScene();
                }}>
                    <SvgAdd />
                    <span>{t('scene.waitControl')}</span>
                </div>
                <div className='condition' onClick={() => {
                    if (from === 'scene') {
                        dispatch({
                            type: 'scene/updateAddNew',
                            payload: 'condition_controller'
                        })
                    } else if (from === 'plan') {
                        dispatch({
                            type: 'plan/updateAddNew',
                            payload: 'condition_controller'
                        })
                    } else if (from === 'auto_plan') {
                        dispatch({
                            type: 'auto_plan/updateAddNew',
                            payload: 'condition_controller'
                        })
                    } else if (from === 'case') {
                        dispatch({
                            type: 'case/updateAddNew',
                            payload: 'condition_controller'
                        })
                    }
                    initScene();
                }}>
                    <SvgAdd />
                    <span>{t('scene.conditionControl')}</span>
                </div>
            </div>
            }
            <div className='common-config' style={{ 'min-width': from === 'plan' ? '360px' : '288px' }}>
                <div className='config-item' onClick={() => {
                    if (from === 'scene') {
                        dispatch({
                            type: 'scene/updateAddNew',
                            payload: 'api'
                        })
                    } else if (from === 'plan') {
                        dispatch({
                            type: 'plan/updateAddNew',
                            payload: 'api'
                        })
                    } else if (from === 'auto_plan') {
                        dispatch({
                            type: 'auto_plan/updateAddNew',
                            payload: 'api'
                        })
                    } else if (from === 'case') {
                        dispatch({
                            type: 'case/updateAddNew',
                            payload: 'api'
                        })
                    }
                    initScene();
                
                }}>
                    <SvgApis />
                    <span>{t('scene.createApi')}</span>
                </div>
                <span className='line'></span>
                <div className='config-item' onClick={() => setShowControl(!showControl)}>
                    <SvgAdd />
                    <span>{t('scene.createControl')}</span>
                </div>
                <span className='line'></span>
                <div className='config-item' onClick={() => onChange('api', true)}>
                    <SvgDownload />
                    <span>{t('scene.importApi')}</span>
                </div>
            </div>
        </div>
    )
};

export default FooterConfig;