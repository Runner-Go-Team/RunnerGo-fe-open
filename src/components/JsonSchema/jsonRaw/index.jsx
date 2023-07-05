import React from 'react';
import { Message } from 'adesign-react';
import { EditFormat, isJSON } from '@utils';
import { isObject } from 'lodash';
import MonacoEditor from '@components/MonacoEditor';
import { jsonRawWarper } from './style';

const JsonRaw = (props) => {
  const { value, onChange } = props;

  const handleChangeRaw = (val) => {
    if (!isJSON(val)) {
      Message('error', '仅支持JSON格式。');
      return;
    }
    const data = JSON.parse(val);
    //  const beautifyText = EditFormat(data, 'json').value;
    onChange(data);
  };

  let jsonText = null;
  try {
    jsonText = JSON.stringify(value);
  } catch (ex) {
    jsonText = '';
    Message('error', '解析异常');
  }

  const beautifyText = isObject(value) ? EditFormat(jsonText).value : '';

  return (
    <div className={jsonRawWarper}>
      <MonacoEditor value={beautifyText} onChange={handleChangeRaw.bind(null)} />
    </div>
  );
};

export default JsonRaw;
