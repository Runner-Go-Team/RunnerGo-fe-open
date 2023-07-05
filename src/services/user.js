import ajax, { RxAjaxObservable } from './ajax';

// 用户邮箱登陆
export const fetchUserLoginForEmailRequest = (
  params
) => ajax('post', '/management/api/v1/auth/login', 'json', false, params);
// 用户邮箱注册
export const fetchUserRegisterForEmailRequest = (
  params
) => ajax('post', '/management/api/v1/auth/signup', 'json', false, params);
// 获取团队列表
export const fetchTeamList = (

) => ajax('get', '/management/api/v1/team/list', 'json', false);
// 获取团队列表, 购买套餐
export const fetchTeamListNew = (

  ) => ajax('get', '/management/api/v1/team/list_new', 'json', false);
// 创建/修改团队
export const fetchCreateTeam = (
  params
) => ajax('post', '/management/api/v1/team/save', 'json', false, params);
// 退出团队
export const fetchQuitTeam = (
  params
) => ajax('post', '/management/api/v1/team/quit', 'json', false, params);
// 设置成员角色
export const fetchUpdateRole = (
  params
) => ajax('post', '/management/api/v1/team/role', 'json', false, params);
// 获取团队成员列表
export const fetchTeamMemberList = (
  query
) => ajax('get', '/management/api/v1/team/members', 'json', false, {}, query);
// 移出成员
export const fetchRemoveMember = (
  params
) => ajax('post', '/management/api/v1/team/remove', 'json', false, params);
// 邀请成员
export const fetchInviteMember = (
  params
) => ajax('post', '/management/api/v1/team/invite', 'json', false, params);
// token续期
export const fetchTokenRefresh = (

) => ajax('get', '/management/api/v1/auth/refresh_token', 'json', false);
// 获取用户配置
export const fetchUserConfig = (
  
) => ajax('get', '/management/api/v1/setting/get', 'json', false);
// 修改用户配置
export const fetchUpdateConfig = (
  params
) => ajax('post', '/management/api/v1/setting/set', 'json', false, params);
// 获取成员角色
export const fetchGetRole = (
  query
) => ajax('get', '/management/api/v1/team/role', 'json', false, {}, query);
// 解散团队
export const fetchDissTeam = (
  params
) => ajax('post', '/management/api/v1/team/disband', 'json', false, params);
// 修改昵称
export const fetchUpdateName = (
  params
) => ajax('post', '/management/api/v1/user/update_nickname', 'json', false, params);
// 修改密码
export const fetchUpdatePwd = (
  params
) => ajax('post', '/management/api/v1/user/update_password', 'json', false, params);
// 修改头像
export const fetchUpdateAvatar = (
  params
) => ajax('post', '/management/api/v1/user/update_avatar', 'json', false, params);
// 忘记密码
export const fetchFindPassword = (
  params
)  => ajax('post', '/management/api/v1/auth/forget_password', 'json', false, params);
// 重置密码
export const fetchResetPassword = (
  params
) => ajax('post', '/management/api/v1/auth/reset_password', 'json', false, params);
// 密码是否正确
export const fetchCheckPassword = (
  params
) => ajax('post', '/management/api/v1/user/verify_password', 'json', false, params);
// 获取邀请链接
export const fetchGetLink = (
  query
) => ajax('get', '/management/api/v1/team/invite/url', 'json', false, {}, query);
// 打开邀请链接
export const fetchOpenLink = (
  params
) => ajax('post', '/management/api/v1/team/invite/url', 'json', false, params);
// 获取邀请人的用户信息
export const fetchGetInvitate = (
  params
) => ajax('post', '/management/api/v1/team/get_invite_user_info', 'json', false, params);
// 邀请页面的立即登录接口
export const fetchAcceptInvitate = (
  params
) => ajax('post', '/management/api/v1/team/invite/login', 'json', false, params);
// 获取短信验证码
export const fetchSMSCode = (
  params
) => ajax('post', '/management/api/v1/auth/get_sms_code', 'json', false, params);
// 校验短信验证码
export const fetchCheckSMSCode = (
  params
) => ajax('post', '/management/api/v1/auth/verify_sms_code', 'json', false, params);
// 短信验证码登录
export const fetchSMSCodeLogin = (
  params
) => ajax('post', '/management/api/v1/auth/sms_code_login', 'json', false, params);
// 手机号密码登录
export const fetchPhonePwdLogin = (
  params
) => ajax('post', '/management/api/v1/auth/mobile_login', 'json', false, params);
// 查询当前邀请邮箱是否存在
export const fetchEmailIsExist = (
  params
) => ajax('post', '/management/api/v1/team/get_invite_email_is_exist', 'json', false, params);
// 邮箱是否注册
export const fetchEmailHasRegister = (
  params
) => ajax('post', '/management/api/v1/auth/check_email_is_register', 'json', false, params);
// 注册登录二合一
export const fetchRegisterAndLogin = (
  params
) => ajax('post', '/management/api/register_or_login', 'json', false, params);

