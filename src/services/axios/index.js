import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ContentType } from './constant';
import { RD_BASE_URL, APP_VERSION, REQUEST_TIMEOUT } from '@config/index';
import { getCookie } from '@utiils/cookie';

const path = 'api';

const instance = axios.create({
    baseURL: `${RD_BASE_URL}${path}`,
    timeout: REQUEST_TIMEOUT,
});

// 添加拦截
instance.interceptors.request.use(
    async (config) => {
        const storage = window.localStorage;
        const session = window.sessionStorage;
        let machineid = storage.getItem('machineid');
        if (!machineid) {
            machineid = uuidv4();
            storage.setItem('machineid', machineid);
        }
        config.headers = {
            // token: getCookie('token', 'NOLOGIN')
            // clientId: session.clientId ? session.clientId : 'NOLOGIN',
            // is_silent: -1,
            // machineid,
            // appversion:
            // ...config.headers
        };
        return config;
    },
    (err) => {
    }
);

instance.interceptors.response.use(
    (res) => {
        if (res.status === 200) {
            return res.data;
        }
    },
    (err) => {
    }
);

const request = (method, url, contentType = null, loading, params, headers) => {
    return instance({
        method,
        url,
        headers: {
            ...headers,
        },
        contentType: ContentType[contentType], 
        data: params,
    });
};

export default request;