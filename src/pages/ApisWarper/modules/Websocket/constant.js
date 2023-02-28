export const MsgStatusList = [
  {
    key: '全部消息',
    value: 'all',
  },
  {
    key: '已发送',
    value: 'send',
  },
  {
    key: '已接收',
    value: 'message',
  },
];

// 控制台返回结果类型，
export const ConsoleModeList = [
  {
    key: 'Text',
    value: 'text',
  },
  {
    key: 'Html',
    value: 'html',
  },
  {
    key: 'Json',
    value: 'json',
  },
  {
    key: 'Xml',
    value: 'xml',
  },
];

export const rawConfigList = [
  {
    title: '连接超时设置',
    desc: '设置socket请求连接等待超时时长（以毫秒为单位）。 要永不超时，请设置为 0。',
    field: 'shakeHandsTimeOut',
  },
  {
    title: '重连尝试',
    desc: '连接突然断开时的最大重新尝试连接次数。',
    field: 'reconnectNum',
  },
  {
    title: '重新连接间隔',
    desc: '每次重新连接尝试之间的时间间隔。(以毫秒为单位)',
    field: 'reconnectTime',
  },
  {
    title: '最大内容大小',
    desc: '允许的最大发送内容大小（以 MB 为单位）。 要接收任何大小的消息，请设置为 0。',
    field: 'informationSize',
  },
];
export const IOConfigList = [
  {
    title: '客户端版本',
    desc: '选择应该用于连接服务器的客户端版本',
    field: 'socketIoVersion',
  },
  {
    title: '握手路径',
    desc: '设置握手请求期间应使用的服务器路径',
    field: 'shakeHandsPath',
  },
  {
    title: '连接超时设置',
    desc: '设置socket请求连接等待超时时长（以毫秒为单位）。 要永不超时，请设置为 0。',
    field: 'shakeHandsTimeOut',
  },
  {
    title: '重连尝试',
    desc: '连接突然断开时的最大重新尝试连接次数。',
    field: 'reconnectNum',
  },
  {
    title: '重新连接间隔',
    desc: '每次重新连接尝试之间的时间间隔。(以毫秒为单位)',
    field: 'reconnectTime',
  },
];

// 模拟数据
export const socketResponse = [
  {
    target_id: 'c6764868-83a4-418d-a8ce-70d4f6a38a02',
    responseType: 'success',
    messagetime: '14:07:22',
    messageType: 'connect',
    message: '{}',
    size: 2,
  },
  {
    target_id: 'c6764868-83a4-418d-a8ce-70d4f6a38a02',
    responseType: 'receive',
    messagetime: '14:07:22',
    messageType: 'messgae',
    message: 'hi',
    size: 2,
  },
  {
    target_id: 'c6764868-83a4-418d-a8ce-70d4f6a38a02',
    responseType: 'close',
    messagetime: '14:07:22',
    messageType: 'close',
    message: 1000,
    size: 4,
  },
];
