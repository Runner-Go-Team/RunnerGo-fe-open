import React from 'react';
import { Input, Button, InputNumber } from 'adesign-react';
import produce from 'immer';
import { EventType, EventsPanel } from './style';

const EventFor = (props) => {
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
      <EventType className="loop-item">For循环控制器</EventType>
      <EventsPanel>
        <span className="runner-for-span">循环次数</span>
        <Input
          value={value?.limit}
          placeholder="支持变量{{变量名}}"
          onChange={handleChange.bind(null, 'limit')}
        />
        <span className="runner-for-span">次</span>
        <span className="runner-for-span">循环间隔</span>
        <InputNumber min={0} value={value?.sleep} onChange={handleChange.bind(null, 'sleep')} />
      </EventsPanel>
    </>
  );
};

export default EventFor;
