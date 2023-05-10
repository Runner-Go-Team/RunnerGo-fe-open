import React, { useEffect, useState } from 'react';
import { Button, Tree, Modal, Message } from 'adesign-react';
import {
    More as SvgMore,
    Apis as SvgApis,
    Folder as SvgFolder,
    WS as SvgWebSocket,
    Doc as SvgDoc,
} from 'adesign-react/icons';
import GrpcSvg from '@assets/grpc/grpc.svg';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector, useDispatch } from 'react-redux';
import Bus, { useEventBus } from '@utils/eventBus';
import { cloneDeep, isArray, isPlainObject, isString, isUndefined } from 'lodash';
import { setWorkspaceCurrent, getWorkspaceCurrent } from '@rxUtils/user/workspace';
import DragNode from './dragNode';
import { MenuTreeNode } from './style';
import useNodeSort from './hooks/useNodeSort';
import { handleShowContextMenu } from './contextMenu';
import Example from './example';
import MenuStatus from './menuStatus';
import './index.less';
import cn from 'classnames';
import SvgScene from '@assets/icons/Scene1';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NodeType = {
    api: SvgApis,
    scene: SvgScene,
    doc: SvgDoc,
    websocket: SvgWebSocket,
    folder: SvgFolder,
    grpc: GrpcSvg,
    group: SvgFolder,
};


