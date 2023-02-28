// import { IBaseResponse } from '@dto/baseResponse';
import ajax, { RxAjaxObservable } from './ajax';

// 获取用户下项目列表
export const saveOssFile = (params) =>
  ajax('post', '/oss/push_files', 'form', false, params);
