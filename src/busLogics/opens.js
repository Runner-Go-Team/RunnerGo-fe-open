import { fetchTargetIdsRequest } from '@services/apis';
import { Message } from 'adesign-react';
import { getBaseCollection } from '../constants/baseCollection';

// 新建接口
// export const addOpenItem = (dispatch, open_apis, workspace) => {
//   const { CURRENT_PROJECT_ID } = workspace;
//   const newApi = getBaseCollection('api');
//   newApi.project_id = CURRENT_PROJECT_ID || '-1';
//   open_apis[newApi.target_id] = newApi;
//   Opens.put(newApi, newApi.target_id).then(() => {
//     dispatch({
//       type: 'opens/addOpenItem',
//       payload: open_apis,
//     });
//   });
// };
