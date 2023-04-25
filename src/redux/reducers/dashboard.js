const NAMESPACE = 'dashboard';

const initialState = {
  userData: {
    api_num: 0,
    plan_num: 0,
    report_num: 0,
    scene_num: 0,
  },

  homeData: null,
  refresh: false,
  runningPlan: null,
  globalParam: null
};

// action名称
const actionTypes = {
  updateUserData: 'updateUserData',
  updateRefresh: 'updateRefresh',

  updateHomeData: 'updateHomeData',
  updateRunningPlan: 'updateRunningPlan',
  updateGlobalParam: 'updateGlobalParam'
}

export const dashBoardReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.updateUserData}`:

      return {
        ...state,
        userData: action.payload,
      };

    case `${NAMESPACE}/${actionTypes.updateRefresh}`:
      return {
        ...state,
        refresh: action.payload
      }

    case `${NAMESPACE}/${actionTypes.updateHomeData}`:
      return {
        ...state,
        homeData: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateRunningPlan}`:
      return {
        ...state,
        runningPlan: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateGlobalParam}`:
      return {
        ...state,
        globalParam: action.payload
      }
    default:
      return state;
  }
};

export default dashBoardReducer;
