import React from 'react';
import isObject from 'lodash/isObject';
import { Select, Input } from 'adesign-react';
import { rawConfigList, IOConfigList } from '../constant';
import { WssConfigWrapper } from './style';

const Option = Select.Option;

const WssConfig = (props) => {
  const { socketConfig, method = 'raw', onChange } = props;
  const handleChange = (field, val) => {
    let value = val;

    if (field === 'shakeHandsPath' || field === 'socketIoVersion') {
    } else if (field === 'informationSize') {
      if (!value) {
        value = 0;
      }
      value = Number(value);
      if (isNaN(value)) {
        return;
      }
      if (value > 5) {
        value = 5;
      }
    } else {
      if (!value) {
        value = 0;
      }
      value = Number(value);
      if (isNaN(value)) {
        return;
      }
    }
    onChange(field, value);
  };

  const tretDom = (item) => {
    if (!item.field) {
      return;
    }
    if (item.field === 'socketIoVersion') {
      return (
        <Select
          value={socketConfig?.[item.field] || ''}
          onChange={(e) => handleChange('socketIoVersion', e)}
        >
          {/* {socketConfig?.socketIoVersion && (
            <Option value={socketConfig?.socketIoVersion} key={socketConfig?.socketIoVersion}>
              v3
            </Option>
          )} */}
          <Option value="v2">v2</Option>
          <Option value="v3">v3</Option>
          <Option value="v4">v4</Option>
        </Select>
      );
    }

    return (
      <Input
        onChange={(val) => handleChange(item.field, val)}
        type="text"
        style={{ height: 35 }}
        placeholder=""
        value={socketConfig.hasOwnProperty(item.field) ? String(socketConfig[item.field]) : ''}
      />
    );
  };

  return (
    <WssConfigWrapper>
      <div className="wss-config-list">
        {method && method === 'Raw'
          ? rawConfigList.map((item) => (
              <div key={item.field} className="wss-config-item">
                <div className="wss-config-desc">
                  <div className="title">{item.title}</div>
                  <div className="desc">{item.desc}</div>
                </div>
                <div className="tret">{tretDom(item)}</div>
              </div>
            ))
          : IOConfigList.map((item) => (
              <div key={item.field} className="wss-config-item">
                <div className="wss-config-desc">
                  <div className="title">{item.title}</div>
                  <div className="desc">{item.desc}</div>
                </div>
                <div className="tret">{tretDom(item)}</div>
              </div>
            ))}
      </div>
    </WssConfigWrapper>
  );
};

export default WssConfig;
