
// 当前运行环境fe主域，主要用于cookie
const FE_Host = {
    development: '',
    test: 'runnergo.cn',
    production: 'runnergo.cn',
};


export const FE_HOST = FE_Host[NODE_ENV];

export default {
    FE_HOST,
};
