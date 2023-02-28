// import { UserProjects } from '@indexedDB/project';
import isUndefined from 'lodash/isUndefined';
// import { Task, Await_Task } from '@indexedDB/asyn_task';
import { filter, tap } from 'rxjs/operators';
// import { User } from '@indexedDB/user';
import { onlineStatus, isLogin } from '@utils/common';
import dayjs from 'dayjs';
import { globalTask$ } from '../global';
// import { ITaskInfo } from '../types';
import { taskState } from './state';
import { executeTask } from './executeTask';

// 获取当前项目ID
export const getCurrentProjectId = async (uuid) => {
    const userData = await User.get(uuid);
    return userData?.workspace?.CURRENT_PROJECT_ID;
};

// 获取用户下项目详情
const getUserProjectInfo = async (project_id, uuid) => {
    const id = `${project_id}/${uuid}`;
    return await UserProjects.get(id);
};

// force是否强制执行，如果为true则冲突
export const runTask = async (force = -1) => {
    if (onlineStatus() === false) {
        return;
    }
    if (!isLogin()) {
        return;
    }
    if (taskState.taskRunSwitch === 'off') {
        return;
    }
    taskState.taskRunSwitch = 'off';
    if (taskState.dormant_to_time !== 0 && dayjs().unix() < taskState.dormant_to_time) {
        // 休眠状态，不执行任务
        return;
    }

    const uuid = localStorage.getItem('uuid');
    if (uuid === null) {
        return;
    }

    const project_id = await getCurrentProjectId(uuid);
    if (project_id === undefined) {
        return;
    }

    const projectInfo = await getUserProjectInfo(project_id, uuid);
    if (isUndefined(projectInfo)) {
        return;
    }

    if (projectInfo?.is_push === false) {
        resolve('8.项目未上传');
        return;
        // todo
    }

    // 当前队列里未执行的全部任务列表
    const dbTaskList = await Task.where('project_id').anyOf([project_id, 'NOT_NEED']).toArray();

    // 如果没有任务了，则处理下载接口异步任务
    if (dbTaskList.length === 0) {
        taskState.taskRunSwitch = 'on';
        return;
    }

    let indexTask = null; // 取得排序最小的那个任务
    dbTaskList?.forEach((item) => {
        if (indexTask === null || item.sort < indexTask.sort) {
            indexTask = item;
        }
    });

    // 执行异步任务方法
    try {
        await executeTask(indexTask);
    } catch (ex) {
    } finally {
        setTimeout(() => {
            taskState.taskRunSwitch = 'on';
            globalTask$.next({
                action: 'runTask',
            });
        }, taskState.throuteSeconds);
    }
};

globalTask$
    .pipe(
        filter((message) => message.action === 'runTask'),
        tap(() => {
            runTask();
        })
    )
    .subscribe();
