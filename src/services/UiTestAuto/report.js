import ajax from '../ajax';

// 获取报告列表
export const ServiceGetReportList = (
  params
) => ajax('post', '/management/api/v1/ui_report/list', 'json', false, params);

// 获取报告详情
export const ServiceGetReportDetail = (
  query
) => ajax('get', '/management/api/v1/ui_report/detail', 'json', false, {}, query);

// 删除报告
export const ServicDeleteReport = (
  params
) => ajax('post', '/management/api/v1/ui_report/delete', 'json', false, params);

// 停止报告
export const ServicStopReport = (
  params
) => ajax('post', '/management/api/v1/ui_report/stop', 'json', false, params);

// 修改报告
export const ServicUpdateReport = (
  params
) => ajax('post', '/management/api/v1/ui_report/update', 'json', false, params);

// 运行报告
export const ServicRunReport = (
  params
) => ajax('post', '/management/api/v1/ui_report/run', 'json', false, params);
