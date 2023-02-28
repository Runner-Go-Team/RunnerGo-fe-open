const NAMESPACE = 'envs';

const initialState = {
  currentEnv: {
    env_id: '-1',
    id: '',
    name: '默认环境',
    list: {},
    pre_url: '',
    project_id: '',
  }, // 当前项目详细信息
  envDatas: {}, // 当前项目下所有环境信息
};

// action名称
const actionTypes =  {
  setCurrentEnv: 'setCurrentEnv',
  setEnvDatas: 'setEnvDatas',
}

export const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.setCurrentEnv}`:
      return {
        ...state,
        currentEnv: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.setEnvDatas}`:
      return {
        ...state,
        envDatas: action.payload,
      };
    default:
      return state;
  }
};

export default projectsReducer;
