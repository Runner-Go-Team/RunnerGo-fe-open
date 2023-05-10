import React, { useState, useEffect } from 'react';
import { Apis as SvgApis, Add as SvgAdd, Download as SvgDownload } from 'adesign-react/icons';
import './index.less';
import Bus from '@utils/eventBus';
import { Message } from 'adesign-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SvgTools from '@assets/icons/gongjuxiang';
import SvgScreen from '@assets/icons/full_screen';
import SvgBeautify from '@assets/icons/beautify';
import dagre from 'dagre';
import { IconMenuFold, IconMenuUnfold } from '@arco-design/web-react/icon';


const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));


const nodeWidth = 220;
const nodeHeight = 143;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    })

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    })

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWidthPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? 'left' : 'top';
        node.sourcePosition = isHorizontal ? 'right' : 'bottom';

        node.position = {
            x: nodeWidthPosition.x - nodeWidth / 2,
            y: nodeWidthPosition.y - nodeHeight / 2
        };

        return node;
    })

    return { nodes, edges }
}


const FooterConfig = (props) => {
    const { onChange, from = 'scene', fullScreenChange, full } = props;
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
    const nodes = nodes_list[from];

    const scene_edges = useSelector((store) => store.scene.edges);
    const plan_edges = useSelector((store) => store.plan.edges);
    const auto_plan_edges = useSelector((store) => store.auto_plan.edges);
    const case_edges = useSelector((store) => store.case.edges);

    const edges_list = {
        'scene': scene_edges,
        'plan': plan_edges,
        'auto_plan': auto_plan_edges,
        'case': case_edges
    }
    const edges = edges_list[from];




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

    const [showContent, setShowContent] = useState(true);

    const toBeautify = () => {
        if (nodes.length === 0) {
            return;
        }

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            nodes,
            edges,
        );

        const newNodes = [...layoutedNodes];
        const newEdges = [...layoutedEdges];

        if (from === 'scene') {
            dispatch({
                type: 'scene/updateNodes',
                payload: newNodes
            });
            dispatch({
                type: 'scene/updateEdges',
                payload: newEdges
            });
            dispatch({
                type: 'scene/updateBeautify',
                payload: true
            })
        } else if (from === 'plan') {
            dispatch({
                type: 'plan/updateNodes',
                payload: newNodes
            });
            dispatch({
                type: 'plan/updateEdges',
                payload: newEdges
            });
            dispatch({
                type: 'plan/updateBeautify',
                payload: true
            })
        } else if (from === 'auto_plan') {
            dispatch({
                type: 'auto_plan/updateNodes',
                payload: newNodes
            });
            dispatch({
                type: 'auto_plan/updateEdges',
                payload: newEdges
            });
            dispatch({
                type: 'auto_plan/updateBeautify',
                payload: true
            })
        } else if (from === 'case') {
            dispatch({
                type: 'case/updateNodes',
                payload: newNodes
            });
            dispatch({
                type: 'case/updateEdges',
                payload: newEdges
            });
            dispatch({
                type: 'case/updateBeautify',
                payload: true
            })
        }

    };

    return (
        <div 
            className='footer-config'
        >
            {
                showContent ? <>
                    {showControl && <div className='add-controller'>
                        <div className='wait' onClick={() => {
                            if (run_status === 'running') {
                                Message('error', t('message.runningSceneCanNotHandle'));
                                return;
                            }

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
                            if (run_status === 'running') {
                                Message('error', t('message.runningSceneCanNotHandle'));
                                return;
                            }

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
                    <div className='common-config'>
                        <div className='config-item'>
                            <IconMenuUnfold onClick={() => setShowContent(false)} />
                        </div>
                        <div className='config-item' onClick={() => {
                            if (run_status === 'running') {
                                Message('error', t('message.runningSceneCanNotHandle'));
                                return;
                            }

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
                        <div className='config-item' onClick={() => {
                            if (run_status === 'running') {
                                Message('error', t('message.runningSceneCanNotHandle'));
                                return;
                            }

                            setShowControl(!showControl);
                        }}>
                            <SvgAdd />
                            <span>{t('scene.createControl')}</span>
                        </div>
                        <div className='config-item' onClick={() => {
                            if (run_status === 'running') {
                                Message('error', t('message.runningSceneCanNotHandle'));
                                return;
                            }
                            initScene();

                            onChange('api', true);
                        }}>
                            <SvgDownload />
                            <span>{t('scene.importApi')}</span>
                        </div>
                        <div className='config-item' onClick={toBeautify}>
                            <SvgBeautify />
                            <span>{t('btn.toBeautify')}</span>
                        </div>
                        <div className='config-item' onClick={fullScreenChange}>
                            <SvgScreen />
                            <span>{ full ? t('scene.quitFullScreen') : t('scene.fullScreen') }</span>
                        </div>
                    </div>
                </> : <IconMenuFold className='default-tool-icon' onClick={() => setShowContent(true)} />
            }
        </div>
    )
};

export default FooterConfig;