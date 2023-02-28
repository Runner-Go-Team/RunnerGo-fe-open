import React, { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import CollapseContextMenu from './CollapseContext';
import Panel from './panel';
import './index.less';

export const Collapse = (props) => {
  const { Provider } = CollapseContextMenu;
  const { children, options, contentClassName, className, defaultValue, onClick } = props;
  const [values, setValues] = useState([]);

  const handleChangeCollapse = async (key) => {
    const index = values.findIndex((it) => it === key);
    if (index > -1) {
      const list = cloneDeep(values);
      list.splice(index, 1);
      setValues(list);
    } else {
      setValues([...values, key]);
    }
    onClick && onClick(key, index > -1 ? 'close' : 'open');
  };
  useEffect(() => {
    defaultValue && setValues(defaultValue);
  }, [defaultValue]);
  return (
    <div>
      <Provider
        value={{
          openKeys: values,
          onClick: handleChangeCollapse,
        }}
      >
        {options &&
          options.map((it) => (
            <Panel
              key={it.keys}
              keys={it.keys}
              className={className}
              contentClassName={contentClassName}
              title={it.title}
            >
              {it.render && it.render(it)}
            </Panel>
          ))}
        {children}
      </Provider>
    </div>
  );
};
export default Collapse;
