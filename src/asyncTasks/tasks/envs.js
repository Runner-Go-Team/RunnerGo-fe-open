// import { saveEnvRequest, deleteEnvRequest } from '@services/envs';
// import { Envs } from '@indexedDB/project';
import isUndefined from 'lodash/isUndefined';
import isObject from 'lodash/isObject';

const saveEnv = async (taskInfo) => {
    return new Promise ((resove, reject) => {
        Envs.get(taskInfo.payload)
            .then((env) => {
                if (isUndefined(env) || !isObject(env)) {
                    resove();
                }
                env.env_vars = env.list;
                saveEnvRequest(env).subscribe({
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
            })
            .carch(() => {
                reject();
            });
    });
};

const deleteEnv = (taskInfo) => {
    return new Promise ((resove, reject) => {
        deleteEnvRequest({
            env_id: taskInfo.payload,
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
    SAVE: saveEnv,
    DELETE: deleteEnv,
};
