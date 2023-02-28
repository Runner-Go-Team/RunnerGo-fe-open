import React, { useRef, useState, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import _throttle from 'lodash/throttle';
import classNames from 'classnames';
import './index.less';

const DragNode = (props) => {
  const {
    style,
    children,
    index,
    nodeKey,
    beginMove = () => undefined,
    moving = () => undefined,
    moved = () => undefined,
    refHandler,
  } = props;

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
      beginMove(index);
      return { index, nodeKey };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

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
      setDragMode(mode);
      moving(item.index, index, mode);
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
        moved(item.nodeKey, nodeKey, drageMode);
      }
    },
  });

  const opacity = isDragging ? 0.15 : 1;

  drag(drop(refHandler));
  return (
    <div
      ref={preview}
      style={{ ...style, opacity }}
      className={classNames({
        'event-drag-node': true,
        'event-drag-node-top': isOver && drageMode === DRAGMODE.top,
        'event-drag-node-inside': isOver && canDrop && drageMode === DRAGMODE.inside,
        'event-drag-node-bottom': isOver && drageMode === DRAGMODE.bottom,
      })}
    >
      {children}
    </div>
  );
};

export default DragNode;
