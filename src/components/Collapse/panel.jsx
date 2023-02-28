import React, { useState, useContext } from 'react';
import classnams from 'classnames';
import Context from './CollapseContext';
import './index.less';

const perfix = 'api-post-collapse';
export const Panel = (props) => {
  const CollapseContext = useContext(Context);
  const { keys } = props;
  const { openKeys, onClick } = CollapseContext;
  const { children, className, contentClassName, title } = props;
  const handleChangeCollapse = () => {
    onClick(keys);
  };
  const titleClassNames = classnams(className, {
    [perfix]: true,
  });
  const renderContentClassname = classnams(contentClassName, {
    [perfix]: true,
    [`${perfix}_show`]: openKeys.includes(keys),
    [`${perfix}_hide`]: !openKeys.includes(keys),
  });
  return (
    <>
      <div className={titleClassNames} onClick={handleChangeCollapse}>
        {title}
      </div>
      <span className={renderContentClassname}>{openKeys.includes(keys) && children}</span>
    </>
  );
};

export default Panel;
