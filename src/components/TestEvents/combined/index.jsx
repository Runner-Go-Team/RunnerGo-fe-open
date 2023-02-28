import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { ISingleProcessTest } from '@models/runner/singleProcessTest';
import { cloneDeep, isArray } from 'lodash';
import { EventsPanel } from '../style';
import RootItem from './rootItem';
import EventContext, { TYPE_SORT_PARAMS } from '../context';
import '../index.less';

const SortableItem = SortableElement(({ item, rootIndex, eventList }) => {
  return <RootItem {...{ item, rootIndex, eventList }} />;
});

const SortableList = SortableContainer(({ childList }) => {
  return (
    <EventsPanel>
      {childList?.map((item, index) => (
        <SortableItem
          key={`${item?.test_id}`}
          {...{
            item,
            eventList: isArray(item?.event_list) ? item?.event_list : [],
            index,
            rootIndex: index,
          }}
        />
      ))}
    </EventsPanel>
  );
});

const TestEvents = (props) => {
  const {
    testItemList,
    onDeleteTestItem = () => undefined,
    onTestItemSort = () => undefined,
  } = props;

  const handleItemSortEnd = (params) => {
    const { oldIndex, newIndex } = params;
    const tempList = cloneDeep(testItemList);
    const sourceData = tempList[oldIndex];
    tempList.splice(oldIndex, 1);
    tempList.splice(newIndex, 0, sourceData);
    onTestItemSort(tempList);
  };

  return (
    <EventContext.Provider
      value={{
        eventItemMode: 'combinedTest',
        setEventList: () => undefined,
        handleShowApiPanel: () => undefined,
        handleAddEventItem: () => undefined,
        handleDeleteItem: onDeleteTestItem,
        handleItemSortEnd: () => undefined,
        readOnly: true,
      }}
    >
      <SortableList
        {...{
          useDragHandle: true,
          lockAxis: 'y',
          childList: testItemList,
          helperClass: 'is-sorting',
          onSortEnd: handleItemSortEnd,
        }}
      />
    </EventContext.Provider>
  );
};

export default TestEvents;
