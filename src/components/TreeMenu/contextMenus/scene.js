import i18next from "i18next";

export const SCENE_MENUS = [
    {
        type: 'modifyFolder',
        title: i18next.t('scene.editScene'),
        action: 'modifyFolder',
    },
    {
        type: 'cloneScene',
        title: i18next.t('scene.cloneScene'),
        action: 'cloneScene',
    },
    {
        type: 'deleteFolder',
        title: i18next.t('scene.deleteScene'),
        action: 'deleteFolder',
    },
];

export default SCENE_MENUS;
