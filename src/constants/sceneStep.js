export const STEP_FOOTERS = [
  {
    name: '浏览器操作', type: 'browser', color: 'var(--theme-color)', backgroundColor: 'rgba(64, 82, 236, 0.1)',
    menus: [{ name: '打开网页', action: 'open_page' },
    { name: '关闭网页', action: 'close_page' },
    { name: '切换窗口', action: 'toggle_window' },
    { action: 'forward', name: '前进' },
    { action: 'back', name: '后退' },
    { action: 'refresh', name: '刷新' }]
  },
  {
    name: '鼠标操作', type: 'mouse', color: 'rgba(109, 64, 236, 1)', backgroundColor: 'rgba(109, 64, 236, 0.1)',
    menus: [{ name: '点击', action: 'mouse_clicking' },
    { name: '鼠标滚动', action: 'mouse_scrolling' },
    { name: '鼠标移动', action: 'mouse_movement' },
    { name: '鼠标拖拽', action: 'mouse_dragging' }]
  },
  { name: '输入操作', type: 'input_operations', color: 'rgba(64, 153, 236, 1)', backgroundColor: 'rgba(64, 153, 236, 0.1)' },
  { name: '等待事件', type: 'wait_events', color: 'rgba(64, 215, 236, 1)', backgroundColor: 'rgba(64, 215, 236, 0.1)' },
  {
    name: '循环', type: 'loop', color: 'rgba(237, 120, 71, 1)', backgroundColor: 'rgba(237, 120, 71, 0.1)', menus: [
      { name: 'for循环', action: 'for_loop' },
      { name: 'While循环', action: 'while_loop' },
    ]
  },
  { name: '断言', type: 'assert', color: 'rgba(151, 57, 57, 1)', backgroundColor: 'rgba(151, 57, 57, 0.1)' },
  { name: '关联提取', type: 'data_withdraw', color: 'rgba(57, 151, 83, 1)', backgroundColor: 'rgba(57, 151, 83, 0.1)' },
  { name: 'If判断', type: 'if_condition', color: 'rgba(198, 39, 115, 1)', backgroundColor: 'rgba(198, 39, 115, 0.1)' },
  { name: '代码操作', type: 'code_operation', color: 'rgba(192, 195, 7, 1)', backgroundColor: 'rgba(192, 195, 7, 0.1)' },
  {
    name: '更多操作(敬请期待)', type: 'more', color: 'var(--font-3)', backgroundColor: 'transparent', borderColor: 'var(--border-line)',
    menus: [
      { name: '滑动验证码', action: 'yzm' },
      { name: '上传', action: 'shangc' },
      { name: '监听元素', action: 'jiant' },
      { name: '接口操作', action: 'api' },
      { name: '数据库操作', action: 'database' },
    ]
  },
]

export const STEP_NAME = {
  open_page: '打开网页',
  close_page: '关闭网页',
  toggle_window: '切换窗口',
  mouse_clicking: '鼠标点击',
  mouse_scrolling: '鼠标滚动',
  mouse_movement: '鼠标移动',
  mouse_dragging: '鼠标拖拽',
  input_operations: '输入操作',
  wait_events: '等待事件',
  for_loop: 'for循环',
  while_loop: 'While循环',
  assert: '断言',
  if_condition: 'If判断',
  forward: '前进',
  back: '后退',
  refresh: '刷新',
  data_withdraw: '关联提取',
  code_operation: '代码操作'
}

export const HAS_CHILD_STEP = ['for_loop', 'while_loop', 'if_condition']

const SETTINGS = {
  wait_before_exec: 1,
  timeout: 15,
  error_handling: "terminate",
  screenshot_config: "exception",
  element_sync_mode: 1
}

export const Scene_Element = {
  target_type: 1,
  element_id: "",
  locators: [],
  custom_locators: [{
    id: 'custom',
    method: 'playwright_selector',
    type: undefined,
    value: '',
    key: '',
    index: -1,
    is_checked: 1
  }]
}

