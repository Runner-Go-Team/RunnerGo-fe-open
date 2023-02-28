import React from 'react';
import { Input } from 'adesign-react';
import produce from 'immer';
import { EventType, EventsPanel } from './style';

const EventScript = (props) => {
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
      <EventType className="script-item">脚本</EventType>
      <EventsPanel>
        <Input
          placeholder="脚本名称"
          value={value?.name}
          onChange={handleChange.bind(null, 'name')}
        />
      </EventsPanel>
    </>
  );
};

export default EventScript;
