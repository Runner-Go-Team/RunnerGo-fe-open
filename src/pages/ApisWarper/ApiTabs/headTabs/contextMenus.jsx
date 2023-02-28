import i18next from "i18next";

export const TABS_MENUS = [
    // {
    //     type: 'cloneTarget',
    //     title: '克隆当前标签',
    //     action: 'cloneTarget',
    // },
    // {
    //     type: 'closeTarget',
    //     title: '关闭当前标签',
    //     action: 'closeTarget',
    // },
    {
        type: 'closeAllTarget',
        title: i18next.t('apis.closeAllTarget'),
        action: 'closeAllTarget',
    },
    {
        type: 'focreCloseAllTarget',
        title: i18next.t('apis.focreCloseAllTarget'),
        action: 'focreCloseAllTarget',
    },
    {
        type: 'closeOtherTarget',
        title: i18next.t('apis.closeOtherTargetById'),
        action: 'closeOtherTarget',
    },
    {
        type: 'focreCloseOtherTarget',
        title: i18next.t('apis.focreCloseOtherTargetById'),
        action: 'focreCloseOtherTarget',
    },
    // {
    //     type: 'saveAllTarget',
    //     title: '保存所有标签',
    //     action: 'saveAllTarget',
    // },
];

export default TABS_MENUS;
