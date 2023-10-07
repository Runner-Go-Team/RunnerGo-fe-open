import ajax from '../ajax';

// 创建目录
export const ServiceCreateSceneFolder = (
  params
) => ajax('post', '/management/api/v1/ui_scene/folder/save', 'json', false, params);

// 修改目录
export const ServiceEditSceneFolder = (
  params
) => ajax('post', '/management/api/v1/ui_scene/folder/update', 'json', false, params);

// 删除目录/场景(移入回收站)
export const ServiceTrashSceneOrFolder = (
  params
) => ajax('post', '/management/api/v1/ui_scene/trash', 'json', false, params);

// 创建场景
export const ServiceCreateScene = (
  params
) => ajax('post', '/management/api/v1/ui_scene/save', 'json', false, params);

// 获取场景详情
export const ServiceSceneDetail = (
  query
) => ajax('get', '/management/api/v1/ui_scene/detail', 'json', false, {}, query);

// 保存场景
export const ServiceSaveScene = (
  params
) => ajax('post', '/management/api/v1/ui_scene/update', 'json', false, params);

// 创建场景步骤
export const ServiceCreateSceneOperator = (
  params
) => ajax('post', '/management/api/v1/ui_scene/operator/save', 'json', false, params);

// 获取场景步骤列表
export const ServiceSceneOperatorList = (
  query
) => ajax('get', '/management/api/v1/ui_scene/operator/list', 'json', false, {}, query);


// 获取场景步骤详情
export const ServiceSceneOperatorDetail = (
  query
) => ajax('get', '/management/api/v1/ui_scene/operator/detail', 'json', false, {}, query);

// 场景步骤拖动排序
export const ServiceOperatorSort = (
  params
) => ajax('post', '/management/api/v1/ui_scene/operator/sort', 'json', false, params);

// 删除场景步骤
export const ServiceOperatorDelete = (
  params
) => ajax('post', '/management/api/v1/ui_scene/operator/delete', 'json', false, params);

// 修改场景步骤
export const ServiceOperatorUpdate = (
  params
) => ajax('post', '/management/api/v1/ui_scene/operator/update', 'json', false, params);

// 修改场景步骤状态
export const ServiceOperatorSetStatus = (
  params
) => ajax('post', '/management/api/v1/ui_scene/operator/set/status', 'json', false, params);

// 复制场景步骤
export const ServiceOperatorCopy = (
  params
) => ajax('post', '/management/api/v1/ui_scene/operator/copy', 'json', false, params);

// 场景调试
export const ServiceUiSceneSend = (
  params
) => ajax('post', '/management/api/v1/ui_scene/send', 'json', false, params);

// 场景停止调试
export const ServiceUiSceneStop = (
  params
) => ajax('post', '/management/api/v1/ui_scene/stop', 'json', false, params);

// 场景目录排序
export const ServiceUiSceneSort = (
  params
) => ajax('post', '/management/api/v1/ui_scene/sort', 'json', false, params);

// 获取场景回收站列表
export const ServiceSceneTrashList = (
  query
) => ajax('get', '/management/api/v1/ui_scene/trash_list', 'json', false, {}, query);

// 场景/目录 恢复
export const ServiceUiSceneRecall = (
  params
) => ajax('post', '/management/api/v1/ui_scene/recall', 'json', false, params);

// 场景/目录 恢复
export const ServiceUiSceneDelete = (
  params
) => ajax('post', '/management/api/v1/ui_scene/delete', 'json', false, params);

// 修改场景同步方式
export const ServiceSaveUiSceneSyncMode = (
  params
) => ajax('post', '/management/api/v1/ui_plan/scene/sync_mode', 'json', false, params);

// 复制场景
export const ServiceSaveUiSceneCopy = (
  params
) => ajax('post', '/management/api/v1/ui_scene/copy', 'json', false, params);
