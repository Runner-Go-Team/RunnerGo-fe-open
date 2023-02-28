// import { saveUserProjectParamsRequest } from '@services/projects';
// import { UserProjects } from '@indexedDB/project';
import { isObject, isUndefined } from 'lodash';

const saveProjectParams = async (taskInfo) => {
    const project = await UserProjects.get(taskInfo.payload);
    const request = project?.details?.request;
    request.script = project?.details?.script;

    return new Promise((resove, reject) => {
        if (isUndefined(request) || !isObject(request)) {
            resove();
        }
        saveUserProjectParamsRequest({
            request,
            is_force: 0,
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
    SAVE: saveProjectParams,
};
