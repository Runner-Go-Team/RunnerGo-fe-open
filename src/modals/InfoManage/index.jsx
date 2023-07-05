import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Message } from 'adesign-react';
import { Left as SvgLeft, Edit as SvgEdit } from 'adesign-react/icons';
import LogoRight from '@assets/logo/info_right';
import './index.less';
import avatar from '@assets/logo/avatar.png'
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EditAvatar from '../EditAvatar';
import EditPwd from '../EditPwd';
import EditEmail from '../EditEmail';
import EditAccount from '../EditAccount';
import { fetchUpdateName, fetchUpdatePwd, fetchCheckPassword } from '@services/user';
import { Tooltip } from '@arco-design/web-react';
import SvgClose from '@assets/logo/close';
import Bus from '@utils/eventBus';
import { RD_ADMIN_URL } from '@config';
import { setCookie } from '@utils';

const InfoManage = (props) => {
    const { onCancel } = props;
    const navigate = useNavigate();
    const userInfo = useSelector((store) => store.user.userInfo);
    const [nickName, setNickName] = useState('');
    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [showMask, setShowMask] = useState(false);
    const [showEditName, setEditName] = useState(false);
    const [showEditAccount, setEditAccount] = useState(false);
    const [showEditEmail, setEditEmail] = useState(false);
    const [nameError, setNameError] = useState(false);

    const [showEditAvatar, setEditAvatar] = useState(false);
    const [showEditPwd, setEditPwd] = useState(false);

    const enter = () => {
        setShowMask(true);
    }

    const leave = () => {

        setShowMask(false);
    }

    useEffect(() => {
        const avatar_item = document.querySelector('.avatar-item');
        avatar_item.addEventListener('mouseenter', enter);
        avatar_item.addEventListener('mouseleave', leave);

        return () => {
            avatar_item.removeEventListener('mouseenter', enter);
            avatar_item.removeEventListener('mouseleave', leave);

        }
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        setNickName(userInfo.nickname)
    }, [userInfo]);

    const { t } = useTranslation();

    const editAvatar = () => {
        setEditAvatar(true);
    }

    const cancelEditName = () => {
        setEditName(false);
        setNickName(userInfo.nickname);
        setNameError(false);
    }

    const okEditName = () => {
        if (nameError) {
            return;
        }

        const params = {
            nickname: nickName,
        };
        fetchUpdateName(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    dispatch({
                        type: 'user/updateUserInfo',
                        payload: {
                            ...userInfo,
                            nickname: nickName,
                        }
                    })
                    if (nickName) {
                        Message('success', t('message.updateSuccess'));
                        setEditName(false)
                    }
                } else {
                    Message('error', t('message.updateError'))
                }
            }
        })
    };

    const quitLogin = () => {
        Bus.$emit('closeWs');
        localStorage.removeItem('runnergo-token');
        localStorage.removeItem('expire_time_sec');
        localStorage.removeItem('team_id');
        localStorage.removeItem('settings');
        localStorage.removeItem('open_apis');
        localStorage.removeItem('open_scene');
        localStorage.removeItem('open_plan');
        localStorage.removeItem("package_info");

        setCookie('token', '');
        window.location.href = `${RD_ADMIN_URL}/#/login`;

        Message('success', t('message.quitSuccess'));
    }

    return (
        <div className='info-manage'>
            {
                showEditName && <Modal
                    className='edit-name-modal'
                    visible
                    title={null}
                    footer={null}
                >
                    <LogoRight className='logo-right' />
                    <Button className='close-btn' onClick={() => cancelEditName()}>
                        <SvgClose />
                    </Button>
                    <div className='container'>
                        <p className='edit-name-title'>{t('modal.editName')}</p>
                        <Input
                            maxLength={26}
                            className={nameError ? 'input-error' : ''}
                            placeholder={t('placeholder.nickname')}
                            value={nickName}
                            onChange={(e) => {
                                setNickName(e);
                            }}
                            onBlur={(e) => {
                                if (/[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g.test(nickName)) {
                                    setNameError(true);
                                    return;
                                } else {
                                    setNameError(false);
                                }

                                // 配合首次注册的团队名称的长度，xxxx 的团队, 昵称长度改为2-26位
                                if (nickName.trim().length < 2 || nickName.trim().length > 26) {
                                    setNameError(true);
                                    return;
                                } else {
                                    setNameError(false);
                                }
                            }}
                        />
                        {nameError && <p className='input-error-text' style={{ color: 'var(--run-red)', marginRight: 'auto' }}>{t('sign.nicknameError')}</p>}
                        <div className='btn'>
                            <Button className='cancel-btn' onClick={() => cancelEditName()}>{t('btn.cancel')}</Button>
                            <Button className='ok-btn' onClick={() => okEditName()}>{t('btn.ok')}</Button>
                        </div>
                    </div>
                </Modal>
            }

            <Modal
                className='info-modal'
                title={null}
                footer={null}
                visible
            >
                <LogoRight className='logo-right' />
                <Button className='close-btn' onClick={() => onCancel()}>
                    <SvgClose />
                </Button>

                <div className='info-modal-container'>
                    <div className='avatar-item' onClick={() => editAvatar()} >
                        {showMask && <div className='avatar-mask'>{t('modal.updateAvatar')}</div>}
                        <img className='avatar' src={userInfo.avatar || avatar} />
                    </div>

                    <div className='info-item'>
                        <div className='info-item-left'>
                            <p>{t('sign.nickname')}</p>
                            <p>{userInfo.nickname}</p>
                        </div>
                        <Button className='info-item-right' onClick={() => setEditName(true)}>{t('index.update')}</Button>
                    </div>
                    <div className='info-item'>
                        <div className='info-item-left'>
                            <p>{t('sign.account')}</p>
                            <p>{userInfo.account}</p>
                        </div>
                        <Button className='info-item-right' onClick={() => setEditAccount(true)}>{t('index.update')}</Button>
                    </div>
                    <div className='info-item'>
                        <div className='info-item-left'>
                            <p>{t('sign.email')}</p>
                            <p>{userInfo.email || '—'}</p>
                        </div>
                        <Button className='info-item-right' onClick={() => setEditEmail(true)}>{userInfo.email ? t('index.update') : t('modal.bindNow')}</Button>
                    </div>
                    <div className='info-item' style={{ borderBottom: 0 }}>
                        <div className='info-item-left'>
                            <p>{t('sign.password')}</p>
                            <p>********</p>
                        </div>

                        <Button className='info-item-right' onClick={() => setEditPwd(true)}>{t('index.update')}</Button>
                    </div>


                    <Button className='quit-btn' onClick={() => quitLogin()}>{t('btn.quit')}</Button>
                </div>

            </Modal>

            {
                showEditAvatar && <EditAvatar onCancel={() => setEditAvatar(false)} />
            }
            {
                showEditPwd && <EditPwd onCancel={() => setEditPwd(false)} />
            }
            {
                showEditEmail && <EditEmail onCancel={() => setEditEmail(false)} />
            }
            {showEditAccount && <EditAccount onCancel={() => setEditAccount(false)} />}
        </div>
    )
};

export default InfoManage;