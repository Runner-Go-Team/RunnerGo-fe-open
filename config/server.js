// 后端http接口地址
export const RD_BaseURL = {
    development: '开发环境地址',
    test: '测试环境地址',
    production: '线上环境地址',
};


// 后端websocke地址
export const RD_websocketUrl = {
    development: '开发环境地址',
    test: '测试环境地址',
    production: '线上环境地址'
};

// 后台权限系统地址
export const RD_AdminURL = {
    development: '后台开发环境地址',
    test: '后台测试环境地址',
    production: '后台线上环境地址',
}


// 后端文件存储地址
export const RD_FileURL = 'http://(file-server服务的ip):(file-server服务的端口)';


export const RD_BASE_URL = RD_BaseURL[NODE_ENV];
export const RD_WEBSOCKET_URL = RD_websocketUrl[NODE_ENV];
export const RD_ADMIN_URL = RD_AdminURL[NODE_ENV];

export default {
    RD_BASE_URL,
    RD_WEBSOCKET_URL,
    RD_ADMIN_URL
};
