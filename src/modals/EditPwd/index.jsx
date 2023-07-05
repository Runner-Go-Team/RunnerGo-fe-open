import React, { useEffect, useState } from 'react';
import { Modal, Message, Button } from 'adesign-react';
import { useTranslation } from 'react-i18next';
import './index.less';
import { fetchUpdateName, fetchUpdatePwd, fetchCheckPassword } from '@services/user';
import { useNavigate } from 'react-router-dom';
import { Input } from '@arco-design/web-react';
import LogoRight from '@assets/logo/info_right';
import SvgClose from '@assets/logo/close';
import Bus from '@utils/eventBus';
import { RD_ADMIN_URL } from '@config';
import { setCookie } from '@utils';


const EditPwd = (props) => {
    const { onCancel } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [pwdError, setPwdError] = useState(false);
    const [newPwdError, setNewPwdError] = useState(false);
    const [pwdDiff, setPwdDiff] = useState(false);
    const [cantUpdate, setCantUpdate] = useState(false);

    const [currentEmpty, setCurrentEmpty] = useState(false);
    const [newEmpty, setNewEmpty] = useState(false);
    const [confirmEmpty, setConfirmEmpty] = useState(false);

    const [submitState, setSubmitState] = useState(true);

    const submit = () => {
        if (!newPwd.trim().length) {
            setNewEmpty(true);
        } else {
            setNewEmpty(false);
        }
        if (!confirmPwd.trim().length) {
            setConfirmEmpty(true);
        } else {
            setConfirmEmpty(false);
        }

        if (newPwdError || newEmpty || pwdDiff || confirmEmpty) {
            return;
        }
        const params = {
            new_password: newPwd,
            repeat_password: confirmPwd,
        }
        fetchUpdatePwd(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    Message('success', t('message.updateSuccess'));
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
                }
            }
        })
    }

    useEffect(() => {
        if (newPwd.trim().length > 0 &&
            confirmPwd.trim().length > 0 &&
            newPwd === confirmPwd &&
            !newPwdError && !newEmpty && !confirmEmpty && !confirmEmpty) {
            setSubmitState(false);
        } else {
            setSubmitState(true);
        }
    }, [newPwdError, newEmpty, confirmEmpty, pwdDiff, newPwd, confirmPwd])

    return (
        <Modal
            visible
            className='edit-pwd-modal'
            title={null}
            footer={null}
            cancelText={t('btn.cancel')}
            okText={t('btn.ok')}
        >
            <LogoRight className='logo-right' />
            <Button className='close-btn' onClick={() => onCancel()}>
                <SvgClose />
            </Button>
            <div className='container'>
                <p className='edit-pwd-title'>{t('modal.editPwd')}</p>
                <div className='input-list'>
                    <div className='input-list-item'>
                        <Input.Password
                            className={(newPwdError || newEmpty) ? 'input-error' : ''}
                            placeholder={t('placeholder.newPwd')}
                            value={newPwd}
                            onChange={(e) => {
                                setNewPwd(e);
                            }}
                            onBlur={(e) => {
                                if (newPwd.trim().length < 6 || newPwd.trim().length > 20) {
                                    setNewPwdError(true);
                                } else {
                                    setNewPwdError(false);
                                }
                            }}
                        />
                        {(newPwdError || newEmpty) && <p className='text-error'>{t('sign.plsInputPwd')}</p>}
                    </div>
                    <div className='input-list-item'>
                        <Input.Password
                            className={(pwdDiff || confirmEmpty) ? 'input-error' : ''}
                            placeholder={t('placeholder.confirmPwd')}
                            value={confirmPwd}
                            onChange={(e) => {
                                setConfirmPwd(e);
                            }}
                            onBlur={(e) => {
                                if (newPwd.trim() !== confirmPwd.trim()) {
                                    setPwdDiff(true);
                                } else {
                                    setPwdDiff(false);
                                }
                            }}
                        />
                        {(confirmEmpty || pwdDiff) && <p className='text-error'>{t('sign.confirmPwdError')}</p>}
                    </div>
                </div>
                <div className='btn'>
                    <Button className='cancel-btn' onClick={() => onCancel()}>{t('btn.cancel')}</Button>
                    <Button className='ok-btn' disabled={submitState} onClick={() => submit()}>{t('btn.ok')}</Button>
                </div>
            </div>
        </Modal>
    )
};

export default EditPwd;