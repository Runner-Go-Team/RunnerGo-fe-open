import React, { useEffect, useState } from 'react';
import './index.less';
import MenuContext from './context';

const { Provider } = MenuContext;
const ContextMenu = (props) => {
    const { style, children, hoverStyle, onItemClick = () => null } = props;

    const [childList, setChildList] = useState([]);

    const hoverMenu = (
        <div className="context-menu hover-menu" style={hoverStyle}>
            <ul>
                {childList?.map((item) => (
                    <li key={item.type} onClick={onItemClick.bind(null, item.action)}>
                        <div className="menu-item">{item.title}</div>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <Provider
            value={{
                hoverStyle,
                setChildList,
                onItemClick,
            }}
        >
            <div className="context-menu" style={style}>
                <ul>{children}</ul>
            </div>
            {Array.isArray(childList) && childList.length > 0 && hoverMenu}
        </Provider>
    );
};

export default ContextMenu;
