import React from 'react';
import { Modal } from 'adesign-react';
import Markdown from '@components/MarkDown';

const DescriptionModal = (props) => {
  const { value = '', onChange, onCancel, title } = props;

  return (
    <Modal title={title || '接口说明'} visible onCancel={onCancel} footer={null}>
      <div style={{ height: 500 }}>
        <Markdown value={value} onChange={onChange.bind(null, 'description')} />
      </div>
    </Modal>
  );
};

export default DescriptionModal;
