import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import ResizeObserver from 'resize-observer-polyfill';

// interface Props {
//   width: number;
//   minWidth?: number;
//   onUpdateWidth: (newWidth: number) => void;
//   refTable: any;
// }

const SplitBar = (props) => {
  const { width = 0, minWidth = 200, onUpdateWidth = () => undefined, refTable } = props;

  const [scaling, setScaling] = useState(false);
  const [layoutWidth, setLayoutWidth] = useState(width);
  const [barHeight, setBarHeight] = useState(30);

  const refScaleData = useRef({
    enable: false,
    startX: width,
  });

  useEffect(() => {
    setLayoutWidth(width);
  }, [width]);

  const refSplit = useRef(null);

  const handleMouseDown = (ev) => {
    if (refSplit?.current.contains(ev.target)) {
      const { pageX } = ev;
      refScaleData.current = {
        enable: true,
        startX: pageX,
      };
      setScaling(true);
    }
  };

  // 开始调整组件高宽
  const handleMouseMove = (ev) => {
    if (refScaleData.current.enable) {
      const { pageX } = ev;
      const scaledX = pageX - refScaleData.current.startX;
      const newWidth = layoutWidth + scaledX;
      if (newWidth > minWidth) {
        setLayoutWidth(newWidth);
      } else {
        setLayoutWidth(minWidth);
      }
    }
  };

  const handleMouseUp = (ev) => {
    if (refScaleData.current.enable) {
      const { pageX } = ev;
      const scaledX = pageX - refScaleData.current.startX;
      const newWidth = layoutWidth + scaledX;
      if (newWidth > minWidth) {
        onUpdateWidth(newWidth);
      } else {
        onUpdateWidth(minWidth);
      }
    }
    refScaleData.current = {
      enable: false,
      startX: 0,
    };
    setScaling(false);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [width]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        const { height } = entry.contentRect;

        // console.log(height, '=====height======');
        setBarHeight(height);
      }
    });
    resizeObserver.observe(refTable.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [refTable]);

  return (
    <>
      <div
        ref={refSplit}
        onMouseDown={handleMouseDown}
        style={{
          left: layoutWidth,
          height: barHeight,
        }}
        className={cn({
          'td-scale': true,
          scaling,
        })}
      />
    </>
  );
};

export default SplitBar;
