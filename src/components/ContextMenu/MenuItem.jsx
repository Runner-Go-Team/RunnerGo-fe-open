import React, { useContext, useEffect } from 'react';
import { Right as ArrowRight } from 'adesign-react/icons';
import MenuContext from './context';

const MenuItem = (props) => {
  const { children, icon, childrenList = [], action } = props;

  const { setChildList = () => null, onItemClick = () => null } = useContext(MenuContext);

  useEffect(() => {
    return () => {
      setChildList([]);
    };
  }, []);

  return (
    <>
      <li
        onClick={onItemClick.bind(null, action, props)}
        onMouseEnter={setChildList.bind(null, childrenList)}
      >
        <div className="menu-item">
          {icon}
          {children}
          {childrenList && childrenList.length > 0 && <ArrowRight className="arrow-right" />}
        </div>
      </li>
    </>
  );
};

export default MenuItem;
