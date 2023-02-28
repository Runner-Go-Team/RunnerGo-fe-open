const NAMESPACE = 'runner';

const initialState = {
  currentTest: null, // 当前正在运行中的测试信息 example{type:"singleTest",name:'dasdasdas',test_id:'dadsada'}
  currentProgress: 0, // 当前进度
};

// action名称
const actionTypes = {
  setCurrentTest: 'setCurrentTest',
  setCurrentProgress: 'setCurrentProgress',
}

const runnerReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.setCurrentTest}`:
      return {
        ...state,
        currentTest: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.setCurrentProgress}`:
      return {
        ...state,
        currentProgress: action.payload,
      };

    default:
      return state;
  }
};

export default runnerReducer;
