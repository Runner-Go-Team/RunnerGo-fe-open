import { ITaskAction } from '@dto/asyncTask';
import { fromEvent } from 'rxjs';
import { pluck } from 'rxjs/operators';

export const taskWorker = new Worker('asyncTaskService.js');

export const pushTask = (message) => {
    taskWorker.postMessage(message);
};

export const taskObservable$ = fromEvent(taskWorker, 'message').pipe(pluck ('data'));
