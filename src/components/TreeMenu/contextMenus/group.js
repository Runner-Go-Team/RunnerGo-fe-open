import i18next from "i18next";

export const GROUP_MENUS = [
    {
        type: 'modifyFolder',
        title: i18next.t('scene.editGroup'),
        action: 'modifyFolder',
    },
    // {
    //     type: 'cloneGroup',
    //     title: '克隆目录',
    //     action: 'cloneGroup',
    // },
    {
        type: 'deleteFolder',
        title: i18next.t('scene.deleteGroup'),
        action: 'deleteFolder',
    },
];

export default GROUP_MENUS;
