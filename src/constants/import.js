export const IMPORT_TYPE_LIST = {
    postman: {
      name: 'postman',
      id: 1,
      tips: '支持postmanV2.0导出的Collections JSON。建议使用postman最新版后导出',
    },
    swagger: {
      name: 'swagger',
      id: 2,
      tips: '支持swaggerv2和v3,如选择导出的是其他类型，请按导出类型导入',
    },
    swaggerUrl: {
      name: 'swaggerUrl',
      id: 3,
      tips: '支持swaggerv2和v3,如选择导出的是其他类型，请按导出类型导入',
    },
    apifox: {
      name: 'apifox',
      id: 4,
      tips: '支持apifox,如选择导出的是其他类型，请按导出类型导入',
    },
    apizza: {
      name: 'apizza',
      id: 5,
      tips: '支持apizza,如选择导出的是其他类型，请按导出类型导入',
    },
    eolink: {
      name: 'eolink',
      id: 6,
      tips: '支持eolink,如选择导出的是其他类型，请按导出类型导入',
    },
    yapi: {
      name: 'yapi',
      id: 7,
      tips: '支持yapi,如选择导出的是其他类型，请按导出类型导入',
    },
    apipost: {
      name: 'apipost',
      id: 8,
      tips: '支持apipost,如选择导出的是其他类型，请按导出类型导入',
    },
  };
  
  export const MODAL_TYPE = [
    {
      name: '同URL 覆盖',
      id: 'url',
    },
    {
      name: '同URL 且同目录覆盖',
      id: 'urlAndFolder',
    },
    {
      name: '同URL 不导入',
      id: 'uniqueUrl',
    },
    {
      name: '同URL 时保留两者',
      id: 'bothUrl',
    },
  ];
  
  export const IMPORT_INTERVAL = [
    { name: '手动触发', id: 0 },
    { name: '每隔3小时', id: 3 },
    { name: '每隔12小时', id: 12 },
    { name: '每隔24小时', id: 24 },
  ];
  
  export const DATA_SOURCES = [
    { name: 'OpenAPI（Swagger）', id: 'openApi' },
    // { name: 'apiDoc', id: 'api' },
    // { name: 'Apifox', id: 'apifox' },
  ];
  