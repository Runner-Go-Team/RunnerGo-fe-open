import React, { useEffect, useState } from 'react';
import { Input, InputNumber, Switch, CheckBox, Modal } from 'adesign-react';
import { isNumber } from 'lodash';

const Textarea = Input.Textarea;

const ArrayModal = (props) => {
  const { value, onChange } = props;

  return (
    <>
      <div className="set-title">基础设置</div>
      <div className="base-setting">
        <div className="item-line">
          <div className="case-title">uniqueItems:</div>
          <div className="case-value">
            <Switch
              size="small"
              checked={value?.uniqueItems}
              onChange={onChange.bind(null, 'uniqueItems')}
            />
          </div>
        </div>
        <div className="item-line">
          <div className="case-title">最小元素个数:</div>
          <div className="case-value">
            <InputNumber
              size="mini"
              min={0}
              value={isNumber(value?.minItems) ? value?.minItems : 0}
              onChange={onChange.bind(null, 'minItems')}
            />
          </div>
          <div className="case-title">最大元素个数:</div>
          <div className="case-value">
            <InputNumber
              min={0}
              size="mini"
              value={isNumber(value?.maxItems) ? value?.maxItems : 0}
              onChange={onChange.bind(null, 'maxItems')}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ArrayModal;
