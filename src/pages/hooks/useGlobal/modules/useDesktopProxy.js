import { useEffect } from 'react';
import { tap, filter, map, catchError } from 'rxjs/operators';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { CLOUD_PROXY_URL } from '@config/server';
import { isElectron } from '@utils';
import Bus from '@utils/eventBus';

const useDesktopProxy = () => {
    const dispatch = useDispatch();
    const { desktop_proxy } = useSelector((d) => d?.desktopProxy);

    // socket 初始化
    const desktopProxyInit = () => {
        if (isEmpty(desktop_proxy) && !desktop_proxy?.connected) {
            // dispatch({
            //     type: 'desktopProxy/updateDesktopProxy',
            //     payload: { desktop_proxy: window.io(CLOUD_PROXY_URL, { reconnectionDelayMax: 30000 }) },
            // });
        }
    };
    // 断开socket连接
    const desktopProxyClose = () => {
        if (!isEmpty(desktop_proxy)) {
            desktop_proxy.disconnect();
            desktop_proxy.disconnected = false;
        }
    };
    useEffect(() => {
        if (!isElectron()) {
            desktopProxyInit();
        }
    }, []);

    useEffect(() => {
        // 连接代理
        Bus.$on('CONNECT_PROXY', (d) => {
            const { PROXY_AUTO, PROXY_TYPE } = d;
            if (PROXY_AUTO > 0) {
                desktopProxyInit();
            } else {
                switch (PROXY_TYPE) {
                    case 'cloud':
                        desktopProxyClose();
                        break;
                    case 'desktop':
                        desktopProxyInit();
                        break;
                    case 'browser':
                        desktopProxyClose();
                        break;
                    case 'chrome proxy':
                        // window.addEventListener
                        // TODO: 浏览器插件链接
                        // TODO: 用户关闭之后需要取消发送，并且给出相应的错误信息
                        // setInterval(() => {
                        //   window.postMessage({
                        //     type: 'APIPOST:GETCHROMESTATUS',
                        //   });
                        // }, 5000);
                        // window.addEventListener('message', getProxyStatus);
                        desktopProxyClose();
                        break;
                    default:
                        desktopProxyClose();
                        break;
                }
            }
        });

        return () => {
            Bus.$off('CONNECT_PROXY');
        };
    }, [desktop_proxy]);
};

export default useDesktopProxy;
