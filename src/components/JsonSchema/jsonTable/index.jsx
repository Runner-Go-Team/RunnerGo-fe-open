import React from 'react';
import { isObject } from 'lodash';
import ItemNode from './itemNode';
import './index.less';

const Template = (props) => {
  const { value, onChange } = props;

  const shemaData = isObject(value) ? value : {};

  const handleRowChange = (nodeKey, newVal) => {
    onChange(newVal);
  };

  return (
    <div className="json-schema-template">
      <div className="template-table" style={{ height: 'auto', flexDirection: 'column' }}>
        <ItemNode
          enableDelete={false}
          deepIndex={0}
          readOnly
          value={shemaData}
          nodeKey="rootNode"
          onChange={handleRowChange}
          // onNodeKeyChange={() => undefined}
        />
      </div>
    </div>
  );
};

export default Template;
