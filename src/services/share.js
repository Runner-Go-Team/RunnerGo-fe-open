import ajax, { RxAjaxObservable } from './ajax';

// 获取用户下项目列表
export const fetchUserProjectList = () =>
  ajax('post', '/apis_project/my_project_list', 'json', false, {});

// 创建分享信息
export const createShareRequest = (
  params
) => ajax('post', '/share/save', 'json', false, params);

// 获取分享列表简介数据
export const fetchUserShareSimpleList = (
  params
) => ajax('post', '/share/all_simple', 'json', false, params);

// 获取分享信息列表
export const fetchUserShareList = (
  params
) => ajax('post', '/share/all', 'json', false, params);

// 删除分享信息
export const deleteShareDataRequest = (
  params
) => ajax('post', '/share/delete', 'json', false, params);
