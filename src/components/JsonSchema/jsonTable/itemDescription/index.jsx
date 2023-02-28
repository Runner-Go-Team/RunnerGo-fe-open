import React from 'react';
import { Input } from 'adesign-react';
import './index.less';
// import Input from '../input';

const ItemMock = (props) => {
  const { value, onChange } = props;
  return (
    <div className="item-description">
      <Input
        className="mock-input"
        size="mini"
        placeholder="description"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default ItemMock;
