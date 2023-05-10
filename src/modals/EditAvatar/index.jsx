import React, { useState, useEffect } from 'react';
import { Modal, Upload, Message, Button } from 'adesign-react';
import { useSelector, useDispatch } from 'react-redux';
import avatar from '@assets/logo/avatar.png'
import { useTranslation } from 'react-i18next';
import './index.less';
import cn from 'classnames';
import { v4 } from 'uuid';
import OSS from 'ali-oss';
import { fetchUpdateAvatar } from '@services/user';
import { OSS_Config, RD_FileURL, USE_OSS } from '@config';
import axios from 'axios';
import LogoRight from '@assets/logo/info_right';
import SvgClose from '@assets/logo/close';


const EditAvatar = (props) => {
    const { onCancel } = props;
    const { t } = useTranslation();
    const [selectDefault, setSelectDefault] = useState(null);
    const [avatarNow, setAvatarNow] = useState('');
    const userInfo = useSelector((store) => store.user.userInfo);
    const dispatch = useDispatch();

    // 默认头像三个, 建议使用oss地址
    const defaultAvatar = [
        "your avatar oss url 1",
        "your avatar oss url 2",
        "your avatar oss url 3"
    ];

    useEffect(() => {
        setAvatarNow(userInfo.avatar);
    }, [userInfo]);


    const uploadFile = async (files, fileLists) => {
        if (USE_OSS) {
            if (!OSS_Config.region || !OSS_Config.accessKeyId || !OSS_Config.accessKeySecret || !OSS_Config.bucket) {
                Message('error', t('message.setOssConfig'));
                return;
            }
        }
        const fileMaxSize = 1024 * 3;
        const fileType = ['jpg', 'jpeg', 'png'];
        const { originFile: { size, name } } = files[0];
        const nameType = name.split('.')[1];

        if (size / 1024 > fileMaxSize) {
            Message('error', t('message.maxFileSize'));
            return;
        };
        if (!fileType.includes(nameType)) {
            Message('error', t('message.AvatarType'));
            return;
        }

        if (USE_OSS) {
            const client = new OSS(OSS_Config);
            const { name: res_name, url } = await client.put(
                "your oss bucket url",
                files[0].originFile,
            )
            setAvatarNow(url);
        } else {
            let formData = new FormData();
            formData.append('file', files[0].originFile);

            const res = await axios.post(`${RD_FileURL}/api/upload`, formData);
            const url = `${RD_FileURL}/${res.data[0].filename}`;

            setAvatarNow(url);
        }

    };

    const updateAvatar = () => {
        const params = {
            avatar_url: avatarNow,
        };
        fetchUpdateAvatar(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    Message('success', t('message.updateSuccess'));
                    dispatch({
                        type: 'user/updateUserInfo',
                        payload: {
                            ...userInfo,
                            avatar: avatarNow,
                        }
                    })
                    onCancel();
                } else {
                    Message('error', t('message.updateError'))
                }
            }
        })
    };

    return (
        <Modal
            className='edit-avatar-modal'
            visible
            title={null}
            footer={null}
        >
            <LogoRight className='logo-right' />
            <Button className='close-btn' onClick={() => onCancel()}>
                <SvgClose />
            </Button>
            <div className='container'>
                <p className='title'>{t('modal.defaultAvatar')}</p>
                <div className='default-avatar'>
                    {
                        defaultAvatar.map((item, index) => (
                            <div className='avatar-body'>
                                <img className={cn('default-avatar-item', {
                                    'select-avatar': selectDefault === index
                                })} key={index} src={item} onClick={() => {
                                    setSelectDefault(index);
                                    setAvatarNow(defaultAvatar[index])
                                }} />
                            </div>
                        ))
                    }
                </div>
                <p className='title' style={{ marginTop: '50px' }}>{t('modal.diyAvatar')}</p>
                <Upload showFilesList={false} onChange={(files, fileList) => uploadFile(files, fileList)}>
                    <img className='avatar' src={avatarNow || avatar} alt="" onClick={() => diyAvatar()} />
                </Upload>
                <p className='avatar-tips'>{t('modal.avatarTips')}</p>

                <div className='btn'>
                    <Upload showFilesList={false} onChange={(files, fileList) => uploadFile(files, fileList)}>
                        <Button className='select-btn'>{t('btn.selectImg')}</Button>
                    </Upload>
                    <Button className='cancel-btn' onClick={onCancel}>{t('btn.cancel')}</Button>
                    <Button className='ok-btn' onClick={() => updateAvatar()}>{t('btn.ok')}</Button>
                </div>
            </div>
        </Modal>
    )
};

export default EditAvatar;