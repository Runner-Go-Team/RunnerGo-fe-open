import { Subject } from 'rxjs';

export const tabSubject$ = new Subject();

export const pushAction = (message) => {
    tabSubject$.next({
        action: message.action,
        payload: message.payload,
    });
};
