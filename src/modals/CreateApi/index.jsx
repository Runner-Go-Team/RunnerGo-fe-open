import React from "react";
import { Input, Modal } from 'adesign-react';
import { CreateApiModal } from './style';

const CreateApi = (props) => {
    const { onCancel } = props;
    return (
        <Modal
          visible={true}
          className={CreateApiModal}
          title={<p style={{color: 'var(--font-1)', fontSize: '16px'}}>新建接口</p>}
          onCancel={onCancel}
        >
            <p className="container-title">接口名称</p>
            <Input placeholder='请输入接口名称' />
        </Modal>
    )
};

export default CreateApi;