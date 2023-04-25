const NAMESPACE = 'report';

const initialState = {
  // 立即刷新页面
  refreshList: false,
  // 列表数据
  report_list: null,
  // debug日志
  debug_list: null,
  // 压力机监控
  monitor_list: null,
  // 报告数据
  report_detail: null,
  // 报告顶部的基本信息
  report_info: null,
  // debug响应区
  debug_res: null
};

// action名称
const actionTypes = {
  updateRefreshList: 'updateRefreshList',
  updateReportList: 'updateReportList',
  updateDebugList: 'updateDebugList',
  updateMonitorList: 'updateMonitorList',
  updateReportDetail: 'updateReportDetail',
  updateReportInfo: 'updateReportInfo',
  updateDebugRes: 'updateDebugRes'
}

export const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.updateRefreshList}`:
      return {
        ...state,
        refreshList: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.updateReportList}`:
      return {
        ...state,
        report_list: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateDebugList}`:
      return {
        ...state,
        debug_list: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateMonitorList}`:
      return {
        ...state,
        monitor_list: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateReportDetail}`:
      return {
        ...state,
        report_detail: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateReportInfo}`:
      return {
        ...state,
        report_info: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateDebugRes}`:
      return {
        ...state,
        debug_res: action.payload
      }
    default:
      return state;
  }
};

export default reportReducer;
