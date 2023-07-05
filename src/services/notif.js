import ajax from './ajax';

// 获取三方通知组列表
export const ServiceGetNoticeGroupList = (
  query
) => ajax('get', '/management/api/permission/get_notice_group_list', 'json', false, {}, query);

// 三方通知绑定
export const ServiceGetNoticeSaveEvent = (
  params
) => ajax('post', '/management/api/v1/notice/save_event', 'json', false, params);

// 发送通知
export const ServiceGetNoticeSend = (
  params
) => ajax('post', '/management/api/v1/notice/send', 'json', false, params);

// 获取通知事件对应通知组ID
export const ServiceGetNoticeGetGroupEvent = (
  query
) => ajax('get', '/management/api/v1/notice/get_group_event', 'json', false, {}, query);
