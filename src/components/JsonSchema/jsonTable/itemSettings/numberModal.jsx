import React, { useEffect, useState } from 'react';
import { Input, InputNumber, Switch, CheckBox, Modal } from 'adesign-react';
import { isNumber } from 'lodash';

const Textarea = Input.Textarea;

const NumberModal = (props) => {
  const { value, onChange } = props;

  return (
    <>
      <div className="set-title">基础设置</div>
      <div className="base-setting">
        <div className="item-line">
          <div className="case-title">默认值:</div>
          <Input
            size="mini"
            className="case-value"
            value={value?.default}
            onChange={onChange.bind(null, 'default')}
          />
        </div>
        <div className="item-line">
          <div className="case-title">exclusiveMinimum:</div>
          <div className="case-value">
            <Switch
              size="mini"
              checked={value?.exclusiveMinimum}
              onChange={onChange.bind(null, 'exclusiveMinimum')}
            />
          </div>
          <div className="case-title">exclusiveMaximum:</div>
          <div className="case-value">
            <Switch
              size="mini"
              checked={value?.exclusiveMaximum}
              onChange={onChange.bind(null, 'exclusiveMaximum')}
            />
          </div>
        </div>
        <div className="item-line">
          <div className="case-title">最小值:</div>
          <div className="case-value">
            <InputNumber
              size="mini"
              min={0}
              value={isNumber(value?.minimum) ? value?.minimum : 0}
              onChange={onChange.bind(null, 'minimum')}
            />
          </div>
          <div className="case-title">最大值:</div>
          <div className="case-value">
            <InputNumber
              size="mini"
              min={0}
              value={isNumber(value?.maximum) ? value?.maximum : 0}
              onChange={onChange.bind(null, 'maximum')}
            />
          </div>
        </div>
        <div className="item-line">
          <div className="case-title">
            <span style={{ paddingRight: 5 }}>枚举</span>
            <CheckBox />
            <span>:</span>
          </div>
          <div className="case-value">
            <Textarea
              size="mini"
              height={40}
              autoSize={false}
              value={value?.enum?.join('\n')}
              onChange={onChange.bind(null, 'enum')}
            />
          </div>
        </div>
        <div className="item-line">
          <div className="case-title">备注:</div>
          <div className="case-value">
            <Textarea
              size="mini"
              height={40}
              autoSize={false}
              value={value?.enumDesc}
              onChange={onChange.bind(null, 'enumDesc')}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NumberModal;
