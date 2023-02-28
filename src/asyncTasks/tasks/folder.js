// import { SaveTargetRequest } from '@services/apis';
// import { Collection } from '@indexedDB/project';
import { isObject, isUndefined } from 'lodash';

const saveFolder = async (taskInfo) => {
    const folder = await Collection.get(taskInfo.payload);
    return new Promise ((resove, reject) => {
        if (isUndefined(folder) || !isObject(folder)) {
            resove();
        }
        SaveTargetRequest({ ...folder, is_socket: 1 }).subscribe({
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
    SAVE: saveFolder,
};
