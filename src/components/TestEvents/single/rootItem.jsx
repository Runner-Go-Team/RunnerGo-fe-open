import React, { useState, useContext } from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import { CaretRight, Menu1 as SvgSort } from 'adesign-react/icons';
import { isArray } from 'lodash';
import produce from 'immer';
import Controllers from '../controllers';
import EventWrapper from '../controllers/wrapper';
import { RootEventItem } from '../style';
import EventListPanel from '../eventList';
import Context from '../context';

const RootItem = (props) => {
  const { rootIndex, item } = props;
  const [isExpand, setIsExpand] = useState(false);

  const { setEventList } = useContext(Context);

  // 非叶子节点
  const hasChild = isArray(item?.childEvents) && item?.childEvents.length > 0;
  const EventNode = Controllers[item.type];

  const DragHandle = SortableHandle(() => <SvgSort />);

  const handleChange = (key, newVal) => {
    const newList = produce((draft) => {
      const dIndex = draft.findIndex((dItem) => dItem.event_id === item.event_id);
      draft[dIndex][key] = newVal;
    });
    setEventList(newList);
  };

  return (
    <RootEventItem>
      <div className="btn-right">
        <DragHandle />
      </div>
      <div className="events-main-panel">
        <EventWrapper
          isRoot
          className="root-node"
          rootIndex={rootIndex}
          handleChange={handleChange}
          item={item}
        >
          {hasChild && (
            <CaretRight
              className="expand-icon"
              onClick={setIsExpand.bind(null, !isExpand)}
              style={{
                transform: isExpand ? 'rotate(90deg)' : 'none',
              }}
            />
          )}
          <EventNode value={item?.data} onChange={handleChange.bind(null, 'data')} />
        </EventWrapper>
        {hasChild && isExpand && <EventListPanel childList={item.childEvents} path={[rootIndex]} />}
      </div>
    </RootEventItem>
  );
};

export default RootItem;
