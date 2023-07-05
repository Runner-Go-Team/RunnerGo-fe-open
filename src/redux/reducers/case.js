const NAMESPACE = 'case';

const initialState = {
  // 用例列表
  case_menu: {},
  // 准备添加接口或控制器
  add_new: '',
  // 添加接口或控制器
  type: [],
  // 当前打开的case
  open_case: {},
  // 当前打开的case名字
  open_case_name: '',
  // 当前打开的case描述
  open_case_desc: '',
  // id和api config的映射关系
  id_apis: {},
  // id和node config的映射关系
  node_config: {},
  // 节点
  nodes: [],
  // 线,
  edges: [],
  // 调试场景, 进入等待状态
  to_loading: false,
  // 引入接口
  import_node: [],
  // 当前编辑中的api
  api_now: {},
  // 是否展示接口编辑抽屉
  showApiConfig: false,
  // 当前配置的node id
  id_now: '',
  // 准备复制的node节点
  clone_node: {},
  // 准备删除的节点id
  delete_node: '',
  // 运行成功的线
  success_edge: [],
  // 运行失败的线
  failed_edge: [],
  // 当前选中的节点
  select_box: '',
  // 运行场景的结果
  run_res: null,
  // 初始化点和线的状态
  init_scene: false,
  // 正在跑的场景id
  running_scene: '',
  // 右键选中的线id
  edge_right_id: '',
  // 要改变的线
  update_edge: {},
  // 要改变的点
  update_node: {},
  // 运行场景的状态
  run_status: '',
  // 美化当前场景
  beautify: false,
  // 发送接口的返回结果
  run_api_res: null,


  // 展开用例集
  show_case: false,
  // 刷新用例菜单
  refresh: false,
  // 当前打开的用例基本信息
  open_info: {},
  // 展开断言tab
  show_assert: false,
  // 判断当前用例是否进行了修改
  is_changed: false,
  // 隐藏所有下拉框
  hide_drop: false,
  // 是否弹出mysql的编辑抽屉
  show_mysql_config: false,
};

const actionTypes = {
  updateAddNew: 'updateAddNew',
  updateType: 'updateType',
  updateOpenCase: 'updateOpenCase',
  updateIdApis: 'updateIdApis',
  updateNodeConfig: 'updateNodeConfig',
  updateNodes: 'updateNodes',
  updateEdges: 'updateEdges',
  updateToLoading: 'updateToLoading',
  updateImportNode: 'updateImportNode',
  updateApiNow: 'updateApiNow',
  updateApiConfig: 'updateApiConfig',
  updateIdNow: 'updateIdNow',
  updateCloneNode: 'updateCloneNode',
  updateDeleteNode: 'updateDeleteNode',
  updateSuccessEdge: 'updateSuccessEdge',
  updateFailedEdge: 'updateFailedEdge',
  updateSelectBox: 'updateSelectBox',
  updateRunRes: 'updateRunRes',
  updateInitScene: 'updateInitScene',
  updateRunningScene: 'updateRunningScene',
  updateEdgeRight: 'updateEdgeRight',
  updateShowCase: 'updateShowCase',
  updateCaseName: 'updateCaseName',
  updateCaseDesc: 'updateCaseDesc',
  updateChangeEdge: 'updateChangeEdge',
  updateChangeNode: 'updateChangeNode',
  updateRunStatus: 'updateRunStatus',
  updateBeautify: 'updateBeautify',
  updateRefreshMenu: 'updateRefreshMenu',
  updateApiRes: 'updateApiRes',
  updateOpenInfo: 'updateOpenInfo',
  updateShowAssert: 'updateShowAssert',
  updateIsChanged: 'updateIsChanged',
  updateHideDrop: 'updateHideDrop',
  updateCaseMenu: 'updateCaseMenu',
  updateShowMysqlConfig: 'updateShowMysqlConfig'
};

export const caseReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/${actionTypes.updateAddNew}`:
      return {
        ...state,
        add_new: action.payload
      };
    case `${NAMESPACE}/${actionTypes.updateType}`:
      return {
        ...state,
        type: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateOpenCase}`:
      return {
        ...state,
        open_case: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateIdApis}`:
      return {
        ...state,
        id_apis: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateNodeConfig}`:
      return {
        ...state,
        node_config: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateNodes}`:
      return {
        ...state,
        nodes: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateEdges}`:
      return {
        ...state,
        edges: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateToLoading}`:
      return {
        ...state,
        to_loading: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateImportNode}`:
      return {
        ...state,
        import_node: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateApiNow}`:
      return {
        ...state,
        api_now: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateApiConfig}`:
      return {
        ...state,
        showApiConfig: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateIdNow}`:
      return {
        ...state,
        id_now: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateCloneNode}`:
      return {
        ...state,
        clone_node: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateDeleteNode}`:
      return {
        ...state,
        delete_node: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateSuccessEdge}`:
      return {
        ...state,
        success_edge: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateFailedEdge}`:
      return {
        ...state,
        failed_edge: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateSelectBox}`:
      return {
        ...state,
        select_box: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateRunRes}`:
      return {
        ...state,
        run_res: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateInitScene}`:
      return {
        ...state,
        init_scene: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateRunningScene}`:
      return {
        ...state,
        running_scene: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateEdgeRight}`:
      return {
        ...state,
        edge_right_id: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateShowCase}`:
      return {
        ...state,
        show_case: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateCaseName}`:
      return {
        ...state,
        open_case_name: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateCaseDesc}`:
      return {
        ...state,
        open_case_desc: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateChangeEdge}`:
      return {
        ...state,
        update_edge: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateChangeNode}`:
      return {
        ...state,
        update_node: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateRunStatus}`:
      return {
        ...state,
        run_status: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateBeautify}`:
      return {
        ...state,
        beautify: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateRefreshMenu}`:
      return {
        ...state,
        refresh: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateApiRes}`:
      return {
        ...state,
        run_api_res: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateOpenInfo}`:
      return {
        ...state,
        open_info: action.payload
      }
    case `${NAMESPACE}/${actionTypes.updateShowAssert}`:
      return {
        ...state,
        show_assert: action.payload
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
    case `${NAMESPACE}/${actionTypes.updateCaseMenu}`:
      return {
        ...state,
        case_menu: action.payload
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

export default caseReducer;
