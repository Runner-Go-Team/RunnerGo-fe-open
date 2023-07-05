import ajax from './ajax';

// 获取环境列表
export const fetchEnvList = (
    params
) => ajax('post', '/management/api/v1/env/get_env_list', 'json', false, params);

// 新建环境
export const fetchCreateEnv = (
    params
) => ajax('post', '/management/api/v1/env/create_env', 'json', false, params);

// 更新环境名称
export const fetchUpdateEnvName = (
    params
) => ajax('post', '/management/api/v1/env/update_env', 'json', false, params);

// 删除环境
export const fetchDeleteEnv = (
    params
) => ajax('post', '/management/api/v1/env/del_env', 'json', false, params);

// 删除环境下的服务
export const fetchDeleteService = (
    params
) => ajax('post', '/management/api/v1/env/del_env_service', 'json', false, params);

// 删除环境下的数据库
export const fetchDeleteDb = (
    params
) => ajax('post', '/management/api/v1/env/del_env_database', 'json', false, params);

// 获取环境下服务列表
export const fetchServiceList = (
    params
) => ajax('post', '/management/api/v1/env/get_service_list', 'json', false, params);

// 获取环境下数据库列表
export const fetchDbList = (
    params
) => ajax('post', '/management/api/v1/env/get_database_list', 'json', false, params);

// 新建环境下的服务
export const fetchCreateService = (
    params
) => ajax('post', '/management/api/v1/env/save_env_service', 'json', false, params);

// 新建环境下的数据库
export const fetchCreateDb = (
    params
) => ajax('post', '/management/api/v1/env/save_env_database', 'json', false, params);

// 克隆环境
export const fetchCloneEnv = (
    params
) => ajax('post', '/management/api/v1/env/copy_env', 'json', false, params);

