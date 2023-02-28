const NAMESPACE = 'conflict';

const initialState = {
  currentConflict: null, // 当前项目详细信息
};

// action名称
const actionTypes =  {
  setConflict: 'setConflict',
}

export const conflictReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.setConflict}`:
      return {
        ...state,
        currentConflict: action.payload,
      };
    default:
      return state;
  }
};

export default conflictReducer;
