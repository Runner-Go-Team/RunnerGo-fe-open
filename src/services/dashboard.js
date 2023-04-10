import ajax from './ajax';

// 获取首页控制台相关内容
export const fetchDashBoardInfo = (
    query
) => ajax('get', '/management/api/v1/dashboard/default', 'json', false, {}, query);

// 获取运行中的计划
export const fetchRunningPlan = (
    query
) => ajax('get', '/management/api/v1/dashboard/underway_plans', 'json', false, {}, query);

// 获取操作日志列表
export const fetchOperationLog = (
    query
) => ajax('get', '/management/api/v1/operation/list', 'json', false, {}, query);

// 获取全局变量
export const fetchGlobalVar = (
    query
) => ajax('get', '/management/api/v1/variable/list', 'json', false, {}, query);

// 创建/修改全局变量
export const fetchCreateVar = (
    params
) => ajax('post', '/management/api/v1/variable/save', 'json', false, params);

// 删除全局变量
export const fetchDeleteVar = (
    params
) => ajax('post', '/management/api/v1/variable/delete', 'json', false, params);

// 同步全局变量
export const fetchSaveVar = (
    params
) => ajax('post', '/management/api/v1/variable/sync', 'json', false, params);


// 新版首页
export const fetchGetIndex = (
    params
) => ajax('post', '/management/api/v1/dashboard/home_page', 'json', false, params);

// 获取公共函数
export const fetchPublicFunction = (
    query
) => ajax('get', '/management/api/v1/dashboard/public_function_list', 'json', false, {}, query);