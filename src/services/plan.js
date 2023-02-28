import ajax from './ajax';

// 获取计划列表
export const fetchPlanList = (
    query
) => ajax('get', '/management/api/v1/plan/list', 'json', false, {}, query);

// 获取计划详情
export const fetchPlanDetail = (
    query
) => ajax('get', '/management/api/v1/plan/detail', 'json', false, {}, query);

// 创建/修改计划
export const fetchCreatePlan = (
    params
) => ajax('post', '/management/api/v1/plan/save', 'json', false, params);

// 获取预设配置
export const fetchPreConfig = (
    query
) => ajax('get', '/management/api/v1/plan/preinstall/detail', 'json', false, {}, query);

// 创建/修改预设配置
export const fetchCreatePre = (
    params
) => ajax('post', '/management/api/v1/plan/preinstall/save', 'json', false, params);

// 删除计划
export const fetchDeletePlan = (
    params
) => ajax('post', '/management/api/v1/plan/delete', 'json', false, params);

// 保存计划
export const fetchSavePlan = (
    params
) => ajax('post', '/management/api/v1/plan/task/save', 'json', false, params);

// 执行计划
export const fetchRunPlan = (
    params
) => ajax('post', '/management/api/v1/plan/run', 'json', false, params);

// 停止计划
export const fetchStopPlan = (
    params
) => ajax('post', '/management/api/v1/plan/stop', 'json', false, params);

// 克隆计划
export const fetchCopyPlan = (
    params
) => ajax('post', '/management/api/v1/plan/clone', 'json', false, params);

// 邮件通知
export const fetchSendPlanEmail = (
    params
) => ajax('post', '/management/api/v1/plan/email_notify', 'json', false, params);

// 查询计划任务
export const fetchGetTask = (
    query
) => ajax('get', '/management/api/v1/plan/task/detail', 'json', false, {}, query);

// 导入场景
export const fetchImportScene = (
    params
) => ajax('post', '/management/api/v1/plan/import_scene', 'json', false, params);

// 邮件通知列表
export const fetchEmailList = (
    query
) => ajax('get', '/management/api/v1/plan/email_list', 'json', false, {}, query);

// 删除邮件通知
export const fetchDeleteEmail = (
    params
) => ajax('post', '/management/api/v1/plan/email_delete', 'json', false, params);

// 批量删除性能测试计划
export const fetchBatchDelete = (
    params
) => ajax('post', '/management/api/v1/plan/batch_delete', 'json', false, params);