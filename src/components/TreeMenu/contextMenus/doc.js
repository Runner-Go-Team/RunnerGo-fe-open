import { isMac } from '@utils/common';

const ctrl = isMac() ? 'Cmd' : 'Ctrl';

export const DOC_MENUS = [
    {
        type: 'shareDoc',
        title: '分享文档',
        action: 'shareDoc',
    },
    {
        type: 'copyDoc',
        title: '复制文档',
        action: 'copyDoc',
    },
    {
        type: 'cloneDoc',
        title: '克隆文档',
        action: 'cloneDoc',
        tips: `${ctrl} + D`,
    },
    {
        type: 'deleteDoc',
        title: '删除文档',
        action: 'deleteDoc',
    },
];

export default DOC_MENUS;
