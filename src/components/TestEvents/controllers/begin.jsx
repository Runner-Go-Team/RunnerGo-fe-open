import React from 'react';
import { Input, CheckBox } from 'adesign-react';
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
      <EventType className="work-item">事物控制器</EventType>
      <EventsPanel>
        <Input
          placeholder="事务名称"
          value={value?.name}
          onChange={handleChange.bind(null, 'name')}
        />
        {/* <CheckBox
          checked={value?.generate > 0 ? 'checked' : 'uncheck'}
          onChange={(ckd: string) => {
            handleChange('generate', ckd === 'checked' ? 1 : -1);
          }}
        />
        <span style={{ marginRight: 10 }}>Generate Parent Sample</span> */}
        {/* <CheckBox
          checked={value?.includeTime > 0 ? 'checked' : 'uncheck'}
          onChange={(ckd: string) => {
            handleChange('includeTime', ckd === 'checked' ? 1 : -1);
          }}
        />
        <span> Include timers</span> */}
      </EventsPanel>
    </>
  );
};

export default EventFor;
