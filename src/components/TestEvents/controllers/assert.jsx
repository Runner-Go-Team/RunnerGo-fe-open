import React from 'react';
import { Input } from 'adesign-react';
import produce from 'immer';
import { EventType, EventsPanel } from './style';

const EventAssert = (props) => {
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
      <EventType className="assert-item">全局断言</EventType>
      <EventsPanel>
        <Input
          placeholder="断言名称"
          value={value?.name}
          onChange={handleChange.bind(null, 'name')}
        />
      </EventsPanel>
    </>
  );
};

export default EventAssert;
