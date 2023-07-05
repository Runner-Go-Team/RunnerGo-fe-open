import React, { useState, useEffect } from "react";
import './index.less';
import { Message } from 'adesign-react';
import { Link as SvgLink, Delete as SvgDelete } from 'adesign-react/icons';
import { Input, Switch, Upload } from '@arco-design/web-react';
import { RD_FileURL, OSS_Config } from '@config';
import OSS from 'ali-oss';
import { useTranslation } from 'react-i18next';
import { v4 } from 'uuid';

const MqttConventionConfig = (props) => {
    const { data: { mqtt_detail: { common_config: { client_name, username, password, is_encrypt, auth_file: { file_name } } } }, onChange } = props;
    const { t } = useTranslation();

    const uploadFile = async ({ file }) => {
        if (!OSS_Config.region || !OSS_Config.accessKeyId || !OSS_Config.accessKeySecret || !OSS_Config.bucket) {
            Message('error', t('message.setOssConfig'));
            return;
        }

        const fileMaxSize = 1024 * 1;
        const fileType = ['crt'];
        const { name, size } = file;
        const nameType = name.split('.')[1];

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
            file
        )
        const auth_file = {
            file_name: name,
            file_url: url,
        }
        onChange('mqtt_auth_file', auth_file);
    }

    const clearFileList = () => {
        const auth_file = {
            file_name: "",
            file_url: "",
        }
        onChange('mqtt_auth_file', auth_file);
    }


    return (
        <div className="mqtt-manage-request-convention">
            <div className="item">
                <p className="label">客户端名称</p>
                <Input className='right' value={client_name ? client_name : ''} onChange={(e) => {
                    onChange('mqtt_client_name', e);
                }} />
            </div>
            <div className="item">
                <p className="label">用户名</p>
                <Input className='right' value={username ? username : ''} onChange={(e) => {
                    onChange('mqtt_username', e);
                }} />
            </div>
            <div className="item">
                <p className="label">密码</p>
                <Input className='right' value={password ? password : ''} onChange={(e) => {
                    onChange('mqtt_password', e);
                }} />
            </div>
            <div className="item">
                <p className="label">SSL/TLS</p>
                <Switch size="small" className='right' value={is_encrypt ? is_encrypt : true} onChange={(e) => {
                    onChange('mqtt_is_encrypt', e);
                }} />
            </div>
            <div className="item">
                <p className="label">认证文件</p>
                {
                    file_name ? <div className="file-box file-box-fill right">
                        <SvgLink fill="var(--font-1)" />
                        <p>{file_name}</p>
                        <SvgDelete onClick={clearFileList}  />
                    </div>
                        : <Upload className='right' limit={1} showUploadList={false} customRequest={uploadFile}>
                            <div className='file-box'>
                                <SvgLink />
                                <p>支持上传crt</p>
                            </div>
                        </Upload>
                }

            </div>
        </div>
    )
};

export default MqttConventionConfig;