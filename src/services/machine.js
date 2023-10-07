import ajax from './ajax';

// 获取机器列表
export const fetchGetMachine = (
    params
) => ajax('post', '/management/api/v1/machine/machine_list', 'json', false, params);

// 启用或停用机器
export const fetchUpdateMachine = (
    params
) => ajax('post', '/management/api/v1/machine/change_machine_on_off', 'json', false, params);

// 获取当前可用的压力机列表
export const fetchUsableMachineList = (
    params
) => ajax('post', '/management/api/v1/machine/get_usable_machine_list', 'json', false, params);

// 获取Ui自动化机器列表
export const ServiceGetUiMachineList = (
    query
) => ajax('get', '/management/api/v1/ui_scene/engine_machine', 'json', false, {}, query);

