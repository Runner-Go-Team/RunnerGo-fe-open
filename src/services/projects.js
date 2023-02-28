import ajax, { RxAjaxObservable } from './ajax';

// 获取用户简要团队项目列表
export const fetchSimpleTeamProjectListRequest = () =>
  ajax('post', '/apis_project/list', 'json', false, {});

// 获取用户下项目列表
export const fetchUserProjectList = () =>
  ajax('post', '/apis_project/my_project_list', 'json', false, {});

// 获取用户下团队列表
export const fetchUserTeamList = () =>
  ajax('post', '/apis_project/my_team_list', 'json', false, {});

// 获取项目详情信息
export const initProjectDetailsRequest = (
  params
) => ajax('post', '/apis_project/init_project_details', 'json', false, params);

// 保存用户全局参数信息
export const saveUserProjectParamsRequest = (
  params
) => ajax('post', '/project/save_pro_request', 'json', false, params);

// 将本地项目上传至云端
export const uploadUserProjectRequest = (
  params
) => ajax('post', '/apis_project/create_project', 'json', false, params);

// 切换当前project_id
export const switchProjectRequest = (
  params
) => ajax('post', '/apis_project/switch_project', 'json', false, params);

// 保存同步项目配置
export const saveSyncProjectApi = (params) =>
  ajax('post', '/apis_project/save_my_sync_project', 'json', false, params);

// 获取我的参与指定项目同步配置信息列表
export const getSyncProjectApi = (params) =>
  ajax('post', '/apis_project/get_my_sync_project_list', 'json', false, params);

// 获取我的创建项目同步数据库
export const getSyncProjectAllApi = (
  params
) => ajax('post', '/apis_project/get_my_sync_projects_list', 'json', false, params);

// 获取用户最近保存
export const getUserRecord = (params) =>
  ajax('post', '/project/target_user_record_page', 'json', false, params);

// 最近保存详情
export const getUserRecordDetail = (
  params
) => ajax('post', '/project/target_user_recode_details', 'json', false, params);

// 删除最近保存
export const delUserRecordDetail = (
  params
) => ajax('post', '/project/target_user_recode_del', 'json', false, params);
// 保存参数描述库呀
export const saveGlobalDesc = (params) =>
  ajax('post', '/project/save_global_description', 'json', false, params);

// 批量获取项目信息详情
export const getMultiProjectDetailsRequest = (params) =>
    ajax('post', '/apis_project/get_multi_project_details', 'json', false, params);

// mark save
export const MarkSaveRequest = (params) =>
  ajax('post', '/mark/save', 'json', false, params);

// mark del
export const MarkDelRequest = (params) =>
  ajax('post', '/mark/delete', 'json', false, params);

// 获取团队协作记录
export const getSynergykLogs = (params) =>
  ajax('post', '/apis_project/synergy_log', 'json', false, params);

// 获取团队成员列表
export const getAllProjectUser = (params) =>
  ajax('post', '/apis_project/user_list', 'json', false, params);

// 修改团队成员权限
export const changeUserRole = (params) =>
  ajax('post', '/project/user/change_role', 'json', false, params);

// 团队人员平铺列表可查看是否在当前项目下-简略
export const getTeamListWithProject = (
  params
) => ajax('post', '/team/place/list_with_project', 'json', false, params);

// 获取链接邀请
export const getProjectInviteUrl = (
  params
) => ajax('post', '/project/user/invite_url', 'json', false, params);

// 添加人员
export const addProjectPersonnel = (
  params
) => ajax('post', '/project/user/add', 'json', false, params);

// 获取可邀请的角色
export const getInviteRole = (params) =>
  ajax('post', '/project/user/invite_role', 'json', false, params);

// 获取团队工位总数和一用数量
export const getTeamPlaceCount = (params) =>
  ajax('post', '/team/place/count', 'json', false, params);

// 获取项目全部单流或测试套件简介列表
export const getAllSimpleProcessTestList = (
  params
) => ajax('post', '/apis/get_all_simple_process_tests', 'json', false, params);

// 批量获取单流或测试套件 详情列表
export const getMultiProcessTestList = (
  params
) => ajax('post', '/apis/get_multi_process_tests', 'json', false, params);

// 获取项目全部 测试报告 简介列表
export const getAllSimpleProcessTestReportList = (params) =>
    ajax('post', '/apis/get_all_simple_process_test_reports', 'json', false, params);

// 批量获取测试报告 详情列表
export const getMultiProcessTestReportList = (params) =>
    ajax('post', '/apis/get_multi_process_test_reports', 'json', false, params);
