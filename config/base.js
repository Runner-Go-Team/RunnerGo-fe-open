export const REQUEST_TIMEOUT = 10000; // 请求超时时间 单位毫秒
export const APP_VERSION = '7.0.0';

// 是否使用OSS服务做文件存储, 若不使用, 会走另外一个文件本地存储服务filer-server的逻辑
export const USE_OSS = true;

export default {
  REQUEST_TIMEOUT,
  APP_VERSION,
  USE_OSS
};
