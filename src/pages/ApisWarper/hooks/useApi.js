/* eslint-disable react-hooks/rules-of-hooks */
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { get, isArray, isObject, isPlainObject, isString, isUndefined, trim, values } from 'lodash';
import { useRef } from 'react';
import dayjs from 'dayjs';
import { Message } from 'adesign-react';
// import { Collection, Historys, UserProjects, Envs, Cookie } from '@indexedDB/project';
import Atools from 'apipost-tools';
// import { User } from '@indexedDB/user';
import Bus from '@utils/eventBus';
import cloneDeep from 'lodash/cloneDeep';
import { setHistorySendRequest } from '@services/apis';
import {
    isElectron,
    completionHttpProtocol,
    download,
    completionWSProtocol,
    findParent,
    NewURL,
    EditFormat,
    pathArr,
    isJSON,
} from '@utils';
import { pushTask } from '@asyncTasks/index';
import { getPathExpressionObj } from '@constants/pathExpression';
import { DOMAIN_ONELEVEL, DOMAIN_TWOLEVEL } from '@constants/api';

// 用于接口
const useApi = () => {
    const dispatch = useDispatch();
    const opens = useSelector((store) => store?.opens);
    const workspace = useSelector((store) => store?.workspace);
    const { desktop_proxy } = useSelector((store) => store?.desktopProxy);
    const { CURRENT_PROJECT_ID, CURRENT_ENV_ID } = workspace;
    const { temp_apis, apipostHeaders, open_apis } = opens;

    const downLoadRef = useRef(null);

    const saveResponseToConsole = (request, response) => {
        const { method, url, request_headers, request_bodys } = request;
        const { responseTime, resposneAt, code, resMime, headers, stream, fitForShow, netWork } =
            response;
        const { raw: rawBody } = Atools.bufferToRaw(stream.data, resMime);
        const consoleObj = {
            data: {},
        };
        consoleObj.data.Network = netWork || {};
        consoleObj.data.General = {
            'Request Method': method || 'GET',
            'Request URL': url || '',
            'Status Code': code,
            'Request Time': resposneAt,
        };
        consoleObj.data['Request Headers'] = request_headers || {};
        consoleObj.data['Request Body'] = isJSON(request_bodys)
            ? JSON.parse(request_bodys)
            : request_bodys || {};

        consoleObj.data['Response Headers'] = headers || {};
        consoleObj.type = 'network';
        consoleObj.result = 'log';
        consoleObj.time = responseTime;
        switch (fitForShow) {
            case 'Image':
                consoleObj.data['Response Body'] = '控制台不支持查看带有媒体文件的实体';
                break;
            case 'Monaco':
                consoleObj.data['Response Body'] = rawBody || {};
                break;
            default:
                consoleObj.data['Response Body'] = '控制台不支持查看当前格式文件的实体';
                break;
        }
        consoleObj.date_time = new Date().getTime();
        // 控制台打印
        dispatch({
            type: 'console/addConsoleList',
            payload: consoleObj,
        });
        return consoleObj;
    };

    const consoleFailPrinting = (request, message) => {
        const { method, url, request_headers, request_bodys } = request;
        const consoleObj = {};
        consoleObj.data = {};
        consoleObj.data.Error = message;
        consoleObj.data.General = {
            'Request Method': method || 'POST',
            'Request URL': url || '',
            'Status Code': '500',
            'Request Time': dayjs().format('HH:mm:ss'),
        };
        consoleObj.data['Request Headers'] = request_headers || {};

        consoleObj.data['Request Body'] = isJSON(request_bodys)
            ? JSON.parse(request_bodys)
            : request_bodys;

        consoleObj.type = 'network';
        consoleObj.result = 'error';
        // consoleObj.time = responseTime;
        consoleObj.date_time = new Date().getTime();
        // 控制台打印
        dispatch({
            type: 'console/addConsoleList',
            payload: consoleObj,
        });
        return consoleObj;
        // apApi.consolePrinting(consoleObj);
    };

    const handleProto = (data, proto) => {
        const { target_id, response } = data;
        const { text, name, path } = proto;
        const protoObj = {
            protoPath: path,
            protoContent: text,
            services: {},
        };
        if (!open_apis.hasOwnProperty(target_id)) {
            return;
        }
        const temp_open_apis = cloneDeep(open_apis);
        const target = temp_open_apis[target_id];
        if (isPlainObject(response)) {
            for (const serviceName in response) {
                const service = response[serviceName];
                const serviceObj = {};
                if (service.hasOwnProperty('method') && isArray(service.method)) {
                    service.method.forEach((item) => {
                        const loaclTarget = get(
                            target,
                            `protos.['${name}'].services.['${serviceName}'].['${item.name}']`
                        );
                        serviceObj[item.name] = {
                            proto: name,
                            service: serviceName,
                            url: '',
                            method: item.name,
                            request: {
                                header: [],
                                body: {
                                    raw: JSON.stringify(item.requestBody),
                                    parameter: [],
                                },
                            },
                            response: {
                                success: {
                                    raw: '',
                                    parameter: [],
                                },
                                error: {
                                    raw: '',
                                    parameter: [],
                                },
                            },
                        };
                        // 本地存在，需要保留一些数据
                        if (isPlainObject(loaclTarget)) {
                            if (isPlainObject(loaclTarget?.response)) {
                                serviceObj[item.name].response = loaclTarget.response;
                            }
                            if (isPlainObject(loaclTarget?.request)) {
                                serviceObj[item.name].request.header = loaclTarget?.request?.header || [];
                                serviceObj[item.name].request.body.parameter =
                                    loaclTarget?.request?.body?.parameter || [];
                            }
                            if (isString(loaclTarget?.url)) {
                                serviceObj[item.name].url = loaclTarget.url;
                            }
                        }
                    });
                }
                protoObj.services[serviceName] = serviceObj;
            }
            if (!target.hasOwnProperty('protos')) {
                target.protos = {};
            }
            target.protos[name] = protoObj;
            Bus.$emit('updateTarget', {
                target_id,
                pathExpression: 'protos',
                value: target.protos,
            });
        }
    };
    // 变量替换
    const varReplace = () => { };

    const handleRequest = async (tempApi) => {
        const { request } = tempApi;

        // 补全http协议开头
        completionHttpProtocol(tempApi);
        // 处理请求头数据
        if (isArray(request?.header?.parameter)) {
            request.header.parameter = apipostHeaders.concat(request.header.parameter);
        }
    };
    const getOPtions = async (tempApi, config) => {
        const options = {};
        const { project_id, parent_id } = tempApi;
        const uuid = localStorage.getItem('uuid');
        const project = await UserProjects.get(`${project_id}/${uuid}`);
        if (isUndefined(project) || !isObject(project)) {
            throw new Error('获取项目信息异常');
        }
        options.project = {
            request: project?.details?.request || {},
            script: project?.details?.script || {},
        };

        // cookie
        const cookies = await Cookie.where('project_id').anyOf(CURRENT_PROJECT_ID).toArray();
        options.cookies = {
            switch: config?.GLOBAL_COOKIE_OPEN,
            data: cookies || [],
        };

        const collectons = await Collection.where('project_id').anyOf(project_id).toArray();
        const collectionArr = [];
        if (isArray(collectons)) {
            findParent(collectionArr, collectons, parent_id);
        }
        // 把自己添加进数组
        collectionArr.push(tempApi);
        options.collection = collectionArr;
        const env = await Envs.get(`${project_id}/${CURRENT_ENV_ID}`);
        if (isUndefined(env) || !isObject(env)) {
            throw new Error('获取环境信息异常');
        }

        options.env_name = env?.name || '';
        options.env_pre_url = env?.pre_url || '';
        options.environment = {};
        if (isPlainObject(env?.list)) {
            Object.keys(env.list).forEach((key) => {
                const item = env.list[key];
                options.environment[key] = item?.current_value || item?.value || '';
            });
        }
        // 场景
        options.scene = 'http_request';
        // toDo 全局变量
        options.globals = {};
        // 发送配置信息
        options.requester = {
            timeout: config?.AJAX_USER_TIMEOUT || 0, // 超时时间
            followRedirect: config?.FOLLOW_REDIRECT || 1, // 请求自动重定向
            maxrequstloop: config?.MAX_REDIRECT_TIME || 5, // 最大重定向次数
            AUTO_CONVERT_FIELD_2_MOCK: config?.AUTO_CONVERT_FIELD_2_MOCK || 1, // 是否自动识别mock
            REQUEST_PARAM_AUTO_JSON: config?.REQUEST_PARAM_AUTO_JSON || -1, // 是否JSON化
        };
        // 代理相关
        if (config?.REQUEST_PROXY_OPEN > 0) {
            let proxyUrl = trim(config?.REQUEST_PROXY_URL);
            proxyUrl = completionHttpProtocol(proxyUrl);
            options.requester.proxy = proxyUrl;
            // 代理认证
            if (config?.REQUEST_PROXY_AUTH_OPEN && parseInt(config?.REQUEST_PROXY_AUTH_OPEN, 10) === 1) {
                const proxyAuth = `Basic ${btoa(
                    `${config?.REQUEST_PROXY_AUTH_USERNAME.trim()}:${config?.REQUEST_PROXY_AUTH_PASSWORD.trim()}`
                )}`;
                options.requester.proxyAuth = proxyAuth;
            }
        }
        // ca证书
        if (config?.CA_CERTIFICATES?.OPEN > 0 && config?.CA_CERTIFICATES?.FILE_URL != '') {
            options.requester.https = {
                rejectUnauthorized: -1, // 忽略错误证书 1 -1
                certificateAuthority: config.CA_CERTIFICATES.FILE_URL || '', // ca证书地址
                certificate: '', // 客户端证书地址
                key: '', // 客户端证书私钥文件地址
                pfx: '', // pfx 证书地址
                passphrase: '', // 私钥密码
            };
        }
        const URLObj = NewURL(tempApi.url);
        // 客户端证书
        if (config?.CLIENT_CERTIFICATES && config?.CLIENT_CERTIFICATES[URLObj.host]) {
            let crt_pem = '';
            let key_pem = '';
            let passphrase = '';
            let pfx_pem = '';
            if (
                config?.CLIENT_CERTIFICATES[URLObj.host]?.CRT &&
                config?.CLIENT_CERTIFICATES[URLObj.host]?.CRT?.FILE_URL != ''
            ) {
                crt_pem = config?.CLIENT_CERTIFICATES[URLObj.host]?.CRT?.FILE_URL || '';
                passphrase = config?.CLIENT_CERTIFICATES[URLObj.host].PASSWORD || '';
                if (config?.CLIENT_CERTIFICATES[URLObj.host]?.KEY?.FILE_URL != '') {
                    key_pem = config?.CLIENT_CERTIFICATES[URLObj.host]?.KEY?.FILE_URL || '';
                }
            } else if (
                config?.CLIENT_CERTIFICATES[URLObj.host]?.PFX &&
                config?.CLIENT_CERTIFICATES[URLObj.host]?.PFX?.FILE_URL != ''
            ) {
                pfx_pem = config?.CLIENT_CERTIFICATES[URLObj.host]?.PFX?.FILE_URL || '';
                if (config?.CLIENT_CERTIFICATES[URLObj.host]?.KEY?.FILE_URL != '') {
                    key_pem = config?.CLIENT_CERTIFICATES[URLObj.host]?.KEY?.FILE_URL || '';
                }
                passphrase = config?.CLIENT_CERTIFICATES[URLObj.host].PASSWORD || '';
            }
            if (isPlainObject(options.requester.https)) {
                options.requester.https = {
                    ...options.requester.https,
                    ...{
                        certificate: crt_pem || '', // 客户端证书地址
                        key: key_pem || '', // 客户端证书私钥文件地址
                        pfx: pfx_pem || '', // pfx 证书地址
                        passphrase: passphrase || '', // 私钥密码
                    },
                };
            } else {
                options.requester.https = {
                    rejectUnauthorized: -1, // 忽略错误证书 1 -1
                    certificateAuthority: '', // ca证书地址
                    certificate: crt_pem || '', // 客户端证书地址
                    key: key_pem || '', // 客户端证书私钥文件地址
                    pfx: pfx_pem || '', // pfx 证书地址
                    passphrase: passphrase || '', // 私钥密码
                };
            }
        }
        // 是否自动保存响应示例
        options.SEND_AFTER_SAVE_EXAMPLE = config?.SEND_AFTER_SAVE_EXAMPLE || 1;
        return options;
    };
    const handleResCookie = async (cookies) => {
        // #region 处理cookie信息
        if (isArray(cookies) && cookies.length > 0) {
            const cookieObj = {};
            const list = await Cookie.where('project_id').anyOf(CURRENT_PROJECT_ID).toArray();
            for (let index = 0; index < cookies.length; index++) {
                const item = cookies[index];
                if ((!item.key && !item.value) || (!item.name && !item.value)) {
                    continue;
                }
                if (item.domain === undefined) {
                    continue;
                } else {
                    const tempArr = [];
                    list.filter((i) => {
                        // {}
                        // eslint-disable-next-line no-nested-ternary
                        let localDomain = i.domain;
                        let remoteDomain = item.domain;
                        if (localDomain.charAt(0) === '.')
                            localDomain = localDomain.substr(1, localDomain.length);
                        if (remoteDomain.charAt(0) === '.')
                            remoteDomain = remoteDomain.substr(1, remoteDomain.length);

                        if (
                            localDomain === remoteDomain &&
                            i.key === item.name &&
                            i.path === item.path &&
                            tempArr.length <= 0
                        ) {
                            item.cookie_id = i.cookie_id;
                            tempArr.push(item);
                        }
                    });
                    if (item.name) {
                        item.key = item.name;
                    }
                    if (item.expires) {
                        const expires = new Date(item.expires);
                        item.expires = expires;
                    }
                    for (const property in item) {
                        if (property === 'maxAge' || property === 'expirationDate') {
                            let nowData = new Date().getTime();
                            nowData += item[property] * 1000;
                            item.expires = new Date(nowData);
                        }
                    }
                    // 设置cookie 所属项目
                    item.project_id = CURRENT_PROJECT_ID;

                    if (tempArr.length <= 0) {
                        const uuid = uuidv4();
                        item.cookie_id = uuid;
                        cookieObj[item.cookie_id] = item;
                    } else {
                        tempArr.forEach((i) => {
                            cookieObj[i.cookie_id] = i;
                        });
                    }
                }
            }
            const cookieArr = Object.values(cookieObj);
            if (cookieArr.length > 0) {
                for (let index = 0; index < cookieArr.length; index++) {
                    const i = cookieArr[index];
                    Cookie.put(i, i.cookie_id);
                }
            }
        }
    };
    const handleResponse = async (convertResult, options) => {
        if (convertResult?.status === 'success') {
            const { request, response } = convertResult?.data || {};
            const { target_id, resMime, fitForShow, stream, filename, code, resCookies } = response || {};
            const { raw: rawBody, buffer, base64 } = Atools.bufferToRaw(stream.data, resMime);

            response.rawBody = rawBody;
            response.stream.data = Array.from(buffer);
            response.base64Body = base64;
            // 接口发送结束  状态恢复
            dispatch({
                type: 'opens/updateTempApisById',
                id: target_id,
                payload: { sendStatus: 'initial' },
            });

            // 拼接response 给VM使用
            // const res = await getVmResponse(data);
            // window.VM_RESPONSE[id] = res;

            // 处理响应cookie
            handleResCookie(resCookies);

            // 发送并下载响应结果
            if (downLoadRef?.current) {
                const name = `接口响应数据.${resMime.ext}`;
                download(
                    isString(fitForShow) && fitForShow === 'Monaco' ? rawBody : response.stream,
                    filename || name,
                    resMime?.mime
                );
            }

            // 重置断言
            // window.assert = [];

            // 执行后执行脚本 可能直接修改响应结果

            // 把响应结果放到redux 渲染展示
            dispatch({
                type: 'opens/updateTempApisById',
                id: target_id,
                payload: { request, response },
            });

            // 发送后自动导入响应示例
            if (options?.SEND_AFTER_SAVE_EXAMPLE > 1 && fitForShow === 'Monaco') {
                const extension = options?.SEND_AFTER_SAVE_EXAMPLE == 2 ? 'success' : 'error';
                Bus.$emit('updateTarget', {
                    target_id,
                    pathExpression: getPathExpressionObj('exampleRaw', extension),
                    value: EditFormat(rawBody).value,
                });
            }
        } else if (convertResult?.status === 'error') {
            throw new Error(convertResult?.message || '请求失败。');
        }
    };

    const handleConsole = (dataLog) => {
        const { action, message, method } = dataLog;
        const { type, data } = message || {};

        if (isString(method) && method == 'log') {
            if (isArray(data) && data.length > 0) {
                data.forEach((item) => {
                    dispatch({
                        type: 'console/addConsoleList',
                        payload: {
                            type: action || 'console',
                            result: type || 'log',
                            time: dayjs().format('HH:mm:ss'),
                            data: item || '',
                            date_time: dayjs().valueOf(),
                        },
                    });
                });
            }
        } else if (isString(method) && method == 'request') {
            const { status, response, request, message: NewMessage } = data || {};

            // 控制台打印接口发送信息
            if (status === 'error') {
                consoleFailPrinting(request, NewMessage);
            } else {
                saveResponseToConsole(request, response);
            }
        }
    };

    const handleIoRes = async (data, options) => {
        const { action, envs } = data;
        // 接收到控制台消息
        if (action === 'console') {
            handleConsole(data);
        } else if (action === 'http_complate') {
            if (isPlainObject(data.data)) {
                const { assert, response, target_id, visualizer_html } = data.data;
                if (isArray(assert) && assert.length > 0) {
                    // 接收断言
                    dispatch({
                        type: 'opens/updateTempApisById',
                        payload: { assert },
                        id: target_id,
                    });
                } else {
                    // 重置断言
                    dispatch({
                        type: 'opens/updateTempApisById',
                        payload: { assert: [] },
                        id: target_id,
                    });
                }
                if (isPlainObject(visualizer_html) && isString(visualizer_html?.html)) {
                    // 可视化
                    dispatch({
                        type: 'opens/updateTempApisById',
                        payload: { html: visualizer_html.html },
                        id: target_id,
                    });
                }
                if (isPlainObject(envs)) {
                    // 接收环境变量和全局变量
                    if (isPlainObject(envs?.environment)) {
                        // 环境变量
                        const newList = {};
                        Object.keys(envs.environment).forEach((key) => {
                            newList[key] = {
                                current_value: envs.environment[key],
                                type: '1',
                                value: envs.environment[key],
                            };
                        });
                        Envs.update(`${CURRENT_PROJECT_ID}/${CURRENT_ENV_ID}`, { list: newList });
                    }
                    if (isPlainObject(envs?.globals)) {
                        // 全局变量
                        dispatch({
                            type: 'projects/setGlobalVars',
                            payload: envs.globals,
                        });
                    }
                }
                if (isPlainObject(response)) {
                    if (response?.status === 'success') {
                        await handleResponse(response, options);
                    } else {
                        throw new Error(response?.message || '请求失败');
                    }
                }
            }
        }
    };

    const electronSend = async (tempApi) => { };

    const desktopSend = (tempApi, options) => {
        return new Promise((resolve, reject) => {
            desktop_proxy.off('runtime_response');
            // http 请求返回
            desktop_proxy.on('runtime_response', (data) => {
                const { action } = data.data;
                // todo 支持并发请求接口
                if (data?.status === 'success') {
                    // 处理结果
                    handleIoRes(data.data, options)
                        .then(() => {
                            if (action === 'http_complate') {
                                resolve(true);
                            }
                        })
                        .catch((error) => {
                            if (action === 'http_complate') {
                                reject(error);
                            }
                        });
                } else if (action === 'http_complate') {
                    reject(data?.message || '请求失败');
                }
            });
            desktop_proxy.emit('runner', {
                option: options,
                test_events: [
                    {
                        type: 'api',
                        data: tempApi,
                    },
                ],
            });

            desktop_proxy.onclose = (reason) => {
                desktop_proxy.removeAllListeners('http_response');
                // called when the underlying connection is closed
                resolve(true);
            };
        });
    };
    const cloudSend = async (tempApi) => { };
    const chromeProxySend = async (tempApi) => { };
    const browserSend = async (tempApi) => { };

    // 发送方法
    const apiSend = async (api, ifDownLoad = false) => {
        // 是否下载响应
        downLoadRef.current = ifDownLoad;

        const tempApi = cloneDeep(api);
        // 修改接口发送状态
        dispatch({
            type: 'opens/updateTempApisById',
            id: tempApi?.target_id,
            payload: { sendStatus: 'sending' },
        });
        // 添加发送历史记录 先调用接口 失败走异步任务
        const historyData = cloneDeep(tempApi);
        const history_id = uuidv4();
        historyData.update_day = new Date(new Date().toLocaleDateString()).getTime();
        historyData.update_dtime = Math.floor(new Date().getTime() / 1000);
        historyData.target_id = history_id;
        Historys.put(historyData);
        setHistorySendRequest({
            project_id: historyData.project_id,
            target_info: historyData,
        }).subscribe({
            next(resp) {
                if (resp?.code === 10000) {
                } else {
                    pushTask(
                        {
                            task_id: historyData.target_id,
                            action: 'SAVE',
                            model: 'HISTORY_SEND',
                            payload: historyData.target_id,
                            project_id: historyData.project_id,
                        },
                        -1
                    );
                }
            },
            error() {
                pushTask(
                    {
                        task_id: historyData.target_id,
                        action: 'SAVE',
                        model: 'HISTORY_SEND',
                        payload: historyData.target_id,
                        project_id: historyData.project_id,
                    },
                    -1
                );
            },
        });
        // 执行预执行脚本
        const user = await User.get(localStorage.getItem('uuid'));
        const { config } = user || {};
        const PROXY_AUTO = config?.PROXY_AUTO || 1;
        const PROXY_TYPE = config?.PROXY_TYPE || 'cloud';
        // 处理请求数据
        await handleRequest(tempApi, config);

        try {
            const options = await getOPtions(tempApi, config);

            if (isElectron()) {
                await electronSend(tempApi);
                return;
            }
            // 自动选择代理
            if (PROXY_AUTO > 0) {
                if (desktop_proxy && desktop_proxy?.connected) {
                    await desktopSend(tempApi, options);
                } else {
                    await cloudSend(tempApi);
                }
                return;
            }
            switch (PROXY_TYPE) {
                case 'desktop':
                    await desktopSend(tempApi, options);
                    break;
                case 'cloud':
                    await cloudSend(tempApi);
                    break;
                case 'chrome proxy':
                    await chromeProxySend(tempApi);
                    break;
                case 'browser':
                    await browserSend(tempApi);
                    break;
                default:
                    break;
            }
        } catch (error) {

            // 接口发送状态改为异常
            dispatch({
                type: 'opens/updateTempApisById',
                id: tempApi?.target_id,
                payload: { sendStatus: 'sendError', message: error?.message || String(error) },
            });
        }
    };

    const getProtoAllMethodList = async (proto, grpc_id, callback) => {
        const { text } = proto;
        if (desktop_proxy && desktop_proxy?.connected) {
            // if (!desktop_proxy?._callbacks?.$grpc_allMethodList_response) {
            desktop_proxy.on('grpc_allMethodList_response', function (res) {
                desktop_proxy.removeAllListeners('grpc_allMethodList_response');

                if (res?.status === 'success') {
                    // 处理结果 存到本地
                    if (isPlainObject(res?.data)) {
                        handleProto(res.data, proto);
                    }
                    callback && callback();
                } else {
                    Message('error', res?.message);
                }
            });
            // }
            desktop_proxy.emit('grpc', {
                target_id: grpc_id || '',
                option: {
                    proto: text,
                },
                data: {
                    func: 'allMethodList',
                },
            });
        } else {
            Message('error', '请下载桌面代理或使用客户端');
        }
    };

    const grpcSend = async (methodBody, grpc_id, methodPath) => {
        // 修改接口发送状态
        dispatch({
            type: 'opens/updateTempGrpcsById',
            id: grpc_id,
            methodPath,
            payload: { sendStatus: 'sending' },
        });

        if (desktop_proxy && desktop_proxy?.connected) {
            // if (!desktop_proxy?._callbacks?.$grpc_request_response) {
            desktop_proxy.on('grpc_request_response', function (res) {
                desktop_proxy.removeAllListeners('grpc_request_response');
                if (res?.status === 'success') {
                    // 处理结果 存到本地
                    if (isPlainObject(res?.data?.response)) {
                        // 把响应结果放到redux 渲染展示
                        dispatch({
                            type: 'opens/updateTempGrpcsById',
                            id: res.data.target_id,
                            methodPath,
                            payload: { response: res.data.response },
                        });
                    }
                } else {
                    // 接口发送状态改为异常
                    dispatch({
                        type: 'opens/updateTempGrpcsById',
                        id: res.data.target_id,
                        methodPath,
                        payload: { sendStatus: 'sendError', message: res?.message || '调用失败' },
                    });
                }
            });
            // }
            const targetGrpc = open_apis[grpc_id];
            let path = '';
            let content = '';
            if (isPlainObject(targetGrpc?.protos[methodBody?.proto])) {
                path = targetGrpc.protos[methodBody.proto]?.path || '';
                content = targetGrpc.protos[methodBody.proto]?.protoContent || '';
            }
            desktop_proxy.emit('grpc', {
                target_id: grpc_id || '',
                option: {
                    proto: path || content,
                },
                data: {
                    func: 'request',
                    target: methodBody,
                },
            });
        } else {
            Message('error', '请下载桌面代理或使用客户端');
        }
    };

    const getMockMethodRequest = (methodBody, grpc_id, methodPath) => {
        if (desktop_proxy && desktop_proxy?.connected) {
            // if (!desktop_proxy?._callbacks?.$grpc_request_response) {
            desktop_proxy.on('grpc_mockMethodRequest_response', function (res) {
                desktop_proxy.removeAllListeners('grpc_mockMethodRequest_response');
                if (res?.status === 'success') {
                    // 处理结果 存到本地
                    if (isPlainObject(res?.data) && res.data.hasOwnProperty('response')) {
                        // 统一修改
                        Bus.$emit('updateTarget', {
                            target_id: res.data?.target_id || grpc_id,
                            pathExpression: getPathExpressionObj(`${methodPath}.request.body.raw`),
                            value: isPlainObject(res.data.response)
                                ? JSON.stringify(res.data.response, null, '\t')
                                : String(res.data.response),
                        });
                    }
                } else {
                    Message('error', res?.Message);
                }
            });
            // }
            const targetGrpc = open_apis[grpc_id];
            let path = '';
            let content = '';
            if (isPlainObject(targetGrpc?.protos[methodBody?.proto])) {
                path = targetGrpc.protos[methodBody.proto]?.path || '';
                content = targetGrpc.protos[methodBody.proto]?.protoContent || '';
            }
            desktop_proxy.emit('grpc', {
                target_id: grpc_id || '',
                option: {
                    proto: path || content,
                },
                data: {
                    func: 'mockMethodRequest',
                    target: methodBody,
                },
            });
        } else {
            Message('error', '请下载桌面代理或使用客户端');
        }
    };

    const connectWebSocket = (target) => {
        if (!isString(target?.request?.url) || trim(target.request.url).length <= 0) {
            Message('error', '请先填写socket地址。');
            return;
        }
        if (desktop_proxy && desktop_proxy?.connected) {
            if (!desktop_proxy?._callbacks?.$websocket_res) {
                desktop_proxy.on('websocket_res', (res) => {
                    const { id, action, data, time } = res;
                    switch (action) {
                        case 'connect': // 连接成功
                            dispatch({
                                type: 'opens/setSocketResById',
                                payload: { status: 'connect', res: { action, time } },
                                id,
                            });
                            break;
                        case 'disconnect': // 断开连接
                            dispatch({
                                type: 'opens/setSocketResById',
                                payload: { status: 'disconnect', res: { action, time } },
                                id,
                            });
                            break;
                        case 'message': // 接收消息
                            dispatch({
                                type: 'opens/setSocketResById',
                                payload: { status: 'connect', res: { message: data, action, time } },
                                id,
                            });
                            break;
                        case 'error': // 异常消息
                            dispatch({
                                type: 'opens/setSocketResById',
                                payload: { status: 'error', res: { message: data, action, time } },
                                id,
                            });
                            break;
                        default:
                            break;
                    }
                });
            }
            if (target?.method === 'Raw') {
                completionWSProtocol(target);
            } else if (target?.method === 'SockJs') {
                completionHttpProtocol(target);
            }
            dispatch({
                type: 'opens/setSocketResById',
                payload: { status: 'connecting' },
                id: target.target_id,
            });
            desktop_proxy.emit('websocket', {
                action: 'connect',
                target,
            });
        } else {
            Message('error', '尚未连接到代理,请稍后重试。');
        }
    };

    const disconnectWebSocket = (target) => {
        if (desktop_proxy && desktop_proxy?.connected) {
            desktop_proxy.emit('websocket', {
                action: 'disconnect',
                target,
            });
        } else {
            dispatch({
                type: 'opens/setSocketResById',
                payload: {
                    status: 'disconnect',
                    res: { action: 'disconnect', time: dayjs().format('HH:mm:ss') },
                },
                id: target.target_id,
            });
        }
    };

    const sendMessageWebSocket = (id, message, event) => {
        if (desktop_proxy && desktop_proxy?.connected) {
            desktop_proxy.emit('websocket', {
                action: 'message',
                message,
                target: { target_id: id },
                event,
            });
        }
    };

    return {
        getMockMethodRequest,
        apiSend,
        grpcSend,
        getProtoAllMethodList,
        varReplace,
        connectWebSocket,
        disconnectWebSocket,
        sendMessageWebSocket,
    };
};

export default useApi;
