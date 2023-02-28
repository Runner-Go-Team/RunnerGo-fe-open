/* eslint-disable no-await-in-loop */
import { v4 as uuidV4 } from 'uuid';
import dayjs from 'dayjs';
// import { Collection } from '@indexedDB/project';
import { cloneDeep, isString } from 'lodash';
import { global$ } from '@hooks/useGlobal/global';
import { DelApiRequest, fetchDeleteApi } from '@services/apis';
import { pushTask } from '@asyncTasks/index';
import Bus from '@utils/eventBus';
import { Message } from 'adesign-react';

export const pasteData = () => { };

// 获取树形对象/或带有子数据的数组内部数据列表
export const getMultiDataList = (treeData) => {
    const dataList = [];
    const digObjectItem = (data) => {
        const { children, ...dataInfo } = data;
        dataList.push(dataInfo);
        if (dataInfo.target_type === 'folder' && Array.isArray(children)) {
            for (let i = 0; i < children.length; i++) {
                digObjectItem(children[i]);
            }
        }
    };
    if (Array.isArray(treeData)) {
        for (let i = 0; i < treeData.length; i++) {
            digObjectItem(treeData[i]);
        }
    } else {
        digObjectItem(treeData);
    }
    return dataList;
};

/*
遍历简要数据，获取本地indexDB中最新值
dataInfo:简要数据
return:完整数据
*/
export const getFullData = async (dataInfo) => {
    if (Array.isArray(dataInfo)) {
        const list = [];
        for (const item of dataInfo) {
            const { sort, parent_id } = item;
            const newData = await Collection.get(item.target_id);
            list.push({ ...newData, sort, parent_id });
        }
        return list;
    }
    const { sort, parent_id } = dataInfo;
    const newDataInfo = await Collection.get(dataInfo.target_id);
    return { ...newDataInfo, sort, parent_id };
};

// 生成复制内容并生成新的target_id,parent_id
export const getCoverData = (
    preData,
    target_parent_id = '0',
    target_project_id = '-1',
    indexSort = 0
) => {
    const tempData = {};

    const digData = (childList, newParentId, indexSort) => {
        for (let i = 0; i < childList.length; i++) {
            const item = childList[i];
            const newTargetId = uuidV4();
            const itemChild = preData.filter((d) => d.parent_id === item.target_id);
            digData(itemChild, newTargetId, 1);
            tempData[item.target_id].target_id = newTargetId;
            tempData[item.target_id].parent_id = newParentId;
            tempData[item.target_id].project_id = target_project_id;
            tempData[item.target_id].sort = indexSort + i;
        }
    };

    if (Array.isArray(preData)) {
        for (const item of preData) {
            tempData[item.target_id] = { ...item };
        }
        digData(
            preData.filter((d) => d.parent_id === '0'),
            target_parent_id,
            indexSort + 1
        );
    } else {
        return {
            ...preData,
            target_id: uuidV4(),
            parent_id: target_parent_id,
            project_id: target_project_id,
            sort: indexSort + 1,
        };
    }
    return Object.values(tempData).filter((d) => isString(d?.target_type));
};

export const deleteMultiData = async (target_id) => {
    const deleteIds = Array.isArray(target_id) ? target_id : [target_id];

    for (const targetId of deleteIds) {
        // Collection.update(targetId, {
        //     status: -1,
        //     update_dtime: dayjs().valueOf(),
        // });
        Bus.$emit('removeOpenItem', targetId);
    }

    fetchDeleteApi({
        target_id: target_id
    }).subscribe({
        next (resp) {
            const { code } = resp;
            if (code === 0) {
                Message('success', '删除成功!');
                // todo
                global$.next({
                    action: 'GET_APILIST',
                    payload: {
                        page: 1,
                        size: 100,
                        team_id: localStorage.getItem('team_id')
                    },
                });
            } else {
                Message('error', '删除失败!');
            }
        },
        error (err) {
            pushTask({
                task_id: targetIds.toString(),
                action: 'DELETE',
                model: 'API',
                payload: deleteIds,
                project_id,
            });
        },
    });
};

export default {
    pasteData,
};
