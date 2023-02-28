import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Message } from 'adesign-react';
// import { Envs } from '@indexedDB/project';
import { pushTask } from '@asyncTasks/index';
import { saveEnvRequest, deleteEnvRequest } from '@services/envs';
// import { IEnvDataItem, IEnv } from '@models/project/env';
import { getLocalEnvsDatas } from '@rxUtils/env';

const useEnvs = (props) => {
  const dispatch = useDispatch();

  const CURRENT_PROJECT_ID = useSelector((store) => store?.workspace?.CURRENT_PROJECT_ID);
  const CURRENT_ENV_ID = useSelector((store) => store?.workspace?.CURRENT_ENV_ID);

  const refreshEnvs = async () => {
    const envDatas = await getLocalEnvsDatas(CURRENT_PROJECT_ID);
    dispatch({
      type: 'envs/setEnvDatas',
      payload: envDatas,
    });
  };

  const saveEnvs = async (saveObj  ) => {
    const { envData, envList, env_id, callback = null } = saveObj;

    const newlistDatas = {};
    envList.forEach((envItem) => {
      const { key, ...restData } = envItem;
      if (key !== '') newlistDatas[key] = restData;
    });

    const project_id = CURRENT_PROJECT_ID;

    const newEnvData = {
      ...envData,
      env_id,
      project_id,
      id: `${project_id}/${env_id}`,
      list: newlistDatas,
    };

    await Envs.put(newEnvData, newEnvData.id);
    refreshEnvs();
    saveEnvRequest({
      ...newEnvData,
      env_vars: newEnvData?.list,
    }).subscribe({
      next(resp) {
        if (resp?.code === 10000) {
          Message('success', '保存成功');
        }
      },
      error() {
        pushTask({
          task_id: `${project_id}/${env_id}`,
          action: 'SAVE',
          model: 'ENVS',
          payload: `${project_id}/${env_id}`,
          project_id,
        });
      },
    });

    callback && callback();

    // 如果是修改当前环境，则同步更新redux
    if (env_id === CURRENT_ENV_ID) {
      dispatch({
        type: 'envs/setCurrentEnv',
        payload: newEnvData,
      });
    }
  };
  const deleteEnvs = ({ env_id }) => {
    deleteEnvRequest({
      env_id,
      is_force: 0,
      project_id: CURRENT_PROJECT_ID,
    }).subscribe({
      next(resp) {
        if (resp?.code === 10000) {
          Message('success', '删除成功');
          refreshEnvs();
        }
      },
      error() {
        pushTask({
          task_id: `${CURRENT_PROJECT_ID}/${env_id}`,
          action: 'DELETE',
          model: 'ENVS',
          payload: env_id,
          project_id: CURRENT_PROJECT_ID,
        });
      },
    });
    // env_id: "be2c01ef-bac1-4bac-b7d5-a6e5cbc26881"
    // is_force: 0
    // project_id: "ccdace77-9a9b-43c1-849c-6baaaa8a2222"
  };

  return {
    saveEnvs,
    deleteEnvs,
  };
};

export default useEnvs;
