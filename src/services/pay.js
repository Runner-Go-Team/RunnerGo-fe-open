import ajax from './ajax';

// 获取支付套餐卡片数据, 续费
export const fetchGetBuyVersion = (
    params
) => ajax('post', '/management/api/v1/order/get_team_buy_version', 'json', false, params);

// 获取支付套餐卡片数据, 购买
export const fetchGetBuyVersionNew = (
    params
) => ajax('post', '/management/api/v1/order/get_team_buy_version_new', 'json', false, params);

// 获取试用有效期, 续费
export const fetchGetTrialExpireDate = (
    params
) => ajax('post', '/management/api/v1/order/get_team_trial_expiration_date', 'json', false, params);

// 获取试用有效期, 购买
export const fetchGetTrialExpireDateNew = (
    params
) => ajax('post', '/management/api/v1/order/get_team_trial_expiration_date_new', 'json', false, params);

// 获取套餐价格, 续费
export const fetchGetBuyAmount = (
    params
) => ajax('post', '/management/api/v1/order/get_team_bug_version_amount', 'json', false, params);

// 获取套餐价格, 购买
export const fetchGetBuyAmountNew = (
    params
) => ajax('post', '/management/api/v1/order/get_team_buy_version_amount_new', 'json', false, params);

// 获取订单列表
export const fetchOrderList = (
    params
) => ajax('post', '/management/api/v1/order/get_order_list', 'json', false, params);

// 获取发票列表
export const fetchInvoiceList = (
    params
) => ajax('post', '/management/api/v1/order/get_invoice_list', 'json', false, params);

// 获取发票详情
export const fetchInvoiceDetail = (
    params
) => ajax('post', '/management/api/v1/order/get_invoice_detail', 'json', false, params);

// 删除订单
export const fetchDeleteOrder = (
    params
) => ajax('post', '/management/api/v1/order/batch_delete_order', 'json', false, params);

// 删除订单, 续费
export const fetchDeleteOrderNew = (
    params
) => ajax('post', '/management/api/v1/order/batch_delete_order_new', 'json', false, params);

// 开具发票接口
export const fetchCreateInvoice = (
    params
) => ajax('post', '/management/api/v1/order/add_invoice', 'json', false, params);

// 订单详情
export const fetchOrderDetail = (
    params
) => ajax('post', '/management/api/v1/order/get_order_detail', 'json', false, params);

// 获取vum列表
export const fetchVumList = (
    params
) => ajax('post', '/management/api/v1/order/get_vum_use_list', 'json', false, params);

// 创建订单, 续费
export const fetchCreateOrder = (
    params
) => ajax('post', '/management/api/v1/order/create_order', 'json', false, params);

// 创建订单, 购买
export const fetchCreateOrderNew = (
    params
) => ajax('post', '/management/api/v1/order/create_order_new', 'json', false, params);

// 获取购买VUM套餐卡片信息
export const fetchVumPackage = (
    params
) => ajax('post', '/management/api/v1/order/get_vum_buy_version', 'json', false, params);

// 获取未支付订单列表
export const fetchNotPayOrder = (
    params
) => ajax('post', '/management/api/v1/order/get_not_pay_order_list', 'json', false, params);

// 获取购买VUM价格详情
export const fetchVumAmount = (
    params
) => ajax('post', '/management/api/v1/order/get_vum_amount', 'json', false, params);

// 获取我的资源信息
export const fetchMyResource = (
    params
) => ajax('post', '/management/api/v1/order/get_my_resource_info', 'json', false, params);

// 获取订单支付详情, 续费
export const fetchPayDetail = (
    params
) => ajax('post', '/management/api/v1/order/get_order_pay_detail', 'json', false, params);

// 获取订单支付详情, 购买
export const fetchPayDetailNew = (
    params
) => ajax('post', '/management/api/v1/order/get_order_pay_detail_new', 'json', false, params);

// 获取订单支付状态, 续费
export const fetchPayStatus = (
    params
) => ajax('post', '/management/api/v1/order/get_order_pay_status', 'json', false, params);

// 获取订单支付状态, 购买
export const fetchPayStatusNew = (
    params
) => ajax('post', '/management/api/v1/order/get_order_pay_status_new', 'json', false, params);

// 获取当前计划预估使用vum数量
export const fetchUseVum = (
    params
) => ajax('post', '/management/api/v1/plan/get_estimate_use_vum_num', 'json', false, params);

// 获取当前团队所属团队套餐详情
export const fetchTeamPackage = (
    params
) => ajax('post', '/management/api/v1/order/get_current_team_buy_version', 'json', false, params);


// 统一获取价格及详情
export const fetchGetMoney = (
    params
) => ajax('post', '/management/api/v1/order/get_order_amount_detail', 'json', false, params);

// 统一获取价格及详情, 续费
export const fetchGetMoneyNew = (
    params
) => ajax('post', '/management/api/v1/order/get_order_amount_detail_new', 'json', false, params);