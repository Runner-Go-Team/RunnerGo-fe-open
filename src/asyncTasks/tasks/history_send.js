// import { setHistorySendRequest } from '@services/apis';
// import { Historys } from '@indexedDB/project';
import isUndefined from 'lodash/isUndefined';
import isObject from 'lodash/isObject';

const saveHistory = async (taskInfo) => {
    const history = await Historys.get(taskInfo.payload);
    return new Promise ((resove, reject) => {
        if (isUndefined(history) || !isObject(history)) {
            resove();
        }
        setHistorySendRequest({
            project_id: history.project_id,
            target_info: history,
        }).subscribe({
            next: (resp) => {
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
    SAVE: saveHistory,
};
