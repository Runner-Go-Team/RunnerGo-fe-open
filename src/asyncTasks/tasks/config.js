// import { setSysConfig } from '@services/user';
// import { User } from '@indexedDB/user';
import { isObject, isPlainObject, isUndefined } from 'lodash';

const saveConfig = async (taskInfo) => {
    const user = await User.get(taskInfo.payload);
    return new Promise ((resove, reject) => {
        if (isUndefined(user) || !isObject(user)) {
            resove();
        }
        if (!isPlainObject(user?.config)) {
            resove();
        }
        setSysConfig({ uuid: taskInfo.payload, configure: user.config }).subscribe({
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
    SAVE: saveConfig,
};
