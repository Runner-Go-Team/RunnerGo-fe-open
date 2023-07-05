import cloneDeep from 'lodash/cloneDeep';


const NAMESPACE = 'mock';

const initialState = {
  // 左侧目录
  mock_apis: {},
  // 顶部tabs 打开过的接口 key为id value为接口具体数据
  mock_apis_open: {},
  open_api_now: '',
  open_res: {}, // 响应结果
};

// action名称
const actionTypes = {
  coverOpenMockApis: 'coverOpenMockApis',
  removeApiById: 'removeApiById',
  updateOpenApiNow: 'updateOpenApiNow',
  updateOpenRes: 'updateOpenRes',
  recoverMockApis: 'recoverMockApis',
  coverMockApis: 'coverMockApis',
}

export const opensReducer = (state = initialState, action) => {
  const { mock_apis_open } = state || {};
  const { target_id } = action.payload || {};
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.coverOpenMockApis}`:
      return {
        ...state,
        mock_apis_open: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.removeApiById}`:
      const tempOpenApis = cloneDeep(mock_apis_open);
      delete tempOpenApis[target_id];
      return {
        ...state,
        mock_apis_open: tempOpenApis,
      };

    case `${NAMESPACE}/${actionTypes.updateOpenApiNow}`:
      return {
        ...state,
        open_api_now: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateOpenRes}`:
      return {
        ...state,
        open_res: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.recoverMockApis}`:
      return {
        ...state,
        mock_apis: {},
      };
    case `${NAMESPACE}/${actionTypes.coverMockApis}`:
      return {
        ...state,
        mock_apis: action.payload,
      };
    default:
      return state;
  }
};
export default opensReducer;
