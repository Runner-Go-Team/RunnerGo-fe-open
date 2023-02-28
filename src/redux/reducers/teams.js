const NAMESPACE = 'teams';

const initialState = {
  teamData: [], // 团队列表数据,
  teamMember: [], // 团队成员列表数据,
  logList: [], // 操作日志
};

// action名称
const actionTypes = {
  updateTeamData: 'updateTeamData',
  updateLogList: 'updateLogList',
  updateTeamMember: 'updateTeamMember'
}

export const teamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.updateTeamData}`:
      return {
        ...state,
        teamData: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.updateLogList}`:
      return {
        ...state,
        logList: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.updateTeamMember}`:
      return {
        ...state,
        teamMember: action.payload
      };
    default:
      return state;
  }
};

export default teamsReducer;
