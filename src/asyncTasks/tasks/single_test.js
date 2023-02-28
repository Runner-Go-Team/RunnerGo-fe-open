// import { SingleProcessTest } from '@indexedDB/runner';
// import { saveProcessTest, deleteProcessTest, saveProcessTestSortRequest } from '@services/test';
import { isArray, isUndefined } from 'lodash';

const saveTest = async (taskInfo) => {
    const testInfo = await SingleProcessTest.get(taskInfo.payload);
    if (isUndefined(testInfo)) {
        return Promise.resolve();
    }

    return new Promise((resove, reject) => {
        saveProcessTest({
            ...testInfo,
            is_socket: 1,
            process_test_type: 'single',
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

const deleteTest = async (taskInfo) => {
    return new Promise ((resove, reject) => {
        deleteProcessTest({ ...taskInfo.payload, is_socket: 1 }).subscribe({
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

const updateSortTest = async (taskInfo) => {
    return new Promise ((resove, reject) => {
        saveProcessTestSortRequest(taskInfo.payload).subscribe({
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
    SAVE: saveTest,
    DELETE: deleteTest,
    SORT: updateSortTest,
};
