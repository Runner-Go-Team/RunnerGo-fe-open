export const REQUEST_DIST = {
  api: {
    '$.name': '接口名称',
    '$.request.url': '接口URL',
    '$.method': '请求方式',
    '$.mark': '接口状态',
    // mock_url: 'Mock 服务路径',
    // mock: 'Mock 服务模板',
    // 'parent_id' : '所属目录',
    '$.request.description': '接口描述',
    '$.request.query.parameter': '请求Query参数',
    '$.request.resful.parameter': '请求路径变量',
    '$.request.header.parameter': '请求Header参数',
    '$.request.body.mode': 'Body参数请求方式',
    '$.request.body.raw': '请求Body Raw参数',
    '$.request.body.raw_para': '请求Body Raw参数列表', // raw_para
    '$.request.body.parameter': '请求Body参数',
    '$.request.cookie.parameter': '请求cookie参数',
    '$.request.event.pre_script': '接口预执行脚本',
    '$.request.event.test': '接口后执行脚本',
    '$.request.auth.type': '接口认证类型',
    '$.request.auth.basic': '接口Basic认证参数',
    '$.request.auth.bearer': '接口Bearer认证参数',
    '$.request.auth.kv': '接口的私密键值对认证参数',
    '$.response.success.raw': '接口成功响应示例',
    '$.response.success.parameter': '接口成功响应示例参数',
    '$.response.error.raw': '接口失败响应示例',
    '$.response.error.parameter': '接口失败响应示例参数',
    // 'sort' : '排序'
  },
  websocket: {
    '$.name': '文档名称',
    '$.request.url': '接口URL',
    '$.method': '请求方式',
    '$.mark': '接口状态',
    '$.request.query.parameter': '请求Query参数',
    '$.request.header.parameter': '请求Header参数',
  },
  example: {
    '$.name': '文档名称',
    '$.request.url': '接口URL',
    '$.method': '请求方式',
    '$.mark': '接口状态',
    '$.mock_url': 'Mock 服务路径',
    '$.mock': 'Mock 服务模板',
    // 'parent_id' : '所属目录',
    '$.request.description': '接口描述',
    '$.request.query.parameter': '请求Query参数',
    '$.request.resful.parameter': '请求路径变量',
    '$.request.header.parameter': '请求Header参数',
    '$.request.body.mode': 'Body参数请求方式',
    '$.request.body.raw': '请求Body Raw参数',
    '$.request.body.raw_para': '请求Body Raw参数列表', // raw_para
    '$.request.body.parameter': '请求Body参数',
    '$.request.cookie.parameter': '请求cookie参数',
    '$.request.event.pre_script': '接口预执行脚本',
    '$.request.event.test': '接口后执行脚本',
    '$.request.auth.type': '接口认证类型',
    '$.request.auth.basic': '接口Basic认证参数',
    '$.request.auth.bearer': '接口Bearer认证参数',
    '$.request.auth.kv': '接口的私密键值对认证参数',
    '$.response.success.raw': '接口成功响应示例',
    '$.response.success.parameter': '接口成功响应示例参数',
    '$.response.error.raw': '接口失败响应示例',
    '$.response.error.parameter': '接口失败响应示例参数',
    // 'sort' : '排序'
  },
  doc: {
    '$.request.description': '文档描述',
    '$.name': '文档标题',
    '$.mark': '接口状态',
    // 'parent_id' : '所属目录',
    // 'sort' : '排序'
  },
  folder: {
    '$.name': '目录名称',
    '$.request.header': '目录公共Header参数',
    '$.request.query': '目录公共Query参数',
    '$.request.body': '目录公共Body参数',
    '$.request.auth.type': '目录公共认证类型',
    '$.request.auth.basic': '目录公共Basic认证参数',
    '$.request.auth.bearer': '目录公共Bearer认证参数',
    '$.request.auth.kv': '目录公共私密键值对认证参数',
    '$.request.description': '目录描述',
    '$.script.pre_script': '目录公共预执行脚本',
    '$.script.test': '目录公共后执行脚本',
  },
  grpc: {
    '$.name': '目录名称',
    '$.mark': '接口状态',
  },
  // global_script: {
  //   '$.script.pre_script': '全局公共预执行脚本',
  //   '$.script.test': '全局公共后执行脚本',
  // },
  global_descriptions: {
    '$.list': '参数描述库',
  },
  global_paras: {
    '$.request.header': '全局公共Header参数',
    '$.request.query': '全局公共Query参数',
    '$.request.body': '全局公共Body参数',
    '$.request.auth.type': '全局公共认证类型',
    '$.request.auth.basic': '全局公共Basic认证参数',
    '$.request.auth.bearer': '全局公共Bearer认证参数',
    '$.request.auth.kv': '全局公共私密键值对认证参数',
    '$.request.script.pre_script': '全局公共预执行脚本',
    '$.request.script.test': '全局公共后执行脚本',
  },
  env: {
    '$.name': '环境名称',
    '$.pre_url': '前置URL',
    '$.env_vars': '环境变量',
    // 'global_vars' : '全局变量',
  },
};

export const BOTHLIST = [
  '$.request.description',
  '$.request.query.parameter',
  '$.request.header.parameter',
  '$.request.body.parameter',
  '$.request.event.pre_script',
  '$.request.event.test',
  '$.request.header.parameter',
  // 'mock',
  '$.request.description',
  '$.request.header',
  '$.request.query',
  '$.request.body',
  '$.script.pre_script',
  '$.script.test',
  '$.list',
  '$.env_vars',
];

export const CONFILCTURL = {
  // '/apis/save_target_from_client': 'api', // 接口
  // '/apis/save_doc_from_client': 'doc', // 文档
  // '/apis/save_websocket_from_client': 'websocket', // websocket
  // '/apis/save_folder_from_client': 'folder', // 目录
  // '/apis/save_archive_and_update_target': 'archive', // 归档
  '/apis/save_target': 'save',
  '/project/save_global_description': 'global_descriptions', // 参数描述
  '/project/save_project_env': 'env', // 环境
  '/project/save_pro_request': 'global_paras', // 全局参数
};
