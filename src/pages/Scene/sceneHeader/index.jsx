import React, { useState, useEffect } from 'react';
import './index.less';
import {
    Setting1 as SvgSetting,
    Save as SvgSave,
    CaretRight as SvgCaretRight
} from 'adesign-react/icons';
import { Button, Message } from 'adesign-react';
import { useSelector, useDispatch } from 'react-redux';
import CreateApi from '@modals/CreateApi';
import SceneConfig from '@modals/SceneConfig';
import { fetchStopScene } from '@services/scene';
import Bus from '@utils/eventBus';
import { useParams } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { MarkerType } from 'react-flow-renderer';
import SvgStop from './stop';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@arco-design/web-react';

const SceneHeader = (props) => {
    const { from, open } = props;
    const { t } = useTranslation();
    const [showSceneConfig, setSceneConfig] = useState(false);
    const dispatch = useDispatch();
    const { id } = useParams();
    // const saveScene = useSelector((store) => store.scene.saveScene);

    const nodes_scene = useSelector((store) => store.scene.nodes);
    const edges_scene = useSelector((store) => store.scene.edges);
    const id_apis_scene = useSelector((store) => store.scene.id_apis);
    const node_config_scene = useSelector((store) => store.scene.node_config);
    const open_scene_scene = useSelector((store) => store.scene.open_scene);
    const init_scene_scene = useSelector((store) => store.scene.init_scene);
    const to_loading_scene = useSelector((store) => store.scene.to_loading);
    const run_res_scene = useSelector((store) => store.scene.run_res);
    const run_status_scene = useSelector((store) => store.scene.run_status);


    const nodes_case = useSelector((store) => store.case.nodes);
    const edges_case = useSelector((store) => store.case.edges);
    const id_apis_case = useSelector((store) => store.case.id_apis);
    const node_config_case = useSelector((store) => store.case.node_config);
    const open_scene_case = useSelector((store) => store.case.open_case);
    const init_scene_case = useSelector((store) => store.case.init_scene);
    const to_loading_case = useSelector((store) => store.case.to_loading);
    const run_res_case = useSelector((store) => store.case.run_res);
    const run_status_case = useSelector((store) => store.case.run_status);


    const nodes_plan = useSelector((store) => store.plan.nodes);
    const edges_plan = useSelector((store) => store.plan.edges);
    const id_apis_plan = useSelector((store) => store.plan.id_apis);
    const node_config_plan = useSelector((store) => store.plan.node_config);
    const open_scene_plan = useSelector((store) => store.plan.open_plan_scene);
    const init_scene_plan = useSelector((store) => store.plan.init_scene);
    const to_loading_plan = useSelector((store) => store.plan.to_loading);
    const run_res_plan = useSelector((store) => store.plan.run_res);
    const run_status_plan = useSelector((store) => store.plan.run_status);

    const nodes_auto_plan = useSelector((store) => store.auto_plan.nodes);
    const edges_auto_plan = useSelector((store) => store.auto_plan.edges);
    const id_apis_auto_plan = useSelector((store) => store.auto_plan.id_apis);
    const node_config_auto_plan = useSelector((store) => store.auto_plan.node_config);
    const open_scene_auto_plan = useSelector((store) => store.auto_plan.open_plan_scene);
    const init_scene_auto_plan = useSelector((store) => store.auto_plan.init_scene);
    const to_loading_auto_plan = useSelector((store) => store.auto_plan.to_loading);
    const run_res_auto_plan = useSelector((store) => store.auto_plan.run_res);
    const run_status_auto_plan = useSelector((store) => store.auto_plan.run_status);

    const nodes_list = {
        'scene': nodes_scene,
        'plan': nodes_plan,
        'auto_plan': nodes_auto_plan,
        'case': nodes_case
    }
    const nodes = nodes_list[from];
    const edges_list = {
        'scene': edges_scene,
        'plan': edges_plan,
        'auto_plan': edges_auto_plan,
        'case': edges_case
    }
    const edges = edges_list[from];
    const id_apis_list = {
        'scene': id_apis_scene,
        'plan': id_apis_plan,
        'auto_plan': id_apis_auto_plan,
        'case': id_apis_case
    }
    const id_apis = id_apis_list[from];
    const node_config_list = {
        'scene': node_config_scene,
        'plan': node_config_plan,
        'auto_plan': node_config_auto_plan,
        'case': node_config_case
    }
    const node_config = node_config_list[from];
    const open_scene_list = {
        'scene': open_scene_scene,
        'plan': open_scene_plan,
        'auto_plan': open_scene_auto_plan,
        'case': open_scene_case
    }
    const open_scene = open_scene_list[from];
    console.log(open_scene_scene, open_scene_plan, open_scene_auto_plan, open_scene_case, from);
    const init_scene_list = {
        'scene': init_scene_scene,
        'plan': init_scene_plan,
        'auto_plan': init_scene_auto_plan,
        'case': init_scene_case
    }
    const init_scene = init_scene_list[from];

    const to_loading = from === 'scene' ? to_loading_scene : to_loading_plan;
    // const run_res = from === 'scene' ? (run_res_scene ? run_res_scene[open_scene.scene_id] : {}) : (run_res_plan ? run_res_plan[open_scene.scene_id] : {});
    const run_status_list = {
        'scene': run_status_scene,
        'plan': run_status_plan,
        'auto_plan': run_status_auto_plan,
        'case': run_status_case
    }
    const run_status = run_status_list[from];

    useEffect(() => {
        if (from === 'scene') {
            dispatch({
                type: 'scene/updateToLoading',
                payload: false,
            })
            dispatch({
                type: 'scene/updateSuccessEdge',
                payload: [],
            });
            dispatch({
                type: 'scene/updateFailedEdge',
                payload: [],
            });
        } else if (from === 'plan') {
            dispatch({
                type: 'plan/updateToLoading',
                payload: false,
            })
            dispatch({
                type: 'plan/updateSuccessEdge',
                payload: [],
            });
            dispatch({
                type: 'plan/updateFailedEdge',
                payload: [],
            });
            // dispatch({
            //     type: 'plan/updateType',
            //     payload: [],
            // })
        } else if (from === 'auto_plan') {
            dispatch({
                type: 'auto_plan/updateToLoading',
                payload: false,
            })
            dispatch({
                type: 'auto_plan/updateSuccessEdge',
                payload: [],
            });
            dispatch({
                type: 'auto_plan/updateFailedEdge',
                payload: [],
            });
        } else if (from === 'case') {
            dispatch({
                type: 'case/updateToLoading',
                payload: false,
            })
            dispatch({
                type: 'case/updateSuccessEdge',
                payload: [],
            });
            dispatch({
                type: 'case/updateFailedEdge',
                payload: [],
            });
        }
    }, []);

    const scene_name = useSelector((store) => store.scene.open_scene_name);
    const scene_desc = useSelector((store) => store.scene.open_scene_desc);

    const plan_scene_name = useSelector((store) => store.plan.open_scene_name);
    const plan_scene_desc = useSelector((store) => store.plan.open_scene_desc);

    const open_scene_name = from === 'plan' ? plan_scene_name : scene_name;
    const open_scene_desc = from === 'plan' ? plan_scene_desc : scene_desc;


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
                payload: scene_id,
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
                payload: scene_id,
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
                payload: scene_id,
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
                payload: scene_id,
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
        const _callback = () => {
            if (from === 'case') {
                Bus.$emit('runCase');
            } else {
                Bus.$emit('runScene', scene_id ? scene_id : target_id, nodes.length, from);
            }
        }
        saveScene(_callback);
    };


    useEffect(() => {
        return () => {
            // saveScene();
        }
    }, [nodes, edges, node_config, id_apis, open_scene])


    const saveScene = (callback) => {
        if (from === 'scene') {
            dispatch({
                type: 'scene/updateIsChanged',
                payload: false
            })
            Bus.$emit('saveScene', callback);
        } else if (from === 'plan') {
            dispatch({
                type: 'plan/updateIsChanged',
                payload: false
            })
            Bus.$emit('saveScenePlan', nodes, edges, id_apis, node_config, open_scene, id, 'plan', callback);
        } else if (from === 'auto_plan') {
            dispatch({
                type: 'auto_plan/updateIsChanged',
                payload: false
            })
            Bus.$emit('saveSceneAutoPlan', nodes, edges, id_apis, node_config, open_scene, id, callback);
        } else if (from === 'case') {
            dispatch({
                type: 'case/updateIsChanged',
                payload: false
            })
            const open_scene = open === 'auto_plan' ? open_scene_auto_plan : open_scene_scene;
            Bus.$emit('saveCase', callback);
        }
    };

    const formatData = (a, b) => {
        let result = [];
        let root = [];
        a.forEach(item => {
            if (b.findIndex(elem => elem.target === item.id) === -1) {
                root.push(item);
            }
        })
        result.push(root);

        const findValue = (id) => {
            return a.find(item => item.id === id);
        }

        let loop = (result, arr) => {
            let res = [];
            arr.forEach(item => {
                let data = b.filter(elem => elem.source === item.id).map(elem1 => {
                    result.forEach(item => {
                        let _index = item.findIndex(elem2 => elem2.id === elem1.target);
                        if (_index !== -1) {
                            item.splice(_index, 1);
                        }
                    })
                    return { ...findValue(elem1.target) }
                });
                res.push(...data);
            })

            if (res.length > 0) {
                result.push(res);
                return loop(result, res);
            } else {
                return result;
            }
        }

        return loop(result, root);
    };

    const toBeautify = () => {
        if (nodes.length === 0) {
            return;
        }
        const result = formatData(nodes, edges);
        result.forEach((item, index) => {
            // const rootY = item[0].position.y;
            let Y = 50 + (index) * 220;

            item.forEach(elem => {
                elem.position.y = Y;
                elem.positionAbsolute.y = Y;
            })
        })

        let _result = [];
        result.forEach(item => {
            item.forEach(elem => {
                _result.push(elem);
            })
        });
        if (from === 'scene') {
            dispatch({
                type: 'scene/updateNodes',
                payload: _result
            });
            dispatch({
                type: 'scene/updateBeautify',
                payload: true
            })
            dispatch({
                type: 'scene/updateIsChanged',
                payload: true
            })
        } else if (from === 'plan') {
            dispatch({
                type: 'plan/updateNodes',
                payload: _result
            });
            dispatch({
                type: 'plan/updateBeautify',
                payload: true
            })
            dispatch({
                type: 'plan/updateIsChanged',
                payload: true
            })
        } else if (from === 'auto_plan') {
            dispatch({
                type: 'auto_plan/updateNodes',
                payload: _result
            });
            dispatch({
                type: 'auto_plan/updateBeautify',
                payload: true
            })
            dispatch({
                type: 'auto_plan/updateIsChanged',
                payload: true
            })
        } else if (from === 'case') {
            dispatch({
                type: 'case/updateNodes',
                payload: _result
            });
            dispatch({
                type: 'case/updateBeautify',
                payload: true
            })
            dispatch({
                type: 'case/updateIsChanged',
                payload: true
            })
        }

    };

    const initScene = () => {
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
    }

    const open_case = useSelector((store) => store.case.open_case);
    const show_case = useSelector((store) => store.case.show_case);
    const open_case_name = useSelector((store) => store.case.open_case_name);
    const open_case_desc = useSelector((store) => store.case.open_case_desc);

    return (
        <div className='scene-header'>
            <div className='scene-header-left'>
                <Tooltip color='var(--select-hover)' content={show_case && Object.entries(open_case || {}).length > 0 ? open_case_name : open_scene_name}>
                    <p className='name'>{show_case && Object.entries(open_case || {}).length > 0 ? open_case_name : open_scene_name}</p>
                </Tooltip>
                {
                    show_case && Object.entries(open_case || {}).length > 0 ?
                        open_case_desc ? <Tooltip color='var(--select-hover)'  content={open_case_desc}>
                            {
                                open_case_desc ? <p className='desc' style={{ maxWidth: from === 'plan' ? '16.66rem' : '51.25rem' }}>
                                    {open_case_desc ? <span>{t('case.caseDesc')}：</span> : ''}
                                    {open_case_desc}
                                </p> : ''
                            }
                        </Tooltip>
                            : <>
                                {
                                    open_case_desc ? <p className='desc' style={{ maxWidth: from === 'plan' ? '16.66rem'  : '51.25rem' }}>
                                        {open_case_desc ? <span>{t('case.caseDesc')}：</span> : ''}
                                        {open_case_desc}
                                    </p> : ''
                                }
                            </>
                        : open_scene_desc ? <Tooltip color='var(--select-hover)'  content={open_scene_desc}>
                            {
                                open_scene_desc ? <p className='desc' style={{ maxWidth: from === 'plan' ? '16.66rem'  : '51.25rem' }}>
                                    {open_scene_desc ? <span>{t('scene.sceneDesc')}：</span> : ''}
                                    {open_scene_desc}
                                </p> : ''
                            }
                        </Tooltip>
                            : <>
                                {
                                    open_scene_desc ? <p className='desc' style={{ maxWidth: from === 'plan' ? '16.66rem'  : '51.25rem' }}>
                                        {open_scene_desc ? <span>{t('scene.sceneDesc')}：</span> : ''}
                                        {open_scene_desc}
                                    </p> : ''
                                }
                            </>
                }
            </div>
            <div className='scene-header-right'>
                {
                    !(show_case && Object.entries(open_case || {}).length > 0) && <div className='config' onClick={() => setSceneConfig(true)}>
                        <SvgSetting />
                        <span>{t('scene.sceneConfig')}</span>
                    </div>
                }
                {/* <Button className='saveBtn' onClick={() => initScene()}>初始化调试结果</Button> */}
                {/* <Button className='saveBtn' onClick={() => toBeautify()}>{t('btn.toBeautify')}</Button> */}
                <Button className='saveBtn' disabled={run_status === 'running'} preFix={<SvgSave />} onClick={() => saveScene(() => {
                    Message('success', t('message.saveSuccess'));
                })}>{t('btn.save')}</Button>
                {
                    run_status === 'running'
                        ? <Button className='stopBtn' preFix={<SvgStop />} onClick={() => {
                            if (from === 'case') {
                                Bus.$emit('stopCase', () => {
                                    Message('success', t('message.stopSuccess'));
                                })
                            } else {
                                console.log(open_scene, open_scene, open_scene);
                                Bus.$emit('stopScene', open_scene.scene_id ? open_scene.scene_id : open_scene.target_id, from, () => {
                                    Message('success', t('message.stopSuccess'));
                                })
                            }
                        }}>{t('btn.stopRun')}</Button>
                        : <Button className='runBtn' disabled={run_status === 'running'} preFix={<SvgCaretRight />} onClick={() => runScene()}>{from === 'scene' ? t('btn.run') : (from === 'case' ? t('case.runCase') : t('btn.runScene'))}</Button>
                }
            </div>
            {showSceneConfig && <SceneConfig from={from} onCancel={() => setSceneConfig(false)} />}
        </div>
    )
};

export default SceneHeader;