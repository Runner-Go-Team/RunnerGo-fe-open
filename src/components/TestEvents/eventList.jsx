import React, { useContext } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { isArray } from 'lodash';
import { EventListWrapper } from './style';
import NodeItem from './nodeItem';
import Context from './context';

const SortableItem = SortableElement(({ item, path }) => {
  return <NodeItem {...{ item, path }} />;
});

const SortableList = SortableContainer(({ childList, path }) => {
  return (
    <div>
      <EventListWrapper>
        {childList?.map((item, index) => (
          <SortableItem
            key={item.event_id}
            {...{
              item,
              index,
              path: [...path, index],
            }}
          />
        ))}
      </EventListWrapper>
    </div>
  );
});

const EventList = (props) => {
  const { childList, path } = props;

  const { handleItemSortEnd = () => undefined } = useContext(Context);

  const childDataList = isArray(childList) ? childList?.sort((a, b) => a.sort - b.sort) : [];

  return (
    <SortableList
      {...{
        childList: childDataList,
        useDragHandle: true,
        lockAxis: 'y',
        onSortEnd: handleItemSortEnd.bind(null, childList),
        path,
        helperClass: 'is-sorting',
      }}
    />
  );
};

export default EventList;
