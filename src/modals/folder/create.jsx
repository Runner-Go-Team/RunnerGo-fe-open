import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    // Input,
    Tabs as TabComponent,
    Modal,
    Switch,
    Table,
    Message,
    Button,
} from 'adesign-react';
import { Delete as DeleteSvg } from 'adesign-react/icons';
import Authen from '@components/Auth';
import ScriptBox from '@components/ScriptBox';
import ApiInput from '@components/ApiInput';
import { HEADERTYPELIST } from '@constants/typeList';
import Bus from '@utils/eventBus';
import { newDataItem, dataItem } from '@constants/dataItem';
import useFolders from '@hooks/useFolders';
import useMockFolders from '@hooks/useMockFolders';
import { findSon } from '@utils';
import { cloneDeep, eq, isPlainObject, isString, set, trim, isArray } from 'lodash';
import DescChoice from '@components/descChoice';
import { FolderWrapper, FolderModal } from './style';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import cn from 'classnames';
import { Input, Select } from '@arco-design/web-react';

const { Tabs, TabPan } = TabComponent;
const Option = Select.Option;
const Textarea = Input.TextArea;

const CreateFolder = (props) => {
    const { onCancel, folder, type = 'api' } = props;

    const apiFolders = type == 'mock' ? useMockFolders().apiFolders : useFolders().apiFolders
    const { t } = useTranslation();
    const [script, setScript] = useState({
        pre_script: '',
        // pre_script_switch: 1,
        test: '',
        // test_switch: 1,
    });
    const [request, setRequest] = useState(
        folder?.request || {
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
    const [folderName, setFolderName] = useState('');
    const [description, setDescription] = useState('');
    const [tabActiveId, setTabActiveId] = useState('0');
    const [parent_id, setParent_id] = useState(0);

    useEffect(() => {
        const init = () => {
            if (isPlainObject(folder)) {
                const { request, name, script: folderScript, parent_id, description } = folder;
                parent_id && setParent_id(parent_id);
                folderScript && setScript(folderScript);
                name && setFolderName(name);
                request && setRequest(request);
                description && setDescription(description);
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
    }, [folder]);

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
                newState[type].parameter = newList
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
            width: 40,
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
            width: 100,
            render: (text, rowData, rowIndex) => {
                return (
                    <ApiInput
                        size="mini"
                        onModal
                        value={text}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { key: newVal });
                        }}
                        onBlur={async () => {
                            if (
                                isString(rowData?.key) &&
                                trim(rowData.key).length > 0 &&
                                isString(rowData?.description) &&
                                trim(rowData.description).length <= 0
                            ) {
                                const desc = await Bus.$asyncEmit('getProjectDescList', rowData.key);
                                if (isString(desc) && desc.length > 0) {
                                    handleChange(rowData, rowIndex, { description: desc });
                                }
                            }
                        }}
                    />
                );
            },
        },
        {
            title: '参数值',
            dataIndex: 'value',
            enableResize: true,
            width: 150,
            render: (text, rowData, rowIndex) => {
                return (
                    <ApiInput
                        size="mini"
                        onModal
                        value={text}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { value: newVal });
                        }}
                    />
                );
            },
        },
        {
            title: '必填',
            dataIndex: 'not_null',
            width: 55,
            render: (text, rowData, rowIndex) => {
                return (
                    <Switch
                        size="small"
                        checked={text > 0}
                        onChange={(e) => {
                            handleChange(rowData, rowIndex, { not_null: e ? 1 : -1 });
                        }}
                    />
                );
            },
        },
        {
            title: '类型',
            dataIndex: 'field_type',
            enableResize: false,
            width: 100,
            render: (text, rowData, rowIndex) => {
                return (
                    <Select
                        value={HEADERTYPELIST.includes(rowData?.field_type) ? rowData?.field_type : 'String'}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { field_type: newVal });
                        }}
                    >
                        {HEADERTYPELIST.map((item) => (
                            <Option key={item} value={item}>
                                {item}
                            </Option>
                        ))}
                    </Select>
                );
            },
        },
        {
            title: '参数描述',
            dataIndex: 'description',
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        size="mini"
                        value={text}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { description: newVal });
                        }}
                    />
                );
            },
        },
        {
            title: '',
            width: 30,
            render: (text, rowData, rowIndex) => (
                <div>
                    <DescChoice
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { description: newVal });
                        }}
                        filterKey={rowData?.key}
                    ></DescChoice>
                </div>
            ),
        },
        {
            title: '',
            width: 30,
            render: (text, rowData, rowIndex) => (
                <Button
                    onClick={() => {
                        handleTableDelete(rowIndex);
                    }}
                >
                    <DeleteSvg style={{ width: 16, height: 16 }} />
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
        // let newFolders = apiFolders.filter(i => i?.status == 1);
        let newFolders = apiFolders;
        if (isPlainObject(folder)) {
            const res = [];
            res.push(folder);
            findSon(res, newFolders, folder?.target_id);
            const resObj = {};
            res.forEach((item) => {
                resObj[item?.target_id] = item;
            });
            newFolders = newFolders.filter((item) => !resObj.hasOwnProperty(item?.target_id));
        }
        return (
            <>
                <Select
                    popupStyle={{ maxHeight: '30vh', overflow: 'auto' }}
                    value={parent_id || '0'}
                    onChange={(val) => {
                        setParent_id(val || '0');
                    }}
                >
                    <Option key={'0'} value={'0'}>
                        {t('apis.rootFolder')}
                    </Option>
                    {newFolders.map((item) => (
                        <Option key={item?.target_id} value={item?.target_id}>
                            {`|${new Array(item.level).fill('—').join('')}${item.name}`}
                        </Option>
                    ))}
                </Select>
            </>
        );
    };
    const onModalSumbit = () => {
        if (trim(folderName).length <= 0) {
            Message('error', t('message.folderNameEmpty'));
            return;
        }
        if (type === 'mock') {
            let option = {
                param: {
                    name: folderName,
                    description,
                    request,
                    script,
                    parent_id: parent_id || '0',
                },
            }
            if (isPlainObject(folder)) {
                option.oldFolder = folder;
            }
            Bus.$emit('mock/saveMockFolder', option,
                () => {
                    onCancel();
                    if (isPlainObject(folder)) {
                        Message('success', t('message.saveSuccess'));
                    } else {
                        Message('success', t('message.createFolderSuccess'));
                    }
                })
            return;
        }
        if (isPlainObject(folder)) {
            Bus.$emit(
                'busUpdateCollectionById',
                {
                    id: folder.target_id,
                    data: {
                        name: folderName,
                        description,
                        request,
                        script,
                        parent_id: parent_id || '0',
                    },
                    oldValue: folder
                },
                () => {
                    onCancel();
                    Message('success', t('message.saveSuccess'));
                }
            );
        } else {
            Bus.$emit(
                'addCollectionItem',
                {
                    type: 'folder',
                    pid: parent_id || '0',
                    param: {
                        name: folderName,
                        description,
                        request,
                        script,
                    },
                },
                () => {
                    onCancel();
                    Message('success', t('message.createFolderSuccess'));
                }
            );
        }
    }
    return (
        <Modal
            title={isPlainObject(folder) ? t('apis.editFolder') : t('apis.createFolder')}
            visible
            onCancel={onCancel}
            className={FolderModal}
            cancelText={t('btn.cancel')}
            okText={t('btn.save')}
            onOk={onModalSumbit}
        >
            <FolderWrapper>
                <div className="article">
                    <div className="items">
                        <div className={cn('name', { 'english-name': i18next.language === 'en' })}>{t('apis.parentFolder')}</div>
                        <div className="content">{folderSelect()}</div>
                    </div>
                    <div className="items">
                        <div className={cn('name', { 'english-name': i18next.language === 'en' })}>{t('apis.folderName')}</div>
                        <div className="content">
                            <Input
                                maxLength={30}
                                value={folderName}
                                onChange={(val) => {
                                    setFolderName(val);
                                }}
                                placeholder={t('placeholder.folderName')}
                            />
                        </div>
                    </div>
                    <div className="items">
                        <div className={cn('name', { 'english-name': i18next.language === 'en' })}>{t('apis.folderDesc')}</div>
                        <div className="content">
                            <Textarea
                                maxLength={50}
                                showWordLimit
                                placeholder={t('placeholder.folderDesc')}
                                value={description || ''}
                                onChange={(val) => {
                                    setDescription(val);
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* <Tabs
                    defaultActiveId={tabActiveId}
                    onChange={(val) => {
                        setTabActiveId(val || '0');
                    }}
                >
                    <TabPan id="0" title="目录公用header">
                        <Table showHeader showBorder columns={columns} data={getTableList('header')}></Table>
                    </TabPan>
                    <TabPan id="1" title="目录公用query">
                        <Table showHeader showBorder columns={columns} data={getTableList('query')}></Table>
                    </TabPan>
                    <TabPan id="2" title="目录公用body">
                        <Table showHeader showBorder columns={columns} data={getTableList('body')}></Table>
                    </TabPan>
                    <TabPan id="3" title="目录公用认证">
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
    );
};
export default CreateFolder;
