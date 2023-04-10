const NAMESPACE = 'machine';

const initialState = {
    // 列表数据
    machine_list: null
};

// action名称
const actionTypes = {
    updateMachineList: 'updateMachineList'
}

export const machineReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.updateMachineList}`:
      return {
        ...state,
        machine_list: action.payload,
      };
    default:
      return state;
  }
};

export default machineReducer;