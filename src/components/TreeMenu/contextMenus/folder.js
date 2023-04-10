import Beta from '@assets/icons/beta.svg';
import i18next, { t } from 'i18next';

export const FOLDER_MENUS = [
    // {
    //     type: 'create',
    //     title: '新建',
    //     action: '',
    // },
    // {
    //     type: 'pasteToCurrent',
    //     title: '粘贴至该目录',
    //     action: 'pasteToCurrent',
    //     // tips: `${ctrl} + V`,
    // },
    {
        type: 'createApi',
        title: i18next.t('apis.createApi'),
        action: 'createApi'
    },
    {
        type: 'modifyFolder',
        title: i18next.t('apis.editFolder'),
        action: 'modifyFolder',
    },
    // {
    //     type: 'shareFolder',
    //     title: '分享目录',
    //     action: 'shareFolder',
    // },
    // {
    //     type: 'copyFolder',
    //     title: '复制目录',
    //     action: 'copyFolder',
    //     // tips: `${ctrl} + C`,
    // },
    {
        type: 'deleteFolder',
        title: i18next.t('apis.deleteFolder'),
        action: 'deleteFolder',
    },
];

export default FOLDER_MENUS;