const action_details = {
  open_page: { url: "", is_new_page: false },
  close_page: { window_action: "first", input_content: "", custom_index: 0 },
  toggle_window: {
    type: "switch_page",
    switch_page: {
      window_action: "previous", // "first","previous","next","last","custom_index","custom_handle_id","all"
      input_content: ""
    },
    exit_frame: {},
    switch_frame_by_index: {
      frame_index: 0
    },
    switch_to_parent_frame: {},
    switch_frame_by_locator: {
      element: {
        ...Scene_Element
      }
    }
  },
  mouse_clicking: {
    type: "single_click_left", // "single_click_left", "single_click_right", "double_click","long_press"
    element: {
      ...Scene_Element
    },
    click_position: {
      x: 0,
      y: 0
    }
  },
  mouse_scrolling: {
    type: "scroll_mouse", // "scroll_mouse", "scroll_mouse_element_appears"
    scroll_distance: 0,
    direction: 'upAndDown',
    element: {
      ...Scene_Element
    },
    single_scroll_distance: 1
  },
  mouse_movement: {
    type: "move_to_target_point", // "mouse_enter_element","mouse_leave_element"
    end_point_coordinates: {
      "x": 0,
      "y": 0
    }
  },
  mouse_dragging: {
    type: "drag_element", //"drag_element" , "drag_to_target_point"
    element: {
      ...Scene_Element
    },
    target_element: {
      ...Scene_Element
    },
    end_point_coordinates: {
      "x": 0,
      "y": 0
    },
  },
  input_operations: {
    type: "input_on_element", // "input_on_element", "input_at_cursor_position"
    element: {
      ...Scene_Element
    },
    input_content: "",
    append_content: ""
  },
  wait_events: {
    type: "fixed_time", // "fixed_time","element_exist" ....
    wait_time: 1,
    element: {
      ...Scene_Element
    },
    target_texts: []
  },
  for_loop: {
    type: "for_times", // for_times  for_data
    count: 1,
    files: []
  },
  while_loop: {
    condition_relate: 'and',
    condition_operators: [],
    max_count: 1,
  },
  data_withdraw: {
    name: '',
    variable_type: "scene",  // "scene", "global"
    withdraw_type: "element_method", // "element_method","webpage_method","scroll_bar_method"
    element_method: {
      method: "text_content",// text_content,source_code,value,attribute,position,
      element: {
        ...Scene_Element
      },
      attribute_name: "",
      position_type: "screen_left" //  screen_left、browser_left
    },
    webpage_method: {
      method: "url", // url,title,source_code,text_content,handler_id
    },
    scroll_bar_method: {
      method: "direction", // direction（纵向）,transverse（横向）
      scroll_position: "current" // current(当前位置),bottom(底部位置)
    }
  },
  assert: {
    type: "element_exists",
    element: {
      ...Scene_Element
    },
    text_exists: {
      target_texts: []
    },
    text_not_exists: {
      target_texts: []
    },
    variable_assertion: {
      relation_options: "Equal", //  "Same","NotSame","Equal","NotEqual","Contains","NotContains","GreaterThan","LessThan","NotEqualTo","GreaterThanorEqualTo","LessThanorEqualTo","Regex"
      actual_value: "",
      expected_value: ""
    },
    expression_assertion: {
      expected_value: ""
    },
    element_attribute_assertion: {
      relation_options: "Equal",
      condition_type: "TagName", // CSSValue、TagName、Scope、Size、ElementCount、Text、TextColor、BackgroundColor
      expected_value: ''
    },
    page_attribute_assertion: {
      relation_options: "Equal",
      assert_attribute: 'url',
      expected_value: ''
    }
  },
  if_condition: {
    condition_relate: 'and',
    condition_operators: []
  },
  code_operation: {
    type: 'javascript',
    element: {
      ...Scene_Element
    },
    operation_type: 'element', // element | page
    code_text: ''
  },
  forward: {},
  back: {},
  refresh: {}
}
const step_common_param = {
  name: "",
  status: 1,
  settings: { ...SETTINGS },
  asserts: [],
  data_withdraws: []
}
export const STEP_DEFAULT = {
  open_page: {
    type: 'browser', action: 'open_page', action_detail: {
      open_page: {
        ...action_details.open_page
      },
    },
    ...step_common_param
  },
  close_page: {
    type: 'browser', action: 'close_page', action_detail: {
      close_page: {
        ...action_details.close_page
      },
    },
    ...step_common_param
  },
  toggle_window: {
    type: 'browser', action: 'toggle_window', action_detail: {
      toggle_window: {
        ...action_details.toggle_window
      },
    },
    ...step_common_param
  },
  mouse_clicking: {
    type: 'mouse', action: 'mouse_clicking', action_detail: {
      mouse_clicking: {
        ...action_details.mouse_clicking
      },
    },
    ...step_common_param
  },
  mouse_scrolling: {
    type: 'mouse', action: 'mouse_scrolling', action_detail: {
      mouse_scrolling: {
        ...action_details.mouse_scrolling
      },
    },
    ...step_common_param
  },
  mouse_movement: {
    type: 'mouse', action: 'mouse_movement', action_detail: {
      mouse_movement: {
        ...action_details.mouse_movement
      },
    },
    ...step_common_param
  },
  mouse_dragging: {
    type: 'mouse', action: 'mouse_dragging', action_detail: {
      mouse_dragging: {
        ...action_details.mouse_dragging
      },
    },
    ...step_common_param
  },
  input_operations: {
    type: 'input_operations', action: 'input_operations', action_detail: {
      input_operations: {
        ...action_details.input_operations
      },
    },
    ...step_common_param
  },
  wait_events: {
    type: 'wait_events', action: 'wait_events', action_detail: {
      wait_events: {
        ...action_details.wait_events
      },
    },
    ...step_common_param
  },
  for_loop: {
    type: 'loop', action: 'for_loop', action_detail: {
      for_loop: {
        ...action_details.for_loop
      },
    },
    ...step_common_param
  },
  while_loop: {
    type: 'loop', action: 'while_loop', action_detail: {
      while_loop: {
        ...action_details.while_loop
      },
    },
    ...step_common_param
  },
  data_withdraw: {
    type: 'data_withdraw', action: 'data_withdraw', action_detail: {
      data_withdraw: {
        ...action_details.data_withdraw
      },
    },
    ...step_common_param
  },
  assert: {
    type: 'assert', action: 'assert', action_detail: {
      assert: {
        ...action_details.assert
      },
    },
    ...step_common_param
  },
  if_condition: {
    type: 'if_condition', action: 'if_condition', action_detail: {
      if_condition: {
        ...action_details.if_condition
      },
    },
    ...step_common_param
  },
  forward: {
    type: 'browser', action: 'forward', action_detail: {
      forward: {
        ...action_details.forward
      },
    },
    ...step_common_param
  },
  back: {
    type: 'browser', action: 'back', action_detail: {
      back: {
        ...action_details.back
      },
    },
    ...step_common_param
  },
  refresh: {
    type: 'browser', action: 'refresh', action_detail: {
      refresh: {
        ...action_details.refresh
      },
    },
    ...step_common_param
  },
  code_operation: {
    type: 'code_operation', action: 'code_operation', action_detail: {
      code_operation: {
        ...action_details.code_operation
      }
    }
  }
}

