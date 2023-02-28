const NAMESPACE = 'projects';

const initialState = {
  projectData: null, // 用户下所有项目列表
  tempParamsDesc: [], // 临时存储参数描述库
  noticeCount: 0,
  userOnlineList: [], // 在线用户列表
  globalVars: {},
};

// action名称
const actionTypes = {
  setCurrentProject: 'setCurrentProject',
  setProjectData: 'setProjectData',
  setTempParams: 'setTempParams',
  addTempParams: 'addTempParams',
  setNoticeCount: 'setNoticeCount',
  setUserOnlineList: 'setUserOnlineList',
  setGlobalVars: 'setGlobalVars',
}

export const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.setCurrentProject}`:
      return {
        ...state,
        currentProject: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.setProjectData}`:
      return {
        ...state,
        projectData: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.setTempParams}`:
      return {
        ...state,
        tempParamsDesc: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.setNoticeCount}`:
      return {
        ...state,
        noticeCount: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.setUserOnlineList}`:
      return {
        ...state,
        userOnlineList: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.setGlobalVars}`:
      return {
        ...state,
        globalVars: action.payload,
      };
    default:
      return state;
  }
};

export default projectsReducer;
