import isFunction from 'lodash/isFunction';
import dayjs from 'dayjs';
// import { Task, Await_Task } from '@indexedDB/asyn_task';
import { isError } from 'lodash';
import SYNCTASK from '../tasks';
// import { ITaskInfo } from '../types';
import { taskState } from './state';

// 执行task同步
export const executeTask = async (indexTask) => {
    // 调用同步接口
    const syncFunc = SYNCTASK?.[indexTask.model]?.[indexTask.action];
    if (isFunction(syncFunc) === false) {
        taskState.taskRunSwitch = 'on';
        return;
    }

    try {
        await syncFunc(indexTask);
        taskState.dormant_try_counter = 0;
        taskState.dormant_to_time = 0;
        await Task.delete(indexTask.id);
    } catch (err) {
        indexTask.hangup += 1;
        taskState.dormant_try_counter += 1;
        if (taskState.dormant_try_counter > taskState.dormant_try_limit) {
            taskState.dormant_to_time = dayjs().unix() + taskState.dormant_long_second;
        }
        if ((isError(err) && err.message === 'delete_task') || err === 'delete_task') {
            // 删除任务
            await Task.delete(indexTask.id);
        }
        // 如果任务失败次数超过n次，放到失败任务队列中
        else if (indexTask.hangup >= taskState.a_tark_try_limit) {
            await Await_Task.put({ ...indexTask, hangup: 0 }, indexTask.id);
            await Task.delete(indexTask.id);
            taskState.taskRunSwitch = 'on';
        } else {
            // 修改任务执行次数
            await Task.update(indexTask.id, {
                hangup: indexTask.hangup,
            });
        }
    }
};
