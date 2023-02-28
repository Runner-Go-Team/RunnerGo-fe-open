// import { CombinedProcessTest } from '@indexedDB/runner';
// import { saveProcessTest, saveProcessTestSortRequest } from '@services/test';
import { isUndefined } from 'lodash';

const saveTest = async (taskInfo) => {
    const testInfo = await CombinedProcessTest.get(taskInfo.payload);
    if (isUndefined(testInfo)) {
        return Promise.resolve();
    }
    return new Promise((resove, reject) => {
        saveProcessTest({
            ...testInfo,
            is_socket: 1,
            process_test_type: 'combined',
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
    SORT: updateSortTest,
};
