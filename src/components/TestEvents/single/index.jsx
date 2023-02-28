import React from 'react';
import { arrayToTreeObject } from '@utils/common';
import produce from 'immer';
import { TYPE_EVENT_TYPE, ITestEvents } from '@models/runner/testEvents';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ISingleProcessTest } from '@models/runner/singleProcessTest';
import EventContext from '../context';
import EventList from './eventList';
import '../index.less';

const TestResult = (props) => {
  const {
    dataInfo,
    eventList,
    setEventList,
    onContextMenuClick,
    onNodeSortEnd = () => void 0,
  } = props;

  const params = {
    key: 'event_id',
    parent: 'parent_event_id',
    children: 'childEvents',
  };

  const nodeSort = (pre, after) => pre.sort - after.sort;

  const treeList = arrayToTreeObject(eventList, params)?.sort(nodeSort);

  // 删除节点
  const handleDeleteItem = (event_id) => {
    const newEventList = produce(eventList, (draft) => {
      const dIndex = draft.findIndex((dItem) => dItem.event_id === event_id);
      if (dIndex !== -1) {
        draft.splice(dIndex, 1);
      }
    });
    setEventList(newEventList);
  };

  return (
    <EventContext.Provider
      value={{
        eventItemMode: 'singleTest',
        dataInfo,
        eventList,
        setEventList,
        handleDeleteItem,
        readOnly: false,
        onContextMenuClick,
        onNodeSortEnd,
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <div className="event-list-panel">
          <EventList childEvents={treeList} path={[]} />
        </div>
      </DndProvider>
    </EventContext.Provider>
  );
};

export default TestResult;
