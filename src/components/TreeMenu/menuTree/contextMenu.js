import React from 'react';
import ContextMenu from '@components/ContextMenu';
import MenuItem from '@components/ContextMenu/MenuItem';
import { Modal, Message } from 'adesign-react';
import { isArray, isString, isUndefined, isFunction } from 'lodash';
import contextMenus from '../contextMenus';
import contextFuncs from '../contextFuncs';

const handleMenuItemClick = ({ module, action, target_id, props, open_scene, from, plan_id, running_scene }) => {
    const funcModule = contextFuncs[module][action];
    if (isFunction(funcModule) === false) {
        Message('error', '无效操作');
        return;
    }
    funcModule(target_id, props, open_scene, from, plan_id, running_scene);
};

export const handleShowContextMenu = (props, e, params) => {
    console.log(props, e, params);

    let target_id = null;
    if (params) {
        target_id = params;
    }
    const { open_scene, from, plan_id, menu, running_scene } = props;

    let module = '';
    if (isUndefined(params)) {
        module = 'root';
        if (from === 'scene' || from === 'plan' || from === 'auto_plan') {
            return;
        }
    } else if (isArray(params)) {
        module = 'multi';
    } else {
        module = params.target_type;
    }
    if (!isString(module) || !isArray(contextMenus?.[module])) {
        return;
    }
    const contextMenuRef = React.createRef(null);
    const menuList = menu?.[module];
    console.log(menu, menuList);

    const HoverMenu = (
        <div>
            <ContextMenu
                onItemClick={(action) => {
                    if (action === '') {
                        return;
                    }
                    handleMenuItemClick.call(null, { module, action, target_id, props, open_scene, from, plan_id, running_scene });
                    contextMenuRef?.current?.hideMenu();
                }}
                style={{ width: 170 }}
                hoverStyle={{ width: 170 }}
            >
                {menuList.map((item) => (
                    <MenuItem action={item.action} childrenList={item.children} key={item.action}>
                        {item.title}
                    </MenuItem>
                ))}
            </ContextMenu>
        </div>
    );
    Modal.Show(HoverMenu, { x: e.pageX, y: e.pageY }, contextMenuRef);
};
