// import { Task, Await_Task } from '@indexedDB/asyn_task';
import dayjs from 'dayjs';
import { isUndefined } from 'lodash';
// import { ITaskInfo } from '../types';
import { MODEL_LEVEL, ACTION_LEVEL } from '../constant';
import { globalTask$ } from '../global';

/*
添加任务
taskInfo 任务信息
is_force：是否强制保存，忽略版本检查
isAutoRun： 添加任务后是否自动执行任务1执行 -1不执行
*/
export const pushTask = (taskInfo, isAutoRun = 1, is_force = -1) => {

    const { task_id = '' } = taskInfo;

    const task = {
        ...taskInfo,
        id: `${taskInfo.model}/${taskInfo.action}/${task_id}`,
        hangup: 0,
        project_id: taskInfo.project_id,
        model: taskInfo.model,
        action: taskInfo.action,
        payload: taskInfo.payload,
        addedTime: dayjs().format('HH:mm:ss'),
    };
    task.sort = dayjs().unix() * (4 - MODEL_LEVEL[task.model]) * (4 - ACTION_LEVEL[task.action]);
    if (isUndefined(MODEL_LEVEL[task.model]) || isUndefined(ACTION_LEVEL[task.action])) {
        return;
    }

    if (task.action === 'SAVE' && task.model === 'PROJECT') {
        task.sort = 0;
    }

    Await_Task.delete(task.id);
    Task.put(task, task.id);

    // 是否自动执行
    if (isAutoRun === 1) {
        globalTask$.next({
            action: 'runTask',
        });
    }
};
