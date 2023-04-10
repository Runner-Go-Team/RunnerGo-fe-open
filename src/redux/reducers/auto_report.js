const NAMESPACE = 'auto_report';

const initialState = {
  // 立即刷新页面
  refreshList: false,

  // 列表数据
  auto_report_list: null
};

// action名称
const actionTypes = {
  updateRefreshList: 'updateRefreshList',
  updateAutoReportList: 'updateAutoReportList'
}

export const autoReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.updateRefreshList}`:
      return {
        ...state,
        refreshList: action.payload,
      };

    case `${NAMESPACE}/${actionTypes.updateAutoReportList}`:
      return {
        ...state,
        auto_report_list: action.payload
      }
    default:
      return state;
  }
};

export default autoReportReducer;
