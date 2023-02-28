import React, { useEffect, useState } from 'react';
import { Modal, Card, Message } from 'adesign-react';
import ASidetools from 'apipost-inside-tools';
import MonacoEditor from '@components/MonacoEditor';
import { copyStringToClipboard } from '@utils';
import './index.less';
import { isArray, isString } from 'lodash';

const OperationModal = (props) => {
  const { onCancel, value, paramsType, handleType = 'import', onChange } = props;

  // 设置editor值
  const [editorValue, setEditorValue] = useState('');
  useEffect(() => {
    if (value) setEditorValue(value);
  }, [value]);

  const handleConfirm = () => {
    if (editorValue === '') {
      Message('error', '请输入需要导入的内容');
      return;
    }
    if (handleType === 'export') {
      copyStringToClipboard(editorValue);
    } else {
      const importList = ASidetools.import2array(editorValue);
      if (isArray(importList) && importList.length > 0) {
        for (let i = 0; i < importList.length; i++) {
          const ite = importList[i];
          if (!ite.hasOwnProperty('type')) ite.type = 'Text';
          if (ite?.field_type === 'Text') ite.field_type = 'String';
          if (!isString(ite.value)) ite.value = '';
        }
        onChange && onChange(paramsType, importList);
        Message('success', '导入成功');
      }
      onCancel();
    }
  };

  return (
    <Modal
      className="operation-modal"
      visible
      title={handleType === 'export' ? '导出参数' : '导入参数'}
      okText={handleType === 'export' ? '复制' : '导入'}
      onCancel={onCancel}
      onOk={handleConfirm}
    >
      <div className="operation-content">
        <Card bordered>
          {handleType === 'export'
            ? '参数已成功导出为如下格式字符串，您可复制后通过【导入参数】快速导入到其他接口'
            : '快速导入到请求参数，支持 JSON/Key-value 格式'}
        </Card>
        <div className="editor-box">
          <MonacoEditor
            language="json"
            value={editorValue}
            onChange={(val) => {
              setEditorValue(val);
            }}
            options={{
              readOnly: handleType === 'export',
            }}
          ></MonacoEditor>
        </div>
      </div>
    </Modal>
  );
};

export default OperationModal;
