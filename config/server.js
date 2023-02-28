// 后端接口地址
export const RD_BaseURL = {
    development: 'https://manager.runnergo.cc',
    test: 'https://manager.runnergo.cc',
    production: 'https://manager.runnergo.cc',
};

// 后端文件存储地址
export const RD_FileURL = 'http://localhost:20004';



export const RD_BASE_URL = RD_BaseURL[NODE_ENV];


export default {
    RD_BASE_URL,
};
