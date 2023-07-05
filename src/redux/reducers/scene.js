const NAMESPACE = 'scene';

import { v4 } from 'uuid';

const initialState = {
  sceneDatas: {}, // 场景管理菜单列表
  open_scene: null, // 打开的场景
  open_scene_name: '', // 打开的场景的名字
  open_scene_desc: '', //打开的场景的描述
  isLoading: false, // 目录列表是否正在加载中,
  nodes: [], // 节点
  edges: [], // 线,
  type: [],
  showApiConfig: false, // 是否展示接口配置
  saveScene: false, // 保存场景
  id_apis: {}, // id和api配置的映射关系
  id_now: '', // 当前配置的node id
  api_now: {}, // 当前配置的api
  node_config: {}, // id和api/控制器基本配置的映射关系

  import_node: [], // 导入项目时添加节点

  delete_node: '', // 要删除的节点id

  clone_node: [], // 复制的节点

  update_edge: {}, // 要改变的线
  update_node: {}, // 要改变的点

  run_res: null, // 运行场景的结果
  run_status: '', // 运行场景的状态
  run_api_res: null, // 运行节点API的结果

  success_edge: [], // 运行成功的线
  failed_edge: [], // 运行失败的线

  init_scene: false, // 初始化点和线的状态

  to_loading: false, // 所有节点进入loading状态

  running_scene: '', // 正在跑的场景id,

  select_box: '', //当前选中的节点

  beautify: false, // 美化当前场景

  edge_right_id: '',

  add_new: '',


  open_info: null,

  is_changed: false, // 判断当前场景是否进行了修改


  hide_drop: false, // 隐藏所有下拉框

  refresh_box: v4(),

  scene_global_param: null,

  show_mysql_config: false, // 是否弹出mysql的编辑抽屉
};

// action名称
const actionTypes = {
  recoverSceneDatas: 'recoverSceneDatas',
  updateSceneDatas: 'updateSceneDatas',
  updateLoadStatus: 'updateLoadStatus',
  updateNodes: 'updateNodes',
  updateEdges: 'updateEdges',
  updateType: 'updateType',
  updateApiConfig: 'updateApiConfig',
  updateSaveScene: 'updateSaveScene',
  updateIdApis: 'updateIdApis',
  updateApiNow: 'updateApiNow',
  updateNodeConfig: 'updateNodeConfig',
  updateImportNode: 'updateImportNode',
  updateOpenScene: 'updateOpenScene',
  updateDeleteNode: 'updateDeleteNode',
  updateCloneNode: 'updateCloneNode',
  updateOpenName: 'updateOpenName',
  updateChangeEdge: 'updateChangeEdge',
  updateChangeNode: 'updateChangeNode',
  updateRunRes: 'updateRunRes',
  updateIdNow: 'updateIdNow',
  updateApiRes: 'updateApiRes',
  updateSuccessEdge: 'updateSuccessEdge',
  updateFailedEdge: 'updateFailedEdge',

  updateInitScene: 'updateInitScene',
  updateToLoading: 'updateToLoading',
  updateRunningScene: 'updateRunningScene',
  updateRunStatus: 'updateRunStatus',
  updateSelectBox: 'updateSelectBox',
  updateOpenDesc: 'updateOpenDesc',

  updateBeautify: 'updateBeautify',

  updateEdgeRight: 'updateEdgeRight',

  updateAddNew: 'updateAddNew',

  updateOpenInfo: 'updateOpenInfo',
  updateIsChanged: 'updateIsChanged',

  updateHideDrop: 'updateHideDrop',

  updateRefreshBox: 'updateRefreshBox',
  updateSceneGlobalParam: 'updateSceneGlobalParam',

  updateShowMysqlConfig: 'updateShowMysqlConfig'
};

export const sceneReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.recoverSceneDatas}`:
      return {
        ...state,
        sceneDatas: {},
        isLoading: true,
      };
    case `${NAMESPACE}/${actionTypes.updateSceneDatas}`:
      return {
        ...state,
        isLoading: false,
        sceneDatas: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.updateLoadStatus}`:
      return {
        ...state,
        isLoading: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.updateNodes}`:
      return {
        ...state,
        nodes: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.updateEdges}`:
      return {
        ...state,
        edges: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateType}`:
      return {
        ...state,
        type: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateApiConfig}`:
      return {
        ...state,
        showApiConfig: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateSaveScene}`:
      return {
        ...state,
        saveScene: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateIdApis}`:
      return {
        ...state,
        id_apis: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateApiNow}`:
      return {
        ...state,
        api_now: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateNodeConfig}`:
      return {
        ...state,
        node_config: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateImportNode}`:
      return {
        ...state,
        import_node: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateOpenScene}`:
      return {
        ...state,
        open_scene: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateDeleteNode}`:
      return {
        ...state,
        delete_node: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateCloneNode}`:
      return {
        ...state,
        clone_node: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateOpenName}`:
      return {
        ...state,
        open_scene_name: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateChangeEdge}`:
      return {
        ...state,
        update_edge: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateChangeNode}`:
      return {
        ...state,
        update_node: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateRunRes}`:
      return {
        ...state,
        run_res: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateIdNow}`:
      return {
        ...state,
        id_now: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateApiRes}`:
      return {
        ...state,
        run_api_res: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateSuccessEdge}`:
      return {
        ...state,
        success_edge: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.updateFailedEdge}`:
      return {
        ...state,
        failed_edge: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateInitScene}`:
      return {
        ...state,
        init_scene: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateToLoading}`:
      return {
        ...state,
        to_loading: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateRunningScene}`:
      return {
        ...state,
        running_scene: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateRunStatus}`:
      return {
        ...state,
        run_status: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateSelectBox}`:
      return {
        ...state,
        select_box: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateOpenDesc}`:
      return {
        ...state,
        open_scene_desc: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateBeautify}`:
      return {
        ...state,
        beautify: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateEdgeRight}`:
      return {
        ...state,
        edge_right_id: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateAddNew}`:
      return {
        ...state,
        add_new: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateOpenInfo}`:
      return {
        ...state,
        open_info: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateIsChanged}`:
      return {
        ...state,
        is_changed: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateHideDrop}`:
      return {
        ...state,
        hide_drop: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateRefreshBox}`:
      return {
        ...state,
        refresh_box: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateSceneGlobalParam}`:
      return {
        ...state,
        scene_global_param: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateShowMysqlConfig}`:
      return {
        ...state,
        show_mysql_config: action.payload
      }
    default:
      return state;
  }
};

export default sceneReducer;
