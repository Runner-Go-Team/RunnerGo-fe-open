// 前端-H5页面地址 管理中心地址，主要用于跳转
const FE_BaseUrl = {
    development: 'https://dev_tools_env_dev_fe.apipost.cn',
    test: 'https://dev_tools_env_dev_fe.apipost.cn',
    production: 'https://console.apipost.cn',
};

// 当前运行环境fe主域，主要用于cookie
const FE_Host = {
    development: '',
    test: 'apipost.cn',
    production: 'apipost.cn',
};

export const FE_BASEURL = FE_BaseUrl[NODE_ENV];

export const FE_HOST = FE_Host[NODE_ENV];

// 客户端分享端口号
export const CLIENT_SHARE_ADDRESS = 'http://{CLIENT_IP_ADDRESS}:19373/share?issue=';

// 客户端mock端口号
export const CLIENT_MOCK_ADDRESS = 'http://{CLIENT_IP_ADDRESS}:19374/mock';

export default {
    FE_BASEURL,
    FE_HOST,
    CLIENT_SHARE_ADDRESS,
    CLIENT_MOCK_ADDRESS,
};
