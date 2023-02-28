import ajax from './ajax';

// 获取环境列表
export const fetchEnvList = (
    params
) => ajax('post', '/management/api/v1/env/list', 'json', false, params);

// 保存环境
export const fetchSaveEnv = (
    params
) => ajax('post', '/management/api/v1/env/save', 'json', false, params);

// 删除环境
export const fetchDeleteEnv = (
    params
) => ajax('post', '/management/api/v1/env/del', 'json', false, params);

// 删除服务
export const fetchDeleteService = (
    params
) => ajax('post', '/management/api/v1/env/del_service', 'json', false, params);

// 复制环境
export const fetchCopyEnv = (
    params
) => ajax('post', '/management/api/v1/env/copy', 'json', false, params);