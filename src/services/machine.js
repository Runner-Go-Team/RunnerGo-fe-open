import ajax from './ajax';

// 获取机器列表
export const fetchGetMachine = (
    params
) => ajax('post', '/management/api/v1/machine/machine_list', 'json', false, params);

// 启用或停用机器
export const fetchUpdateMachine = (
    params
) => ajax('post', '/management/api/v1/machine/change_machine_on_off', 'json', false, params);