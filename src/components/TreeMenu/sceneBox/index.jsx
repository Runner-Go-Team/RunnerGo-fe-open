import React, { useState, useEffect } from 'react';
import './index.less';
import { Apis as SvgApis, NewFolder as SvgNewFolder, Download as SvgDownload } from 'adesign-react/icons';
import SvgScene from '@assets/icons/Scene1';
import CreateGroup from '@modals/CreateGroup';
import CreateScene from '@modals/CreateScene';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Message, Modal } from 'adesign-react';
import Bus from '@utils/eventBus';

const SceneBox = (props) => {
    const { from, onChange, taskType } = props;
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const dispatch = useDispatch();

    const [showCreateGroup, setCreateGroup] = useState(false);
    const [showCreateScene, setCreateScene] = useState(false);
    const [canCreate, setCanCreate] = useState(true);
    const planMenu = useSelector((store) => store.plan.planMenu);

    const is_changed_scene = useSelector((store) => store.scene.is_changed);
    const is_changed_plan = useSelector((store) => store.plan.is_changed);
    const is_changed_auto_plan = useSelector((store) => store.auto_plan.is_changed);
    const is_changed_case = useSelector((store) => store.case.is_changed);

    const is_changed_list = {
        'scene': is_changed_scene,
        'plan': is_changed_plan,
        'auto_plan': is_changed_auto_plan,
        'case': is_changed_case
    };

    const is_changed = is_changed_list[from];

    useEffect(() => {
        if (Object.values(planMenu).filter(item => item.target_type === 'scene').length === 1 && taskType === 2) {
            setCanCreate(false);
        } else {
            setCanCreate(true);
        }
    }, [planMenu, taskType]);

    const clearCase = () => {
        dispatch({
            type: 'case/updateIsChanged',
            payload: false
        })
        dispatch({
            type: 'case/updateRunRes',
            payload: null,
        })
        dispatch({
            type: 'case/updateRunningScene',
            payload: '',
        })
        dispatch({
            type: 'case/updateNodes',
            payload: [],
        });
        dispatch({
            type: 'case/updateEdges',
            payload: [],
        })
        dispatch({
            type: 'case/updateCloneNode',
            payload: [],
        })
        dispatch({
            type: 'case/updateSuccessEdge',
            payload: [],
        });
        dispatch({
            type: 'case/updateFailedEdge',
            payload: [],
        });
        dispatch({
            type: 'case/updateApiConfig',
            payload: false,
        })
        dispatch({
            type: 'case/updateBeautify',
            payload: false
        })
    }


    // 监听场景中是否有更改并且未保存
    const checkSceneChange = (callback) => {
        if (is_changed_case) {
            Modal.confirm({
                title: t('modal.tips'),
                content: t('modal.caseNotSave'),
                okText: t('btn.save'),
                cancelText: t('btn.cancel'),
                diyText: t('btn.notSave'),
                onOk: () => {
                    // 保存当前场景
                    Bus.$emit('saveCase', () => {
                        Message('success', t('message.saveSuccess'));
                        clearCase();
                        if (is_changed) {
                            Modal.confirm({
                                title: t('modal.tips'),
                                content: t('modal.sceneNotSave'),
                                okText: t('btn.save'),
                                cancelText: t('btn.cancel'),
                                diyText: t('btn.notSave'),
                                onOk: () => {
                                    // 保存当前场景
                                    Bus.$emit('saveScene', () => {
                                        Message('success', t('message.saveSuccess'));

                                        dispatch({
                                            type: 'scene/updateIsChanged',
                                            payload: false
                                        })

                                        callback && callback();
                                    });
                                },
                                onCancel: () => {
                                    // 取消弹窗

                                },
                                onDiy: () => {
                                    // 不保存, 直接跳转

                                    dispatch({
                                        type: 'scene/updateIsChanged',
                                        payload: false
                                    })
                                    callback && callback();
                                }
                            })
                        }
                    });

                },
                onCancel: () => {
                    // 取消弹窗

                },
                onDiy: () => {

                    // 不保存, 直接跳转
                    clearCase();
                    if (is_changed) {
                        Modal.confirm({
                            title: t('modal.tips'),
                            content: t('modal.sceneNotSave'),
                            okText: t('btn.save'),
                            cancelText: t('btn.cancel'),
                            diyText: t('btn.notSave'),
                            onOk: () => {
                                // 保存当前场景
                                Bus.$emit('saveScene', () => {
                                    Message('success', t('message.saveSuccess'));

                                    dispatch({
                                        type: 'scene/updateIsChanged',
                                        payload: false
                                    })
                                    callback && callback();


                                });
                            },
                            onCancel: () => {
                                // 取消弹窗

                            },
                            onDiy: () => {
                                // 不保存, 直接跳转

                                dispatch({
                                    type: 'scene/updateIsChanged',
                                    payload: false
                                })
                                callback && callback();

                            }
                        })
                    } else {
                        callback && callback();
                    }
                }
            })
        } else {
            clearCase();
            if (is_changed) {
                Modal.confirm({
                    title: t('modal.tips'),
                    content: t('modal.sceneNotSave'),
                    okText: t('btn.save'),
                    cancelText: t('btn.cancel'),
                    diyText: t('btn.notSave'),
                    onOk: () => {
                        // 保存当前场景
                        Bus.$emit('saveScene', () => {
                            Message('success', t('message.saveSuccess'));

                            dispatch({
                                type: 'scene/updateIsChanged',
                                payload: false
                            })
                            callback && callback();


                        });
                    },
                    onCancel: () => {
                        // 取消弹窗

                    },
                    onDiy: () => {
                        // 不保存, 直接跳转

                        dispatch({
                            type: 'scene/updateIsChanged',
                            payload: false
                        })
                        callback && callback();

                    }
                })
            } else {
                callback && callback();
            }
        }
    }

    const nodes_plan = useSelector((store) => store.plan.nodes);
    const edges_plan = useSelector((store) => store.plan.edges);
    const id_apis_plan = useSelector((d) => d.plan.id_apis);
    const node_config_plan = useSelector((d) => d.plan.node_config);

    const open_scene_scene = useSelector((d) => d.scene.open_scene);
    const open_plan_scene = useSelector((d) => d.plan.open_plan_scene);
    const auto_plan_scene = useSelector((d) => d.auto_plan.open_plan_scene);

    const open_list = {
        'scene': open_scene_scene,
        'plan': open_plan_scene,
        'auto_plan': auto_plan_scene
    }

    const open_scene = open_list[from];

    // 监听性能计划场景中是否有更改且未保存
    const checkPlanSceneChange = (callback) => {
        if (is_changed) {
            Modal.confirm({
                title: t('modal.tips'),
                content: t('modal.sceneNotSave'),
                okText: t('btn.save'),
                cancelText: t('btn.cancel'),
                diyText: t('btn.notSave'),
                onOk: () => {
                    // 保存当前场景
                    Bus.$emit('saveScenePlan', nodes_plan, edges_plan, id_apis_plan, node_config_plan, open_scene, id, 'plan', () => {
                        Message('success', t('message.saveSuccess'));
                        dispatch({
                            type: 'plan/updateIsChanged',
                            payload: false
                        })

                        callback && callback();
                    });
                },
                onCancel: () => {
                    // 取消弹窗
                },
                onDiy: () => {
                    // 不保存, 直接跳转

                    dispatch({
                        type: 'plan/updateIsChanged',
                        payload: false
                    })
                    callback && callback();
                }
            })
        } else {
            callback && callback();
        }
    }

    const nodes_auto_plan = useSelector((store) => store.auto_plan.nodes);
    const edges_auto_plan = useSelector((store) => store.auto_plan.edges);
    const id_apis_auto_plan = useSelector((d) => d.auto_plan.id_apis);
    const node_config_auto_plan = useSelector((d) => d.auto_plan.node_config);


    // 监听自动化计划场景中是否有更改且未保存
    const checkAutoPlanSceneChange = (callback) => {
        if (is_changed_case) {
            Modal.confirm({
                title: t('modal.tips'),
                content: t('modal.caseNotSave'),
                okText: t('btn.save'),
                cancelText: t('btn.cancel'),
                diyText: t('btn.notSave'),
                onOk: () => {
                    // 保存当前场景
                    Bus.$emit('saveCase', () => {
                        Message('success', t('message.saveSuccess'));
                        clearCase();
                        if (is_changed) {
                            Modal.confirm({
                                title: t('modal.tips'),
                                content: t('modal.caseNotSave'),
                                okText: t('btn.save'),
                                cancelText: t('btn.cancel'),
                                diyText: t('btn.notSave'),
                                onOk: () => {
                                    // 保存当前场景
                                    Bus.$emit('saveSceneAutoPlan', nodes_auto_plan, edges_auto_plan, id_apis_auto_plan, node_config_auto_plan, open_scene, id, () => {
                                        Message('success', t('message.saveSuccess'));

                                        dispatch({
                                            type: 'auto_plan/updateIsChanged',
                                            payload: false
                                        })

                                        callback && callback();
                                    });

                                },
                                onCancel: () => {
                                    // 取消弹窗

                                },
                                onDiy: () => {
                                    // 不保存, 直接跳转

                                    dispatch({
                                        type: 'auto_plan/updateIsChanged',
                                        payload: false
                                    })
                                    callback && callback();
                                }
                            })
                        } else {
                            callback && callback();
                        }
                    });

                },
                onCancel: () => {
                    // 取消弹窗

                },
                onDiy: () => {

                    // 不保存, 直接跳转

                    clearCase();
                    if (is_changed) {
                        Modal.confirm({
                            title: t('modal.tips'),
                            content: t('modal.caseNotSave'),
                            okText: t('btn.save'),
                            cancelText: t('btn.cancel'),
                            diyText: t('btn.notSave'),
                            onOk: () => {
                                // 保存当前场景
                                Bus.$emit('saveSceneAutoPlan', nodes_auto_plan, edges_auto_plan, id_apis_auto_plan, node_config_auto_plan, open_scene, id, () => {
                                    Message('success', t('message.saveSuccess'));

                                    dispatch({
                                        type: 'auto_plan/updateIsChanged',
                                        payload: false
                                    })
                                    
                                    callback && callback();
                                });

                            },
                            onCancel: () => {
                                // 取消弹窗

                            },
                            onDiy: () => {
                                // 不保存, 直接跳转

                                dispatch({
                                    type: 'auto_plan/updateIsChanged',
                                    payload: false
                                })
                                callback && callback();
                            }
                        })
                    } else {
                        callback && callback();
                    }
                }
            })
        } else {
            clearCase();
            if (is_changed) {
                Modal.confirm({
                    title: t('modal.tips'),
                    content: t('modal.caseNotSave'),
                    okText: t('btn.save'),
                    cancelText: t('btn.cancel'),
                    diyText: t('btn.notSave'),
                    onOk: () => {
                        // 保存当前场景
                        Bus.$emit('saveSceneAutoPlan', nodes_auto_plan, edges_auto_plan, id_apis_auto_plan, node_config_auto_plan, open_scene, id, () => {
                            Message('success', t('message.saveSuccess'));

                            dispatch({
                                type: 'auto_plan/updateIsChanged',
                                payload: false
                            })

                            callback && callback();
                        });

                    },
                    onCancel: () => {
                        // 取消弹窗

                    },
                    onDiy: () => {
                        // 不保存, 直接跳转

                        dispatch({
                            type: 'auto_plan/updateIsChanged',
                            payload: false
                        })
                        callback && callback();
                    }
                })
            } else {
                callback && callback();
            }
        }
    }

    return (
        <div className='scene-box' style={{ justifyContent: from === 'plan' ? 'space-between' : 'flex-start' }}>
            <div className='scene-box-item' onClick={() => setCreateGroup(true)}>
                <SvgNewFolder width="18" height="18" />
                <p>{from !== 'plan' ? t('scene.new') : ''}{i18n.language === 'cn' ? '' : ' '}{t('scene.group')}</p>
                <div className='line' style={{ margin: from === 'plan' ? (i18n.language === 'cn' ? '0 25px' : '0 8px') : '0 24px' }}></div>
            </div>
            <div className='scene-box-item' onClick={() => {
                if (canCreate) {
                    if (from === 'scene') {
                        checkSceneChange(() => setCreateScene(true));
                    } else if (from === 'plan') {
                        checkPlanSceneChange(() => setCreateScene(true));
                    } else if (from === 'auto_plan') {
                        checkAutoPlanSceneChange(() => setCreateScene(true));
                    }
                } else {
                    Message('error', t('message.cantCreateScene'));
                }
            }}>
                <SvgScene width="18" height="18" />
                <p>{t('scene.createScene')}</p>
            </div>
            {
                (from === 'plan' || from === 'auto_plan') &&
                <>

                    <div className='scene-box-item' onClick={() => {
                        if (from === 'scene') {
                            checkSceneChange(() => onChange(true));
                        } else if (from === 'plan') {
                            checkPlanSceneChange(() => onChange(true));
                        } else if (from === 'auto_plan') {
                            checkAutoPlanSceneChange(() => onChange(true));
                        }
                    }}>
                        <div className='line' style={{ margin: from === 'plan' ? (i18n.language === 'cn' ? '0 25px' : '0 8px') : '0 14px' }}></div>
                        <SvgDownload width="18" height="18" />
                        <p>{t('plan.importScene')}</p>
                    </div>
                </>
            }

            {showCreateGroup && <CreateGroup from={from} onCancel={() => setCreateGroup(false)} />}
            {showCreateScene && <CreateScene from={from} onCancel={() => setCreateScene(false)} />}
        </div>
    )
};

export default SceneBox;