import React from 'react';
import { EventsPanel } from './style';

const EventApi = (props) => {
  const { value, onChange = () => undefined } = props;

  return (
    <>
      <EventsPanel>
        <div className="api-method">{value?.method}</div>
        <div className="api-name">{value?.name}</div>
        <div className="api-url">{value?.url}</div>
      </EventsPanel>
    </>
  );
};

export default EventApi;
