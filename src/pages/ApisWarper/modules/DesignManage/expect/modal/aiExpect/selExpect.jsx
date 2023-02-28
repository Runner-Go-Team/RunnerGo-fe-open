import React from 'react';
import { Select } from 'adesign-react';

const Option = Select.Option;

const SelExpect = (props) => {
  const { dataList, value, onChange = () => undefined } = props;

  return (
    <Select  value={value} onChange={onChange}>
      {Array.isArray(dataList) &&
        dataList?.map((item) => (
          <Option key={item.expectId} value={item.expectId}>
            {item.name}({item.code})
          </Option>
        ))}
    </Select>
  );
};

export default SelExpect;
