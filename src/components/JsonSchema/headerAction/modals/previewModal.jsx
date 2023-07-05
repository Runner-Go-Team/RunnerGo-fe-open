import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Message } from 'adesign-react';
import { Refresh1 as RefreshSvg } from 'adesign-react/icons';
import MonacoEditor from '@components/MonacoEditor';
import { parseModelToJsonSchema } from '@utils';
import { cloneDeep, isObject } from 'lodash';
import { EditFormat } from '@utils';
import MockSchema from 'apipost-mock-schema';
import { ImportModalWrapper } from '../style';

const PreviewModal = (props) => {
  const { value, onCancel } = props;
  const [viewText, setViewText] = useState('');

  useEffect(() => {
    if (isObject(value)) {
      handleViewSchemaText(value);
    }
  }, [value]);

  const handleViewSchemaText = async (dataModel) => {
    const schema = await parseModelToJsonSchema(dataModel, []);
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
        } else {
          setViewText(mockData);
        }
      })
      .catch((err) => {
        Message('error', '解析失败');
        setViewText('');
      });
  };

  const handleUpdateText = useCallback(() => {
    handleViewSchemaText(value);
  }, [value]);

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
