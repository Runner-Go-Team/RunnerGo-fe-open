import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { filter } from 'rxjs/operators';
import { ITaskAction } from '@dto/asyncTask';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import { taskObservable$, pushTask } from '../taskWorker';

const useProject = (uuid, token) => {
  const dispatch = useDispatch();

  const handlePullProjectResponse = ({ payload }) => {
    if (payload.code === 10000 && isArray(payload.data)) {
      dispatch({
        type: 'projects/setProjectList',
        payload: payload.data,
      });
    }
  };

  // 初始化时加载项目信息
  useEffect(() => {
    // 异步加载当前用户下项目信息列表
    pushTask({
      actionType: 'PULL',
      module: 'PROJECT',
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
        filter((message) => message.module === 'PROJECT')
      )
      .subscribe(handlePullProjectResponse);
  }, []);
};

export default useProject;
