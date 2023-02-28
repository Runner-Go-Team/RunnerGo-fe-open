import React from 'react';
import ContextMenu from '@components/ContextMenu';
import MenuItem from '@components/ContextMenu/MenuItem';
import { Modal, Message } from 'adesign-react';
import i18next from 'i18next';
import Bus, { useEventBus } from '@utils/eventBus';


export const handleShowContextMenu = (e, item, callback) => {

    const { case_id } = item;

    const contextMenuRef = React.createRef(null);

    const HoverMenu = (
        <div>
            <ContextMenu
                onItemClick={(action) => {
                    if (action === 1) {
                        Bus.$emit('cloneCase', case_id, callback)
                    } else if (action === 2) {
                        callback(1, item);
                    } else if (action === 3) {
                        Bus.$emit('deleteCase', case_id, callback);
                    }
                     contextMenuRef?.current?.hideMenu();
                }}
                style={{ width: 140 }}
                hoverStyle={{ width: 140 }}
            >
                <MenuItem action={1}>
                    {i18next.t('case.cloneCase')}
                </MenuItem>
                <MenuItem action={2}>
                    {i18next.t('case.editCase')}
                </MenuItem>
                <MenuItem style={{ color: 'var(--delete-red)' }} action={3}>
                    {i18next.t('case.deleteCase')}
                </MenuItem>
            </ContextMenu>
        </div>
    );
    Modal.Show(HoverMenu, { x: e.pageX, y: e.pageY }, contextMenuRef);
};
