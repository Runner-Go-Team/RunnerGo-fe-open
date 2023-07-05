import { copyStringToClipboard, getClipboardText, getSafeJSON } from '@utils';
// import { Collection } from '@indexedDB/project';
import { Message, Modal } from 'adesign-react';
import { isArray, isObject, isPlainObject, isString, isUndefined } from 'lodash';
import Bus from '@utils/eventBus';
import { getCoverData, getFullData, deleteMultiData } from './common';
import { fetchSceneDetail } from '@services/scene';
import i18next from 'i18next';
import { global$ } from '@hooks/useGlobal/global';

export const createApi = ({ params, props }) => {
    Bus.$emit('addOpenItem', { type: 'api', pid: params.target_id });
};
export const createText = ({ props, params }) => {
    Bus.$emit('addOpenItem', { type: 'doc', pid: params.target_id });
};
export const createWebsocket = ({ props, params }) => {
    Bus.$emit('addOpenItem', { type: 'websocket', pid: params.target_id });
};
export const createGrpc = ({ props, params }) => {
    Bus.$emit('addOpenItem', { type: 'grpc', pid: params.target_id });
};

export const createChildFolder = ({ params, showModal, action }) => {
    Bus.$emit('addOpenItem', { type: 'folder', pid: params.target_id });
};
export const modifyFolder = async ({target_id}, props, a, from) => {
    // const folder = await Collection.get(params.target_id);
    // if (!isUndefined(folder) && isPlainObject(folder)) {
    let from_list = {
        'scene': 1,
        'plan': 2,
        'auto_plan': 3
    }
    fetchSceneDetail({
        team_id: localStorage.getItem('team_id'),
        target_id: [target_id],
        source: from_list[from]
    }).subscribe({
        next (res) {
            const { data: { scenes } } = res;
            props.showModal('addScene', { scene: scenes[0] });
        }
    })
    // }
};
export const cloneScene = async ({target_id}, props, a, from, plan_id) => {
    Bus.$emit('cloneScene', target_id, from, plan_id);
};

export const disableScene = async({target_id}, props, a, from, plan_id) => {
    Bus.$emit('changeSceneDisable', target_id, 1, () => {
        Message('success', i18next.t('message.disableSceneSuccess'));
        if (from === 'plan') {
            global$.next({
                action: 'RELOAD_LOCAL_PLAN',
                id: plan_id
            })
        } else if (from === 'auto_plan') {
            global$.next({
                action: 'RELOAD_LOCAL_AUTO_PLAN',
                id: plan_id
            })
        }
    });
};

export const enableScene = async({target_id}, props, a, from, plan_id) => {
    Bus.$emit('changeSceneDisable', target_id, 0, () => {
        Message('success', i18next.t('message.enableSceneSuccess'));
        if (from === 'plan') {
            global$.next({
                action: 'RELOAD_LOCAL_PLAN',
                id: plan_id
            })
        } else if (from === 'auto_plan') {
            global$.next({
                action: 'RELOAD_LOCAL_AUTO_PLAN',
                id: plan_id
            })
        }
    });
}

export const shareFolder = ({ props, params, showModal }) => {
    Bus.$emit('openModal', 'CreateShare', {
        defaultShareName: params.name,
        defaultShareMode: params.target_type,
        project_id: props.project_id,
        target_id: params.target_id,
    });
};

export const copyFolder = async ({ params }) => {
    const localData = await getFullData(params);
    const cpyiedData = getCoverData(localData);
    copyStringToClipboard(JSON.stringify(cpyiedData));
};

const getChildMaxSort = async (parent_id) => {
    const list = await Collection.where({ parent_id }).toArray();
    if (Array.isArray(list)) {
        let maxSort = list.length;
        for (const item of list) {
            if (item.sort > maxSort) {
                maxSort = item.sort;
            }
        }
        return maxSort;
    }
    return 0;
};

export const pasteToCurrent = ({ props, params }) => {
    const targetParentId = params.target_id;
    const targetProjectId = props.project_id;
    getClipboardText().then(async (text) => {
        if (!isString(text) || text?.length === '') {
            Message('error', '剪贴板中暂无任何内容');
            return;
        }

        const clipboardData = await getSafeJSON(text);
        if (!isObject(clipboardData) && !isArray(clipboardData)) {
            Message('error', '剪贴板中暂无目录信息');
        }
        const maxSort = await getChildMaxSort(targetParentId);
        const newData = getCoverData(clipboardData, targetParentId, targetProjectId, maxSort);

        const copyList = [].concat(newData);

        const copyUseFulList = [];
        const copyUseFulIdList = [];
        // 防止将一些空的无效数据复制进来
        for (const copyItem of copyList) {
            if (
                isObject(copyItem) &&
                isString(copyItem?.target_type) &&
                isString(copyItem?.name) &&
                isString(copyItem?.target_id)
            ) {
                copyUseFulList.push(copyItem);
                copyUseFulIdList.push(copyItem.target_id);
            }
        }
        Message('success', '粘贴成功！');
        Bus.$emit('bulkAddCollection', copyUseFulList, targetProjectId);
    });
};
export const pasteFolderToRoot = ({ props }) => { };
export const deleteFolder = async ({ target_id }, props, open_scene, from, plan_id, running_scene) => {
    // deleteMultiData(target_id);
    Modal.confirm({
        title: i18next.t('modal.look'),
        content: i18next.t('modal.deleteScene'),
        okText: i18next.t('btn.ok'),
        cancelText: i18next.t('btn.cancel'),
        onOk: () => {
            Bus.$emit('deleteScene', target_id, open_scene, from, plan_id, running_scene, (code) => {
                if (code === 0) {
                    Message('success', i18next.t('message.deleteSuccess'));
                }
            })
        }
    })
};

export default {
    createApi,
    createText,
    createWebsocket,
    createChildFolder,
    modifyFolder,
    shareFolder,
    copyFolder,
    pasteToCurrent,
    deleteFolder,
    createGrpc,
    cloneScene,
    enableScene,
    disableScene
};
