import {
    updateCollectionSortRequest,
    SaveTargetRequest,
    restoreApiRequest,
    DelApiRequest,
    addMultiTargetRequest,
} from '@services/apis';
import Bus from '@utils/eventBus';
// import { Collection } from '@indexedDB/project';
import { isArray, isObject, isPlainObject, isUndefined } from 'lodash';

const handleSortTarget = async (taskInfo) => {
    return new Promise((resove, reject) => {
        updateCollectionSortRequest(taskInfo.payload).subscribe({
            next: async (resp) => {
                if (resp?.code === 10000) {
                    resove(resp);
                } else {
                    reject();
                }
            },
            error: () => {
                reject();
            },
        });
    });
};

const saveApi = async (taskInfo) => {
    const api = await Collection.get(taskInfo.payload);
    return new Promise ((resove, reject) => {
        if (isUndefined(api) || !isObject(api)) {
            resove();
        }
        SaveTargetRequest({ ...api, is_socket: 1 }).subscribe({
            next: async (resp) => {
                if (resp?.code === 10000) {
                    resove(resp);
                    // 更新本地数据库版本
                    // 更新本地数据
                    Bus.$emit('updateOpensById', {
                        id: api?.target_id,
                        data: { version: resp?.data?.version },
                    });

                    Bus.$emit('updateCollectionById', {
                        id: api?.target_id,
                        data: { version: resp?.data?.version },
                    });
                } else {
                    reject();
                }
            },
            error: () => {
                reject();
            },
        });
    });
};

const deleteApi = async (taskInfo) => {
    const { payload, project_id } = taskInfo;
    return new Promise ((resove, reject) => {
        DelApiRequest({ target_ids: payload, project_id, is_socket: 1 }).subscribe({
            next: async (resp) => {
                if (resp?.code === 10000) {
                    resove(resp);
                } else {
                    reject();
                }
            },
            error: () => {
                reject();
            },
        });
    });
};

const handleCompletelyDelete = async (taskInfo) => {
    return new Promise ((resove, reject) => {
        restoreApiRequest(taskInfo?.payload).subscribe({
            next: async (resp) => {
                if (resp?.code === 10000) {
                    resove(resp);
                } else {
                    reject();
                }
            },
            error: () => {
                reject();
            },
        });
    });
};

const batchSave = async (taskInfo) => {
    const apis = await Collection.bulkGet(taskInfo.payload);
    return new Promise ((resove, reject) => {
        if (!isArray(apis) || apis.length <= 0) {
            resove();
        }
        const useFulList = apis.filter((i) => isPlainObject(i) && !isUndefined(i));
        if (!isArray(useFulList) || useFulList.length <= 0) {
            resove();
        }
        addMultiTargetRequest({
            targets: useFulList,
            is_socket: 1,
            project_id: taskInfo.project_id,
        }).subscribe({
            next: async (resp) => {
                if (resp?.code === 10000) {
                    resove(resp);
                } else {
                    reject();
                }
            },
            error: () => {
                reject();
            },
        });
    });
};

export default {
    SORT: handleSortTarget,
    SAVE: saveApi,
    DELETE: deleteApi,
    FOREVER: handleCompletelyDelete,
    BATCHSAVE: batchSave,
};
