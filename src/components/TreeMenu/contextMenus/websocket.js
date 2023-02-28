import { isMac } from '@utils/common';

const ctrl = isMac() ? 'Cmd' : 'Ctrl';

export const WEBSOCKET_MENUS = [
    {
        type: 'cloneWebSocket',
        title: '克隆WebSocket',
        action: 'cloneWebSocket',
        tips: `${ctrl} + D`,
    },
    {
        type: 'copyWebSocket',
        title: '复制WebSocket',
        action: 'copyWebSocket',
    },
    {
        type: 'shareWebSocket',
        title: '分享WebSocket',
        action: 'shareWebSocket',
    },
    {
        type: 'deleteWebSocket',
        title: '删除WebSocket',
        action: 'deleteWebSocket',
    },
];

export default WEBSOCKET_MENUS;
