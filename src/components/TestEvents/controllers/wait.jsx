import React from 'react';
import { InputNumber } from 'adesign-react';
import produce from 'immer';
import { EventType, EventsPanel } from './style';

const EventWait = (props) => {
  const { value, onChange } = props;

  const handleChange = (key, newVal) => {
    onChange(
      produce(value, (draft) => {
        draft[key] = newVal;
      })
    );
  };

  return (
    <>
      <EventType className="wait-item">等待控制器</EventType>
      <EventsPanel>
        <InputNumber
          min={0}
          value={value?.sleep || 0}
          placeholder="等待时长，支持变量{{变量名}}"
          onChange={handleChange.bind(null, 'sleep')}
        />
        <span className="runner-wait-span">ms</span>
      </EventsPanel>
    </>
  );
};

export default EventWait;
