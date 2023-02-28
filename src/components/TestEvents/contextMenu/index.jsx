import React from 'react';
import ContextMenu from '@components/ContextMenu';
import MenuItem from '@components/ContextMenu/MenuItem';
import { Modal } from 'adesign-react';
import { ContextMenuWraper } from './style';
import CONTEXT_MENUS from './menus';

export const handleShowContextMenu = (eventItem, onContextMenuClick, e) => {
  e.preventDefault();
  e.stopPropagation();

  const module = eventItem.type;

  const contextMenuRef = React.createRef(null);
  const menuList = CONTEXT_MENUS?.[module];

  if (menuList.length === 0) {
    return <></>;
  }

  const handleItemClick = (type) => {
    onContextMenuClick(type, eventItem);
  };

  const HoverMenu = (
    <>
      <ContextMenuWraper>
        <ContextMenu
          onItemClick={(type) => {
            if (type === '') {
              return;
            }
            handleItemClick(type);
            contextMenuRef?.current?.hideMenu();
          }}
          style={{ width: 150 }}
          hoverStyle={{ width: 150 }}
        >
          {menuList.map((item) => (
            <MenuItem action={item.type} key={item.type}>
              {item.title}
            </MenuItem>
          ))}
        </ContextMenu>
      </ContextMenuWraper>
    </>
  );
  Modal.Show(HoverMenu, { x: e.pageX - 140, y: e.pageY + 20 }, contextMenuRef);
};
