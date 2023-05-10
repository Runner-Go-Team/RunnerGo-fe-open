import ajax from './ajax';

// 用例列表
export const fetchCaseList = (
    params
) => ajax('post', '/management/api/v1/case/list', 'json', false, params);

// 克隆用例
export const fetchCopyCase = (
    params
) => ajax('post', '/management/api/v1/case/copy', 'json', false, params);

// 保存用例
export const fetchSaveCase = (
    params
) => ajax('post', '/management/api/v1/case/save', 'json', false, params);

// 保存用例执行流
export const fetchSaveFlow = (
    params
) => ajax('post', '/management/api/v1/case/save/scene/case/flow', 'json', false, params);

// 删除用例
export const fetchDeleteCase = (
    params
) => ajax('post', '/management/api/v1/case/del', 'json', false, params);

// 获取用例执行流
export const fetchGetFlow = (
    params
) => ajax('post', '/management/api/v1/case/flow/detail', 'json', false, params);

// 调试场景用例
export const fetchRunCase = (
    params
) => ajax('post', '/management/api/v1/case/send', 'json', false, params);

// 停止调试场景用例
export const fetchStopCase = (
    params
) => ajax('post', '/management/api/v1/case/stop', 'json', false, params);

// 开始/关闭用例
export const fetchSwitchCase = (
    params
) => ajax('post', '/management/api/v1/case/change/check', 'json', false, params);

// 拖拽排序
export const fetchChangeSort = (
    params
) => ajax('post', '/management/api/v1/case/change_case_sort', 'json', false, params);