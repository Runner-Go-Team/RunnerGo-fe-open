const NAMESPACE = 'apis';

const initialState = {
  apiDatas: {}, // apis菜单列表
  isLoading: false, // 目录列表是否正在加载中
};

// action名称
const actionTypes = {
  recoverApiDatas: 'recoverApiDatas',
  updateApiDatas: 'updateApiDatas',
  updateLoadStatus: 'updateLoadStatus',
}

export const apisReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.recoverApiDatas}`:
      return {
        ...state,
        apiDatas: {},
        isLoading: true,
      };
    case `${NAMESPACE}/${actionTypes.updateApiDatas}`:
      return {
        ...state,
        isLoading: false,
        apiDatas: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.updateLoadStatus}`:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export default apisReducer;
