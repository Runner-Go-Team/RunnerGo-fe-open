import React, { useState, useContext, useRef, useCallback } from 'react';
import { CaretRight, Menu1 as SvgSort, Refresh1 as SvgRefresh } from 'adesign-react/icons';
import { useDrag, useDrop } from 'react-dnd';
import _throttle from 'lodash/throttle';
import classNames from 'classnames';
import { Button } from 'adesign-react';
import { isArray, isString, isUndefined } from 'lodash';
import produce from 'immer';
import { handleShowContextMenu } from '@busModules/TestEvents/contextMenu';
import ScriptBox from '@components/ScriptBox';
import ApiRunner from '@busModules/apiRunner';
import Controllers from '../controllers';
import ItemAfterfix from '../controllers/wrapper/itemAfterfix';
import EventListPanel from './eventList';
import Context from '../context';
import useRunApi from './hooks/useRunApi';
import './index.less';
import './DragTreeNode/index.less';

const RootItem = (props) => {
  const { path, index, item } = props;
  const [isExpand, setIsExpand] = useState(true);

  const refHandler = useRef(null);
  const refContainer = useRef(null);
  const eventId = item.event_id;
  const eventPath = isArray(path) ? path.concat(index) : [index];

  const { dataInfo, eventList, setEventList, onContextMenuClick, onNodeSortEnd } =
    useContext(Context);

  const handleChange = (key, newVal) => {
    const newList = produce(eventList, (draft) => {
      const dIndex = draft.findIndex((dItem) => dItem.event_id === item.event_id);
      draft[dIndex][key] = newVal;
    });
    setEventList(newList);
  };

  const renderEventContent = (itemType) => {
    if (!isString(itemType)) {
      return <></>;
    }
    const EventNode = Controllers?.[item?.type];
    if (isUndefined(EventNode)) {
      return <></>;
    }
    return <EventNode value={item?.data} onChange={handleChange.bind(null, 'data')} />;
  };

  const className = (type) => {
    return `event-item-wraper ${type}`;
  };

  const handleChangeScript = (content) => {
    handleChange('data', {
      ...item.data,
      content,
    });
  };

  const DRAGMODE = {
    top: 'top',
    inside: 'inside',
    bottom: 'bottom',
  };

  const [drageMode, setDragMode] = useState(null);
  // const ref = useRef(null);
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'card',
    item: () => {
      return { index, nodeKey: item.event_id };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // const drageMode = useRef(null);

  const handleHover = useCallback(
    _throttle((item, monitor) => {
      if (!refHandler?.current) {
        return;
      }
      const hoverBoundingRect = refHandler.current?.getBoundingClientRect();
      const hoverHeight = hoverBoundingRect.bottom - hoverBoundingRect.top;
      const clientOffset = monitor.getClientOffset();
      let mode = null;
      if (clientOffset === null || hoverBoundingRect === null) {
        return;
      }
      if (clientOffset.y < hoverBoundingRect.y + hoverHeight / 3) {
        mode = DRAGMODE.top;
      } else if (
        clientOffset.y >= hoverBoundingRect.y + hoverHeight / 3 &&
        clientOffset.y < hoverBoundingRect.y + hoverHeight * (2 / 3)
      ) {
        mode = DRAGMODE.inside;
      } else {
        mode = DRAGMODE.bottom;
      }
      // drageMode.current = mode;
      setDragMode(mode);
      // moving(item.index, index, mode);
    }, 50),
    []
  );

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'card',
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
    hover: handleHover,
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        onNodeSortEnd(item.nodeKey, eventId, drageMode);
      }
    },
  });

  const opacity = isDragging ? 0.15 : 1;

  drag(refHandler);
  drop(refContainer);

  const { showRequest, reportInfo, requesting, handleToRequest, handleToggleShowRequest } =
    useRunApi({
      testInfo: dataInfo,
      eventInfo: item,
    });

  return (
    <div
      style={{ opacity }}
      className={classNames({
        'event-drag-node': true,
        'event-drag-node-top': isOver && drageMode === DRAGMODE.top,
        'event-drag-node-inside': isOver && canDrop && drageMode === DRAGMODE.inside,
        'event-drag-node-bottom': isOver && drageMode === DRAGMODE.bottom,
      })}
    >
      <div ref={refContainer} className={className(item.type)}>
        <div ref={refHandler} className="sort-item">
          <SvgSort />
        </div>
        <div className="event-item-panel">
          <div className="primary-node" ref={preview}>
            <div className="drag-line"></div>
            <div className="expand-item">
              <CaretRight
                className="expand-icon"
                onClick={setIsExpand.bind(null, !isExpand)}
                style={{
                  transform: isExpand ? 'rotate(90deg)' : 'none',
                }}
              />
            </div>
            <div className="main-wraper" onClick={handleToggleShowRequest}>
              <div className="event-path">
                {eventPath.map((pIndex) => pIndex + 1).join('-')}
              </div>
              {renderEventContent(item?.type)}
            </div>
            <div className="button-item">
              {item.type === 'api' && (
                <>
                  {reportInfo !== null && isString(reportInfo.response?.status) && (
                    <>{reportInfo.response?.status}</>
                  )}
                  <Button
                    onClick={handleToRequest}
                    className={classNames('btn-execute', {
                      requesting,
                    })}
                  >
                    {requesting ? <SvgRefresh /> : <CaretRight />}
                  </Button>
                </>
              )}

              <ItemAfterfix
                isRoot={false}
                eventItemMode="singleTest"
                item={item}
                handleChange={handleChange}
              />
            </div>
          </div>
          <div className="child-node">
            <div className="item-padding" style={{ width: 20 * eventPath.length }} />
            <div className="event-list">
              {['script', 'assert'].includes(item?.type) && isExpand === true && (
                <div className="script-panel">
                  <ScriptBox value={item?.data?.content} onChange={handleChangeScript} />
                </div>
              )}
              {showRequest && item.type === 'api' && reportInfo !== null && (
                <div className="api-runner-box">
                  {isUndefined(reportInfo?.response?.data) ? (
                    <>{reportInfo?.response.message}</>
                  ) : (
                    <ApiRunner value={reportInfo} />
                  )}
                </div>
              )}
              {isExpand && <EventListPanel childEvents={item.childEvents} path={eventPath} />}
            </div>
          </div>
          <div className="buttons-panel">
            <Button
              className="apipost-light-btn"
              onClick={handleShowContextMenu.bind(null, item, onContextMenuClick)}
            >
              添加子控制器
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RootItem;
