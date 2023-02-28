import React, { useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayToTreeObject } from '@utils/common';
import { EventsPanel } from '../style';
import RootItem from './rootItem';
import EventContext, { TYPE_CURRENT_EVENT_INFO } from '../context';
// import LeftItems from './leftItems';
import '../index.less';

const SortableItem = SortableElement(({ item, rootIndex, setEventIndex, eventIndex }) => {
  return <RootItem {...{ item, rootIndex, setEventIndex, eventIndex }} />;
});

const SortableList = SortableContainer(({ childList, setEventIndex, eventIndex }) => {
  return (
    <EventsPanel>
      {childList?.map((item, index) => (
        <SortableItem
          key={item.event_id}
          {...{
            item,
            index,
            rootIndex: index,
            setEventIndex,
            eventIndex,
          }}
        />
      ))}
    </EventsPanel>
  );
});

const TestResult = (props) => {
  const { eventList, currentEventInfo, onClickMore, statusList } = props;

  const [eventIndex, setEventIndex] = useState(null);

  const params = {
    key: 'event_id',
    parent: 'parent_event_id',
    children: 'childEvents',
  };

  const nodeSort = (pre, after) => pre.sort - after.sort;

  const treeList = arrayToTreeObject(eventList, params)?.sort(nodeSort);

  return (
    <EventContext.Provider
      value={{
        eventItemMode: 'executeTest',
        readOnly: true,
        setEventList: () => void 0,
        currentEventInfo,
        onClickMore,
        statusList,
      }}
    >
      <SortableList
        {...{
          eventIndex,
          setEventIndex,
          useDragHandle: true,
          lockAxis: 'y',
          childList: treeList,
          helperClass: 'is-sorting',
        }}
      />
    </EventContext.Provider>
  );
};

export default TestResult;
