import React, { useState } from 'react';
import { Modal, Button, Message } from 'adesign-react';
import APTools from 'apipost-inside-tools';
import MonacoEditor from '@components/MonacoEditor';
import curl2har from 'curl2har';
import Bus from '@utils/eventBus';
import { isPlainObject } from 'lodash';
import { ImportApiModal } from './style';

const ImportApi = (props) => {
  const { onCancel } = props;

  const [curl, setCurl] = useState('');

  const submit = async () => {
    const convertResult = curl2har(curl);
    if (convertResult.status === 'error') {
      Message('error', convertResult.message || '');
    } else {
        const newApi = APTools.har2apipost(convertResult.data);
      }
    } 
  return (
    <>
      <Modal
        className={ImportApiModal}
        title="从CURL导入接口"
        visible
        onCancel={onCancel}
        footer={
          <>
            <Button onClick={onCancel}>取消</Button>
            <Button onClick={submit}>立即导入</Button>
          </>
        }
      >
        <MonacoEditor
          value={curl || ''}
          style={{ minHeight: '100%' }}
          Height="100%"
          language="json"
          onChange={(val) => {
            setCurl(val);
          }}
        />
      </Modal>
    </>
  );
};

export default ImportApi;
