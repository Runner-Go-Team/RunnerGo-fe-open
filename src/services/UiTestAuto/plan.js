import ajax from '../ajax';

// 创建计划
export const ServiceCreatePlan = (
  params
) => ajax('post', '/management/api/v1/ui_plan/save', 'json', false, params);

// 获取计划列表
export const ServiceGetPlanList = (
  params
) => ajax('post', '/management/api/v1/ui_plan/list', 'json', false, params);

// 修改计划
export const ServiceUpdatePlan = (
  params
) => ajax('post', '/management/api/v1/ui_plan/update', 'json', false, params);

// 导入场景到计划中
export const ServiceImportSceneToPlan = (
  params
) => ajax('post', '/management/api/v1/ui_plan/scene/import', 'json', false, params);

// 获取计划详情
export const ServiceGetPlanDetail = (
  query
) => ajax('get', '/management/api/v1/ui_plan/detail', 'json', false, {}, query);

// 查询计划任务配置
export const ServicGetPlanTaskConfig = (
  params
) => ajax('post', '/management/api/v1/ui_plan/get_task_conf', 'json', false, params);

// 修改计划任务配置
export const ServicSavePlanTaskConfig = (
  params
) => ajax('post', '/management/api/v1/ui_plan/save_task_conf', 'json', false, params);

// 删除计划
export const ServicDeletePlan = (
  params
) => ajax('post', '/management/api/v1/ui_plan/delete', 'json', false, params);

// 复制计划
export const ServicCopyPlan = (
  params
) => ajax('post', '/management/api/v1/ui_plan/copy', 'json', false, params);

// 运行计划
export const ServicRunPlan = (
  params
) => ajax('post', '/management/api/v1/ui_plan/run', 'json', false, params);

// 停止计划
export const ServicStopPlan = (
  params
) => ajax('post', '/management/api/v1/ui_plan/stop', 'json', false, params);

// 计划场景手动同步
export const ServicPlanSceneSyncLastData = (
  params
) => ajax('post', '/management/api/v1/ui_plan/scene/sync_last_data', 'json', false, params);
