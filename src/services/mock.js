// import { IBaseResponse } from '@dto/baseResponse';
// import ajax from './axios';
import ajax from './ajax';

// 获取目录/接口列表
export const fetchMockApiList = (
    query
) => ajax('get', '/management/api/v1/mock/target/list', 'json', false, {}, query);

// 创建/修改文件夹
export const fetchSaveMockFolder = (
    params
) => ajax('post', '/management/api/v1/mock/folder/save', 'json', false, params);

// 获取目录详情
export const fetchMockFolderDetail = (
  query
) => ajax('get', '/management/api/v1/mock/folder/detail', 'json', false, {}, query);

// 删除目录/接口
export const fetchDeleteFolderOrApi = (
  params
) => ajax('post', '/management/api/v1/mock/target/trash', 'json', false, params);

// 拖拽排序
export const fetchChangeSort = (
  params
) => ajax('post', '/management/api/v1/mock/target/sort', 'json', false, params);

// 获取接口发送结果
export const fetchGetMockResult = (
  query
) => ajax('get', '/management/api/v1/mock/target/result', 'json', false, {}, query);

// 发送接口
export const fetchMockApiSend = (
  params
) => ajax('post', '/management/api/v1/mock/target/send', 'json', false, params);

// 批量获取接口详情
export const fetchGetMockDetail = (
  query
) => ajax('get', '/management/api/v1/mock/target/detail', 'json', false, {}, query);

// 创建/修改mock对象
export const fetchMockSave = (
  params
) => ajax('post', '/management/api/v1/mock/target/save', 'json', false, params);

// 获取mock 元数据
export const fetchGetMockPreUrl = (
  query
) => ajax('get', '/management/api/v1/mock/get', 'json', false, {}, query);

// 导入mock接口到测试对象
export const fetchSaveMockToTarget = (
  params
) => ajax('post', '/management/api/v1/mock/save_to_target', 'json', false, params);
