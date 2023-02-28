export const Settings = {
  SYSTHEMCOLOR: 'white', // 主题色 white dark
  SYSCOMPACTVIEW: -1, // 精简视图 -1(不精简) 1(精简)
  SYSSCALE: 100, // 缩放比例 90 100 110 120
  MAX_CONSOLE_LOG: 10, // 最大日志显示数量
  AJAX_USER_TIMEOUT: 0, // 超时时间 0(不设置超时时间) 单位ms(has)
  FOLLOW_REDIRECT: 1, // 请求重定向  1(重定向) 0(不重定向)(has)
  MAX_REDIRECT_TIME: 5, // 最大重定向次数
  AJAX_DEFAULT_METHOD: 'POST', // 新建接口默认请求方式(has)
  AJAX_DEFAULT_MODE: 'none', // 新建接口默认 Content-Type(has)
  AUTO_CONVERT_FIELD_2_MOCK: 1, // 自动识别 MOCK 参数(has)
  REQUEST_PARAM_AUTO_JSON: -1, // 发送数据 Json 化，JSON 化会导致精度丢失。 1.00 会变成 1
  REQUEST_PROXY_OPEN: -1, // 代理认证状态 1(开启) -1 关闭(has)
  REQUEST_PROXY_URL: '', // 代理url string(has)
  REQUEST_PROXY_AUTH_OPEN: -1, // 代理认证(has)是否开启
  REQUEST_PROXY_AUTH_USERNAME: '', // 代理认证账号(
  REQUEST_PROXY_AUTH_PASSWORD: '', // 代理认证密码
  CA_CERTIFICATES: {
    OPEN: -1, // 代理证书是否开启1(开启) -1 关闭(has)
    FILE_URL: '', // 代理证书地址
    FILE_NAME: '', // 代理证书显示名称
  },
  CLIENT_CERTIFICATES: {}, // 客户端证书
  SEND_AFTER_SAVE_EXAMPLE: 1, // 发送结果保存到响应示例 1(不保存) 2(保存至成功示例) 3(保存到是失败示例)(has)
  TAB_TO_RESPONSE_AFTER_SEND: 1, // 发送后设置 发送后切换至"响应"标签 1(不切换) 2自动切换 (has)
  AUTO_OPEN_RESPONSE_PANEL: -1, // 发送后自动展开响应面板 1(开启) -1(不开启)(has)
  AUTO_BEAUTIFY_RESPONSE_RESULT: 1, // 发送后自动美化响应结果 1(开启) -1(关闭)(has)

  FOLDER_CLICK_SETTING: -1, // 目录点击设置 -1(目录折叠展开) 1(打开标签(建议)）(has)
  AUTO_GEN_MOCK_URL: 1, // 自动生成Mock URL地址 -1(关闭) 1(开启）
  AUTO_OPEN_CLONE_NEWAPI_TAB: 1, // 克隆后自动跳转至新接口标签 -1(关闭) 打开
  SYSTHECONSOLE: 0, // 是否展示控制台
  SYSPROJECTPACKUP: 1, // 全局参数的展开收起
  SYSAPISPROGRESS: 1, // 进度
  APIS_TAB_DIRECTION: -1, // 分屏 -1上下 1左右
  SYSRESPONSEPLANE: 0, // 展开响应面板
  AI_DESCRIPTIONS_SWITCH: 1, // 智能描述库
  MOCK_VARS: {},
  sysMessage: 0,
  sysAdvertising: [],
  GLOBAL_COOKIE_OPEN: 1, // 全局cookie 默认开启
  PROXY_TYPE: 'cloud', // 代理选择 默认 cloud 云端代理 desktop 桌面代理 browser 浏览器代理
  PROXY_AUTO: 1, // 代理自动选择 默认 1 开启 0 关闭
  CHECK_UPDATE: 1, // 检查更新 1 有新的更新，0 不需要更新
  UPDATEOBJ: {},
  isClickCheck: 1,
};
