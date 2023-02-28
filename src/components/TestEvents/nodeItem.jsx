import React, { useContext } from 'react';
import produce from 'immer';
import { isArray } from 'lodash';
import Controllers from './controllers';
import EventWrapper from './controllers/wrapper';
import EventListPanel from './eventList';
import Context from './context';

const NodeItem = (props) => {
  const { item, path } = props;

  const { setEventList, readOnly } = useContext(Context);

  // 非叶子节点
  const hasChild = isArray(item?.childEvents) && item?.childEvents.length > 0;

  const EventNode = Controllers[item.type];

  // 修改节点信息
  const handleChange = (key, newVal) => {
    const newList = produce((draft) => {
      const dIndex = draft.findIndex((dItem) => dItem.event_id === item.event_id);
      draft[dIndex][key] = newVal;
    });
    setEventList(newList);
  };

  return (
    <div className="event-item-panel">
      <EventWrapper
        path={path}
        isRoot={false}
        className="event-node"
        handleChange={handleChange}
        item={item}
      >
        <EventNode value={item?.data} onChange={handleChange.bind(null, 'data')} />
      </EventWrapper>
      {hasChild && <EventListPanel childList={item?.childEvents} path={path} />}
    </div>
  );
};

export default NodeItem;
