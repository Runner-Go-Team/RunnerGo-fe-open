
// 当前运行环境fe主域，主要用于cookie
const FE_Host = {
    development: '',
    test: 'runnergo.com',
    production: 'runnergo.com',
};


export const FE_HOST = FE_Host[NODE_ENV];

export default {
    FE_HOST,
};
