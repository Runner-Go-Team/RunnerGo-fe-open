import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Button, Upload, Message } from 'adesign-react';
import { Add as SvgAdd } from 'adesign-react/icons';
import { RD_FileURL, OSS_Config, USE_OSS } from '@config';
import axios from 'axios';
import { v4 } from 'uuid';
import OSS from 'ali-oss';

const BidirectionalAuth = (props) => {
    const { value, type, handleAttrChange } = props;
    const { t } = useTranslation();
    const [list, setList] = useState(null);



    const uploadFile = async (files, fileLists) => {
        if (USE_OSS) {
            if (!OSS_Config.region || !OSS_Config.accessKeyId || !OSS_Config.accessKeySecret || !OSS_Config.bucket) {
                Message('error', t('message.setOssConfig'));
                return;
            }    
        }

        const fileMaxSize = 1024 * 1;
        const fileType = ['crt'];
        const { originFile: { size, name } } = files[0];
        const nameType = name.split('.')[1];

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
                `kunpeng/test/${v4()}.${nameType}`,
                files[0].originFile,
            )
            handleAttrChange(type, 'ca_cert', url);
            handleAttrChange(type, 'ca_cert_name', name);
        } else {
            let formData = new FormData();
            formData.append('file', files[0].originFile);

            const res = await axios.post(`${RD_FileURL}/api/upload`, formData);
            const url = `${RD_FileURL}/${res.data[0].filename}`;

            handleAttrChange(type, 'ca_cert', url);
            handleAttrChange(type, 'ca_cert_name', name);
        }
    };

    const deleteFile = () => {
        handleAttrChange(type, 'ca_cert', '');
        handleAttrChange(type, 'ca_cert_name', '');
    }

    return (
        <div className="bidirectional-auth">
            <p className="tips">{t('apis.twoWayAuth')}</p>
            {
                value[type].ca_cert.trim().length > 0 &&
                value[type].ca_cert_name.trim().length > 0
                ?  <div className="file-item">
                    <p className="name">{value[type].ca_cert_name}</p>

                    <div className="handle">
                        {/* <p className="handle-item">{ t('btn.view') }</p> */}
                        <p className="handle-item" onClick={deleteFile}>{ t('btn.delete') }</p>
                    </div>
                </div> : <Upload showFilesList={false} onChange={uploadFile}>
                    <Button className='upload-btn' preFix={<SvgAdd />}>{t('scene.addFile')}</Button>
                </Upload> 
            }
        </div>
    )
};

export default BidirectionalAuth;