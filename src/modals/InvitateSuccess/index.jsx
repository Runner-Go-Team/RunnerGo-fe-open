import React from "react";
import './index.less';
import { Modal, Button } from 'adesign-react';
import { useTranslation } from 'react-i18next';

const InvitateSuccess = (props) => {
    const { addLength, unRegister, unEmail, onCancel } = props;
    console.log(unEmail);
    const { t } = useTranslation();
    return (
        <Modal
        className='invitate-result'
        visible
        title={null}
        footer={null}
      >
        <p className='title'>{t('modal.invitateSuccess.title')}</p>
        <p className='message'>{t('modal.invitateSuccess.message-1')}{addLength}{t('modal.invitateSuccess.message-2')} | {t('modal.invitateSuccess.message-3')}{unRegister}{t('modal.invitateSuccess.message-2')}, {t('modal.invitateSuccess.message-4')}</p>
        <div className='container'>
          <div className='un-register-email'>
            {
              unRegister > 0 && <>
                <p className='title'>{t('modal.invitateSuccess.unRegister')}: </p>
                {
                  unEmail.map((item, index) => <p className='email' key={index}>{item}</p>)
                }
              </>
            }
          </div>
          <Button onClick={() => onCancel()}>{t('btn.ok')}</Button>
        </div>
      </Modal>
    )
};

export default InvitateSuccess;