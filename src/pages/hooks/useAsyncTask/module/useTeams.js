import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { filter } from 'rxjs/operators';
import { ITaskAction } from '@dto/asyncTask';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import { taskObservable$, pushTask } from '../taskWorker';

const useProject = (uuid, token) => {
    const dispatch = useDispatch();

    const handlePullTeamResponse = ({ payload }) => {
        if (payload.code === 10000 && isArray(payload.data)) {
            dispatch({
                type: 'teams/updateTeamList',
                payload: payload.data,
            });
        }
    };

    // 初始化时加载团队项目信息
    useEffect(() => {
        // 异步加载当前用户下团队信息列表
        pushTask({
            actionType: 'PULL',
            module: 'TEAM',
            msgType: 'REQUEST',
            payload: {
                token,
                uuid: isString(uuid) ? uuid : '-1',
            },
        });
    }, []);

    useEffect(() => {
        taskObservable$
            .pipe(
                filter((message) => message.actionType === 'PULL'),
                filter((message) => message.module === 'TEAM'),
                filter((message) => message.msgType === 'RESPONSE')
            )
            .subscribe(handlePullTeamResponse);
    }, []);
};

export default useProject;
