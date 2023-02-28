import React from 'react';
import { Modal, Button } from 'adesign-react';

const PayAddSuccessModal = (props) => {
  const { noRegistersPre, successPer, onCancel } = props;
  return (
    <Modal
      visible
      bodyStyle={{
        width: '450px',
      }}
      header={null}
      footer={null}
      onCancel={onCancel}
    >
      <div className="modal-title" style={{ fontSize: '16px', fontWeight: '400' }}>
        添加结果通知
      </div>
      <div className="pay_add_success_messge">
        成功添加
        {successPer}
        人｜未注册
        {noRegistersPre}
        人，已邮箱通知被邀请的协作者。
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" onClick={onCancel} className="apipost-orange-btn">
          确定
        </Button>
      </div>
    </Modal>
  );
};
export default PayAddSuccessModal;