const MenuTrees = (props, treeRef) => {
    const {
        selectedKeys,
        setSelectedKeys,
        filteredTreeList,
        filteredTreeData,
        getSelfNodeAndChildKeys,
        selectedNewTreeData,
        type,
        getSceneName
    } = props;
    const dispatch = useDispatch();
    const apiData = useSelector((d) => d.apis.apiDatas);
    const sceneData = useSelector((d) => d.scene.sceneDatas);
    const id_apis_scene = useSelector((d) => d.scene.id_apis);
    const id_apis_plan = useSelector((d) => d.plan.id_apis);
    const id_apis_auto_plan = useSelector((d) => d.auto_plan.id_apis);
    const node_config_scene = useSelector((d) => d.scene.node_config);
    const node_config_plan = useSelector((d) => d.plan.node_config);
    const node_config_auto_plan = useSelector((d) => d.auto_plan.node_config);
    const open_scene_scene = useSelector((d) => d.scene.open_scene);
    const open_plan_scene = useSelector((d) => d.plan.open_plan_scene);
    const auto_plan_scene = useSelector((d) => d.auto_plan.open_plan_scene);

    const open_list = {
        'scene': open_scene_scene,
        'plan': open_plan_scene,
        'auto_plan': auto_plan_scene
    }

    const open_scene = open_list[type];

    const planData = useSelector((d) => d.plan.planMenu);
    const autoPlanData = useSelector((d) => d.auto_plan.planMenu);
    const treeDataList = {
        'apis': apiData,
        'scene': sceneData,
        'plan': planData,
        'auto_plan': autoPlanData
    }
    const treeData = treeDataList[type];

    const CURRENT_TARGET_ID = useSelector((store) => store?.workspace?.CURRENT_TARGET_ID);
    const CURRENT_PROJECT_ID = useSelector((store) => store?.workspace?.CURRENT_PROJECT_ID);
    const open_api_now = useSelector((store) => store.opens.open_api_now);
    const saveId = useSelector((store) => store.opens.saveId);
    const [defaultExpandKeys, setDefaultExpandKeys] = useState([]);
    const uuid = localStorage.getItem('uuid');

    const nodes_plan = useSelector((store) => store.plan.nodes);
    const edges_plan = useSelector((store) => store.plan.edges);

    const nodes_auto_plan = useSelector((store) => store.auto_plan.nodes);
    const edges_auto_plan = useSelector((store) => store.auto_plan.edges);

    const open_first_plan = useSelector((store) => store.plan.open_first);
    const open_first_auto_plan = useSelector((store) => store.auto_plan.open_first);

    const open_first_list = {
        'plan': open_first_plan,
        'auto_plan': open_first_auto_plan
    };

    const open_first = open_first_list[type];



    const running_scene_scene = useSelector((store) => store.scene.running_scene);
    const running_scene_plan = useSelector((store) => store.plan.running_scene);
    const running_scene_auto_plan = useSelector((store) => store.auto_plan.running_scene);
    const running_scene_case = useSelector((store) => store.case.running_scene);

    const running_scene_list = {
        'scene': running_scene_scene,
        'plan': running_scene_plan,
        'auto_plan': running_scene_auto_plan,
        'case': running_scene_case
    };

    const running_scene = running_scene_list[type];
    const { id } = useParams();


    const [markObj, setMarkObj] = useState([]);
    const { t } = useTranslation();

    const api = [
        // {
        //     type: 'shareApi',
        //     title: '分享接口',
        //     action: 'shareApi',
        // },
        // {
        //     type: 'cloneApi',
        //     title: '克隆接口',
        //     action: 'cloneApi',
        //     tips: `${ctrl} + D`,
        // },
        {
            type: 'cloneApi',
            title: t('apis.cloneApi'),
            action: 'cloneApi',
            // tips: `${ctrl} + C`,
        },
        // {
        //     type: 'copyApi',
        //     title: t('apis.copyApi'),
        //     action: 'copyApi'
        // },
        {
            type: 'deleteApi',
            title: t('apis.deleteApi'),
            action: 'deleteApi',
        },
    ];

    const folder = [
        // {
        //     type: 'create',
        //     title: '新建',
        //     action: '',
        // },
        // {
        //     type: 'pasteToCurrent',
        //     title: '粘贴至该目录',
        //     action: 'pasteToCurrent',
        //     // tips: `${ctrl} + V`,
        // },
        {
            type: 'createApi',
            title: t('apis.createApi'),
            action: 'createApi'
        },
        {
            type: 'modifyFolder',
            title: t('apis.editFolder'),
            action: 'modifyFolder',
        },
        // {
        //     type: 'shareFolder',
        //     title: '分享目录',
        //     action: 'shareFolder',
        // },
        // {
        //     type: 'copyFolder',
        //     title: '复制目录',
        //     action: 'copyFolder',
        //     // tips: `${ctrl} + C`,
        // },
        {
            type: 'deleteFolder',
            title: t('apis.deleteFolder'),
            action: 'deleteFolder',
        },
    ];

    const group = [
        {
            type: 'modifyFolder',
            title: t('scene.editGroup'),
            action: 'modifyFolder',
        },
        // {
        //     type: 'cloneGroup',
        //     title: '克隆目录',
        //     action: 'cloneGroup',
        // },
        {
            type: 'deleteFolder',
            title: t('scene.deleteGroup'),
            action: 'deleteFolder',
        },
    ];

    const scene = [
        {
            type: 'modifyFolder',
            title: t('scene.editScene'),
            action: 'modifyFolder',
        },
        {
            type: 'cloneScene',
            title: t('scene.cloneScene'),
            action: 'cloneScene',
        },
        {
            type: 'deleteFolder',
            title: t('scene.deleteScene'),
            action: 'deleteFolder',
        },
    ];

    const root = [
        {
            type: 'createApis',
            title: t('apis.createApi'),
            action: 'createApis',
        },
        // {
        //     type: 'pasteToRoot',
        //     title: t('apis.pasteApi'),
        //     action: 'pasteToRoot',
        // },
    ];


    const statusListInit = async () => {
        // const currentProjectInfo = await UserProjects.get(`${CURRENT_PROJECT_ID}/${uuid}`);
        // const markList = currentProjectInfo?.details?.markList || [];
        const markList = [];
        const obj = {};
        isArray(markList) &&
            markList.forEach((m) => {
                obj[m.key] = m;
            });
        setMarkObj(obj);
    };

    useEffect(() => {
        // if (type === 'plan') {
        //     const plan_open_group = JSON.parse(localStorage.getItem('plan_open_group') || '[]');
        //     setDefaultExpandKeys(plan_open_group);
        // }

        return () => {
            dispatch({
                type: 'case/updateIsChanged',
                payload: false
            })
        }
    }, []);

    useEventBus('statusListInit', statusListInit, [CURRENT_PROJECT_ID]);

    const methodDic = {
        OPTIONS: 'OPT',
        DELETE: 'DEL',
        PROPFIND: 'PROP',
        UNLOCK: 'UNLCK',
        UNLINK: 'UNLNK',
    };
    const renderPreText = (item) => {
        let result = '';
        switch (item?.target_type) {
            case 'api':
                if (!isUndefined(item?.method)) result = item?.method;
                break;
            case 'doc':
                result = '文本';
                break;
            case 'folder':
                result = '目录';
                break;
            case 'websocket':
                result = 'WS';
                break;
            case 'grpc':
                result = 'GRPC';
                break;
            default:
                break;
        }
        return typeof methodDic[result] === 'string' ? methodDic[result] : result;
    };

    const getTargetMethodClassName = (item) => {
        let className = '';
        switch (item.target_type) {
            case 'websocket':
                className = 'method ws';
                break;
            case 'grpc':
                className = 'method grpc';
                break;
            case 'api':
                className = `method ${item.method.toLowerCase()}`;
                break;
            case 'doc':
                className = 'method doc';
                break;
            default:
                break;
        }

        return className;
    };

    useEffect(() => {
        if (isString(CURRENT_TARGET_ID) && CURRENT_TARGET_ID.length > 0) {
            setSelectedKeys([CURRENT_TARGET_ID]);
        } else {
            setSelectedKeys([]);
        }
    }, [CURRENT_TARGET_ID]);

    useEffect(() => {
        getWorkspaceCurrent(uuid, `${CURRENT_PROJECT_ID}.CURRENT_EXPAND_KEYS`).then((expandKeys) => {
            if (Array.isArray(expandKeys)) {
                setDefaultExpandKeys(expandKeys);
            }
        });
        statusListInit();
    }, [CURRENT_PROJECT_ID]);

    const { handleNodeDragEnd } = useNodeSort({ treeData, type, id });

    const renderIcon = (icon) => {
        const NodeIcon = NodeType?.[icon];
        if (isUndefined(NodeIcon)) {
            return '';
        }
        if (icon === 'grpc') {
            return <NodeIcon viewBox="0 0 24 24" width={12} height={12} style={{ marginLeft: 5 }} />;
        }
        return <NodeIcon width={12} style={{ marginLeft: 5 }} />;
    };

    const renderPrefix = (treeNode) => {
        if (treeNode.target_type !== 'api') {
            return null;
        }
        return <span className={getTargetMethodClassName(treeNode)}>{renderPreText(treeNode)}</span>;
    };

    const handleExpandsChange = (keys) => {
        if (type === 'plan') {
            localStorage.setItem('plan_open_group', JSON.stringify(keys));
            setDefaultExpandKeys(keys);
        }
        setWorkspaceCurrent(uuid, `${CURRENT_PROJECT_ID}.CURRENT_EXPAND_KEYS`, keys);
    };

    useEffect(() => {
        if (filteredTreeList && filteredTreeList.length > 0 && open_first && (type === 'plan' || type === 'auto_plan')) {
            const scene_data = filteredTreeList.filter(item => item.target_type === 'scene');

            if (scene_data && scene_data.length > 0) {
                if (type === 'plan') {
                    dispatch({
                        type: 'plan/updateOpenFirst',
                        payload: false
                    })
                    dispatch({
                        type: 'plan/updateOpenName',
                        payload: scene_data[0].name,
                    })
                    dispatch({
                        type: 'plan/updateOpenDesc',
                        payload: scene_data[0].description
                    })
                    Bus.$emit('addOpenPlanScene', scene_data[0], id_apis_plan, node_config_plan);
                } else if (type === 'auto_plan') {
                    dispatch({
                        type: 'auto_plan/updateOpenFirst',
                        payload: false
                    })
                    dispatch({
                        type: 'scene/updateOpenName',
                        payload: scene_data[0].name,
                    })
                    dispatch({
                        type: 'scene/updateOpenDesc',
                        payload: scene_data[0].description
                    })
                    Bus.$emit('addOpenAutoPlanScene', scene_data[0]);
                    dispatch({
                        type: 'auto_plan/updateOpenInfo',
                        payload: scene_data[0]
                    })
                }
            }
        }
    }, [filteredTreeList, open_first]);

    const renderTreeNode = (nodeItem, { indent, nodeTitle }) => {
        return (
            <MenuTreeNode>
                <DragNode
                    index={nodeItem.nodeIndex}
                    nodeKey={nodeItem.nodeKey}
                    key={nodeItem.nodeKey}
                    moved={handleNodeDragEnd}
                >
                    <div className={cn('tree-node-inner', { 'tree-node-inner-selected': type === 'apis' ? `${nodeItem.nodeKey}` === `${open_api_now}` : `${nodeItem.nodeKey}` === `${open_scene ? open_scene.scene_id || open_scene.target_id : ''}` })}>
                        {indent}
                        {renderIcon(nodeItem.target_type)}
                        {renderPrefix(nodeItem)}
                        {nodeTitle}
                        {/* {nodeItem?.mark !== 'developing' && (
                            <MenuStatus value={nodeItem} markObj={markObj}></MenuStatus>
                        )} */}
                        {/* {nodeItem?.is_example > 0 && <Example value={nodeItem}></Example>} */}
                        <Button
                            className="btn-more"
                            size="mini"
                            onClick={(e) => {
                                handleShowContextMenu(
                                    {
                                        ...props,
                                        project_id: CURRENT_PROJECT_ID,
                                        open_scene,
                                        from: type,
                                        plan_id: id,
                                        running_scene,
                                        menu: {
                                            api,
                                            folder,
                                            scene,
                                            group,
                                            root
                                        }
                                    },
                                    e,
                                    nodeItem.data,
                                );
                            }}
                        >
                            <SvgMore width="12px" height="12px" />
                        </Button>
                    </div>
                </DragNode>
            </MenuTreeNode>
        );
    };

    const handleMultiSelect = (data) => {
        const { target_id, target_type } = data;
        // 非目录节点只对当前节点有效
        let keyList = [];
        if (target_type !== 'folder') {
            if (selectedKeys.includes(target_id)) {
                keyList = selectedKeys.filter((d) => d !== target_id) || [];
            } else {
                keyList = [...selectedKeys, target_id];
            }
        } else {
            const childKeys = getSelfNodeAndChildKeys(filteredTreeData, target_id);
            const isSelected = selectedKeys.includes(target_id);
            if (isSelected) {
                keyList = selectedKeys.filter((item) => childKeys.includes(item) === false);
            } else {
                keyList = [...selectedKeys, ...childKeys];
            }
        }

        const rootList = Object.values(filteredTreeData)?.filter((item) => item.parent_id === '0');
        const newList = [];
        const digFindAll = (childList) => {
            childList && childList.sort((pre, after) => pre.sort - after.sort);
            for (const sItem of childList) {
                if (keyList.includes(sItem.target_id)) {
                    newList.push(sItem.target_id);
                }
                if (sItem.target_type === 'folder' && Array.isArray(sItem?.children)) {
                    digFindAll(sItem.children);
                }
            }
        };
        digFindAll(rootList);
        setSelectedKeys(newList);
    };

    const [checkKeys, setCheckKeys] = useState(["261"]);

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
        dispatch({
            type: 'case/updateOpenCase',
            payload: null
        })
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <Tree
                ref={treeRef}
                defaultExpandKeys={checkKeys}
                onRightClick={handleShowContextMenu.bind(null, {
                    ...props,
                    project_id: CURRENT_PROJECT_ID,
                    open_scene,
                    from: type,
                    plan_id: id,
                    running_scene,
                    menu: {
                        api,
                        folder,
                        scene,
                        group,
                        root
                    }
                })}
                // defaultExpandKeys={defaultExpandKeys}
                onExpandKeysChange={handleExpandsChange}
                onMultiSelect={handleMultiSelect}
                onOutSideClick={setSelectedKeys ? setSelectedKeys.bind(null, []) : () => { }}
                nodeSort={(pre, after) => pre.sort - after.sort}
                selectedKeys={selectedKeys}
                className="menu-tree"
                showLine
                fieldNames={{
                    key: 'target_id',
                    title: 'name',
                    parent: 'parent_id',
                }}
                enableVirtualList
                dataList={filteredTreeList}
                render={renderTreeNode}
                onNodeClick={(val) => {
                    const { target_id } = val;
                    let index = checkKeys.findIndex((item) => item === target_id);
                    let _checkKeys = cloneDeep(checkKeys);
                    if (index === -1) {
                        _checkKeys.push(target_id);
                        setCheckKeys[_checkKeys]
                    } else {
                        _checkKeys.splice(index, 1);
                        setCheckKeys(_checkKeys)
                    }

                    if (type !== 'apis' && val.target_type !== 'group') {

                    }
                    if (val?.target_type == 'folder' || val.target_type === 'group') {

                    } else {
                        if (type === 'apis') {
                            Bus.$emit('addOpenItem', { id: val.target_id });
                        } else if (type === 'scene') {
                            if (open_scene_scene && (open_scene_scene.target_id || open_scene_scene.scene_id) === val.target_id) {
                                return;
                            }

                            clearCase();
                            Bus.$emit('clearFetchSceneState');
                            Bus.$emit('clearFetchCaseState');
                            localStorage.setItem('open_scene', JSON.stringify(val));
                            Bus.$emit('addOpenScene', val);
                            dispatch({
                                type: 'scene/updateOpenInfo',
                                payload: val
                            })
                            dispatch({
                                type: 'scene/updateIsChanged',
                                payload: false
                            })
                            dispatch({
                                type: 'scene/updateOpenName',
                                payload: val.name,
                            })
                            dispatch({
                                type: 'scene/updateOpenDesc',
                                payload: val.description
                            })


                        } else if (type === 'plan') {
                            if (open_plan_scene && (open_plan_scene.target_id || open_plan_scene.scene_id) === val.target_id) {
                                return;
                            }

                            Bus.$emit('clearFetchSceneState');
                            Bus.$emit('addOpenPlanScene', val, id_apis_plan, node_config_plan);
                            dispatch({
                                type: 'plan/updateIsChanged',
                                payload: false
                            })
                            dispatch({
                                type: 'plan/updateOpenName',
                                payload: val.name,
                            })
                            dispatch({
                                type: 'plan/updateOpenDesc',
                                payload: val.description
                            })
                        } else if (type === 'auto_plan') {
                            if (auto_plan_scene && (auto_plan_scene.target_id || auto_plan_scene.scene_id) === val.target_id) {
                                return;
                            }

                            Bus.$emit('clearFetchSceneState');
                            Bus.$emit('clearFetchCaseState');
                            Bus.$emit('addOpenAutoPlanScene', val);
                            dispatch({
                                type: 'auto_plan/updateOpenInfo',
                                payload: val
                            })
                            dispatch({
                                type: 'auto_plan/updateIsChanged',
                                payload: false
                            })
                            dispatch({
                                type: 'scene/updateOpenName',
                                payload: val.name,
                            })
                            dispatch({
                                type: 'scene/updateOpenDesc',
                                payload: val.description
                            })


                        }
                    }
                }}
                rootFilter={(item) => item.parent_id === '0'}
            />
        </DndProvider>
    );
};

export default React.forwardRef(MenuTrees);