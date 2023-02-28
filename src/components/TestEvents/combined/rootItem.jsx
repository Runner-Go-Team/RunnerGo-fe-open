import React, { useState } from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import { CaretRight, Menu1 as SvgSort } from 'adesign-react/icons';
import { isArray } from 'lodash';
import { ITestEvents } from '@models/runner/testEvents';
import { arrayToTreeObject } from '@utils/common';
import EventWrapper from '../controllers/wrapper';
import { RootEventItem } from '../style';
import EventListPanel from '../eventList';

const RootTestItem = (nodeProps) => {
  const { eventList, rootIndex, item } = nodeProps;
  const [isExpand, setIsExpand] = useState(true);

  const DragHandle = SortableHandle(() => <SvgSort />);

  const hasChild = isArray(eventList) && eventList.length > 0;

  const params = {
    key: 'event_id',
    parent: 'parent_event_id',
    children: 'childEvents',
  };

  const nodeSort = (pre, after) => pre.sort - after.sort;

  const treeList = isArray(eventList)
    ? arrayToTreeObject(eventList, params).sort(nodeSort)
    : [];

  return (
    <RootEventItem>
      <div className="expand-panel">
        {hasChild && (
          <CaretRight
            className="expand-icon"
            onClick={setIsExpand.bind(null, !isExpand)}
            style={{
              transform: isExpand ? 'rotate(90deg)' : 'none',
            }}
          />
        )}
      </div>
      <div className="events-main-panel">
        <EventWrapper
          isRoot
          className="root-node"
          rootIndex={rootIndex}
          handleChange={() => undefined}
          item={item}
        >
          {item?.name}
        </EventWrapper>
        {hasChild && isExpand && <EventListPanel childList={treeList} path={[rootIndex]} />}
      </div>
      <div className="btn-right">
        <DragHandle />
      </div>
    </RootEventItem>
  );
};

export default RootTestItem;
