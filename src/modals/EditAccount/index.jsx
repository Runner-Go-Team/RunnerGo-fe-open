import React, { useEffect, useState } from 'react';
import { Modal, Message, Button } from 'adesign-react';
import { useTranslation } from 'react-i18next';
import './index.less';
import { fetchUpdateAccount } from '@services/user';
import { useNavigate } from 'react-router-dom';
import { Input } from '@arco-design/web-react';
import LogoRight from '@assets/logo/info_right';
import SvgClose from '@assets/logo/close';
import { EamilReg } from '@utils';
import { useDispatch, useSelector } from 'react-redux';
import Bus from '@utils/eventBus';
import { RD_ADMIN_URL } from '@config';
import { setCookie } from '@utils';


const EditAccount = (props) => {
  const { onCancel } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [emailEmpty, setEmailEmpty] = useState('');

  const [submitState, setSubmitState] = useState(true);
  const userInfo = useSelector((store) => store.user.userInfo);


  const submit = () => {
    if (!email.trim().length) {
      setEmailEmpty(true);
    } else {
      setEmailEmpty(false);
    }

    if (emailEmpty || emailErr) {
      return;
    }
    const params = {
      account: email,
    }
    fetchUpdateAccount(params).subscribe({
      next: (res) => {
        const { code } = res;
        if (code === 0) {
          dispatch({
            type: 'user/updateUserInfo',
            payload: {
              ...userInfo,
              account: email,
            }
          })
          onCancel();
          Message('success', t('message.updateSuccess'));
        }
      }
    })
  }

  useEffect(() => {
    if (email.trim().length > 0 && !emailEmpty && !emailErr) {
      setSubmitState(false);
    } else {
      setSubmitState(true);
    }
  }, [email, emailErr, emailEmpty])
  useEffect(() => {
    setEmail(userInfo.account)
  }, [userInfo]);
  return (
    <Modal
      visible
      className='edit-account-modal'
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
        <p className='edit-email-title'>{t('modal.updateAccount')}</p>
        <div className='input-list'>
          <div className='input-list-item'>
            <Input
              className={(emailErr || emailEmpty) ? 'input-error' : 'input-item'}
              placeholder={t('placeholder.account')}
              maxLength={30}
              value={email}
              onChange={(e) => {
                setEmail(e);
                setEmailErr(false);
              }}
              onBlur={(e) => {
                if (email.trim().length < 6 || email.trim().length > 30) {
                  Message('error', "账号为6-30位")
                  setEmailErr(true);
                  return;
                } else {
                  setEmailErr(false);
                }
              }}
            />
            {(emailErr || emailEmpty) && <p className='text-error'>{t('sign.errorAccount')}</p>}
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

export default EditAccount;