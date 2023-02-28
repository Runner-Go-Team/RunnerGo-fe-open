import React from 'react';
import { Select } from 'adesign-react';
import { COMPARE_TYPE } from '@constants/expect';

const Option = Select.Option;

const SelExpect = (props) => {
  const { value, onChange = () => undefined } = props;

  return (
    <Select value={value} onChange={onChange}>
      {COMPARE_TYPE?.map((item) => (
        <Option key={item.type} value={item.type}>
          {item.title}
        </Option>
      ))}
    </Select>
  );
};

export default SelExpect;
