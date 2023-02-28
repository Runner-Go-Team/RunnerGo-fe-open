const NAMESPACE = 'workspace';

const initialState = {
  // 默认项目id
  DEFAULT_PROJECT_ID: '-1',
  //  默认团队id
  DEFAULT_TEAM_ID: '-1',
  // 当前项目id
  CURRENT_PROJECT_ID: null,
  // 当前团队id
  CURRENT_TEAM_ID: '-1',
  // 当前接口id
  CURRENT_TARGET_ID: '-1',
  // 当前环境id
  CURRENT_ENV_ID: '-1',
};

// action名称
const actionTypes = {
  updateWorkspaceState: 'updateWorkspaceState',
}

export const workspaceReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.updateWorkspaceState}`:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default workspaceReducer;
