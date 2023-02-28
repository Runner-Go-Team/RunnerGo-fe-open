import React, { useState, useEffect } from "react";
import {
    // Input,
    Select,
    Tabs as TabComponent,
    Modal,
    Switch,
    Table,
    Message,
    Button
} from 'adesign-react';
import { Delete as SvgDelete } from 'adesign-react/icons';
import Authen from "@components/Auth";
import ScriptBox from "@components/ScriptBox";
import ApiInput from "@components/ApiInput";
import { HEADERTYPELIST } from '@constants/typeList';
import Bus from '@utils/eventBus';
import { newDataItem, dataItem } from '@constants/dataItem';
import useFolders from '@hooks/useFolders';
import { isArray, cloneDeep, isPlainObject, isString, set, trim } from 'lodash';
import { findSon } from '@utils';
import DescChoice from '@components/descChoice';
import { FolderWrapper, FolderModal } from './style';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const { Tabs, TabPan } = TabComponent;
const Option = Select.Option;
// const Textarea = Input.Textarea;

import { Input } from '@arco-design/web-react';
const AcroTextarea = Input.TextArea;

const CreateScene = (props) => {
    const { onCancel, scene, from } = props;
    const { t } = useTranslation();

    const { id: plan_id } = useParams();
    const dispatch = useDispatch();
    const id_apis_scene = useSelector((store) => store.scene.id_apis);
    const id_apis_plan = useSelector((store) => store.plan.id_apis);
    const id_apis_auto_plan = useSelector((store) => store.auto_plan.id_apis);
    const node_config_scene = useSelector((store) => store.scene.node_config);
    const node_config_plan = useSelector((store) => store.plan.node_config);
    const node_config_auto_plan = useSelector((store) => store.auto_plan.node_config);

    const { apiFolders } = useFolders();
    const [script, setScript] = useState({
        pre_script: '',
        // pre_script_switch: 1,
        test: '',
        // test_switch: 1,
    });

    const [request, setRequest] = useState(
        scene?.request || {
            header: {
                parameter: []
            },
            query: {
                parameter: []
            },
            body: {
                parameter: []
            },
            auth: {
                type: 'noauth',
                kv: { key: '', value: '' },
                bearer: { key: '' },
                basic: { username: '', password: '' },
            },
            description: '',
        }
    );
    const [sceneName, setSceneName] = useState('');
    const [description, setDescription] = useState('');
    const [tabActiveId, setTabActiveId] = useState('0');
    const [parent_id, setParent_id] = useState(0);

    useEffect(() => {
        const init = () => {
            if (isPlainObject(scene)) {
                const { request, name, script: folderScript, parent_id, description } = scene;
                parent_id && setParent_id(parent_id);
                folderScript && setScript(folderScript);
                name && setSceneName(name);
                description && setDescription(description);
                request && setRequest(request);
            } else {
                setRequest({
                    header: [],
                    query: [],
                    body: [],
                    auth: {
                        type: 'noauth',
                        kv: { key: '', value: '' },
                        bearer: { key: '' },
                        basic: { username: '', password: '' },
                    },
                    description: '',
                });
            }
        };
        init();
    }, [scene]);

    const handleChange = (rowData, rowIndex, newVal) => {
        const requestKey = {
            '0': 'header',
            '1': 'query',
            '2': 'body',
        };
        const type = requestKey[tabActiveId];
        if (isArray(request[type].parameter)) {
            const newList = [...request[type].parameter];
            if (
                newVal.hasOwnProperty('key') ||
                newVal.hasOwnProperty('value') ||
                newVal.hasOwnProperty('description')
            ) {
                delete rowData.static;
            }
            newList[rowIndex] = {
                ...rowData,
                ...newVal,
            };
            setRequest((lastState) => {
                const newState = cloneDeep(lastState);
                newState[type].parameter = newList;
                return newState;
            });
        }
    };

    const handleTableDelete = (index) => {
        const requestKey = {
            '0': 'header',
            '1': 'query',
            '2': 'body',
        };
        const type = requestKey[tabActiveId];
        if (isArray(request[type])) {
            const newList = [...request[type]];
            if (newList.length > 0) {
                newList.splice(index, 1);
                setRequest((lastState) => {
                    const newState = cloneDeep(lastState);
                    newState[type] = newList;
                    return newState;
                });
            }
        }
    };

    const columns = [
        {
            title: '',
            width: 10,
            dataIndex: 'is_checked',
            render: (text, rowData, rowIndex) => (
                <Switch
                    size="small"
                    checked={text > 0}
                    onChange={(e) => {
                        handleChange(rowData, rowIndex, { is_checked: e ? '1' : '0' });
                    }}
                />
            ),
        },
        {
            title: '参数名',
            dataIndex: 'key',
            enableResize: true,
            width: 84,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        size="mini"
                        placeholder='参数名'
                        value={text}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { key: newVal });
                        }}
                    />
                );
            },
        },
        {
            title: '参数值',
            dataIndex: 'value',
            enableResize: true,
            width: 300,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        size="mini"
                        placeholder='参数值'
                        value={text}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { value: newVal });
                        }}
                    />
                );
            },
        },
        // {
        //     title: '必填',
        //     dataIndex: 'not_null',
        //     width: 55,
        //     render: (text, rowData, rowIndex) => {
        //         return (
        //             <Switch
        //                 size="small"
        //                 checked={text > 0}
        //                 onChange={(e) => {
        //                     handleChange(rowData, rowIndex, { not_null: e ? 1 : -1 });
        //                 }}
        //             />
        //         );
        //     },
        // },
        // {
        //     title: '类型',
        //     dataIndex: 'field_type',
        //     enableResize: false,
        //     width: 100,
        //     render: (text, rowData, rowIndex) => {
        //         return (
        //             <Select
        //                 value={HEADERTYPELIST.includes(rowData?.field_type) ? rowData?.field_type : 'String'}
        //                 onChange={(newVal) => {
        //                     handleChange(rowData, rowIndex, { field_type: newVal });
        //                 }}
        //             >
        //                 {HEADERTYPELIST.map((item) => (
        //                     <Option key={item} value={item}>
        //                         {item}
        //                     </Option>
        //                 ))}
        //             </Select>
        //         );
        //     },
        // },
        {
            title: '参数描述',
            dataIndex: 'description',
            width: 300,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        style={{ width: '300px' }}
                        size="mini"
                        placeholder='请输入参数描述'
                        value={text}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { description: newVal });
                        }}
                    />
                );
            },
        },
        // {
        //     title: '',
        //     width: 30,
        //     render: (text, rowData, rowIndex) => (
        //         <div>
        //             <DescChoice
        //                 onChange={(newVal) => {
        //                     handleChange(rowData, rowIndex, { description: newVal });
        //                 }}
        //                 filterKey={rowData?.key}
        //             ></DescChoice>
        //         </div>
        //     ),
        // },
        {
            title: '',
            width: 30,
            render: (text, rowData, rowIndex) => (
                <Button
                    onClick={() => {
                        handleTableDelete(rowIndex);
                    }}
                >
                    <SvgDelete style={{ width: 16, height: 16 }} />
                </Button>
            ),
        },
    ];

    const getTableList = (type) => {
        if (isArray(request[type]) && request[type].length > 0) {
            const hasStatic = request[type].some((item) => item.static);
            if (!hasStatic) {
                return [...request[type], { ...dataItem }];
            }
            return [...request[type]];
        }
        return [{ ...newDataItem }];
    };

    const tempPath = (type, extension) => {
        const path = {
            auth: 'auth', // 修改接口认证信息
            authType: 'auth.type', // 修改接口认证类型
            authValue: `auth.${extension}`, // 修改接口认证值
        };
        return path[type];
    };

    const folderSelect = () => {
        if (isPlainObject(scene)) {
            const res = [];
            res.push(scene);
            findSon(res, apiFolders, scene.target_id);
            const resObj = {};
            res.forEach((item) => {
                resObj[item.target_id] = item;
            });
            const newFolders = apiFolders.filter((item) => !resObj.hasOwnProperty(item?.target_id));
            return (
                <>
                    {newFolders.map((item) => (
                        <Option key={item?.target_id} value={item?.target_id}>
                            {`|${new Array(item.level).fill('—').join('')}${item.name}`}
                        </Option>
                    ))}
                </>
            );
        }
        return (
            <>
                {apiFolders.map((item) => (
                    <Option key={item?.target_id} value={item?.target_id}>
                        {`|${new Array(item.level).fill('—').join('')}${item.name}`}
                    </Option>
                ))}
            </>
        );
    };

    return (
        <Modal
            title={isPlainObject(scene) ? t('scene.editScene') : t('scene.createScene')}
            visible={true}
            onCancel={onCancel}
            className={FolderModal}
            okText={t('btn.save')}
            cancelText={t('btn.cancel')}
            onOk={() => {
                if (trim(sceneName).length <= 0) {
                    Message('error', t('message.SceneNameEmpty'));
                    return;
                }
                if (isPlainObject(scene)) {
                    Bus.$emit(
                        'updateSceneItem',
                        {
                            id: scene.target_id,
                            data: {
                                name: sceneName,
                                description,
                                request,
                                script,
                                parent_id,
                            },
                            from,
                            plan_id,
                            oldValue: scene
                        },
                        () => {
                            if (from === 'plan') {
                                dispatch({
                                    type: 'plan/updateOpenName',
                                    payload: sceneName,
                                })
                                dispatch({
                                    type: 'plan/updateOpenDesc',
                                    payload: description || ''
                                })
                            } else {
                                dispatch({
                                    type: 'scene/updateOpenName',
                                    payload: sceneName,
                                })
                                dispatch({
                                    type: 'scene/updateOpenDesc',
                                    payload: description || ''
                                })
                            }
                            onCancel();
                            Message('success', t('message.saveSuccess'));
                        }
                    );
                } else {
                    Bus.$emit(
                        'addSceneItem',
                        {
                            type: 'scene',
                            pid: parent_id || '0',
                            param: {
                                name: sceneName,
                                description,
                                request,
                                script,
                            },
                            from,
                            plan_id,
                        },
                        (code, data) => {
                            if (code === 0) {
                                Message('success', t('message.createSceneSuccess'));
                                if (from === 'plan') {
                                    dispatch({
                                        type: 'plan/updateOpenName',
                                        payload: data.target_name,
                                    })
                                    dispatch({
                                        type: 'plan/updateOpenDesc',
                                        payload: description || ''
                                    })
                                } else {
                                    dispatch({
                                        type: 'scene/updateOpenName',
                                        payload: data.target_name,
                                    })
                                    dispatch({
                                        type: 'scene/updateOpenDesc',
                                        payload: description || ''
                                    })
                                }
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
                                if (from === 'scene') {
                                    dispatch({
                                        type: 'scene/updateOpenInfo',
                                        payload: data
                                    })
                                    Bus.$emit('addOpenScene', data, id_apis_scene, node_config_scene);
                                } else if (from === 'plan') {
                                    Bus.$emit('addOpenPlanScene', data, id_apis_plan, node_config_plan);
                                } else if (from === 'auto_plan') {
                                    dispatch({
                                        type: 'auto_plan/updateOpenInfo',
                                        payload: data
                                    })
                                    Bus.$emit('addOpenAutoPlanScene', data, id_apis_auto_plan, node_config_auto_plan);
                                }
                                onCancel();
                            }
                        }
                    );
                }
            }}
        >
            <FolderWrapper>
                <div className="article">
                    <div className="article-item">
                        <p><span className="must-input">*</span> {t('scene.sceneName')}</p>
                        <Input maxLength={30} value={sceneName} placeholder={t('placeholder.sceneName')} onChange={(val) => setSceneName(val)} />
                    </div>
                    <div className="article-item">
                        <p>{t('scene.sceneDesc')}</p>
                        <AcroTextarea
                            value={description || ''}
                            placeholder={t('placeholder.sceneDesc')}
                            maxLength={50}
                            showWordLimit
                            onChange={(val) => {
                                setDescription(val);
                            }}
                        />
                    </div>
                </div>
            </FolderWrapper>

        </Modal>
    )
};

export default CreateScene;