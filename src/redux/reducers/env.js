const NAMESPACE = 'env';
import { v4 } from 'uuid';

const initialState = {
    // 刷新环境列表
    refresh: v4(),
    // 场景的环境id
    scene_env_id: 0
};

// action名称
const actionTypes =  {
    updateRefreshList: 'updateRefreshList',
    updateSceneEnvId: 'updateSceneEnvId'
}

export const envReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.updateRefreshList}`:
      return {
        ...state,
        refresh: v4(),
      };
    case `${NAMESPACE}/${actionTypes.updateSceneEnvId}`:
      return {
        ...state,
        scene_env_id: action.payload
      }
    default:
      return state;
  }
};

export default envReducer;
