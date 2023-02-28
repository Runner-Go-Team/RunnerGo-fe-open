// import { createShareRequest, deleteShareDataRequest } from '@services/share';
// import { ShareList } from '@indexedDB/share';
import isUndefined from 'lodash/isUndefined';

const saveShareInfo = async (taskInfo) => {
    const shareInfo = await ShareList.get(taskInfo.payload);
    if (isUndefined(shareInfo)) {
        return Promise.resolve();
    }
    return new Promise((resove, reject) => {
        createShareRequest(shareInfo).subscribe({
            next: async (resp) => {
                if (resp?.code === 10000) {
                    // 修改本地数据库is_push 状态
                    const newShareInfo = {
                        ...shareInfo,
                        is_push: 1,
                    };
                    await ShareList.update(shareInfo.issue_id, newShareInfo);
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

const deleteShareInfo = async (taskInfo) => {
    return new Promise((resove, reject) => {
        deleteShareDataRequest(taskInfo.payload).subscribe({
            next: async (resp) => {
                if (resp?.code === 10000) {
                    await ShareList.delete(taskInfo?.payload?.issue_id);
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
    SAVE: saveShareInfo,
    DELETE: deleteShareInfo,
};
