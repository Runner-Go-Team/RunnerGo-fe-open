import React, { useCallback, useEffect, useState } from 'react';
import ArcoModal from '@modals/ArcoModal';
import MonacoEditor from '@components/MonacoEditor';
import { EditFormat, isJSON } from '@utils';
import { isObject } from 'lodash';
import { jsonRawWarper } from '../../jsonTable/modals/style';
import { Message, Button } from '@arco-design/web-react';

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
    <ArcoModal
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
    </ArcoModal>
  );
};

export default EditRow;
