// 期望响应状态码
export const EXPECT_HTTP_CODE = [200, 201, 202, 301, 302, 304, 400, 401, 403, 404, 500, 503];

// 期望比较位置
export const COMPARE_LOCATION = ['query', 'header', 'body'];

// 期望比较位置
export const COMPARE_TYPE = [
  { type: 'eq', title: '等于' },
  { type: 'uneq', title: '不等于' },
  { type: 'gt', title: '大于' },
  { type: 'gte', title: '大于或等于' },
  { type: 'lt', title: '小于' },
  { type: 'lte', title: '小于或等于' },
  { type: 'includes', title: '包含' },
  { type: 'unincludes', title: '不包含' },
  { type: 'null', title: '等于空' },
  { type: 'notnull', title: '不等于空' },
];

// 响应类型
export const EXPECT_CONTENT_TYPE = ['json', 'text', 'html'];

// 期望条件默认
export const EXPECT_CONDITION_DEFAULT = {
  "path": "header",
  "parameter_name": "",
  "compare": "=",
  "parameter_value": ""
};
// 条件参数位置集合
export const EXPECT_CONDITION_PATH_LIST = ["cookie", "header", "query", "body-json", "body-form", "body-text"];
// 条件比较集合
export const EXPECT_CONDITION_COMPARE_LIST = {
  "=": "等于",
  ">": "大于",
  ">=": "大于等于",
  "<": "小于",
  "<=": "小于等于",
  "regex": "正则",
  "contain": "包含",
  "no_contain": "不包含"
};
