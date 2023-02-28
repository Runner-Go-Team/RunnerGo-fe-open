import React, { useState } from 'react';
import JsonSchema from '@components/JsonSchema';
import { isString } from 'lodash';
import { getSafeJSON } from '@utils';
import JsonHeader from './header';
import JsonBasic from './basic';
import MockPanel from './mock';

const JsonPanel = (props) => {
  const { expectInfo, onChange = () => undefined, data } = props;

  const [jsonMode, setJsonMode] = useState<'schema' | 'mock'>('schema');

  const schemaData = isString(expectInfo?.schema) ? getSafeJSON(expectInfo?.schema) : {};

  const handleChangeSchema = (newData) => {
    onChange('schema', JSON.stringify(newData));
  };

  return (
    <div className="jsonpanel-wrapper">
      <JsonBasic {...{ data, onChange, expectInfo }} />
      <JsonHeader {...{ jsonMode, setJsonMode, expectInfo, onChange }} />
      {jsonMode === 'schema' ? (
        <div>
          <JsonSchema value={schemaData || {}} onChange={handleChangeSchema} />
        </div>
      ) : (
        <MockPanel value={expectInfo?.mock} onChange={onChange.bind(null, 'mock')} />
      )}
    </div>
  );
};

export default JsonPanel;
