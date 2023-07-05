import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Message } from 'adesign-react';
import MonacoEditor from '@components/MonacoEditor';
import { EditFormat, isJSON } from '@utils';
import { isObject } from 'lodash';
import { jsonRawWarper } from '../../jsonTable/modals/style';

const EditRow = (props) => {
  const { value, onChange, onCancel } = props;

  const [tempText, setTempText] = useState(value);

  const handleConfirm = useCallback(
    (val) => {
      if (!isJSON(tempText)) {
        Message('error', '仅支持JSON格式。');
        return;
      }
      const data = JSON.parse(tempText);
      //  const beautifyText = EditFormat(data, 'json').value;
      onChange(data);
      onCancel();
    },
    [tempText, value]
  );

  useEffect(() => {
    let jsonText = null;
    try {
      jsonText = JSON.stringify(tempText);
    } catch (ex) {
      jsonText = '';
      Message('error', '解析异常');
    }
    const beautifyText = isObject(tempText) ? EditFormat(jsonText).value : '';
    setTempText(beautifyText);
  }, []);

  return (
    <Modal
      visible
      title="Raw"
      onCancel={onCancel}
      footer={
        <>
          <Button type="primary" onClick={handleConfirm}>
            确定
          </Button>
        </>
      }
    >
      <div className={jsonRawWarper}>
        <MonacoEditor value={tempText} onChange={setTempText.bind(null)} />
      </div>
    </Modal>
  );
};

export default EditRow;
