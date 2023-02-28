import React from 'react';
import { Input, Select } from 'adesign-react';
import { MOCK_LIST } from '@constants/mock';
import './index.less';

const Option = Select.Option;
const ItemMock = (props) => {
  const { disabled, value, onChange } = props;

  const handleChange = (val) => {
    onChange({
      mock: val,
    });
  };

  const renderSelectText = () => {
    return <>{value}</>;
  };

  return (
    <div className="item-mock">
      <Select
        value={value}
        onChange={handleChange}
        autoAdjustWidth={false}
        disabled={disabled}
        popupClassName="select-popup-mock"
        formatRender={renderSelectText}
      >
        <Option key="">请选择</Option>
        {MOCK_LIST.map((item) => (
          <Option key={item.var} value={item.var}>
            {item.description}
          </Option>
        ))}
      </Select>
      {/* <Input
        disabled={disabled}
        className="mock-input"
        placeholder="mock"
        size="mini"
        value={value}
        onChange={handleChange.bind(null)}
      /> */}
    </div>
  );
};

export default ItemMock;
