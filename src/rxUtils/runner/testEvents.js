import { TestEvents } from '@indexedDB/runner';
import { ITestEvents } from '@models/runner/testEvents';
import { arrayToTreeObject } from '@utils/common';
import { isArray, sortBy } from 'lodash';

export const saveLocalTestEvents = async (test_id, eventList) => {
    // step1，先删除归属到原测试用例下的event list

    await TestEvents.where({ test_id }).delete();
    await TestEvents.bulkPut(eventList);
};

export const getLocalEventList = async (test_id) => {
    const list = await TestEvents.where({ test_id }).toArray();

    if (isArray(list)) {
        return list.sort((a, b) => a.sort - b.sort);
    }
    return [];
};

export const getLocalProjectEventList = async (project_id) => {
    const list = await TestEvents.where({ project_id }).toArray();
    if (isArray(list)) {
        return list.sort((a, b) => a.sort - b.sort);
    }
    return [];
};

// 获取带层级关系的事件列表
export const getEventTreeList = (eventList) => {
    if (!isArray(eventList)) {
        return [];
    }
    const sortedList = sortBy(eventList, ['sort']);
    const beautifyList = sortedList?.map((item) => {
        const { parent_event_id: parent_id, childEvent: children, ...restItem } = item;
        return {
            ...restItem,
            children,
            parent_id,
        };
    });

    const treeList = arrayToTreeObject(beautifyList, {
        key: 'event_id',
        parent: 'parent_id',
        children: 'children',
    });

    return treeList;
};

export default {
    saveLocalTestEvents,
    getLocalProjectEventList,
    getLocalEventList,
};
