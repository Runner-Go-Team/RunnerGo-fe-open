import React, { useEffect, useState } from 'react';
import { Modal, Upload, Button, Message, Switch, Tabs as TabComponent, Table, Select, Input } from 'adesign-react';
import { Copy as SvgCopy, Add as SvgAdd, Delete as DeleteSvg, Iconeye as SvgIconEye, Import as SvgImport } from 'adesign-react/icons';
import { GlobalVarModal, HeaderTitleStyle, VarNameStyle } from './style';
import { copyStringToClipboard, str2testData } from '@utils';

import { fetchImportVar, fetchImportList, fetchSceneVar, fetchChangeVar, fetchDeleteImport, fetchEditImport } from '@services/scene';
import { useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import PreviewFile from '../PreviewFile';
import { useTranslation } from 'react-i18next';
import OSS from 'ali-oss';

import { RD_FileURL, OSS_Config, USE_OSS } from '@config';
import { v4 } from 'uuid';
import axios from 'axios';
import { Tooltip } from '@arco-design/web-react';
import Bus from '@utils/eventBus';


const { Tabs, TabPan } = TabComponent;
const { Option } = Select;

const SceneConfig = (props) => {
    const { onCancel, from } = props;
    const { t } = useTranslation();
    const open_scene_scene = useSelector((store) => store.scene.open_scene);
    const open_plan_scene = useSelector((store) => store.plan.open_plan_scene);
    const open_auto_plan_scene = useSelector((store) => store.auto_plan.open_plan_scene);

    const open_list = {
        'scene': open_scene_scene,
        'plan': open_plan_scene,
        'auto_plan': open_auto_plan_scene
    }
    const open_scene = open_list[from];
    const [fileList, setFileList] = useState([]);

    const [cookieList, setCookieList] = useState([]);
    const [headerList, setHeaderList] = useState([]);
    const [varList, setVarList] = useState([]);
    const [assertList, setAssertList] = useState([]);

    const [checkName, setCheckName] = useState([]);
    const [showPreview, setPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [fileType, setFileType] = useState('');

    const [selectId, setSelectId] = useState('0');
    const [tip, setTip] = useState('');

    const scene_global_param = useSelector((store) => store.scene.scene_global_param);

    const tipList = [
        t('modal.sceneCookieTip'),
        t('modal.sceneHeaderTip'),
        t('modal.sceneVarTip'),
        t('modal.sceneAssertTip')
    ];

    const COMPARE_IF_TYPE = [
        { type: 'eq', title: t('apis.compareSelect.eq') },
        { type: 'uneq', title: t('apis.compareSelect.uneq') },
        { type: 'gt', title: t('apis.compareSelect.gt') },
        { type: 'gte', title: t('apis.compareSelect.gte') },
        { type: 'lt', title: t('apis.compareSelect.lt') },
        { type: 'lte', title: t('apis.compareSelect.lte') },
        { type: 'includes', title: t('apis.compareSelect.includes') },
        { type: 'unincludes', title: t('apis.compareSelect.unincludes') },
        { type: 'null', title: t('apis.compareSelect.null') },
        { type: 'notnull', title: t('apis.compareSelect.notnull') },
    ];

    const res_type = {
        1: cloneDeep(COMPARE_IF_TYPE).splice(6, 10),
        2: COMPARE_IF_TYPE,
        3: cloneDeep(COMPARE_IF_TYPE).slice(0, 2)
    }

    const checkKeyRepeat = (list, key) => {
        let usedKeys = list.map(obj => obj.key); // 获取所有已经被使用的key
        let newKey = key;


        // 如果传入的key已经被使用了，就按照规则处理
        while (usedKeys.includes(newKey)) {

            if (newKey.length === 0) {
                return '';
            }

            newKey = newKey.slice(0, -1);
        }

        return newKey;
    }


    const cookieColumns = [
        {
            title: '',
            width: 40,
            dataIndex: 'is_checked',
            render: (text, rowData, rowIndex) => (
                <Switch
                    size="small"
                    checked={text === '1' || text === 1}
                    onChange={(e) => {
                        handleChange(rowData, rowIndex, { is_checked: e ? 1 : 2 }, (data) => {
                            saveCookie(data);
                        });
                    }}
                />
            ),
        },
        {
            title: t('apis.cookieName'),
            dataIndex: 'key',
            width: 220,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        placeholder={t('apis.key')}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { key: newVal });
                        }}
                        onBlur={(e) => {
                            const { value } = e.target;
                            if (value.trim().length === 0) {
                                return;
                            }
                            const _list = cloneDeep(cookieList);
                            const keys = _list.filter(item => item.key === value);
                            if (keys.length > 1) {
                                _list[rowIndex].key = checkKeyRepeat(_list, _list[rowIndex].key);
                                if (_list[rowIndex].key.trim().length === 0 && _list[rowIndex].value.trim().length === 0) {
                                    _list.splice(rowIndex, 1);
                                }
                                setCookieList(_list);
                                saveCookie(_list);
                                Message('error', t('message.cookieNameRepeat'));
                            } else {
                                saveCookie();
                            }
                        }}
                    />
                );
            },
        },
        {
            title: t('apis.cookieValue'),
            dataIndex: 'value',
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        placeholder={t('placeholder.bodyValue')}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { value: newVal });
                        }}
                        onBlur={(e) => {
                            saveCookie();
                        }}
                    />
                );
            },
        },
        {
            title: '',
            width: 30,
            render: (text, rowData, rowIndex) => (
                rowIndex !== cookieList.length ?
                    <Button
                        onClick={() => {
                            deleteItem(rowIndex);
                        }}
                    >
                        <DeleteSvg className='delete-svg' style={{ width: 16, height: 16 }} />
                    </Button> : <></>
            ),
        },
    ];

    const headerColumns = [
        {
            title: '',
            width: 40,
            dataIndex: 'is_checked',
            render: (text, rowData, rowIndex) => (
                <Switch
                    size="small"
                    checked={text === '1' || text === 1}
                    onChange={(e) => {
                        handleChange(rowData, rowIndex, { is_checked: e ? 1 : 2 }, (data) => {
                            saveHeader(data);
                        });
                    }}
                />
            ),
        },
        {
            title: t('apis.key'),
            dataIndex: 'key',
            width: 230,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        placeholder={t('apis.key')}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { key: newVal });
                        }}
                        onBlur={(e) => {
                            const { value } = e.target;
                            if (value.trim().length === 0) {
                                return;
                            }
                            const _list = cloneDeep(headerList);
                            const keys = _list.filter(item => item.key === value);
                            if (keys.length > 1) {
                                _list[rowIndex].key = checkKeyRepeat(_list, _list[rowIndex].key);
                                if (_list[rowIndex].key.trim().length === 0 && _list[rowIndex].value.trim().length === 0) {
                                    _list.splice(rowIndex, 1);
                                }
                                setHeaderList(_list);
                                saveHeader(_list);
                                Message('error', t('message.keyRepeat'));
                            } else {
                                saveHeader();
                            }
                        }}
                    />
                );
            },
        },
        {
            title: t('apis.value'),
            dataIndex: 'value',
            width: 120,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        placeholder={t('placeholder.bodyValue')}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { value: newVal });
                        }}
                        onBlur={() => {
                            saveHeader();
                        }}
                    />
                );
            },
        },
        {
            title: t('apis.desc'),
            dataIndex: 'description',
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        placeholder={t('placeholder.bodyDesc')}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { description: newVal });
                        }}
                        onBlur={() => {
                            saveHeader();
                        }}
                    />
                );
            },
        },
        {
            title: '',
            width: 30,
            render: (text, rowData, rowIndex) => (
                rowIndex !== headerList.length ?
                    <Button
                        onClick={() => {
                            deleteItem(rowIndex);
                        }}
                    >
                        <DeleteSvg className='delete-svg' style={{ width: 16, height: 16 }} />
                    </Button> : <></>
            ),
        },
    ];

    const varColumns = [
        {
            title: '',
            width: 40,
            dataIndex: 'is_checked',
            render: (text, rowData, rowIndex) => (
                <Switch
                    size="small"
                    checked={text === '1' || text === 1}
                    onChange={(e) => {
                        handleChange(rowData, rowIndex, { is_checked: e ? 1 : 2 }, (data) => {
                            saveVar(data);
                        });
                    }}
                />
            ),
        },
        {
            title: t('column.globalVar.varName'),
            dataIndex: 'key',
            width: 211,
            render: (text, rowData, rowIndex) => {
                return (
                    <div className={VarNameStyle}>
                        <Input
                            value={text}
                            onBlur={(e) => {
                                const { value } = e.target;
                                if (value.trim().length === 0) {
                                    return;
                                }
                                const _list = cloneDeep(varList);
                                const keys = _list.filter(item => item.key === value);
                                if (keys.length > 1) {
                                    _list[rowIndex].key = checkKeyRepeat(_list, _list[rowIndex].key);
                                    if (_list[rowIndex].key.trim().length === 0 && _list[rowIndex].value.trim().length === 0) {
                                        _list.splice(rowIndex, 1);
                                    }
                                    setVarList(_list);
                                    saveVar(_list);
                                    Message('error', t('message.varRepeat'));
                                } else {
                                    saveVar();
                                }
                            }}
                            onChange={(newVal) => {
                                handleChange(rowData, rowIndex, { key: newVal });
                            }}
                        />
                        {rowIndex !== varList.length && <SvgCopy className='copy-svg' onClick={() => copyStringToClipboard(varList[rowIndex].key)} />}
                    </div>
                )
            }
        },
        {
            title: t('column.globalVar.varVal'),
            dataIndex: 'value',
            width: 220,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { value: newVal });
                        }}
                        onBlur={() => {
                            saveVar();
                        }}
                    />
                )
            }
        },
        {
            title: t('column.globalVar.varDesc'),
            dataIndex: 'description',

            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { description: newVal });
                        }}
                        onBlur={() => {
                            saveVar();
                        }}
                    />
                )
            }
        },
        {
            title: '',
            width: 30,
            render: (text, rowData, rowIndex) => {
                return rowIndex !== varList.length ? <div className='handle'>
                    <DeleteSvg onClick={() => deleteItem(rowIndex)} className='delete-svg' />
                </div> : <></>
            }
        }
    ];

    const assertColumns = [
        {
            title: '',
            width: 40,
            dataIndex: 'is_checked',
            render: (text, rowData, rowIndex) => (
                <Switch
                    size="small"
                    checked={text === '1' || text === 1}
                    onChange={(e) => {
                        handleChange(rowData, rowIndex, { is_checked: e ? 1 : 2 }, (data) => {
                            saveAssert(data);
                        });
                    }}
                />
            ),
        },
        {
            title: t('apis.assertBody'),
            width: 150,
            dataIndex: 'response_type',
            render: (text, rowData, rowIndex) => (
                <Select
                    value={rowData.response_type || null}
                    placeholder={t('placeholder.plsSelect')}
                    onChange={(e) => {
                        const callback = (data) => {
                            saveAssert(data);
                        }
                        if (assertList[rowIndex] ? (e === 3 || e === 1) : false) {
                            handleChange(rowData, rowIndex, { var: '', response_type: e }, callback);
                        } else {
                            handleChange(rowData, rowIndex, { response_type: e }, callback);
                        }
                    }}
                >
                    <Option value={1}>{t('apis.assertSelect.resHeader')}</Option>
                    <Option value={2}>{t('apis.assertSelect.resBody')}</Option>
                    <Option value={3}>{t('apis.assertSelect.resCode')}</Option>
                </Select>
            ),
        },
        // 包含 不包含 等于空 不等于空
        {
            title: t('apis.field'),
            dataIndex: 'var',
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        disabled={assertList[rowIndex] ? (
                            assertList[rowIndex].response_type === 3 || assertList[rowIndex].response_type === 1 ||
                            assertList[rowIndex].compare === 'includes' || assertList[rowIndex.compare === 'unincludes' ||
                            assertList[rowIndex].compare === 'null' || assertList[rowIndex].compare === 'notnull'
                            ]
                        ) : false}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { var: newVal }, (data) => {
                                saveAssert(data);
                            });
                        }}
                    />
                );
            },
        },
        {
            title: t('apis.condition'),
            width: 150,
            dataIndex: 'compare',
            render: (text, rowData, rowIndex) => {
                let compare = cloneDeep(COMPARE_IF_TYPE);

                return (
                    <Select
                        value={rowData.compare || null}
                        placeholder={t('placeholder.plsSelect')}
                        onChange={(e) => {
                            const callback = (data) => {
                                saveAssert(data);
                            }
                            if (assertList[rowIndex] ? (e === 'notnull' || e === 'null') : false) {
                                handleChange(rowData, rowIndex, { val: '', compare: e }, callback);
                            } else {
                                handleChange(rowData, rowIndex, { compare: e }, callback);
                            }
                        }}
                    >
                        {
                            assertList[rowIndex]
                                && res_type[assertList[rowIndex].response_type]
                                ? res_type[assertList[rowIndex].response_type].map(item => <Option value={item.type}>{item.title}</Option>)
                                : COMPARE_IF_TYPE.map(item => <Option value={item.type}>{item.title}</Option>)
                        }
                    </Select>
                );
            },
        },
        {
            title: t('apis.val'),
            dataIndex: 'val',
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        disabled={assertList[rowIndex] ? (assertList[rowIndex].compare === 'notnull' || assertList[rowIndex].compare === 'null') : false}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { val: newVal }, (data) => {
                                saveAssert(data);
                            });
                        }}
                    />
                );
            },
        },
        {
            title: '',
            width: 30,
            render: (text, rowData, rowIndex) => (
                rowIndex !== assertList.length - 1 ?
                    <Button
                        onClick={() => {
                            deleteItem(rowIndex);
                        }}
                    >
                        <DeleteSvg className='delete-svg' style={{ width: 16, height: 16 }} />
                    </Button> : <></>
            ),
        },
    ];


    useEffect(() => {
        setTip(tipList[selectId]);
    }, [selectId]);

    useEffect(() => {
        if (open_scene) {
            const params = {
                team_id: localStorage.getItem('team_id'),
                scene_id: open_scene.scene_id ? open_scene.scene_id : open_scene.target_id
            };

            Bus.$emit('sendWsMessage', JSON.stringify({
                route_url: "get_scene_param",
                param: JSON.stringify(params)
            }))
        }
    }, [open_scene]);

    useEffect(() => {
        if (scene_global_param) {
            const { cookies, headers, variables, asserts } = scene_global_param;
            setCookieList([...cookies]);
            setHeaderList([...headers]);
            setVarList([...variables]);
            setAssertList([...asserts])
        }
    }, [scene_global_param]);

    const handleChange = (rowData, rowIndex, newVal, callback) => {
        let list = [];
        if (selectId === '0') {
            list = cookieList;
        } else if (selectId === '1') {
            list = headerList;
        } else if (selectId === '2') {
            list = varList;
        } else if (selectId === '3') {
            list = assertList;
        }
        let newList = [...list];
        newList[rowIndex] = {
            ...rowData,
            ...newVal,
        };
        if (selectId !== "3") {
            newList = newList.filter(item => item.key.trim().length > 0 || item.value.trim().length > 0);
        }

        if (selectId === '0') {
            setCookieList([...newList]);
        } else if (selectId === '1') {
            setHeaderList([...newList]);
        } else if (selectId === '2') {
            setVarList([...newList]);
        } else if (selectId === '3') {
            setAssertList([...newList]);
        }
        callback && callback([...newList]);
    };

    useEffect(() => {
        if (open_scene) {
            const query = {
                team_id: localStorage.getItem('team_id'),
                scene_id: open_scene.scene_id ? open_scene.scene_id : open_scene.target_id,
            };
            fetchImportList(query).subscribe({
                next: (res) => {
                    const { data: { imports } } = res;
                    const _imports = imports.map(item => {
                        let name = item.name.split('/');
                        return {
                            ...item,
                            path: item.name,
                            name: name[name.length - 1],
                        }
                    });
                    setFileList(_imports);
                }
            });
        }
    }, []);

    const getFileList = () => {
        const query = {
            team_id: localStorage.getItem('team_id'),
            scene_id: open_scene.scene_id ? open_scene.scene_id : open_scene.target_id,
        };
        fetchImportList(query).subscribe({
            next: (res) => {
                const { data: { imports } } = res;
                const _imports = imports.map(item => {
                    let name = item.name.split('/');
                    return {
                        ...item,
                        path: item.name,
                        name: name[name.length - 1],
                    }
                });
                setFileList(_imports);
            }
        });
    }

    const deleteItem = (index) => {
        let list = [];
        if (selectId === '0') {
            list = cookieList;
        } else if (selectId === '1') {
            list = headerList;
        } else if (selectId === '2') {
            list = varList;
        } else if (selectId === '3') {
            list = assertList;
        }
        const _list = [...list];
        _list.splice(index, 1);
        if (selectId === '0') {
            setCookieList(_list);
            saveCookie(_list);
        } else if (selectId === '1') {
            setHeaderList(_list);
            saveHeader(_list);
        } else if (selectId === '2') {
            setVarList(_list);
            saveVar(_list);
        } else if (selectId === '3') {
            setAssertList(_list);
            saveAssert(_list);
        }
    }

    const uploadFile = async (files, fileLists) => {
        if (USE_OSS) {
            if (!OSS_Config.region || !OSS_Config.accessKeyId || !OSS_Config.accessKeySecret || !OSS_Config.bucket) {
                Message('error', t('message.setOssConfig'));
                return;
            }
        }

        const fileMaxSize = 1024 * 10;
        const fileType = ['csv', 'txt'];
        const { originFile: { size, name } } = files[0];
        const nameType = name.split('.')[1];

        const { protocol, hostname } = window.location;

        if (fileList.filter(item => item.name === name).length > 0) {
            Message("error", t('message.filenameRepeat'));
            return;
        }

        if (fileLists.length === 5) {
            Message('error', t('message.maxFileNum'));
            return;
        }
        if (size / 1024 > fileMaxSize) {
            Message('error', t('message.maxFileSize'));
            return;
        };
        if (!fileType.includes(nameType)) {
            Message('error', t('message.FileType'));
            return;
        }

        if (USE_OSS) {
            const client = new OSS(OSS_Config);
            const { name: res_name, url } = await client.put(
                "your oss bucket url",
                files[0].originFile,
            )
    
            const params = {
                team_id: localStorage.getItem('team_id'),
                scene_id: open_scene.scene_id ? open_scene.scene_id : open_scene.target_id,
                name,
                url,
            };
            fetchImportVar(params).subscribe({
                next: (res) => {
                    const { code } = res;
                    if (code === 0) {
                        getFileList();
                    }
                }
            })
        } else {
            let formData = new FormData();
            formData.append('file', files[0].originFile);

            const res = await axios.post(`${RD_FileURL}/api/upload`, formData);
            const url = `${RD_FileURL}/${res.data[0].filename}`;
            
            const params = {
                team_id: localStorage.getItem('team_id'),
                scene_id: open_scene.scene_id ? open_scene.scene_id : open_scene.target_id,
                name,
                url,
            };
            fetchImportVar(params).subscribe({
                next: (res) => {
                    const { code } = res;
                    if (code === 0) {
                        getFileList();
                    }
                }
            })

        }

    };

    const saveCookie = (data) => {
        const _list = cloneDeep(data ? data : cookieList);
        const params = {
            team_id: localStorage.getItem('team_id'),
            param_type: 1,
            cookies: _list,
            scene_id: open_scene.scene_id ? open_scene.scene_id : open_scene.target_id
        };

        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "save_scene_param",
            param: JSON.stringify(params)
        }))
    }

    const saveHeader = (data) => {
        const _list = cloneDeep(data ? data : headerList);
        const params = {
            team_id: localStorage.getItem('team_id'),
            param_type: 2,
            headers: _list,
            scene_id: open_scene.scene_id ? open_scene.scene_id : open_scene.target_id
        };
        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "save_scene_param",
            param: JSON.stringify(params)
        }))
    }

    const saveVar = (data) => {
        const _list = cloneDeep(data ? data : varList);
        const params = {
            team_id: localStorage.getItem('team_id'),
            param_type: 3,
            variables: _list,
            scene_id: open_scene.scene_id ? open_scene.scene_id : open_scene.target_id
        };
        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "save_scene_param",
            param: JSON.stringify(params)
        }))
    }

    const saveAssert = (data) => {
        const _list = cloneDeep(data ? data : assertList);
        const params = {
            team_id: localStorage.getItem('team_id'),
            param_type: 4,
            asserts: _list,
            scene_id: open_scene.scene_id ? open_scene.scene_id : open_scene.target_id
        };
        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "save_scene_param",
            param: JSON.stringify(params)
        }))
    }

    const deleteFile = (name) => {
        Modal.confirm({
            title: t('modal.look'),
            content: t('modal.deleteFile'),
            okText: t('btn.ok'),
            cancelText: t('btn.cancel'),
            onOk: () => {
                const params = {
                    team_id: localStorage.getItem('team_id'),
                    scene_id: open_scene.scene_id ? open_scene.scene_id : open_scene.target_id,
                    name,
                };
                fetchDeleteImport(params).subscribe({
                    next: (res) => {
                        const { code } = res;
                        if (code === 0) {
                            Message('success', t('message.deleteSuccess'));
                            const _fileList = cloneDeep(fileList);
                            const _index = _fileList.findIndex(item => item.path === name);
                            _fileList.splice(_index, 1);
                            setFileList(_fileList);
                        } else {
                            Message('error', t('message.deleteError'));
                        }
                    }
                })
            }
        })
    };

    const previewFile = async (url) => {
        const result = await fetch(url);
        const file = await result.blob();

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = reader.result;

            const testData = str2testData(text);

            setPreviewData(testData.length > 0 ? testData : text);
            setFileType(testData.length > 0 ? 'csv' : 'txt');
            setPreview(true);
        };

        reader.readAsText(file);
    };

    const downloadFile = async (name, url) => {

        const result = await fetch(url);
        const file = await result.blob();
        let a = document.createElement('a');
        let _url = window.URL.createObjectURL(file);
        let filename = name;
        a.href = _url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(_url);
        document.body.removeChild(a);
    }


    const getTableData = (tab) => {
        let lastDataList = [
            { is_checked: 1, key: '', value: '' },
            { is_checked: 1, key: '', value: '', description: '' },
            { is_checked: 1, key: '', value: '', description: '' },
            { is_checked: 1, response_type: '', var: '', compare: '', val: '' },
        ];
        let lastData = lastDataList[tab];
        let dataList = [
            cookieList,
            headerList,
            varList,
            assertList
        ];
        let dataItem = dataList[tab];
        return [...dataItem, lastData];
    }

    const defaultList = [
        {
            id: '0',
            title: t('modal.sceneCookie'),
            content: <Table showBorder hasPadding={false} columns={cookieColumns} data={getTableData("0")} />
        },
        {
            id: '1',
            title: t('modal.sceneHeader'),
            content: <Table showBorder hasPadding={false} columns={headerColumns} data={getTableData("1")} />
        },
        {
            id: '2',
            title: t('modal.sceneVar'),
            content: <Table showBorder hasPadding={false} columns={varColumns} data={getTableData("2")} />
        },
        {
            id: '3',
            title: t('modal.sceneAssert'),
            content: <Table showBorder hasPadding={false} columns={assertColumns} data={getTableData("3")} />
        }
    ]

    return (
        <Modal
            className={GlobalVarModal}
            visible={true}
            title={t('scene.sceneConfig')}
            okText={t('btn.save')}
            cancelText={t('btn.cancel')}
            footer={null}
            onCancel={onCancel}
        >
            <p className='container-title'>{t('scene.addFile')}</p>
            <span>{t('scene.fileSize')}</span>
            <span>{t('scene.fileCnFormat')}</span>
            <div className='file-list'>
                {
                    fileList.map(item => (
                        <div className='file-list-item'>
                            <div className='file-list-item-left'>
                                <Switch checked={item.status === 1} onChange={(e) => {
                                    const params = {
                                        id: item.id,
                                        status: e ? 1 : 2
                                    };
                                    fetchEditImport(params).subscribe({
                                        next: (res) => {
                                            if (res.code === 0) {
                                                getFileList();
                                            }
                                        }
                                    });
                                }} />
                            </div>
                            <div className='file-list-item-middle'>
                                {item.name}
                            </div>
                            <div className='file-list-item-right'>
                                <SvgIconEye onClick={() => previewFile(item.url)} />
                                <SvgImport onClick={() => downloadFile(item.name, item.url)} />
                                <DeleteSvg className='delete' onClick={() => deleteFile(item.path)} />
                            </div>
                        </div>
                    ))
                }
            </div>
            <Upload disabled={fileList.length === 5} showFilesList={false} onChange={(files, fileList) => uploadFile(files, fileList)} >
                {
                    fileList.length === 5 ?
                        <Tooltip content={t('message.maxFileNum')}>
                            <Button disabled={fileList.length === 5} className='upload-btn' preFix={<SvgAdd />}>{t('scene.addFile')}</Button>
                        </Tooltip> :
                        <Button disabled={fileList.length === 5} className='upload-btn' preFix={<SvgAdd />}>{t('scene.addFile')}</Button>
                }
            </Upload>
            <p className='container-title'>{t('scene.addVar')}</p>
            <Tabs
                defaultActiveId='0'
                itemWidth={80}
                onChange={(e) => setSelectId(e)}
            >
                {
                    defaultList.map((d) => (
                        <TabPan
                            style={{ padding: '0 15px', width: 'auto !impoertant' }}
                            key={d.id}
                            id={d.id}
                            title={d.title}
                        >
                            <p className='tip'>{tip}</p>
                            {d.content}
                        </TabPan>
                    ))
                }
            </Tabs>
            {showPreview && <PreviewFile fileType={fileType} data={previewData} onCancel={() => setPreview(false)} />}
        </Modal>
    )
};

export default SceneConfig;