import { isMac } from '@utils/common';

const ctrl = isMac() ? 'Cmd' : 'Ctrl';

export const GRPC_MENUS = [
    {
        type: 'shareGrpc',
        title: '分享Grpc',
        action: 'shareGrpc',
    },
    {
        type: 'cloneGrpc',
        title: '克隆Grpc',
        action: 'cloneGrpc',
        tips: `${ctrl} + D`,
    },
    {
        type: 'copyGrpc',
        title: '复制Grpc',
        action: 'copyGrpc',
        // tips: `${ctrl} + C`,
    },
    {
        type: 'deleteGrpc',
        title: '删除Grpc',
        action: 'deleteGrpc',
    },
];

export default GRPC_MENUS;
