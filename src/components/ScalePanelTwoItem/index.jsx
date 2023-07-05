import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Scale } from 'adesign-react';
import { useSelector } from 'react-redux';
import { isNumber } from 'lodash';

// type TYPE_LAYOUT = {
//   flex?: number;
//   width?: number;
//   height?: number;
// };

// interface ScalePanelTwoItemProps {
//   refWrapper: any; // 外部计算高度或宽度最大容器的ref
//   leftMin: any;
//   left: any;
//   rightMin: any;
//   right: any;
//   minSize?: number; // 最小化宽度或高度
//   minContentSize?: number; // 内容区域宽度不足时最小化
// }

const { ScaleItem, ScalePanel } = Scale;
const ScalePanelTwoItem = (props, forwardsRef) => {
  const { leftMin, left, rightMin, right, minSize = 40, minContentSize = 100, refWrapper, direction } = props;
  const APIS_TAB_DIRECTION = isNumber(direction) ? direction : 1;
  const [layouts, setLayouts] = useState(null);

  const refContainer = useRef(null);
  // 调整scale
  const handleLayoutsChange = (newLayouts) => {
    // 水平方向
    if (APIS_TAB_DIRECTION > 0) {
      if (newLayouts[0].width < minContentSize) {
        // 宽度被压缩时
        setLayouts({
          0: { width: minSize },
          1: { flex: 1, width: 0 },
        });
      } else if (newLayouts[0].width > refContainer.current.width - minContentSize) {
        // 宽度超出剩余内容时
        setLayouts({
          0: { flex: 1, width: 0 },
          1: { width: minSize },
        });
      } else {
        setLayouts({
          0: { width: newLayouts[0].width },
          1: { flex: 1, width: 0 },
        });
      }
    }

    // 上下方向
    if (APIS_TAB_DIRECTION !== 1) {
      if (newLayouts[0].height < minContentSize) {
        // 高度被压缩时
        setLayouts({
          0: { height: minSize },
          1: { flex: 1, height: 0 },
        });
      } else if (newLayouts[0].height > refContainer.current.height - minContentSize) {
        // 宽度超出剩余内容时
        setLayouts({
          0: { flex: 1, height: 0 },
          1: { height: minSize },
        });
      } else {
        setLayouts({
          0: { height: newLayouts[0].height },
          1: { flex: 1, height: 0 },
        });
      }
    }
  };
  const leftMiniMode =
    (APIS_TAB_DIRECTION > 0 && layouts?.[0]?.width === minSize) ||
    (APIS_TAB_DIRECTION !== 1 && layouts?.[0]?.height === minSize);

  const rightMiniMode =
    (APIS_TAB_DIRECTION > 0 && layouts?.[1]?.width === minSize) ||
    (APIS_TAB_DIRECTION !== 1 && layouts?.[1]?.height === minSize);

  const handleResetLayouts = () => {
    if (APIS_TAB_DIRECTION > 0) {
      setLayouts({
        0: { width: '20vw' },
        1: { flex: 1, width: 0 },
      });
    } else {
      setLayouts({
        0: { height: refContainer.current.height / 2 },
        1: { flex: 1, height: 0 },
      });
    }
  };
  useImperativeHandle(forwardsRef, () => {
    return {
      handleResetLayouts,
    };
  });
  useEffect(() => {
    refContainer.current = null;
    const resizeObserver = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (refContainer.current === null) {
          if (APIS_TAB_DIRECTION > 0) {
            setLayouts({
              0: { width: '20vw' },
              1: { flex: 1, width: 0 },
            });
          } else {
            setLayouts({
              0: { height: height / 2, flex: 1 },
              1: { flex: 1, height: 0 },
            });
          }
        }
        refContainer.current = { width, height };
      }
    });

    if (refWrapper?.current) {
      resizeObserver.observe(refWrapper?.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [APIS_TAB_DIRECTION, refWrapper]);

  return (
    <>
      <ScalePanel
        direction={APIS_TAB_DIRECTION > 0 ? 'horizontal' : 'vertical'}
        onLayoutsChange={handleLayoutsChange}
        layouts={layouts}
      >
        <ScaleItem minHeight={40} minWidth={40}>
          {leftMiniMode ? leftMin : left}
        </ScaleItem>
        <ScaleItem minHeight={40} minWidth={40} enableScale={false}>
          {rightMiniMode ? rightMin : right}
        </ScaleItem>
      </ScalePanel>
    </>
  );
};

export default forwardRef(ScalePanelTwoItem);
