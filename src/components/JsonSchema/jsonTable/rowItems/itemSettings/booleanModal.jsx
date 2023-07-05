import React, { useEffect, useState } from 'react';
import { Select, InputNumber, Switch, CheckBox, Modal } from 'adesign-react';

const Option = Select.Option;
const BooleanModal = (props) => {
  const { value, onChange } = props;

  return (
    <>
      <div className="set-title">基础设置</div>
      <div className="base-setting">
        <div className="item-line">
          <div className="case-title">默认值:</div>
          <Select
            popupStyle={{ zIndex: 1050 }}
            value={value?.default}
            onChange={onChange.bind(null, 'default')}
          >
            <Option value>true</Option>
            <Option value={false}>false</Option>
          </Select>
        </div>
      </div>
    </>
  );
};

export default BooleanModal;
