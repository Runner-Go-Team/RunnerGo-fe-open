import React, { useState, useEffect } from "react";
import './index.less';
import ArcoModal from "../ArcoModal";
import { Select, Button, Upload, Message, Switch, Modal } from '@arco-design/web-react';
import {
    IconPlus,
    IconEye,
    IconDownload,
    IconDelete
} from '@arco-design/web-react/icon';
import { RD_FileURL, OSS_Config, USE_OSS } from '@config';
import { useTranslation } from 'react-i18next';
import OSS from 'ali-oss';
import axios from "axios";
import { v4 } from 'uuid';
import {
    fetchTargetUploadFile,
    fetchTargetUploadList,
    fetchTargetDeleteFile,
    fetchTargetUpdateStatus,
    fetchSaveTargetCaseConf,
    fetchGetTargetCaseConf
} from '@services/apis';
import { isArray } from "lodash";
import PreviewFile from "../PreviewFile";
import { str2testData } from '@utils';

const { Option } = Select;

const RunCaseConfig = (props) => {
    const { onCancel, targetId } = props;
    const { t } = useTranslation();

    // 执行顺序
    const [runOrder, setRunOrder] = useState(1);
    // 文件列表
    const [fileList, setFileList] = useState([]);
    // 是否显示预览文件的弹窗
    const [showPreview, setPreview] = useState(false);
    // 预览的文件内容
    const [previewData, setPreviewData] = useState([]);
    // 预览的文件类型
    const [fileType, setFileType] = useState('');


    useEffect(() => {
        if (targetId) {
            getFileList();
            getTaskConf();
        }
    }, [targetId]);

    // 获取运行配置
    const getTaskConf = () => {
        const params = {
            team_id: sessionStorage.getItem('team_id'),
            target_id: targetId
        };

        fetchGetTargetCaseConf(params).subscribe({
            next: (res) => {
                const { code, data } = res;

                if (code === 0) {
                    const { case_run_order } = data;

                    setRunOrder(case_run_order);
                }
            }
        })
    };

    // 保存运行配置
    const setTaskConf = (e) => {

        const params = {
            team_id: sessionStorage.getItem('team_id'),
            target_id: targetId,
            case_run_order: e
        };

        fetchSaveTargetCaseConf(params).subscribe({
            next: (res) => {
                const { code, data } = res;

                if (code === 0) {
                    setRunOrder(e);
                }
            }
        })
    };

    // 获取文件列表
    const getFileList = () => {
        const params = {
            team_id: sessionStorage.getItem('team_id'),
            target_id: targetId,
            from_type: 2
        };

        fetchTargetUploadList(params).subscribe({
            next: (res) => {
                const { code, data } = res;

                if (code === 0 && isArray(data)) {
                    setFileList(data);
                }
            }
        })
    }

    // 上传文件
    const uploadFile = async (fileLists, files) => {
        const { status } = files;
        if (status === 'done') {
            if (USE_OSS) {
                if (!OSS_Config.region || !OSS_Config.accessKeyId || !OSS_Config.accessKeySecret || !OSS_Config.bucket) {
                    Message.error(t('message.setOssConfig'));
                    return;
                }
            }

            const fileMaxSize = 1024 * 10;
            const fileType = ['csv', 'txt'];
            const { originFile: { size, name } } = files;
            const nameType = name.split('.')[1];

            if (fileList.filter(item => item.name === name).length > 0) {
                Message.error(t('message.filenameRepeat'));
                return;
            }

            if (fileLists.length === 5) {
                Message.error(t('message.maxFileNum'));
                return;
            }
            if (size / 1024 > fileMaxSize) {
                Message.error(t('message.maxFileSize'));
                return;
            };
            if (!fileType.includes(nameType)) {
                Message.error(t('message.FileType'));
                return;
            }

            let url = '';
            let res = null;

            if (USE_OSS) {
                const client = new OSS(OSS_Config);
                res = await client.put(
                    `kunpeng/test/${v4()}.${nameType}`,
                    files.originFile,
                );
                const { name: res_name, url: res_url } = res;

                url = res_url;
            } else {
                let formData = new FormData();
                formData.append('file', files.originFile);

                res = await axios.post(`${RD_FileURL}/api/upload`, formData);
                const res_url = `${RD_FileURL}/${res.data[0].filename}`;

                url = res_url;
            }

            const params = {
                team_id: sessionStorage.getItem('team_id'),
                target_id: targetId,
                name,
                url,
                from_type: 2
            };

            fetchTargetUploadFile(params).subscribe({
                next: (res) => {
                    const { code, data } = res;

                    if (code === 0) {
                        getFileList();
                    }
                }
            })
        }

    };

    // 预览文件
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

    // 切换文件开关
    const editCheckFile = (id, status) => {
        const params = {
            team_id: sessionStorage.getItem('team_id'),
            target_id: targetId,
            id,
            status,
            from_type: 2
        };

        fetchTargetUpdateStatus(params).subscribe({
            next: (res) => {
                const { code, data } = res;

                if (code === 0) {
                    getFileList();
                }
            }
        })
    };

    // 下载文件
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
    };

    // 删除文件
    const deleteFile = (id) => {
        Modal.confirm({
            title: t('modal.look'),
            content: t('modal.deleteFile'),
            okText: t('btn.ok'),
            cancelText: t('btn.cancel'),
            onOk: () => {
                const params = {
                    team_id: sessionStorage.getItem('team_id'),
                    target_id: targetId,
                    id,
                    from_type: 2,
                };

                fetchTargetDeleteFile(params).subscribe({
                    next: (res) => {
                        const { code, data } = res;

                        if (code === 0) {
                            Message.success(t('message.deleteSuccess'));
                            getFileList();
                        }
                    }
                })
            }
        })
    };

    return (
        <ArcoModal
            className='run-api-case-config-modal'
            title='运行配置'
            footer={null}
            onCancel={onCancel}
        >
            <div className="item">
                <p>执行顺序</p>
                <Select value={runOrder} onChange={setTaskConf}>
                    <Option value={1}>顺序执行</Option>
                    <Option value={2}>同时执行</Option>
                </Select>
            </div>
            <div className="item">
                <p>{ t('scene.fileCnFormat') }</p>
                <div className='file-list'>
                    {
                        fileList.map(item => (
                            <div className='file-list-item'>
                                <div className='file-list-item-left'>
                                    <Switch checked={item.status === 1} onChange={(e) => editCheckFile(item.id, e ? 1 : 2)} />
                                </div>
                                <div className='file-list-item-middle'>
                                    {item.name}
                                </div>
                                <div className='file-list-item-right'>
                                    <IconEye onClick={() => previewFile(item.url)} />
                                    <IconDownload onClick={() => downloadFile(item.name, item.url)} />
                                    <IconDelete className='delete' onClick={() => deleteFile(item.id)} />
                                </div>
                            </div>
                        ))
                    }
                </div>
                {
                    fileList.length < 5 ? 
                    <Upload 
                        disabled={fileList.length === 5} 
                        showUploadList={false} 
                        onChange={uploadFile}
                        customRequest={(option) => {
                            const { file, onSuccess } = option;
                            onSuccess({ file });
                        }}
                    >
                        <Button className='add-file-btn' icon={<IconPlus />}>添加文件</Button>
                    </Upload> : <></>
                }
            </div>
            {showPreview && <PreviewFile fileType={fileType} data={previewData} onCancel={() => setPreview(false)} />}
        </ArcoModal>
    )

};

export default RunCaseConfig;