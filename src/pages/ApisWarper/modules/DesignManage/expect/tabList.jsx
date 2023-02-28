import React from 'react';
import cn from 'classnames';
import { Setting1 as Setting1Svg } from 'adesign-react/icons';

const TabList = (props) => {
  const { tabList, activeId, setActiveId } = props;

  return (
    <div className="header-left">
      {tabList.map((item, index) => {
        return (
          <div
            onClick={setActiveId.bind(null, item?.props?.id)}
            className={cn('header-item', { active: activeId === item?.props?.id })}
            key={item?.props?.id || index}
          >
            {item}
            <Setting1Svg
              width="16px"
              height="16px"
              onClick={(e) => {
                e.stopPropagation();
              }}
            ></Setting1Svg>
          </div>
        );
      })}
    </div>
  );
};

export default TabList;
