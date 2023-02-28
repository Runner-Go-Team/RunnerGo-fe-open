import { isMac } from '@utils/common';

const ctrl = isMac() ? 'Cmd' : 'Ctrl';
import i18next from 'i18next';

export const ROOT_MENUS = [
    {
        type: 'createApis',
        title: i18next.t('apis.createApi'),
        action: 'createApis',
        tips: `${ctrl} + T`,
    },
    // {
    //     type: 'pasteToRoot',
    //     title: i18next.t('apis.pasteApi'),
    //     action: 'pasteToRoot',
    //     // tips: `${ctrl} + V`,
    // },
];

export default ROOT_MENUS;
