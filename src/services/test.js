import ajax, { RxAjaxObservable } from './ajax';

// 保存单流或测试套件
export const saveProcessTest = (params) =>
  ajax('post', '/apis/save_process_test', 'json', false, params);

// 批量删除单流或测试套件
export const deleteProcessTest = (params) =>
  ajax('post', '/apis/delete_multi_process_tests', 'json', false, params);

// 保存测试报告
export const saveProcessReports = (params) =>
  ajax('post', '/apis/save_process_test_reports', 'json', false, params);

// 删除测试报告
export const deleteProcessReports = (
  params
) => ajax('post', '/apis/delete_multi_process_test_reports', 'json', false, params);

// 保存排序信息
export const saveProcessTestSortRequest = (
  params
) => ajax('post', '/apis/save_process_test_sort_apis', 'json', false, params);
