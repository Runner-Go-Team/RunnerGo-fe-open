import { cloneDeep } from 'lodash';

const NAMESPACE = 'console';

const initialState = {
  consoleList: [], // 控制台打印列表
};

// action名称
const actionTypes = {
  addConsoleList: 'addConsoleList',
  coverConsoleList: 'coverConsoleList',
}


export const consoleReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.addConsoleList}`:
      const { consoleList } = state;
      let temp_console_list = cloneDeep(consoleList);
      temp_console_list = [...temp_console_list, action.payload];
      return {
        ...state,
        consoleList: temp_console_list,
      };
    case `${NAMESPACE}/${actionTypes.coverConsoleList}`:
      return {
        ...state,
        consoleList: action.payload,
      };
    default:
      return state;
  }
};

export default consoleReducer;
