export const getPathExpressionObj = (type, extension) => {
  const pathExpressionObj = {
    description: 'request.description', // 修改接口描述
    name: 'name', // 修改接口名称,
    url: 'request.url', //  修改接口url
    mark: 'mark', // 修改接口状态
    method: 'method', // 修改接口请求方式
    assert: 'assert', // 接口断言
    regex: 'regex', // 正则表达式
    header: 'request.header.parameter', // 修改接口请求头
    query: 'request.query.parameter', // 修改接口query参数
    resful: 'request.resful.parameter', // 修改路径变量
    bodyParameter: 'request.body.parameter', // 修改接口body表格参数
    bodyRaw: 'request.body.raw', // 修改接口body raw参数
    bodyRawPara: 'request.body.raw_para', // 修改接口body raw para参数
    bodyMode: 'request.body.mode', // 修改接口body type类型
    folderheader: 'request.header', // 修改目录请求头
    folderquery: 'request.query', // 修改目录请求query
    folderbody: 'request.body', // 修改目录请求体
    auth: 'request.auth', // 修改接口认证信息
    authType: 'request.auth.type', // 修改接口认证类型
    authValue: `request.auth.${extension}`, // 修改接口认证值
    scriptPre: 'request.event.pre_script', // 修改接口预执行脚本
    folderScriptPre: 'script.pre_script', // 修改目录预执行脚本
    folderScriptPreSwitch: 'script.pre_script_switch', // 修改目录预执行脚本开关
    folderScriptTest: 'script.test', // 修改目录后执行脚本
    folderScriptTestSwitch: 'script.test_switch', // 修改目录后执行脚本开关
    scriptTest: 'request.event.test', // //修改接口后执行脚本
    example: `response.${extension}`, // 修改或者添加 整个响应示例
    exampleRaw: `response.${extension}.raw`, // 修改接口响应示例值
    exampleParameter: `response.${extension}.parameter`, // 修改接口响应示例中右侧表格的值
    shakeHandsTimeOut: 'socketConfig.shakeHandsTimeOut', // 修改socket 连接超时时间
    reconnectNum: 'socketConfig.reconnectNum', // 修改socket 重连次数
    reconnectTime: 'socketConfig.reconnectTime', // 修改socket 重连间隔时间
    informationSize: 'socketConfig.informationSize', // 修改socket 最大内容大小
    socketIoVersion: 'socketConfig.socketIoVersion', // 修改socket io 连接版本
    shakeHandsPath: 'socketConfig.shakeHandsPath', // 修改socket io 握手路径
    socketIoEventListeners: 'socketConfig.socketIoEventListeners', // 修改socket io 事件列表
    socketEventName: 'socketConfig.socketEventName', // 修改socket io 发送事件名称
    message: 'message', // 修改socket 发送内容
    messageType: 'messageType', // 修改socket 发送类型
    client_mock_url: 'client_mock_url', // 客户端mock地址
    server_mock_url: 'server_mock_url', // 服务端mock地址
    expect: 'expect', // 期望
    ai_expect: 'ai_expect', // 智能期望
    pre_url: 'request.pre_url',
    env_service_id: 'env_service_id'
  };
  return pathExpressionObj[type] || type;
};
export default getPathExpressionObj;
