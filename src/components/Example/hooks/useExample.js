import React, { useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';

const defaultLayouts = {
  0: {
    width: 500,
    height: 500,
  },
  1: {
    flex: 1,
  },
};

const useExample = (props) => {
  const { refPanel, APIS_TAB_DIRECTION } = props;

  const setDefaultLayouts = () => {
    const panelWidth = refPanel.current?.offsetWidth;
    const panelHeight = refPanel.current?.offsetHeight - 104;
    if (APIS_TAB_DIRECTION > 0) {
      defaultLayouts[0].width = panelWidth / 2;
      delete defaultLayouts[0].height;
    } else {
      defaultLayouts[0].height = panelHeight / 2;
      delete defaultLayouts[0].width;
    }
  };

  const [exampleLayouts, setExampleLayouts] = useState(defaultLayouts);
  const [showRaw, setShowRaw] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // 重置layouts
  const handleResetLayouts = () => {
    setShowRaw(false);
    setShowTable(false);
    setExampleLayouts(cloneDeep(defaultLayouts));
  };

  // scale拖拽事件
  const handleLayoutsChange = (layouts, panelOffset) => {
    setExampleLayouts(layouts);
    const panelWidth = panelOffset.width || 0;
    const panelHeight = panelOffset.height || 0;
    const itemWidth = layouts[0].width || 0;
    const itemHeight = layouts[0].height || 0;
    if (APIS_TAB_DIRECTION > 0 && itemWidth) {
      // 左右分屏
      const rightWidth = panelWidth - itemWidth;
      // 左侧screen
      if (itemWidth <= 40) {
        if (!showRaw) setShowRaw(true);
      } else if (showRaw) setShowRaw(false);
      // 右侧screen
      if (rightWidth <= 40) {
        if (!showTable) setShowTable(true);
      } else if (showTable) setShowTable(false);
    } else {
      // 上下分屏
      const bottomHeight = panelHeight - itemHeight;
      // 上部screen
      if (itemHeight <= 40) {
        if (!showRaw) setShowRaw(true);
      } else if (showRaw) setShowRaw(false);
      // 底部screen
      if (bottomHeight <= 40) {
        if (!showTable) setShowTable(true);
      } else if (showTable) setShowTable(false);
    }
  };

  return {
    exampleLayouts,
    showRaw,
    showTable,
    setDefaultLayouts,
    handleResetLayouts,
    handleLayoutsChange,
  };
};

export default useExample;