// 获取团队 企业内成员邀请列表
export const getTeamInviteMemberList = (
  params
) => ajax('post', '/management/api/permission/get_team_company_members', 'json', false, params);

// 添加团队成员
export const addTeamMember = (
  params
) => ajax('post', '/management/api/permission/team_members_save', 'json', false, params);

// 获取我的角色信息
export const ServiceGetUserRole = (
  params
) => ajax('post', '/management/api/permission/get_role_member_info', 'json', false, params);




// 获取微信二维码
export const fetchGetWxCodeRequest = (
  params
) => ajax('post', '/login/get_wx_code', 'json', false, params);
// 检查用户是否扫码
export const fetchCheckUserWxCodeRequest = (
  params
) => ajax('post', '/login/has_sweep_wx', 'json', false, params);

// 检查用户配置信息
export const fetchUserConfigRequest = () =>
  ajax('post', '/sys/get_user_configure', 'json', false, null);

// 修改配置信息
export const setSysConfig = (params) =>
  ajax('post', '/sys/save_user_configure', 'json', false, params);

// 刷新用户identity
export const refreshIdentity = () =>
  ajax('post', '/user/identity', 'json', false, null);

// 获取团队成员列表
export const fetchProjectUserListRequest = (
  params
) => ajax('post', '/apis_project/user_list', 'json', false, params);

// 检查手机号或邮箱是否注册, 并发送手机验证码
export const fetchEmailPhoneIsRegister = (
  params
) => ajax('post', '/management/api/v1/auth/check_user_is_register', 'json', false, params);

// 注册登录二合一接口
export const fetchRegisterOrLogin = (
  params
) => ajax('post', '/management/api/v1/auth/register_or_login', 'json', false, params);

// 设置用户密码
export const fetchSetPassword = (
  params
) => ajax('post', '/management/api/v1/auth/set_user_password', 'json', false, params);

// 收集用户信息
export const fetchCollectInfo = (
  params
) => ajax('post', '/management/api/v1/user/collect_user_info', 'json', false, params);

// 判断是否需要收集用户信息
export const fetchGetCollectInfo = (
  params
) => ajax('post', '/management/api/v1/user/get_collect_user_info', 'json', false, params);

// 获取微信登录二维码
export const fetchGetWxCode = (
  params
) => ajax('post', '/management/api/v1/auth/get_wechat_login_qr_code', 'json', false, params);

// 获取微信登录结果
export const fetchGetWxResult = (
  params
) => ajax('post', '/management/api/v1/auth/get_wechat_login_result', 'json', false, params);

// 微信绑定手机号
export const fetchBindWxPhone = (
  params
) => ajax('post', '/management/api/v1/auth/wechat_register_or_login', 'json', false, params);

// 检查当前用户是否需要换绑微信
export const fetchChangeBindWx = (
  params
) => ajax('post', '/management/api/v1/auth/check_wechat_is_change_bind', 'json', false, params);

// 修改用户邮箱
export const fetchUpdateEmail = (
  params
) => ajax('post', '/management/api/v1/user/update_email', 'json', false, params);

// 修改用户账号
export const fetchUpdateAccount = (
  params
) => ajax('post', '/management/api/v1/user/update_account', 'json', false, params);

// 开源版注册
export const fetchOpenRegister = (
  params
) => ajax('post', '/management/api/v1/auth/user_register', 'json', false, params);

// 开源版登录
export const fetchOpenLogin = (
  params
) => ajax('post', '/management/api/v1/auth/user_login', 'json', false, params);