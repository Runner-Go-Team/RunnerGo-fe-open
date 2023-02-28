import ajax, { RxAjaxObservable } from './ajax';

// 保存环境
export const saveEnvRequest = (params) =>
  ajax('post', '/project/save_project_env', 'json', false, params);

// 删除环境
export const deleteEnvRequest = (params) =>
  ajax('post', '/project/delete_project_env', 'json', false, params);
