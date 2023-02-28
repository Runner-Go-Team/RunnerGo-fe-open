const NAMESPACE = 'auto_report';

const initialState = {
    // 立即刷新页面
    refreshList: false
};

// action名称
const actionTypes = {
    updateRefreshList: 'updateRefreshList'
}

export const autoReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.updateRefreshList}`:
      return {
        ...state,
        refreshList: action.payload,
      };
    default:
      return state;
  }
};

export default autoReportReducer;
