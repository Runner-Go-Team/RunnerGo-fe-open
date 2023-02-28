import React, { useState } from 'react';
import { CaretRight } from 'adesign-react/icons';
import { isArray } from 'lodash';
import Controllers from '../controllers';
import EventWrapper from '../controllers/wrapper';
import { RootEventItem } from '../style';
import EventListPanel from '../eventList';

const RootItem = (props) => {
  const { rootIndex, eventIndex, item, setEventIndex = () => undefined } = props;
  const [isExpand, setIsExpand] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // 非叶子节点
  const hasChild = isArray(item?.childEvents) && item?.childEvents.length > 0;
  const EventNode = Controllers[item.type];

  const handleChange = (key, newVal) => {};

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
          handleChange={handleChange}
          item={item}
        >
          <EventNode value={item?.data} onChange={handleChange.bind(null, 'data')} />
        </EventWrapper>
        {hasChild && isExpand && <EventListPanel childList={item.childEvents} path={[rootIndex]} />}
      </div>
    </RootEventItem>
  );
};

export default RootItem;
