// import { Task, Await_Task } from '@indexedDB/asyn_task';
import { concatMap, mergeMap, tap, iif, of, reduce } from 'rxjs';
import { executeTask } from '@asyncTasks/utils/executeTask';
import { isArray } from 'lodash';
import { isLogin } from '@utils/common';

const restoreAllAwaitTask = async (project_id) => {
    const awaitList = await Await_Task.where('project_id').anyOf([project_id, 'NOT_NEED']).toArray();
    const awaitIdList = awaitList.map((item) => item.id);
    await Task.bulkPut(awaitList);
    await Await_Task.bulkDelete(awaitIdList);
};

const getTaskList = async (project_id) => {
    const taskList = await Task.where('project_id').anyOf([project_id, 'NOT_NEED']).toArray();
    if (!isArray(taskList)) {
        return [];
    }
    return taskList.sort((a, b) => a.sort - b.sort);
};

export const uploadTasks = (project_id) => {
    return iif(
        isLogin,
        of('').pipe(
            tap(console.log.bind(null, '异步上传任务----开始')),
            concatMap(() => restoreAllAwaitTask(project_id)),
            concatMap(() => getTaskList(project_id)),
            concatMap((d) => of(...d)),
            mergeMap(executeTask),
            reduce((a, b) => a + 1, 0),
            tap(console.log.bind(null, '异步上传任务----执行完成'))
        ),
        of('')
    );
};
