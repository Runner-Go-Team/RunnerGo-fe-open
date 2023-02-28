import { isNumber } from 'lodash';

export const proxyText = (PROXY_AUTO, PROXY_TYPE) => {
    if (isNumber(PROXY_AUTO) && PROXY_AUTO > 0) {
        return '自动选择代理';
    }
    const proxyType = {
        cloud: '云端代理',
        desktop: '桌面代理',
        'chrome proxy': '浏览器插件代理',
        browser: '浏览器代理',
    };
    return proxyType[PROXY_TYPE];
};
