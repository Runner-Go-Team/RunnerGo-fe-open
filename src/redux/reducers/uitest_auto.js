const NAMESPACE = 'uitest_auto';

const initialState = {
  elementFolderDatas: {}, // 元素目录列表
  sceneDatas: {}, // 场景列表
  planSceneDatas: {}, // 计划下的场景列表
  sceneRunResult: {}, // 场景执行的实时结果
  reportDetails: {}, // 报告实时的详情结果
};

// action名称
const actionTypes = {
  updateElementFolderDatas: 'updateElementFolderDatas',
  updateSceneDatas: 'updateSceneDatas',
  updatePlanSceneDatas: 'updatePlanSceneDatas',
  updateSceneRunResult: 'updateSceneRunResult',
  setSceneRunResult: 'setSceneRunResult',
  seReportDetails: 'seReportDetails'
}

export const ui_test_autoReducer = (state = initialState, action) => {
  const { end, operator_id, scene_id, run_id, status,report_id } = action?.payload || {}
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.updateElementFolderDatas}`:
      return {
        ...state,
        elementFolderDatas: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.updateSceneDatas}`:
      return {
        ...state,
        sceneDatas: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.updatePlanSceneDatas}`:
      return {
        ...state,
        planSceneDatas: { ...state.planSceneDatas, [action.plan_id]: action.payload },
      };
    case `${NAMESPACE}/${actionTypes.updateSceneRunResult}`:
      const temp_scene = state.sceneRunResult?.[scene_id] || {}
      return {
        ...state,
        sceneRunResult: { ...state.sceneRunResult, [scene_id]: { ...temp_scene, status: end ? 'over' : 'running', [operator_id]: action.payload } },
      };
    case `${NAMESPACE}/${actionTypes.setSceneRunResult}`:
      return {
        ...state,
        sceneRunResult: { ...state.sceneRunResult, [scene_id]: { status, run_id } },
      };
    case `${NAMESPACE}/${actionTypes.seReportDetails}`:
      if(report_id){
        return {
          ...state,
          reportDetails: { ...state.reportDetails, [report_id]: action.payload },
        };
      }
      return state;
    default:
      return state;
  }
};

export default ui_test_autoReducer;
