import ajax from './ajax';

// 获取套餐
export const getPaymentList = (params) =>
  ajax('post', '/goods/package_list', 'json', false, params);

// 创建订单
export const createPay = (params) =>
  ajax('post', '/pay/create', 'json', false, params);

// 获取订单状态
export const getPayStatus = (params) =>
  ajax('post', '/pay/get_order_status', 'json', false, params);
