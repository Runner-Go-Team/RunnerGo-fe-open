import React, { useEffect, useState } from 'react';
import { Modal, Upload, Button, Message, Switch } from 'adesign-react';
import { Copy as SvgCopy, Add as SvgAdd, Delete as SvgDelete, Iconeye as SvgIconEye, Import as SvgImport } from 'adesign-react/icons';
import { GlobalVarModal, HeaderTitleStyle, VarNameStyle } from './style';
import { copyStringToClipboard, str2testData } from '@utils';

import { fetchImportVar, fetchImportList, fetchSceneVar, fetchChangeVar, fetchDeleteImport, fetchEditImport } from '@services/scene';
import { useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import PreviewFile from '../PreviewFile';
import { useTranslation } from 'react-i18next';
import OSS from 'ali-oss';

import { RD_FileURL, OSS_Config } from '@config';
import { v4 } from 'uuid';
import axios from 'axios';
import { Tooltip, Input, Table } from '@arco-design/web-react';


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
    const [varList, setVarList] = useState([]);
    const [checkName, setCheckName] = useState([]);
    const [showPreview, setPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [fileType, setFileType] = useState('');

    const handleChange = (rowData, rowIndex, newVal) => {
        const newList = [...varList];
        newList[rowIndex] = {
            ...rowData,
            ...newVal,
        };
        if (rowIndex === varList.length - 1) {
            setVarList([...newList, { var: '', val: '', description: '' }])
        } else {
            setVarList([...newList]);
        }
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
            fetchSceneVar(query).subscribe({
                next: (res) => {
                    const { data: { variables } } = res;
                    setVarList([...variables, { var: '', val: '', description: '' }]);
                }
            })
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
    const columns = [
        {
            title: t('scene.varName'),
            dataIndex: 'var',
            width: 211,
            render: (text, rowData, rowIndex) => {
                return (
                    <div className={VarNameStyle}>
                        <Input
                            value={text}
                            onBlur={(e) => {
                                if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(e.target.value)) {
                                    Message('error', t('message.varNameFormatError'));
                                    handleChange(rowData, rowIndex, { var: '' });
                                    return;
                                }
                                const _list = cloneDeep(varList);
                                const names = _list.filter(item => (item.var.trim() === e.target.value.trim()) && e.target.value.trim().length > 0);
                                if (names.length > 1) {
                                    handleChange(rowData, rowIndex, { var: '' });
                                    Message('error', t('message.varRepeat'));
                                }
                            }}
                            onChange={(newVal) => {
                                handleChange(rowData, rowIndex, { var: newVal.trim() });
                                setCheckName([rowIndex, newVal]);
                                if (newVal.length === 0 && varList[rowIndex].val.length === 0 && varList[rowIndex].description.length === 0) {
                                    deleteItem(rowIndex);
                                }
                            }}
                        />
                        {rowIndex !== varList.length - 1 && <SvgCopy onClick={() => copyStringToClipboard(varList[rowIndex].var)} />}
                    </div>
                )
            }
        },
        {
            title: t('scene.varVal'),
            dataIndex: 'val',
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { val: newVal });
                        }}
                    />
                )
            }
        },
        {
            title: t('scene.varDesc'),
            dataIndex: 'description',
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { description: newVal });
                        }}
                    />
                )
            }
        },
        {
            title: '',
            width: 40,
            render: (text, rowData, rowIndex) => {
                return rowIndex !== varList.length - 1 ? <div className='delete-svg'>
                    <SvgDelete onClick={() => deleteItem(rowIndex)} />
                </div> : <></>
            }
        }
    ];

    const deleteItem = (index) => {
        const _list = [...varList];

        _list.splice(index, 1);

        setVarList(_list);
    }

    const uploadFile = async (files, fileLists) => {
        if (!OSS_Config.region || !OSS_Config.accessKeyId || !OSS_Config.accessKeySecret || !OSS_Config.bucket) {
            Message('error', t('message.setOssConfig'));
            return;
        }

        const fileMaxSize = 1024 * 10;
        const fileType = ['csv', 'txt'];
        const { originFile: { size, name } } = files[0];
        const nameType = name.split('.')[1];

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

        const client = new OSS(OSS_Config);
        const { name: res_name, url } = await client.put(
            `kunpeng/test/${v4()}.${nameType}`,
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
    };

    const saveGlobalVar = () => {
        const _list = cloneDeep(varList);
        _list.splice(_list.length - 1, 1);
        const variables = _list.map(item => {
            const { var: _var, val, description } = item;
            return {
                var: _var,
                val,
                description
            };
        });
        console.log(variables);
        const params = {
            team_id: localStorage.getItem('team_id'),
            scene_id: open_scene.scene_id ? open_scene.scene_id : open_scene.target_id,
            variables: variables.filter(item => item.var.trim().length > 0)
        };
        fetchChangeVar(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    Message('success', t('message.saveSuccess'));
                    onCancel();
                }
            },
            err: (err) => {
                Message('error', t('message.saveError'));
            }
        });
    };

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
            console.log(text);
            console.log(testData);

            setPreviewData(testData.length > 0 ? testData : text);
            setFileType(testData.length > 0 ? 'csv' : 'txt');
            setPreview(true);
        };

        reader.readAsText(file);
    };

    const downloadFile = async (name, url) => {

        const result = await fetch(url);
        console.log(result);
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

    return (
        <Modal className={GlobalVarModal} visible={true} title={t('scene.sceneConfig')} okText={t('btn.save')} cancelText={t('btn.cancel')} onOk={() => saveGlobalVar()} onCancel={onCancel} >
            <p className='container-title'>{t('scene.addFile')}</p>
            <span>{t('scene.fileSize')}</span>
            <span>{t('scene.fileCnFormat')}</span>
            <div className='file-list'>
                {
                    fileList.map(item => (
                        <div className='file-list-item'>
                            <div className='file-list-item-left'>
                                <Switch checked={item.status === 1} onChange={(e) => {
                                    console.log(item.status, e);
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
                                <SvgDelete className='delete' onClick={() => deleteFile(item.path)} />
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
            <Table borderCell columns={columns} data={varList} pagination={false} />
            {showPreview && <PreviewFile fileType={fileType} data={previewData} onCancel={() => setPreview(false)} />}
        </Modal>
    )
};

export default SceneConfig;