import React from 'react';
import { Select } from 'adesign-react';
import { COMPARE_LOCATION } from '@constants/expect';

const Option = Select.Option;

const SelLocation = (props) => {
  const { value, onChange = () => undefined } = props;

  return (
    <Select value={value} onChange={onChange}>
      {COMPARE_LOCATION?.map((item) => (
        <Option key={item} value={item}>
          {item}
        </Option>
      ))}
    </Select>
  );
};

export default SelLocation;
