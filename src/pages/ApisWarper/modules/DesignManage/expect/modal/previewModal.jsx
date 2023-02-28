import React, { useEffect, useState } from 'react';
import { Modal, Button, Message } from 'adesign-react';
import { Refresh1 as RefreshSvg } from 'adesign-react/icons';
import MonacoEditor from '@components/MonacoEditor';
import { cloneDeep, isObject } from 'lodash';
import Mock from 'mockjs';
import { EditFormat } from '@utils';
import MockSchema from 'apipost-mock-schema';
import { ImportModalWrapper } from './style';

const PreviewModal = (props) => {
  const { expectInfo, jsonMode, onCancel } = props;

  const [viewText, setViewText] = useState<string>('');

  const handleViewSchemaText = (schema) => {
    const schemaData = cloneDeep(schema);
    if (!isObject(schemaData)) {
      return;
    }
    new MockSchema()
      .mock(schemaData)
      .then((mockData) => {
        if (isObject(mockData)) {
          const beautifyText = EditFormat(JSON.stringify(mockData)).value;
          setViewText(beautifyText);
        }
      })
      .catch((err) => {
        Message('error', '解析失败');
        setViewText('');
      });
  };

  useEffect(() => {
    let rawText = '';
    if (jsonMode === 'mock') {
      try {
        rawText = EditFormat(expectInfo.mock).value;
        rawText = Mock.mock(rawText);
      } catch (ex) {}
    } else if (isObject(expectInfo?.schema)) {
      handleViewSchemaText(expectInfo?.schema);
      return;
    }
    const beautifyText = EditFormat(rawText).value;
    setViewText(beautifyText);
  }, [jsonMode, expectInfo]);

  const handleUpdateText = () => {
    if (jsonMode === 'mock') {
      let text = '';
      try {
        text = Mock.mock(expectInfo?.mock);
        text = EditFormat(text).value;
      } catch (ex) {
        return '';
      }
      setViewText(text);
    } else {
      handleViewSchemaText(expectInfo?.schema);
    }
  };

  return (
    <Modal className={ImportModalWrapper} visible title="预览" onCancel={onCancel} footer={null}>
      <div>
        <Button
          onClick={handleUpdateText}
          preFix={<RefreshSvg width="16px" height="16px"></RefreshSvg>}
        >
          刷新
        </Button>
      </div>
      <div>
        <MonacoEditor
          value={viewText}
          Height={400}
          language="json"
          options={{ readOnly: true }}
        ></MonacoEditor>
      </div>
    </Modal>
  );
};

export default PreviewModal;
