import { getClipboardText, getSafeJSON } from '@utils';
// import { Collection } from '@indexedDB/project';
import { Message } from 'adesign-react';
import { isArray, isObject, isString } from 'lodash';
import Bus from '@utils/eventBus';
import { getCoverData } from './common';

export const createApis = () => {
    Bus.$emit('addOpenItem', { type: 'api', pid: '0' });
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

export const pasteToRoot = (props) => {
    console.log(props);
    // const targetParentId = '0';
    // const targetProjectId = props.project_id;
    getClipboardText().then(async (text) => {

        if (!isString(text) || text?.length === '') {
            Message('error', '剪贴板中暂无任何内容');
            return;
        }

        Bus.$emit('pasteApi', text);
        return;

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
        console.log(copyUseFulList, targetProjectId)
        // Bus.$emit('bulkAddCollection', copyUseFulList, targetProjectId);
    });
};

export default {
    createApis,
    pasteToRoot,
};
