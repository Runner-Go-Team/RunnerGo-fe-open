import cloneDeep from 'lodash/cloneDeep';


const NAMESPACE = 'opens';

const initialState = {
  // 顶部tabs 打开过的接口 key为id value为接口具体数据
  open_apis: {},
  open_api_now: '',
  // api temp数据 （无须上传服务器）
  temp_apis: {},
  websockets: {}, // websocket连接池 key为id value为对象 status 为连接状态 client为连接操作对象 socketRes为接收到的结果
  temp_grpcs: {}, // grpc 返回的响应结果
  apipostHeaders: [
    {
      key: 'accept',
      value: '*/*',
      is_checked: 1,
    },
    {
      key: 'accept-encoding',
      value: 'gzip, deflate, br',
      is_checked: 1,
    },
    // {
    //   key: 'accept-language',
    //   value: 'zh-CN',
    //   is_checked: 1,
    // },
    {
      key: 'user-agent',
      value: 'ApiPOST Runtime +https://www.apipost.cn',
      is_checked: 1,
    },
    {
      key: 'connection',
      value: 'keep-alive',
      is_checked: 1,
    },
  ], // apipost 默认请求头

  open_res: {}, // 响应结果
  sql_res: {}, // mysql oracle的响应结果
  tcp_res: {}, // tcp的响应结果
  ws_res: {}, // websocket的响应结果
  dubbo_res: {}, // dubbo的响应结果
  saveId: null,
};

// action名称
const actionTypes = {
  setSocketResById: 'setSocketResById',
  updateWebsocket: 'updateWebsocket',
  coverWebsockets: 'coverWebsockets',
  coverOpenApis: 'coverOpenApis',
  removeApiById: 'removeApiById',
  updateTempApisById: 'updateTempApisById',
  updateTempGrpcsById: 'updateTempGrpcsById',
  setApipostHeaders: 'setApipostHeaders',
  updateOpenApiNow: 'updateOpenApiNow',
  updateOpenRes: 'updateOpenRes',
  InitApis: 'InitApis',
  updateSaveAll: 'updateSaveAll',
  updateSaveId: 'updateSaveId',
  updateSqlRes: 'updateSqlRes',
  updateTcpRes: 'updateTcpRes',
  updateWsRes: 'updateWsRes',
  updateDubboRes: 'updateDubboRes',
}

export const opensReducer = (state = initialState, action) => {
  const { open_apis, websockets, temp_apis, temp_grpcs } = state || {};
  const { target_id } = action.payload || {};
  const tempWebsockets = cloneDeep(websockets);
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.InitApis}`:
      const _data = cloneDeep(action.payload);
      for (let i in _data) {
        _data[i].is_changed = -1
      }
      return {
        ...state,
        open_apis: _data,
      };
    case `${NAMESPACE}/${actionTypes.coverOpenApis}`:
      return {
        ...state,
        open_apis: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.removeApiById}`:
      const tempOpenApis = cloneDeep(open_apis);
      delete tempOpenApis[target_id];
      return {
        ...state,
        open_apis: tempOpenApis,
      };
    case `${NAMESPACE}/${actionTypes.coverWebsockets}`:
      return {
        ...state,
        websockets: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.updateWebsocket}`:
      if (tempWebsockets.hasOwnProperty(action.id)) {
        tempWebsockets[action.id] = { ...tempWebsockets[action.id], ...action.payload };
      } else {
        tempWebsockets[action.id] = { ...action.payload };
      }
      return {
        ...state,
        websockets: tempWebsockets,
      };
    case `${NAMESPACE}/${actionTypes.updateTempApisById}`:
      const tempApis = cloneDeep(temp_apis);
      if (!tempApis.hasOwnProperty(action.id)) {
        tempApis[action.id] = {};
      }
      tempApis[action.id] = { ...tempApis[action.id], ...action.payload };
      return {
        ...state,
        temp_apis: tempApis,
      };
    case `${NAMESPACE}/${actionTypes.updateTempGrpcsById}`:
      const tempGrpcs = cloneDeep(temp_grpcs);
      if (!tempGrpcs.hasOwnProperty(action.id)) {
        tempGrpcs[action.id] = {};
      }
      if (tempGrpcs[action.id].hasOwnProperty(action.methodPath)) {
        tempGrpcs[action.id][action.methodPath] = {};
      }
      tempGrpcs[action.id][action.methodPath] = {
        ...tempGrpcs[action.id][action.methodPath],
        ...action.payload,
      };
      return {
        ...state,
        temp_grpcs: tempGrpcs,
      };

    case `${NAMESPACE}/${actionTypes.setSocketResById}`:
      const { status, res } = action.payload;
      if (!tempWebsockets[action.id]) {
        tempWebsockets[action.id] = {
          status,
          socketRes: [res],
        };
      } else {
        if (status) tempWebsockets[action.id].status = status;
        if (res)
          tempWebsockets[action.id].socketRes = [res, ...tempWebsockets[action.id].socketRes];
      }
      return {
        ...state,
        websockets: tempWebsockets,
      };
    case `${NAMESPACE}/${actionTypes.setApipostHeaders}`:
      return {
        ...state,
        apipostHeaders: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.updateOpenApiNow}`:
      return {
        ...state,
        open_api_now: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateOpenRes}`:
      return {
        ...state,
        open_res: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateSaveAll}`:
      const _apis = cloneDeep(open_apis);
      for (let i in _apis) {
        if (_apis[i].is_changed > 0) {
          _apis[i].is_changed = -1;
        }
      }
      // _apis[action.payload].is_changed = -1;
      return {
        ...state,
        open_apis: _apis,
      }
    case `${NAMESPACE}/${actionTypes.updateSaveId}`:
      return {
        ...state,
        saveId: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateSqlRes}`:
      return {
        ...state,
        sql_res: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateTcpRes}`:
      return {
        ...state,
        tcp_res: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateWsRes}`:
      return {
        ...state,
        ws_res: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateDubboRes}`:
      return {
        ...state,
        dubbo_res: action.payload
      }
    default:
      return state;
  }
};
export default opensReducer;