export const DEFAULT_ASSERT = {
  type: "element_exists",
  status: 1,
  element: {
    ...Scene_Element
  },
  text_exists: {
    target_texts: []
  },
  text_not_exists: {
    target_texts: []
  },
  variable_assertion: {
    relation_options: "Equal", //  "Same","NotSame","Equal","NotEqual","Contains","NotContains","GreaterThan","LessThan","NotEqualTo","GreaterThanorEqualTo","LessThanorEqualTo","Regex"
    actual_value: "",
    expected_value: ""
  },
  expression_assertion: {
    expected_value: ""
  },
  element_attribute_assertion: {
    relation_options: "Equal",
    condition_type: "TagName",
    expected_value: ''
  },
  page_attribute_assertion: {
    relation_options: "Equal",
    assert_attribute: 'url',
    expected_value: ''
  }
}
export const DEFAULT_DATAWITHDRAW = {
  status: 1,
  name: '',
  variable_type: "scene",  // "scene", "global"
  withdraw_type: "element_method", // "element_method","webpage_method","scroll_bar_method"
  element_method: {
    method: "text_content",// text_content,source_code,value,attribute,position,
    element: {
      ...Scene_Element
    },
    attribute_name: "",
    position_type: "screen_left" //  screen_left、browser_left
  },
  webpage_method: {
    method: "url", // url,title,source_code,text_content,handler_id
  },
  scroll_bar_method: {
    method: "direction", // direction（纵向）,transverse（横向）
    scroll_position: "current" // current(当前位置),bottom(底部位置)
  }
}

export const BROWSER_TYPES = {
  "chromium": 'Chrome',
  "firefox": 'Firefox',
  "internet_explorer": 'Internet Explorer',
  "edge": 'Edge',
  "opera": 'Opera',
  "safari": 'Safari',
};

export const ASSERT_TYPES = {
  element_exists: '断言元素存在',
  element_not_exists: '断言元素不存在',
  // element_displayed: '断言元素显示',
  // element_not_displayed: '断言元素不显示',
  text_exists: '断言文本存在',
  text_not_exists: '断言文本不存在',
  // variable_assertion: '变量断言',
  // expression_assertion: '表达式断言',
  element_attribute_assertion: '断言元素属性',
  page_attribute_assertion: '断言页面属性',
}