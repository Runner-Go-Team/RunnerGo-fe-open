const NAMESPACE = 'plan';

const initialState = {
  planData: null, // 运行中的计划
  refreshList: false, // 刷新计划列表
  open_plan: {}, // 打开的计划
  open_plan_scene: null, // 计划中打开的场景
  open_scene_name: '', // 打开的场景的名字
  open_scene_desc: '', //打开的场景的描述
  planMenu: {}, // 计划左侧菜单

  api_now: '', // 当前打开的接口编辑

  id_apis: {},
  id_now: '', // 当前配置的node id
  showApiConfig: false,
  node_config: {},
  type: [],
  nodes: [],
  edges: [],
  delete_node: '',

  clone_node: [],
  import_node: [],

  run_res: null,
  run_status: '',
  run_api_res: null,

  success_edge: [], // 运行成功的线
  failed_edge: [], // 运行失败的线

  task_config: {
    control_mode: 0,
    debug_mode: "stop",
    is_open_distributed: 0,
    machine_dispatch_mode_conf: {
      machine_allot_type: 0,
      usable_machine_list: []
    },
    mode: 1,
    task_type: 1,
    mode_conf: {},
    timed_task_conf: {}
  }, // 任务配置

  init_scene: false,
  to_loading: false,

  running_scene: '',
  select_box: '',

  // 对比时选中的tab
  select_plan: 0,

  open_first: false,

  email_list: [],


  beautify: false,

  edge_right_id: '',

  add_new: '',

  is_changed: false, // 判断当前场景是否修改了

  hide_drop: false, // 隐藏所有下拉框

  hide_config: false, //隐藏任务配置

  plan_list: null, // 列表的计划


  plan_detail: null, //计划详情顶部的基本信息

  show_mysql_config: false, // 是否弹出mysql的编辑抽屉
};

// action名称
const actionTypes = {
  updatePlanData: 'updatePlanData',
  updateRefreshList: 'updateRefreshList',
  updateOpenPlan: 'updateOpenPlan',
  updatePlanMenu: 'updatePlanMenu',
  updateOpenScene: 'updateOpenScene',
  updateIdApis: 'updateIdApis',
  updateNodeConfig: 'updateNodeConfig',
  updateType: 'updateType',
  updateNodes: 'updateNodes',
  updateEdges: 'updateEdges',
  updateImportNode: 'updateImportNode',
  updateDeleteNode: 'updateDeleteNode',
  updateCloneNode: 'updateCloneNode',
  updateApiNow: 'updateApiNow',

  updateRunRes: 'updateRunRes',
  updateIdNow: 'updateIdNow',
  updateApiRes: 'updateApiRes',
  updateSuccessEdge: 'updateSuccessEdge',
  updateFailedEdge: 'updateFailedEdge',
  updateApiConfig: 'updateApiConfig',

  updateTaskConfig: 'updateTaskConfig',

  updateInitScene: 'updateInitScene',
  updateToLoading: 'updateToLoading',

  updateRunningScene: 'updateRunningScene',
  updateRunStatus: 'updateRunStatus',
  updateSelectBox: 'updateSelectBox',

  updateSelectPlan: 'updateSelectPlan',

  updateOpenFirst: 'updateOpenFirst',
  updateEmailList: 'updateEmailList',

  updateBeautify: 'updateBeautify',

  updateEdgeRight: 'updateEdgeRight',
  updateAddNew: 'updateAddNew',

  updateIsChanged: 'updateIsChanged',
  updateHideDrop: 'updateHideDrop',
  updateOpenName: 'updateOpenName',
  updateOpenDesc: 'updateOpenDesc',
  updateHideConfig: 'updateHideConfig',

  updatePlanList: 'updatePlanList',
  updatePlanDetail: 'updatePlanDetail',

  updateShowMysqlConfig: 'updateShowMysqlConfig'
}

export const plansReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.updatePlanData}`:
      return {
        ...state,
        planData: action.payload,
      };
    case `${NAMESPACE}/${actionTypes.updateRefreshList}`:
      return {
        ...state,
        refreshList: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateOpenPlan}`:
      return {
        ...state,
        open_plan: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updatePlanMenu}`:
      return {
        ...state,
        planMenu: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateOpenScene}`:
      return {
        ...state,
        open_plan_scene: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateIdApis}`:
      return {
        ...state,
        id_apis: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateNodeConfig}`:
      return {
        ...state,
        node_config: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateType}`:
      return {
        ...state,
        type: action.payload,
      }
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
    case `${NAMESPACE}/${actionTypes.updateImportNode}`:
      return {
        ...state,
        import_node: action.payload,
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
    case `${NAMESPACE}/${actionTypes.updateApiNow}`:
      return {
        ...state,
        api_now: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateApiConfig}`:
      return {
        ...state,
        showApiConfig: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateTaskConfig}`:
      return {
        ...state,
        task_config: action.payload,
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
    case `${NAMESPACE}/${actionTypes.updateSelectPlan}`:
      return {
        ...state,
        select_plan: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateOpenFirst}`:
      return {
        ...state,
        open_first: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateEmailList}`:
      return {
        ...state,
        email_list: action.payload
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
    case `${NAMESPACE}/${actionTypes.updateOpenName}`:
      return {
        ...state,
        open_scene_name: action.payload,
      }
    case `${NAMESPACE}/${actionTypes.updateOpenDesc}`:
      return {
        ...state,
        open_scene_desc: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateHideConfig}`:
      return {
        ...state,
        hide_config: action.payload
      }

    case `${NAMESPACE}/${actionTypes.updatePlanList}`:
      return {
        ...state,
        plan_list: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updatePlanDetail}`:
      return {
        ...state,
        plan_detail: action.payload
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

export default plansReducer;
