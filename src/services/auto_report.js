import ajax from './ajax';

// 查询报告列表
export const fetchReportList = (
    params
) => ajax('post', '/management/api/v1/auto_plan/get_report_list', 'json', false, params);

// 批量删除报告
export const fetchDeleteReport = (
    params
) => ajax('post', '/management/api/v1/auto_plan/batch_delete_report', 'json', false, params);

// 获取报告基本详情
export const fetchReportInfo = (
    params
) => ajax('post', '/management/api/v1/auto_plan/get_report_detail', 'json', false, params);

// 发送邮件报告详情
export const fetchEmailTReport = (
    params
) => ajax('post', '/management/api/v1/auto_plan/report_email_notify', 'json', false, params);

// 独立报告详情接口
export const fetchEmailReportDetail = (
    params
) => ajax('post', '/html/api/v1/auto_plan/get_report_detail', 'json', false, params);

// 获取自动化报告里面的接口详情
export const fetchAutoReportApi = (
    params
) => ajax('post', '/management/api/v1/auto_plan/get_report_api_detail', 'json', false, params);

// 运行自动化报告里的接口
export const fetchRunAutoReportApi = (
    params
) => ajax('post', '/management/api/v1/auto_plan/send_report_api', 'json', false, params);

// 修改自动化报告的名称
export const fetchUpdateName = (
    params
) => ajax('post', '/management/api/v1/auto_plan/update_report_name', 'json', false, params);