import ajax from '../ajax';

// 获取元素目录列表
export const ServiceGetElementFolderList = (
  query
) => ajax('get', '/management/api/v1/element/folder/list', 'json', false, {}, query);

// 创建目录
export const ServiceCreateElementFolder = (
  params
) => ajax('post', '/management/api/v1/element/folder/save', 'json', false, params);

// 修改目录
export const ServiceEditElementFolder = (
  params
) => ajax('post', '/management/api/v1/element/folder/update', 'json', false, params);

// 删除目录
export const ServiceDeleteElementFolder = (
  params
) => ajax('post', '/management/api/v1/element/folder/remove', 'json', false, params);

// 创建元素
export const ServiceCreateElement = (
  params
) => ajax('post', '/management/api/v1/element/save', 'json', false, params);

// 修改元素
export const ServiceEditElement = (
  params
) => ajax('post', '/management/api/v1/element/update', 'json', false, params);

// 获取元素详情
export const ServiceGetElementDetails = (
  query
) => ajax('get', '/management/api/v1/element/detail', 'json', false, {}, query);

// 获取元素列表
export const ServiceGetElementList = (
  params
) => ajax('post', '/management/api/v1/element/list', 'json', false, params);

// 删除元素
export const ServiceDeleteElement = (
  params
) => ajax('post', '/management/api/v1/element/remove', 'json', false, params);

//批量元素移动
export const ServiceMoveElement = (
  params
) => ajax('post', '/management/api/v1/element/sort', 'json', false, params);

// 获取元素目录列表
export const ServiceGetSceneList = (
  query
) => ajax('get', '/management/api/v1/ui_scene/list', 'json', false, {}, query);

// 元素目录排序
export const ServiceElementFolderSort = (
  params
) => ajax('post', '/management/api/v1/element/folder/sort', 'json', false, params);
