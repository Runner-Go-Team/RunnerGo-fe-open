import React from 'react';
import { Select } from 'adesign-react';
import './index.less';
import { ITEM_TYPES } from '../constant';

const { Option } = Select;

const ItemName = (props) => {
  const { value, onChange } = props;

  return (
    <Select
      value={value}
      size="mini"
      className="item-type"
      style={{ width: '200px', flex: 'unset' }}
      onChange={onChange}
    >
      {ITEM_TYPES.map((d) => (
        <Option value={d} key={d}>
          {d}
        </Option>
      ))}
    </Select>
  );
};

export default ItemName;
