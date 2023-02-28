import React, { useEffect, useState } from 'react';
import { Input, Select, InputNumber, Switch, CheckBox, Modal } from 'adesign-react';
import { isNumber } from 'lodash';

const Textarea = Input.Textarea;
const Option = Select.Option;
const StringModal = (props) => {
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
          <div className="case-title">最小长度:</div>
          <div className="case-value">
            <InputNumber
              size="mini"
              min={0}
              value={isNumber(value?.minLength) ? value?.minLength : 0}
              onChange={onChange.bind(null, 'minLength')}
            />
          </div>
          <div className="case-title">最大长度:</div>
          <div className="case-value">
            <InputNumber
              size="mini"
              min={0}
              value={isNumber(value?.maxLength) ? value?.maxLength : 0}
              onChange={onChange.bind(null, 'maxLength')}
            />
          </div>
        </div>
        <div className="item-line">
          <div className="case-title">Pattern:</div>
          <Input
            size="mini"
            className="case-value"
            value={value?.pattern}
            onChange={onChange.bind(null, 'pattern')}
          />
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
        <div className="item-line">
          <div className="case-title">format:</div>
          <div className="case-value">
            <Select
              popupStyle={{ zIndex: 1050 }}
              value={value?.format}
              onChange={onChange.bind(null, 'format')}
            >
              <Option value="date-time">date-time</Option>
              <Option value="date">date</Option>
              <Option value="email">email</Option>
              <Option value="hostname">hostname</Option>
              <Option value="ipv4">ipv4</Option>
              <Option value="ipv6">ipv6</Option>
              <Option value="uri">uri</Option>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
};

export default StringModal;
