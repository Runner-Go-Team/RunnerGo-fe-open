
// 当前运行环境fe主域，主要用于cookie 与 fe-open-admin 工程中domain 配置一致
const FE_Host = {
    development: '',
    test: '测试环境主域',
    production: '线上环境主域',
};


export const FE_HOST = FE_Host[NODE_ENV];

export default {
    FE_HOST,
};
