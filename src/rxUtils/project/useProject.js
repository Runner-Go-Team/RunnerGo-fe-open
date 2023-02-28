import { UserProjects } from '@indexedDB/project';
import { isObject } from 'lodash';
import { isLogin } from '@utils/common';
import { fetchSimpleTeamProjectList } from '@services/projects';
import { iif } from 'rxjs';

// 获取本地项目全局参数信息
export const getLocalProjectParams = async (project_id, uuid) => {
    const result = {
        request: {},
        script: {},
    };

    const userProjectId = `${project_id}/${uuid}`;
    const projectInfo = await UserProjects.get(userProjectId);
    if (isObject(projectInfo)) {
        result.request = projectInfo?.details?.request;
        result.script = projectInfo?.details?.script;
    }
    return result;
};
