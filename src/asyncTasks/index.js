// import { Task, Await_Task } from '@indexedDB/asyn_task';
import { timer, interval, tap } from 'rxjs';
import { isString } from 'lodash';
import { pushTask as _pushTask } from './utils/push';
import { runTask } from './utils/run';
import { globalTask$ } from './global';

const run_interval_second = 180; // 正常任务队列多久检测一次
const await_second = 600; // 失败任务多久检测一次
const ASYNC_TIMER = {}; // 定时器

// 获取当前项目ID
export const getCurrentProjectId = async (uuid) => {
    const userData = await User.get(uuid);
    return userData?.workspace?.CURRENT_PROJECT_ID;
};

const restoreAwaitTask = async () => {
    const uuid = localStorage.getItem('uuid');
    const project_id = await getCurrentProjectId(uuid);
    if (!isString(project_id)) {
        return;
    }
    const awaitList = await Await_Task.where('project_id').anyOf([project_id, 'NOT_NEED']).toArray();
    const awaitIdList = awaitList.map((item) => item.id);
    await Task.bulkPut(awaitList);
    await Await_Task.bulkDelete(awaitIdList);
};

export const taskInit = async () => {
    if (ASYNC_TIMER.auto_await2now_interval) {
        clearInterval(ASYNC_TIMER.auto_await2now_interval);
    }

    // 失败任务队列间隔多久重新放入异步任务队列
    ASYNC_TIMER.auto_await2now_interval = setInterval(async () => {
        await restoreAwaitTask();
    }, await_second * 1000);

    // 定时执行任务
    if (ASYNC_TIMER.auto_run_interval) {
        clearInterval(ASYNC_TIMER.auto_run_interval);
    }
    ASYNC_TIMER.auto_run_interval = setInterval(function () {
        globalTask$.next({
            action: 'runTask',
        });
    }, run_interval_second * 1000);

    await restoreAwaitTask();
    globalTask$.next({
        action: 'runTask',
    });
};

export const pushTask = _pushTask;

export default {
    pushTask,
    runTask,
    taskInit,
};
