// import { MarkSaveRequest, MarkDelRequest } from '@services/projects';
// import { UserProjects } from '@indexedDB/project';
import isUndefined from 'lodash/isUndefined';
import isObject from 'lodash/isObject';
import { isArray, isPlainObject } from 'lodash';

const saveMark = async (taskInfo) => {
    const { payload, project_id } = taskInfo;
    const uuid = localStorage.getItem('uuid');
    const project = UserProjects.get(`${project_id}/${uuid}`);
    return new Promise ((resove, reject) => {
        if (isUndefined(project) || !isObject(project)) {
            resove();
        }
        if (!isPlainObject(project?.details) || !isArray(project?.details?.markList)) {
            resove();
        }
        const params = project.details.markList.find((item) => item?.key === payload);
        if (isUndefined(params)) {
            resove();
        }
        MarkSaveRequest({ ...params, project_id }).subscribe({
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

const deleteMark = async (taskInfo) => {
    const { payload, project_id } = taskInfo;
    return new Promise ((resove, reject) => {
        MarkDelRequest({ key: payload, project_id }).subscribe({
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
    SAVE: saveMark,
    DELETE: deleteMark,
};
