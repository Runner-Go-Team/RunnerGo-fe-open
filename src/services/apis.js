// import { IBaseResponse } from '@dto/baseResponse';
// import ajax from './axios';
import ajax, { RxAjaxObservable } from './ajax';

// 创建/修改接口
export const fetchHandleApi = (
    params
) => ajax('post', '/management/api/v1/target/save', 'json', false, params);
// 创建/修改目录
export const fetchHandleFolder = (
    params
) => ajax('post', '/management/api/v1/folder/save', 'json', false, params);
// 获取目录/接口列表
export const fetchApiList = (
    query
) => ajax('get', '/management/api/v1/target/list', 'json', false, {}, query);
// 批量获取接口详情
export const fetchApiDetail = (
    query
) => ajax('get', '/management/api/v1/target/detail', 'json', false, {}, query);
// 获取目录详情
export const fetchFolderDetail = (
    query
) => ajax('get', '/management/api/v1/folder/detail', 'json', false, {}, query);
// 彻底删除目录/接口
export const fetchStrongDeleteApi = (
    params
) => ajax('post', '/management/api/v1/target/delete', 'json', false, params);
// 删除目录/接口
export const fetchDeleteApi = (
    params
) => ajax('post', '/management/api/v1/target/trash', 'json', false, params);
// 恢复目录/接口
export const fetchRecallApi = (
    params
) => ajax('post', '/management/api/v1/target/recall', 'json', false, params);
// 获取回收站接口/目录列表
export const fetchRecycleList = (
    query
) => ajax('get', '/management/api/v1/target/trash_list', 'json', false, {}, query);
// 发送接口
export const fetchSendApi = (
    params
) => ajax('post', '/management/api/v1/target/send', 'json', false, params);
// 获取接口发送结果
export const fetchGetResult = (
    query
) => ajax('get', '/management/api/v1/target/result', 'json', false, {}, query);
// 拖拽排序
export const fetchChangeSort = (
    params
) => ajax('post', '/management/api/v1/target/sort', 'json', false, params);
// 导入接口
export const fetchImportApi = (
    params
) => ajax('post', '/management/api/v1/target/save_import_api', 'json', false, params);



// 获取用户目录简要信息列表
export const fetchTargetIdsRequest = (
    params
) => ajax('post', '/apis/get_target_ids', 'json', false, params);

// 获取用户目录/接口信息详情
export const fetchCollectionDetailRequest = (
    params
) => ajax('post', '/apis/get_multi_api_details', 'json', false, params);

// 目录排序
export const updateCollectionSortRequest = (
    params
) => ajax('post', '/apis/sort_apis', 'json', false, params);

// 保存集合 （包含 Api,doc，webscoket，grpc，folder）
export const SaveTargetRequest = (params) =>
    ajax('post', '/apis/save_target', 'json', false, params);

// 删除接口
export const DelApiRequest = (params) =>
    ajax('post', '/apis/delete_multi_target', 'json', false, params);

// 彻底删除接口/目录
export const restoreApiRequest = (params) =>
    ajax('post', '/apis/restore_and_destroy_targets', 'json', false, params);

// 获取归档列表
export const GetArchiveTargetsList = (
    params
) => ajax('post', '/project/archive_targets_list', 'json', false, params);

// 批量更新接口归档(包含删除)
export const SaveMultiArchiveTarget = (
    params
) => ajax('post', '/project/save_multi_archive_target', 'json', false, params);

// 锁定解锁接口或文档
export const setApiLockStatus = (params) =>
    ajax('post', '/apis/set_api_lock_status', 'json', false, params);

// 新增备份
export const saveApiBakRequest = (params) =>
    ajax('post', '/apis/target_bak_save', 'json', false, params);

// 备份列表
export const getApiBakListRequest = (
    params
) => ajax('post', '/apis/get_api_bak_list', 'json', false, params);

// 备份删除
export const delApiBakRequest = (params) =>
    ajax('post', '/apis/delete_api_bak', 'json', false, params);

// 还原备份
export const backApiBakRequest = (params) =>
    ajax('post', '/apis/back_to_api_bak', 'json', false, params);

// 预览备份
export const previewApiBakRequest = (
    params
) => ajax('post', '/apis/preview_api_bak', 'json', false, params);

// 获取用户最近发送列表
export const getSendHistory = (params) =>
    ajax('post', '/apis/read_history_records', 'json', false, params);

// 获取用户最近发送快照
export const getSendHistoryDetail = (
    params
) => ajax('post', '/apis/read_history_details', 'json', false, params);

// 删除用户最近发送历史
export const delSendHistory = (params) =>
    ajax('post', '/apis/del_history_records', 'json', false, params);
// 添加发送记录
export const setHistorySendRequest = (
    params
) => ajax('post', '/apis/add_history_records', 'json', false, params);

// 当前消息未读数量
export const getUnReadMsgCount = (params) =>
    ajax('post', '/message/unread_message_count', 'json', false, params);

// 获取消息类型
export const getMsgTypeRequest = (params) =>
    ajax('post', '/message/message_type', 'json', false, params);

// 获取消息列表
export const getMsgListRequest = (params) =>
    ajax('post', '/message/message_list', 'json', false, params);

// 已读消息
export const readNoticeApi = (params) =>
    ajax('post', '/message/set_message_read', 'json', false, params);

// 批量新增数据
export const addMultiTargetRequest = (
    params
) => ajax('post', '/apis/add_multi_target', 'json', false, params);

export const getAiDesc = (params) =>
    ajax('post', '/apis_project/get_ai_desc_list', 'json', false, params);
