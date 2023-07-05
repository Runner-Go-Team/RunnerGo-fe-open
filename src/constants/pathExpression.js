export const getPathExpressionObj = (type, extension) => {
  const pathExpressionObj = {
    description: 'request.description', // 修改接口描述
    name: 'name', // 修改接口名称,
    url: 'request.url', //  修改接口url
    mark: 'mark', // 修改接口状态
    method: 'method', // 修改接口请求方式
    request_method: 'request.method',
    assert: 'request.assert', // 接口断言
    regex: 'request.regex', // 正则表达式
    http_api_setup: 'request.http_api_setup', // 接口设置
    cookie: 'request.cookie.parameter', // 修改接口cookie
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

    pre_url: 'env_info.pre_url', // url前缀
    env_id: 'env_info.env_id',  // 环境id
    env_name: 'env_info.env_name', // 环境名称
    service_id: 'env_info.service_id', // 服务id
    service_name: 'env_info.service_name', // 服务名称
    database_id: 'env_info.database_id', // 数据库id
    env_server_name: 'env_info.server_name', // 数据库名称

    sql_string: 'sql_detail.sql_string', // sql的sql内容
    mysql_env_id: 'sql_detail.env_id', // sql的环境id
    mysql_id: 'sql_detail.sql_database_info.mysql_id', // sql的和数据库id
    server_name: 'sql_detail.sql_database_info.server_name', // sql的自定义名称
    db_name: 'sql_detail.sql_database_info.db_name', // sql的数据库名称
    host: 'sql_detail.sql_database_info.host', // sql的ip地址
    port: 'sql_detail.sql_database_info.port', // sql的端口号
    user: 'sql_detail.sql_database_info.user', // sql的用户名
    password: 'sql_detail.sql_database_info.password', // mysql的密码
    charset: 'sql_detail.sql_database_info.charset', // mysql的编码集
    sql_assert: 'sql_detail.assert', // mysql的断言
    sql_regex: 'sql_detail.regex', // mysql的关联提取
    sql_database_info: 'sql_detail.sql_database_info', // sql的数据库信息集合


    oracle_sql_string: 'oracle_detail.sql_string', // mysql的sql内容
    oracle_env_id: 'oracle_detail.env_id', // mysql的环境id
    oracle_id: 'oracle_detail.oracle_database_info.mysql_id', // mysql的和数据库id
    oracle_server_name: 'oracle_detail.oracle_database_info.server_name', // mysql的自定义名称
    oracle_db_name: 'oracle_detail.oracle_database_info.db_name', // mysql的数据库名称
    oracle_host: 'oracle_detail.oracle_database_info.host', // mysql的ip地址
    oracle_port: 'oracle_detail.oracle_database_info.port', // mysql的端口号
    oracle_user: 'oracle_detail.oracle_database_info.user', // mysql的用户名
    oracle_password: 'oracle_detail.oracle_database_info.password', // mysql的密码
    oracle_charset: 'oracle_detail.oracle_database_info.charset', // mysql的编码集
    oracle_assert: 'oracle_detail.assert', // mysql的断言
    oracle_regex: 'oracle_detail.regex', // mysql的关联提取

    tcp_send_message: 'tcp_detail.send_message', // tcp的消息体
    tcp_config_connect_type: 'tcp_detail.tcp_config.connect_type', // tcp的连接方式
    tcp_connect_duration: 'tcp_detail.tcp_config.connect_duration_time', // tcp的连接持续时长
    tcp_send_message_interval: 'tcp_detail.tcp_config.send_msg_duration_time', // tcp的发送消息间隔时长
    tcp_connect_timeout_time: 'tcp_detail.tcp_config.connect_timeout_time', // tcp的连接超时设置
    tcp_retry_num: 'tcp_detail.tcp_config.retry_num', // tcp的重连尝试
    tcp_retry_interval: 'tcp_detail.tcp_config.retry_interval', // tcp的重新连接间隔
    tcp_url: 'tcp_detail.url', // tcp的url
    tcp_message_type: 'tcp_detail.message_type', // tcp的message type
    tcp_auto_send: 'tcp_detail.tcp_config.is_auto_send', // tcp设置的是否自动发送

    ws_url: 'websocket_detail.url', // websocket的url
    ws_send_message: 'websocket_detail.send_message', // websocket发送的消息
    ws_header: 'websocket_detail.ws_header', // websocket的header
    ws_param: 'websocket_detail.ws_param', // websocket的参数
    ws_event: 'websocket_detail.ws_event', // websocket的事件
    ws_config_connect_type: 'websocket_detail.ws_config.connect_type', // websocket的连接方式
    ws_connect_duration: 'websocket_detail.ws_config.connect_duration_time', // websocket的连接持续时长
    ws_send_message_interval: 'websocket_detail.ws_config.send_msg_duration_time', // websocket的发送消息间隔时长
    ws_connect_timeout_time: 'websocket_detail.ws_config.connect_timeout_time', // websocket设置的连接超时设置
    ws_retry_num: 'websocket_detail.ws_config.retry_num', // websocket设置的重连尝试
    ws_retry_interval: 'websocket_detail.ws_config.retry_interval', // websocket设置的重新连接间隔
    ws_message_type: 'websocket_detail.message_type', // websocket的message type
    ws_auto_send: 'websocket_detail.ws_config.is_auto_send', // websocket设置的是否自动发送

    mqtt_topic: "mqtt_detail.topic", // mqtt的topic
    mqtt_send_message: "mqtt_detail.send_message", // mqtt发送的消息
    mqtt_client_name: "mqtt_detail.common_config.client_name", // mqtt的客户端名称
    mqtt_username: "mqtt_detail.common_config.username", // mqtt的用户名
    mqtt_password: "mqtt_detail.common_config.password", // mqtt的密码
    mqtt_is_encrypt: "mqtt_detail.common_config.is_encrypt", // mqtt是否勾选SSL/TLS
    mqtt_auth_file: "mqtt_detail.common_config.auth_file", // mqtt上传的认证文件
    mqtt_connect_timeout_time: "mqtt_detail.higher_config.connect_timeout_time", // mqtt的连接超时时长
    mqtt_keep_alive_time: "mqtt_detail.higher_config.keep_alive_time", // mqtt的keep-alive时长
    mqtt_is_auto_retry: "mqtt_detail.higher_config.is_auto_retry", // mqtt是否勾选自动重连
    mqtt_retry_num: "mqtt_detail.higher_config.retry_num", // mqtt的重连次数
    mqtt_retry_interval: "mqtt_detail.higher_config.retry_interval", // mqtt的重连间隔时间
    mqtt_mqtt_version: "mqtt_detail.higher_config.mqtt_version", // mqtt的版本
    mqtt_dialogue_timeout: "mqtt_detail.higher_config.dialogue_timeout", // mqtt的会话过期时间
    mqtt_is_save_message: "mqtt_detail.higher_config.is_save_message", // mqtt是否勾选保留消息
    mqtt_service_quality: "mqtt_detail.higher_config.service_quality", // mqtt的服务质量
    mqtt_send_msg_interval_time: "mqtt_detail.higher_config.send_msg_interval_time", // mqtt的发送消息间隔时间
    mqtt_will_topic: "mqtt_detail.will_config.will_topic", // mqtt的遗愿主题
    mqtt_is_open_will: "mqtt_detail.will_config.is_open_will", // mqtt是否勾选开启遗愿
    mqtt_will_service_quality: "mqtt_detail.will_config.service_quality", // mqtt的服务质量

    dubbo_protocol: 'dubbo_detail.dubbo_protocol', // dubbo的类型
    dubbo_api_name: 'dubbo_detail.api_name', // dubbo的api调用名称
    dubbo_function_name: 'dubbo_detail.function_name', // dubbo的api调用名称
    dubbo_param: 'dubbo_detail.dubbo_param', // dubbo的基本参数
    dubbo_assert: 'dubbo_detail.dubbo_assert', // dubbo的断言
    dubbo_regex: 'dubbo_detail.dubbo_regex', // dubbo的关联提取
    dubbo_config_registration_center_name: 'dubbo_detail.dubbo_config.registration_center_name', // dubbo设置的注册中心
    dubbo_config_registration_center_address: 'dubbo_detail.dubbo_config.registration_center_address', // dubbo设置的注册中心地址
    dubbo_config_version: 'dubbo_detail.dubbo_config.version', // dubbo设置的版本
  };
  return pathExpressionObj[type] || type;
};
export default getPathExpressionObj;
