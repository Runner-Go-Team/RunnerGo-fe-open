import React from 'react';
import ContextMenu from '@components/ContextMenu';
import MenuItem from '@components/ContextMenu/MenuItem';
import { Modal, Message } from 'adesign-react';
import { isArray, isString, isUndefined, isFunction, isPlainObject } from 'lodash';
import contextFuncs from './contextFuncs';
import TABS_MENUS from './contextMenus';

const handleMenuItemClick = ({ action, params, props }) => {
    const funcModule = contextFuncs?.[action];
    if (isFunction(funcModule) === false) {
        Message('error', '无效操作');
        return;
    }
    funcModule({ params, props });
};

export const handleShowContextMenu = (props, e, params) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPlainObject(params)) {
        return;
    }
    const contextMenuRef = React.createRef(null);

    const HoverMenu = (
        <div>
            <ContextMenu
                onItemClick={(action) => {
                    if (action === '') {
                        return;
                    }
                    handleMenuItemClick.call(null, { action, params, props });
                    contextMenuRef?.current?.hideMenu();
                }}
                style={{ width: 170 }}
                hoverStyle={{ width: 170 }}
            >
                {TABS_MENUS.map((item) => (
                    <MenuItem action={item.action} childrenList={item.children} key={item.action}>
                        {item.title}
                    </MenuItem>
                ))}
            </ContextMenu>
        </div>
    );
    Modal.Show(HoverMenu, { x: e.pageX, y: e.pageY }, contextMenuRef);
};
