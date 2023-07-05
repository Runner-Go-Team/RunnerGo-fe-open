import ajax from './ajax';

// 获取报告列表
export const fetchReportList = (
    query
) => ajax('get', '/management/api/v1/report/list', 'json', false, {}, query);

// 压力机监控
export const fetchMachine = (
    query
) => ajax('get', '/management/api/v1/report/machine', 'json', false, {}, query);

// 删除报告
export const fetchDeleteReport = (
    params
) => ajax('post', '/management/api/v1/report/delete', 'json', false, params);

// 获取报告详情
export const fetchReportDetail = (
    params
) => ajax('post', '/management/api/v1/report/detail', 'json', false, params);

// 获取debug日志
export const fetchDebugLog = (
    query
) => ajax('get', '/management/api/v1/report/debug', 'json', false, {}, query);

// 获取报告任务详情
export const fetchReportInfo = (
    query
) => ajax('get', '/management/api/v1/report/task_detail', 'json', false, {}, query);

// 设置debug模式
export const fetchSetDebug = (
    params
) => ajax('post', '/management/api/v1/report/debug/setting', 'json', false, params);

// 停止报告
export const fetchStopReport = (
    params
) => ajax('post', '/management/api/v1/report/stop', 'json', false, params);

// 获取当前用户选择的debug模式
export const fetchGetDebug = (
    query
) => ajax('get', '/management/api/v1/report/debug/detail', 'json', false, {}, query);

// 邮件通知
export const fetchSendReportEmail = (
    params
) => ajax('post', '/management/api/v1/report/email_notify', 'json', false, params);

// 批量删除报告
export const fetchBatchDelete = (
    params
) => ajax('post', '/management/api/v1/report/batch_delete', 'json', false, params);



// 通过邮箱看报告

// 获取当前用户选择的debug模式
export const fetchEmailGetDebug = (
    query
) => ajax('get', '/html/api/v1/report/debug/detail', 'json', false, {}, query);

// 获取debug日志
export const fetchEmailDebugLog = (
    query
) => ajax('get', '/html/api/v1/report/debug', 'json', false, {}, query);

// 获取报告详情
export const fetchEmailReportDetail = (
    query
) => ajax('get', '/html/api/v1/report/detail', 'json', false, {}, query);

// 压力机监控
export const fetchEmailMachine = (
    query
) => ajax('get', '/html/api/v1/report/machine', 'json', false, {}, query);
// 获取报告任务详情
export const fetchEmailReportInfo = (
    query
) => ajax('get', '/html/api/v1/report/task_detail', 'json', false, {}, query);

// 编辑报告配置并执行
export const fetchEditReport = (
    params
) => ajax('post', '/management/api/v1/report/change_task_conf_run', 'json', false, params);

// 对比报告
export const fetchContrastReport = (
    params
) => ajax('post', '/management/api/v1/report/compare_report', 'json', false, params);

// 保存或更新测试结果描述
export const fetchUpdateDesc = (
    params
) => ajax('post', '/management/api/v1/report/update/description', 'json', false, params);

// 修改报告名称
export const fetchUpdateName = (
    params
) => ajax('post', '/management/api/v1/report/update_report_name', 'json', false, params);