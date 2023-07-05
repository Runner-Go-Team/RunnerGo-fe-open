import i18next from "i18next";

export const TABS_MENUS = [
    {
        type: 'cloneTarget',
        title: i18next.t('apis.cloneCurrentTag'),
        action: 'cloneTarget',
    },
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
    {
        type: 'saveAllTarget',
        title: i18next.t('apis.saveAllTarget'),
        action: 'saveAllTarget',
    },
];

export default TABS_MENUS;
