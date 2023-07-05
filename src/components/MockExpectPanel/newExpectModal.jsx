import React, { useState, useEffect } from "react";
import {
  Select,
  Tabs as TabComponent,
  Modal,
  Message,
} from 'adesign-react';
import { useTranslation } from 'react-i18next';
import { EXPECT_CONTENT_TYPE } from '@constants/expect';

import { Input } from '@arco-design/web-react';
import './newExpectModal.less';

const Option = Select.Option;
const NewExpectModal = (props) => {
  const { onCancel, onSumbit } = props;
  const { t } = useTranslation();
  const [data, setData] = useState({
    name: '',
    type: 'json',
  });
  return (
    <Modal
      title={t('mock.createResponseExpect')}
      visible={true}
      onCancel={onCancel}
      className='mock-create-response-expect-modal'
      okText={t('btn.save')}
      cancelText={t('btn.cancel')}
      onOk={() => {
        onSumbit(data);
      }}
    >
      <div className="create-response-expect-content">
        <div className="card-item">
          <p>{t('mock.expect_name')}</p>
          <Input maxLength={30} value={data?.name} placeholder={t('mock.create_ecpect_input_placeholder')} onChange={(val) => setData({ ...data, name: val })} />
        </div>
        <div className="card-item">
          <p>{t('mock.content_format')}</p>
          <Select value={data?.type || 'json'} onChange={(val)=>setData({ ...data, type: val })}>
            {EXPECT_CONTENT_TYPE.map((item) => <Option key={item} value={item}>
              {item}
            </Option>)}
          </Select>
        </div>
      </div>
    </Modal>
  )
};

export default NewExpectModal;