import { isMac } from '@utils/common';

const ctrl = isMac() ? 'Cmd' : 'Ctrl';

import i18next from 'i18next';

export const API_MENUS = [
    // {
    //     type: 'shareApi',
    //     title: '分享接口',
    //     action: 'shareApi',
    // },
    // {
    //     type: 'cloneApi',
    //     title: '克隆接口',
    //     action: 'cloneApi',
    //     tips: `${ctrl} + D`,
    // },
    {
        type: 'cloneApi',
        title: i18next.t('apis.cloneApi'),
        action: 'cloneApi',
        // tips: `${ctrl} + C`,
    },
    // {
    //     type: 'copyApi',
    //     title: i18next.t('apis.copyApi'),
    //     action: 'copyApi'
    // },
    {
        type: 'deleteApi',
        title: i18next.t('apis.deleteApi'),
        action: 'deleteApi',
    },
];

export default API_MENUS;
