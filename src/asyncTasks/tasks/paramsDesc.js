// import { saveGlobalDesc } from '@services/projects';
// import { UserProjects } from '@indexedDB/project';
import { isObject, isUndefined } from 'lodash';

// 参数描述异步任务
const saveParam = async (taskInfo) => {
    const uuid = localStorage.getItem('uuid');
    const projectInfo = await UserProjects.get(`${taskInfo.project_id}/${uuid}`);

    return new Promise ((resove, reject) => {
        if (
            isUndefined(projectInfo.details.globalDescriptionVars) ||
            !isObject(projectInfo.details.globalDescriptionVars)
        ) {
            resove();
        }
        saveGlobalDesc({
            is_force: 0,
            list: projectInfo.details.globalDescriptionVars,
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
    SAVE: saveParam,
};
