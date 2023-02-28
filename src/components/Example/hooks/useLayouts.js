import React, { useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const MIN_SIZE = 40; // 最小化宽度或高度
const MIN_CONTENT_SIZE = 200; // 内容区域宽度不足时最小化

const useLayouts = (props) => {
  const { direction, refContainerWarper, defaultHideTable = true } = props;

  const refContainer = useRef(null);

  const [contentLayouts, setContentLayouts] = useState(null);

  const handleResetLayouts = () => {
    if (direction === 'horizontal') {
      setContentLayouts({
        0: { width: refContainer.current.width / 2 },
        1: { flex: 1, width: 0 },
      });
    } else {
      setContentLayouts({
        0: { height: refContainer.current.height / 2 },
        1: { flex: 1, height: 0 },
      });
    }
  };

  const handleLayoutsChange = (newLayouts) => {
    // 水平方向
    if (direction === 'horizontal') {
      if (newLayouts[0].width < MIN_CONTENT_SIZE) {
        // 宽度被压缩时
        setContentLayouts({
          0: { width: MIN_SIZE },
          1: { flex: 1, width: 0 },
        });
      } else if (newLayouts[0].width > refContainer.current.width - MIN_CONTENT_SIZE) {
        // 宽度超出剩余内容时
        setContentLayouts({
          0: { flex: 1, width: 0 },
          1: { width: MIN_SIZE },
        });
      } else {
        setContentLayouts({
          0: { width: newLayouts[0].width },
          1: { flex: 1, width: 0 },
        });
      }
    }

    // 上下方向
    if (direction !== 'horizontal') {
      if (newLayouts[0].height < MIN_CONTENT_SIZE) {
        // 高度被压缩时
        setContentLayouts({
          0: { height: MIN_SIZE },
          1: { flex: 1, height: 0 },
        });
      } else if (newLayouts[0].height > refContainer.current.height - MIN_CONTENT_SIZE) {
        // 宽度超出剩余内容时
        setContentLayouts({
          0: { flex: 1, height: 0 },
          1: { height: MIN_SIZE },
        });
      } else {
        setContentLayouts({
          0: { height: newLayouts[0].height },
          1: { flex: 1, height: 0 },
        });
      }
    }
  };

  useEffect(() => {
    refContainer.current = null;
    const resizeObserver = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        // 默认隐藏table
        if (refContainer.current === null && defaultHideTable) {
          if (direction === 'horizontal') {
            setContentLayouts({
              0: { flex: 1, width: 0 },
              1: { width: MIN_SIZE },
            });
          } else {
            setContentLayouts({
              0: { flex: 1, height: 0 },
              1: { height: MIN_SIZE },
            });
          }
        } else if (refContainer.current === null) {
          if (direction === 'horizontal') {
            setContentLayouts({
              0: { width: width / 2 },
              1: { flex: 1, width: 0 },
            });
          } else {
            setContentLayouts({
              0: { height: height / 2 },
              1: { flex: 1, height: 0 },
            });
          }
        }
        refContainer.current = { width, height };
      }
    });
    resizeObserver.observe(refContainerWarper?.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [direction]);

  const leftMiniMode =
    (direction === 'horizontal' && contentLayouts?.[0]?.width === MIN_SIZE) ||
    (direction !== 'horizontal' && contentLayouts?.[0]?.height === MIN_SIZE);

  const rightMiniMode =
    (direction === 'horizontal' && contentLayouts?.[1]?.width === MIN_SIZE) ||
    (direction !== 'horizontal' && contentLayouts?.[1]?.height === MIN_SIZE);

  return {
    contentLayouts,
    handleResetLayouts,
    handleLayoutsChange,
    leftMiniMode,
    rightMiniMode,
  };
};

export default useLayouts;
