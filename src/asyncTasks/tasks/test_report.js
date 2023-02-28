// import { TestReports } from '@indexedDB/runner';
import { isUndefined } from 'lodash';
// import { saveProcessReports, deleteProcessReports } from '@services/test';

const saveReport = async (taskInfo) => {
    const reportInfo = await TestReports.get(taskInfo.payload);
    if (isUndefined(reportInfo)) {
        return Promise.resolve();
    }
    return new Promise((resove, reject) => {
        saveProcessReports({ ...reportInfo, is_socket: 1 }).subscribe({
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

const deleteReport = async (taskInfo) => {
    return new Promise ((resove, reject) => {
        deleteProcessReports({ ...taskInfo.payload, is_socket: 1 }).subscribe({
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
    SAVE: saveReport,
    DELETE: deleteReport,
};
