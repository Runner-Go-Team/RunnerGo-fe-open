import ajax from './ajax';

// 创建/修改目录
export const fetchCreateGroup = (
    params
) => ajax('post', '/management/api/v1/group/save', 'json', false, params);

// 创建/修改场景
export const fetchCreateScene = (
    params
) => ajax('post', '/management/api/v1/scene/save', 'json', false, params);

// 获取目录/场景列表
export const fetchSceneList = (
    query
) => ajax('get', '/management/api/v1/scene/list', 'json', false, {}, query);

// 获取场景流程
export const fetchSceneFlow = (
    query
) => ajax('get', '/management/api/v1/scene/flow/get', 'json', false, {}, query);

// 创建/修改场景流程
export const fetchCreateSceneFlow = (
    params
) => ajax('post', '/management/api/v1/scene/flow/save', 'json', false, params);

// 获取场景详情
export const fetchSceneDetail = (
    params
) => ajax('post', '/management/api/v1/scene/detail', 'json', false, params);

// 获取目录详情
export const fetchGroupDetail = (
    query
) => ajax('get', '/management/api/v1/group/detail', 'json', false, {}, query);

// 获取场景流程详情
export const fetchSceneFlowDetail = (
    query
) => ajax('get', '/management/api/v1/scene/flow/get', 'json', false, {}, query);

// 批量获取场景流程
export const fetchBatchFlowDetail = (
    query
) => ajax('get', '/management/api/v1/scene/flow/batch/get', 'json', false, {}, query);

// 获取场景变量
export const fetchSceneVar = (
    query
) => ajax('get', '/management/api/v1/variable/scene/list', 'json', false, {}, query);

// 同步场景变量
export const fetchChangeVar = (
    params
) => ajax('post', '/management/api/v1/variable/scene/sync', 'json', false, params);

// 导入场景变量
export const fetchImportVar = (
    params
) => ajax('post', '/management/api/v1/variable/scene/import', 'json', false, params);

// 获取导入场景变量历史
export const fetchImportList = (
    query
) => ajax('get', '/management/api/v1/variable/scene/import/list', 'json', false, {}, query);

// 运行场景
export const fetchRunScene = (
    params
) => ajax('post', '/management/api/v1/scene/send', 'json', false, params);

// 获取运行场景结果
export const fetchGetSceneRes = (
    query
) => ajax('get', '/management/api/v1/scene/result', 'json', false, {}, query);

// 运行场景里的接口
export const fetchSendSceneApi = (
    params
) => ajax('post', '/management/api/v1/scene/api/send', 'json', false, params);

// 删除场景设置的文件
export const fetchDeleteImport = (
    params
) => ajax('post', '/management/api/v1/variable/scene/import/delete', 'json', false, params);

// 停止运行场景
export const fetchStopScene = (
    params
) => ajax('post', '/management/api/v1/scene/stop', 'json', false, params);

// 删除目录或场景
export const fetchDeleteScene = (
    params
) => ajax('post', '/management/api/v1/scene/delete', 'json', false, params);

// 导入变量编辑开关
export const fetchEditImport = (
    params
) => ajax('post', '/management/api/v1/variable/scene/import/update', 'json', false, params);

// 克隆场景
export const fetchCopyScene = (
    params
) => ajax('post', '/management/api/v1/auto_plan/clone_scene', 'json', false, params);

// 禁用/启用场景
export const fetchDisableOrEnableScene = (
    params
) => ajax('post', '/management/api/v1/scene/change_disabled_status', 'json', false, params);

// 调试场景内的mysql
export const fetchRunSceneMysql = (
    params
) => ajax('post', '/management/api/v1/scene/send_mysql', 'json', false, params);