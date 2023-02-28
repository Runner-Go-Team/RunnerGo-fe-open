import React from 'react';
import { Input, Button, Select, InputNumber } from 'adesign-react';
import { COMPARE_WHILE_TYPE } from '@constants/compare';
import produce from 'immer';
import { EventType, EventsPanel } from './style';
import './while.less';

const Option = Select.Option;

const EventWhile = (props) => {
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
      <EventType className="loop-item">While循环控制器</EventType>
      <EventsPanel style={{ flexDirection: 'column' }}>
        <div className="event-while-item">
          <Input
            placeholder="条件，支持变量{{变量名}}"
            value={value?.var}
            onChange={handleChange.bind(null, 'var')}
          />
          <Select value={value?.compare} onChange={handleChange.bind(null, 'compare')}>
            {COMPARE_WHILE_TYPE.map((item) => (
              <Option key={item.type} value={item.type}>
                {item.title}
              </Option>
            ))}
          </Select>
          <Input
            placeholder="比较值，支持变量{{变量名}}"
            value={value?.value || ''}
            onChange={handleChange.bind(null, 'value')}
          />
        </div>
        <div className="event-while-item">
          <span className="runner-while-span">等待</span>
          <InputNumber
            placeholder="间隔时长，支持变量{{变量名}}"
            min={0}
            value={value?.sleep || 0}
            onChange={handleChange.bind(null, 'sleep')}
          />
          <span className="runner-while-span">ms</span>
          <span className="runner-while-span">timeout</span>
          <InputNumber
            placeholder="超时时间，支持变量{{变量名}}"
            min={0}
            value={value?.timeout || 0}
            onChange={handleChange.bind(null, 'timeout')}
          />
          <span className="runner-while-span">ms</span>
        </div>
      </EventsPanel>
    </>
  );
};

export default EventWhile;
