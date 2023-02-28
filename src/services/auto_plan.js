import ajax from './ajax';

// 新建计划
export const fetchCreateTPlan = (
    params
) => ajax('post', '/management/api/v1/auto_plan/save', 'json', false, params);

// 获取计划列表
export const fetchTPlanList = (
    params
) => ajax('post', '/management/api/v1/auto_plan/list', 'json', false, params);

// 删除计划接口
export const fetchDeleteTPlan = (
    params
) => ajax('post', '/management/api/v1/auto_plan/delete', 'json', false, params);

// 获取计划基本详情
export const fetchTPlanDetail = (
    params
) => ajax('post', '/management/api/v1/auto_plan/detail', 'json', false, params);

// 修改计划名称或备注
export const fetchUpdateTPlan = (
    params
) => ajax('post', '/management/api/v1/auto_plan/update', 'json', false, params);

// 添加收件人邮箱
export const fetchAddEmail = (
    params
) => ajax('post', '/management/api/v1/auto_plan/add_email', 'json', false, params);

// 获取收件人邮箱列表
export const fetchTPlanEmailList = (
    params
) => ajax('post', '/management/api/v1/auto_plan/email_list', 'json', false, params);

// 删除收件人邮箱
export const fetchTPlanDeleteEmail = (
    params
) => ajax('post', '/management/api/v1/auto_plan/delete_email', 'json', false, params);

// 批量删除自动化测试计划
export const fetchBatchDelete = (
    params
) => ajax('post', '/management/api/v1/auto_plan/batch_delete', 'json', false, params);

// 保存或修改计划配置
export const fetchSaveConfig = (
    params
) => ajax('post', '/management/api/v1/auto_plan/save_task_conf', 'json', false, params);

// 查询计划配置
export const fetchGetConfig = (
    params
) => ajax('post', '/management/api/v1/auto_plan/get_task_conf', 'json', false, params);

// 复制计划
export const fetchCopyPlan = (
    params
) => ajax('post', '/management/api/v1/auto_plan/copy', 'json', false, params);

// 运行计划
export const fetchRunAutoPlan = (
    params
) => ajax('post', '/management/api/v1/auto_plan/run', 'json', false, params);

// 停止计划
export const fetchStopAutoPlan = (
    params
) => ajax('post', '/management/api/v1/auto_plan/stop_auto_plan', 'json', false, params);