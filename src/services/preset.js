import ajax from './ajax';

// 保存预设配置
export const fetchSavePreset = (
    params
) => ajax('post', '/management/api/v1/preinstall/save', 'json', false, params);

// 获取预设配置列表
export const fetchPresetList = (
    params
) => ajax('post', '/management/api/v1/preinstall/list', 'json', false, params);

// 获取预设配置详情
export const fetchPresetDetail = (
    params
) => ajax('post', '/management/api/v1/preinstall/detail', 'json', false, params);
 
// 删除预设配置
export const fetchDeletePreset = (
    params
) => ajax('post', '/management/api/v1/preinstall/delete', 'json', false, params);

// 复制预设配置
export const fetchCopyPreset = (
    params
) => ajax('post', '/management/api/v1/preinstall/copy', 'json', false, params);

// 获取当前所有可用压力机列表
export const fetchMachineList = (
    params
) => ajax('post', '/management/api/v1/preinstall/get_available_machine_list', 'json', false, params);