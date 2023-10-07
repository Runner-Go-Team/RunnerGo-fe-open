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
import { useTranslation } from 'react-i18next';
import { fetchSaveCase } from '@services/case';
import { useSelector, useDispatch } from 'react-redux';
import { v4 } from 'uuid';

const { Tabs, TabPan } = TabComponent;
const Option = Select.Option;
// const Textarea = Input.Textarea;

import { Input } from '@arco-design/web-react';
const AcroTextarea = Input.TextArea;

const CreateCase = (props) => {
    const { onCancel, case: _case, from } = props;
    const { t } = useTranslation();

    const { id: plan_id  } = useParams();
    const dispatch = useDispatch();
    const refresh = useSelector((store) => store.case.refresh);
    const open_scene = useSelector((store) => store.scene.open_scene);
    const open_auto_scene = useSelector((store) => store.auto_plan.open_plan_scene);
    const open_list = {
        'scene': open_scene,
        'auto_plan': open_auto_scene
    }
    const open_data = open_list[from];

    const { apiFolders } = useFolders();
    const [script, setScript] = useState({
        pre_script: '',
        // pre_script_switch: 1,
        test: '',
        // test_switch: 1,
    });

    const [request, setRequest] = useState(
        _case?.request || {
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
    const [caseName, setCaseName] = useState('');
    const [description, setDescription] = useState('');
    const [tabActiveId, setTabActiveId] = useState('0');
    const [parent_id, setParent_id] = useState(0);

    useEffect(() => {
        const init = () => {
            if (isPlainObject(_case)) {
                const { request, case_name, script: folderScript, parent_id, description } = _case;
                parent_id && setParent_id(parent_id);
                folderScript && setScript(folderScript);
                case_name && setCaseName(case_name);
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
    }, [_case]);

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
        if (isPlainObject(_case)) {
            const res = [];
            res.push(_case);
            findSon(res, apiFolders, folder?.target_id);
            const resObj = {};
            res.forEach((item) => {
                resObj[item?.target_id] = item;
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
            title={isPlainObject(_case) ? t('case.editCase') : t('case.createCase')}
            visible={true}
            onCancel={onCancel}
            className={FolderModal}
            okText={ t('btn.save') }
            cancelText={ t('btn.cancel') }
            onOk={() => {
                if (trim(caseName).length <= 0) {
                    Message('error', t('message.caseNameEmpty'));
                    return;
                }
                let fromList = {
                    'scene': 1,
                    'auto_plan': 3,
                };
                if (isPlainObject(_case)) {
                    const params = {
                        case_id: _case.case_id,
                        team_id: sessionStorage.getItem('team_id'),
                        scene_id: open_data.scene_id ? open_data.scene_id : open_data.target_id,
                        name: caseName,
                        description,
                        sort: 1,
                        source: fromList[from],
                        version: 1,
                        plan_id,
                    };
                    fetchSaveCase(params).subscribe({
                        next: (res) => {
                            const { code } = res;
                            if (code === 0) {
                                Message('success', t('message.updateSuccess'));
                                onCancel();
                                dispatch({
                                    type: 'case/updateRefreshMenu',
                                    payload: !refresh
                                })
                                dispatch({
                                    type: 'case/updateCaseName',
                                    payload: caseName || '',
                                })
                                dispatch({
                                    type: 'case/updateCaseDesc',
                                    payload: description || ''
                                })
                            }
                        }
                    })
                } else {
                    const params = {
                        team_id: sessionStorage.getItem('team_id'),
                        scene_id: open_data.scene_id ? open_data.scene_id : open_data.target_id,
                        name: caseName,
                        description,
                        sort: 1,
                        source: fromList[from],
                        version: 1,
                        plan_id,
                        case_id: v4(),
                    };
                    fetchSaveCase(params).subscribe({
                        next: (res) => {
                            const { code, data } = res;
                            const { name: case_name, description, case_id } = data;
                            if (code === 0) {
                                Message('success', t('message.createSuccess'));
                                onCancel();
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
                                    type: 'case/updateCaseName',
                                    payload: case_name || '',
                                })
                                dispatch({
                                    type: 'case/updateCaseDesc',
                                    payload: description || ''
                                })
                                dispatch({
                                    type: 'case/updateOpenInfo',
                                    payload: data
                                })


                                dispatch({
                                    type: 'case/updateCaseName',
                                    payload: caseName || '',
                                })
                                dispatch({
                                    type: 'case/updateCaseDesc',
                                    payload: description || ''
                                })
                                dispatch({
                                    type: 'case/updateRefreshMenu',
                                    payload: !refresh
                                })
                                
                                Bus.$emit('addOpenCase', case_id);

                            }
                        }
                    })
                }
            }}
        >
            <FolderWrapper>
                <div className="article">
                    <div className="article-item">
                        <p><span className="must-input">*</span> { t('case.caseName') }</p>
                        <Input maxLength={30} value={caseName} placeholder={ t('placeholder.caseName') } onChange={(val) => setCaseName(val)} />
                    </div>
                    <div className="article-item">
                        <p>{ t('case.caseDesc') }</p>
                        <AcroTextarea 
                            value={description || ''} 
                            placeholder={ t('placeholder.caseDesc') }
                            maxLength={50}
                            showWordLimit 
                            onChange={(val) => {
                                setDescription(val);
                            }}
                        />
                    </div>
                </div>

                {/* <Tabs
                    defaultActiveId={tabActiveId}
                    onChange={(val) => {
                        setTabActiveId(val || '0');
                    }}
                >
                    <TabPan id="0" title="目录共用Header">
                        <Table showHeader={false} showBorder columns={columns} data={getTableList('header')}></Table>
                    </TabPan>
                    <TabPan id="1" title="目录共用Query">
                        <Table showHeader={false} showBorder columns={columns} data={getTableList('query')}></Table>
                    </TabPan>
                    <TabPan id="2" title="目录共用Body">
                        <Table showHeader={false} showBorder columns={columns} data={getTableList('body')}></Table>
                    </TabPan>
                    <TabPan id="3" title="认证">
                        <Authen
                            value={request?.auth || {}}
                            onChange={(type, val, extension) => {
                                const path = tempPath(type, extension);
                                const newReqest = cloneDeep(request);
                                set(newReqest, path, val);
                                setRequest(newReqest);
                            }}
                        ></Authen>
                    </TabPan>
                </Tabs> */}
            </FolderWrapper>

        </Modal>
    )
};

export default CreateCase;