// import { uploadUserProjectRequest } from '@services/projects';
// import { UserProjects, Collection } from '@indexedDB/project';
// import { Task, Await_Task } from '@indexedDB/asyn_task';
import isUndefined from 'lodash/isUndefined';
import { from } from 'rxjs';

// 上传用户本地项目信息
const addUserProjects = async (taskInfo) => {
    const uuid = localStorage.getItem('uuid');
    if (uuid === null) {
        return Promise.reject();
    }

    const userProjectId = taskInfo?.payload;

    const localProject = await UserProjects.get(userProjectId);
    // 本地项目不存在，视为已上传
    if (
        isUndefined(localProject) ||
        !localProject.hasOwnProperty('is_push') ||
        localProject.is_push !== -1
    ) {
        return Promise.resolve();
    }
    return new Promise((resove, reject) => {
        localProject.intro = localProject.description || '';
        from(uploadUserProjectRequest(localProject))
            .subscribe(async (resp) => {
                if (resp?.code === 10000) {
                    if (isUndefined(resp?.data?.project_id)) {
                        resove();
                        return;
                    }
                    if (resp.data?.project_id !== resp?.data?.request_project_id) {
                        // 替换旧的project_id
                        UserProjects.where('project_id').anyOf(resp?.data?.request_project_id).modify({
                            project_id: resp?.data?.request_project_id,
                            is_push: 1,
                        });
                        Collection.where('project_id').anyOf(resp?.data?.request_project_id).modify({
                            project_id: resp?.data?.request_project_id,
                        });
                        Await_Task.where('project_id').anyOf(resp?.data?.request_project_id).modify({
                            project_id: resp?.data?.request_project_id,
                        });
                        Task.where('project_id').anyOf(resp?.data?.request_project_id).modify({
                            project_id: resp?.data?.request_project_id,
                        });
                    }
                    resove();
                } else {
                    reject();
                }
            })
            .catch(() => {
                reject();
            });
    });
};

export default {
    SAVE: addUserProjects,
};
