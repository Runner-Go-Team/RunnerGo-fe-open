import React from 'react';
import { Input, Button, Select } from 'adesign-react';
import { COMPARE_IF_TYPE } from '@constants/compare';
import produce from 'immer';

import { EventType, EventsPanel } from './style';

const Option = Select.Option;

const EventIf = (props) => {
  const { value, onChange = () => undefined } = props;

  const handleChange = (key, newVal) => {
    onChange(
      produce(value, (draft) => {
        draft[key] = newVal;
      })
    );
  };

  return (
    <>
      <EventType className="if-item">条件控制器</EventType>
      <EventsPanel>
        <span className="runner-if-span">if</span>
        <Input
          value={value?.var || ''}
          placeholder="条件，支持变量{{变量名}}"
          onChange={handleChange.bind(null, 'var')}
        ></Input>
        <Select value={value?.compare} onChange={handleChange.bind(null, 'compare')}>
          {COMPARE_IF_TYPE.map((item) => (
            <Option key={item.type} value={item.type}>
              {item.title}
            </Option>
          ))}
        </Select>
        <Input
          placeholder="比较值，支持变量{{变量名}}"
          value={value?.value}
          onChange={handleChange.bind(null, 'value')}
        ></Input>
        {/* <Input
           placeholder="比较值，支持变量{{变量名}}"
          style={{ width: 120 }}
          value={value?.description}
          onChange={handleChange.bind(null, 'description')}
        ></Input> */}
      </EventsPanel>
    </>
  );
};

export default EventIf;
