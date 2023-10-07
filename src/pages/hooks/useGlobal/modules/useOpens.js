/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Opens, Collection, Recently_Save } from '@indexedDB/project';
import { v4 as uuidv4 } from 'uuid';
// import { User } from '@indexedDB/user';
import Bus, { useEventBus } from '@utils/eventBus';
import { Message } from 'adesign-react';
import {
    isObject,
    isUndefined,
    cloneDeep,
    isEmpty,
    isString,
    set,
    isArray,
    findIndex,
    isPlainObject,
    max,
} from 'lodash';
import { global$ } from '@hooks/useGlobal/global';
import {
    versionCheck,
    targetParameter2Obj,
    isURL,
    createUrl,
    GetUrlQueryToArray,
    completionTarget,
    copyStringToClipboard
} from '@utils';
import * as jsondiffpatch from 'jsondiffpatch';
import { urlParseLax } from '@utils/common';
import { from, lastValueFrom, tap, map, concatMap, of } from 'rxjs';
import { CONFILCTURL } from '@constants/confilct';
import {
    SaveTargetRequest,
    saveApiBakRequest,
    fetchHandleApi,
    fetchApiDetail,
    fetchSendApi,
    fetchGetResult,
    fetchDeleteApi,
    fetchChangeSort,
    fetchRunSql,
    fetchConnectDB,
    fetchGetSqlResult,
    fetchRunTcp,
    fetchGetTcpResult,
    fetchRunWebSocket,
    fetchGetWebSocketResult,
    fetchRunDubbo,
    fetchGetDubboResult,
    fetchSendOrStopWs,
    fetchSendOrStopTcp
} from '@services/apis';
import { fetchRunAutoReportApi } from '@services/auto_report';
import { getBaseCollection } from '@constants/baseCollection';
import QueryString from 'qs';

// 发送api时轮询的参数
var send_api_t = null;

// 发送mysql时轮询的参数
var send_mysql_t = null;

// 发送tcp时轮询的参数
var send_tcp_t = null;
var send_tcp_ret_id = null;

// 发送websocket时轮询的参数
var send_ws_t = null;
var send_ws_ret_id = null;

// 发送dubbo时轮询的参数
var send_dubbo_t = null;

// 新建接口
const useOpens = () => {
    const dispatch = useDispatch();
    const open_apis = useSelector((store) => store?.opens.open_apis);
    const open_api_now = useSelector((store) => store?.opens.open_api_now);
    const open_res = useSelector((store) => store?.opens.open_res);

    const apiDatas = useSelector((store) => store.apis.apiDatas);
    const workspace = useSelector((store) => store?.workspace);
    const debug_target_id = useSelector((store) => store.auto_report.debug_target_id);
    const auto_report_redux = useSelector((store) => store.auto_report);

    const sql_res = useSelector((store) => store.opens.sql_res);
    const tcp_res = useSelector((store) => store.opens.tcp_res);
    const ws_res = useSelector((store) => store.opens.ws_res);
    const dubbo_res = useSelector((store) => store.opens.dubbo_res);
    const { CURRENT_PROJECT_ID, CURRENT_TARGET_ID } = workspace;

    const getSort = (apiDatas) => {
        if (Object.values(apiDatas).length === 0) {
            return 1;
        }
        const _list = Object.values(apiDatas).filter(item => `${item.parent_id}` === '0');
        return _list.length + 1;
    };

    // 修改自动化测试报告的接口配置信息
    const updateAutoReportApi = (data, callback) => {
        const { id, pathExpression, value } = data;
        set(debug_target_id, pathExpression, value);

        if (pathExpression === 'request.url') {
            let reqUrl = value;
            let queryList = [];
            const restfulList = [];
            if (reqUrl) {
                // 自动拼接url http://
                if (!isURL(reqUrl)) {
                    reqUrl = `http://${reqUrl}`;
                }
                const urlObj = createUrl(reqUrl);
                if (isArray(debug_target_id.request?.query?.parameter)) {
                    // 提取query
                    const searchParams = GetUrlQueryToArray(urlObj?.search || '');
                    queryList = id_apis[id].request.query.parameter.filter(
                        (item) => item?.is_checked < 0
                    );
                    searchParams.forEach((item) => {
                        const key = item?.key;
                        const value = item?.value;
                        let obj = {};
                        const i = findIndex(id_apis[id].request.query.parameter, { key });
                        if (i !== -1) obj = id_apis[id].request.query.parameter[i];
                        queryList.push({
                            description: obj?.description || '', // 字段描述
                            is_checked: obj?.is_checked || 1, // 是否启用
                            key: key?.trim(), // 参数名
                            type: obj?.type || 'Text', // 字段类型
                            not_null: obj?.not_null || 1, // 必填｜-1选填
                            field_type: obj?.field_type || 'String', // 类型
                            value: value?.trim(), // 参数值
                        });
                    });
                    set(debug_target_id, 'request.query.parameter', queryList);
                }

                if (isArray(debug_target_id.request?.resful?.parameter)) {
                    // 提取restful
                    const paths = urlObj.pathname.split('/');
                    paths.forEach((p) => {
                        if (p.substring(0, 1) === ':' && p.length > 1) {
                            let obj = {};
                            const i = findIndex(id_apis[id].request?.resful?.parameter, {
                                key: p.substring(1, p.length),
                            });
                            if (i !== -1) obj = id_apis[id].request?.resful?.parameter[i];
                            restfulList.push({
                                key: p.substring(1, p.length),
                                description: obj?.description || '',
                                is_checked: 1,
                                type: 'Text',
                                not_null: 1,
                                field_type: 'String',
                                value: obj?.value || '',
                            });
                        }
                    });
                    set(debug_target_id, 'request.resful.parameter', restfulList);
                }
            }
            set(debug_target_id, 'url', value);
        } else if (pathExpression === 'request.query.parameter') {
            let paramsStr = '';
            const url = debug_target_id.request?.url || '';
            if (
                isArray(debug_target_id.request?.query?.parameter) &&
                debug_target_id.request?.query?.parameter.length > 0
            ) {
                debug_target_id.request.query.parameter.forEach((ite) => {
                    if (ite.key !== '' && ite.is_checked == 1)
                        paramsStr += `${paramsStr === '' ? '' : '&'}${ite.key}=${ite.value}`;
                });
                const newUrl = `${url.split('?')[0]}${paramsStr !== '' ? '?' : ''}${paramsStr}`;
                set(debug_target_id, 'url', newUrl);
                set(debug_target_id, 'request.url', newUrl);
            }
        } else if (pathExpression === 'name') {
            set(debug_target_id, 'name', value);
        }

        set(debug_target_id, 'is_changed', true);


        dispatch({
            type: 'auto_report/updateDebugTargetId',
            payload: debug_target_id
        });

        callback && callback();

    }

    // 重新排序
    const targetReorder = (target) => {
        if (isObject(target) && target.hasOwnProperty('parent_id')) {
            const parentKey = target.parent_id || '0';
            const project_id = target?.project_id;
            // const projectNodes = await Collection.where('project_id').anyOf(project_id).toArray();
            const projectNodes = Object.values(apiDatas);
            let sort = 0;
            const rootNodes = projectNodes.filter((item) => `${item.parent_id}` === `${parentKey}`);
            const nodeSort = rootNodes.map((item) => item.sort);
            sort = max(nodeSort) || 0;
            target.sort = sort + 1;
        }
        return target;
    };
    // 过滤key为空的值
    const filterEmptyKey = async (target) => {
        const { target_type } = target;
        if (target_type === 'api' || target_type === 'websocket') {
            if (target?.request) {
                if (isArray(target?.request?.header?.parameter)) {
                    target.request.header.parameter = target.request.header.parameter.filter(
                        (ite) => ite.key !== ''
                    );
                }
                if (isArray(target?.request?.body?.parameter)) {
                    target.request.body.parameter = target.request.body.parameter?.filter(
                        (ite) => ite.key !== ''
                    );
                    target.request.body.parameter?.forEach((ite) => {
                        // 过滤文件对象
                        if (ite.type === 'File' && ite.key !== '' && typeof ite?.value !== 'string') {
                            try {
                                ite.value = ite?.value?.map((it) => it.name).toString();
                            } catch (error) {
                                ite.value = '';
                            }
                        }
                    });
                }
                if (isArray(target?.request?.query?.parameter)) {
                    target.request.query.parameter = target.request.query.parameter.filter(
                        (ite) => ite.key !== ''
                    );
                }
            }
        }
        if (target_type === 'folder') {
            target.request.header =
                target?.request?.header?.filter((ite) => ite.key !== '') || target.request.header;
            target.request.body =
                target?.request?.body?.filter((ite) => ite.key !== '') || target.request.body;
            target.request.query =
                target?.request?.query?.filter((ite) => ite.key !== '') || target.request.query;
        }
        return target;
    };

    // 小红点判断
    const targetIfChanged = async (newTarget, pathExpression, ignore) => {
        console.log(newTarget, pathExpression, ignore);
        const diffPaths = {
            name: 'name',
            method: 'method',
            mark: 'mark',
            client_mock_url: 'client_mock_url',
            server_mock_url: 'server_mock_url',
            request: 'request',
            response: 'response',
            socketConfig: 'socketConfig',
            script: 'script',
        };

        if (
            isString(pathExpression) &&
            pathExpression.length > 0
            &&
            !ignore
            // diffPaths.hasOwnProperty(pathExpression.split('.')[0])
        ) {
            const path = pathExpression.split('.')[0];
            const updateData = newTarget[diffPaths[path]];
            const change_json = {};
            if (isObject(updateData)) {
                change_json[path] = targetParameter2Obj(updateData);
            } else {
                change_json[path] = updateData;
            }
            // const collectionTarget = await Collection.get(newTarget?.target_id);
            // if (!collectionTarget) {
            newTarget.is_changed = 1;
            // } else {
            //     const source_json = {};
            //     const updateSourceData = collectionTarget[diffPaths[path]];
            //     if (isObject(updateData)) {
            //         source_json[path] = targetParameter2Obj(updateSourceData);
            //     } else {
            //         source_json[path] = updateSourceData;
            //     }
            //     // 开始比对
            //     const delta_diffs = jsondiffpatch
            //         .create({
            //             objectHash: (obj) => obj._key || obj.key,
            //             propertyFilter: (name) => name !== 'value' && name !== 'is_checked',
            //             textDiff: {
            //                 minLength: 600000,
            //             },
            //         })
            //         .diff(change_json, source_json);
            //     if (delta_diffs) {
            //         newTarget.is_changed = 1;
            //     } else {
            //         newTarget.is_changed = -1;
            //     }
            // }
        }
    };

    const addOpensByObj = async (Obj, selected = false, callback) => {
        const tempOpenApis = cloneDeep(open_apis || {});
        tempOpenApis[Obj.target_id] = Obj;

        // await Opens.put(Obj, Obj.target_id).then(() => {
        dispatch({
            type: 'opens/coverOpenApis',
            payload: tempOpenApis,
        });
        selected && Bus.$emit('updateTargetId', Obj.target_id);
        callback && callback();
        const team_id = sessionStorage.getItem('team_id');
        const openNavs =
            apGlobalConfigStore.get(`project_current:${team_id}`)?.open_navs || [];
        openNavs.push(Obj.target_id);
        apGlobalConfigStore.set(`project_current:${team_id}`, {
            open_navs: openNavs,
        });
        // });
    };

    const updateOpensById = (req) => {
        const { id, data } = req;
        // TODO 修改本地库
        if (open_apis.hasOwnProperty(id) && isObject(open_apis[id])) {
            let target_temp = cloneDeep(open_apis[id]);
            target_temp = { ...target_temp, ...data };
            // await Opens.put(target_temp, target_temp.target_id);
            dispatch({
                type: 'opens/coverOpenApis',
                payload: { ...open_apis, [id]: target_temp },
            });
        }
    };

    const updateCollectionById = async () => {
        const params = {
            page: 1,
            size: 100,
            team_id: sessionStorage.getItem('team_id'),
        }
        global$.next({
            action: 'GET_APILIST',
            payload: params,
        });
        // const { id, data, notFindIdNew } = req;
        // let target = await Collection.get(id);
        // if (target && isObject(target)) {
        //     target = { ...target, ...data };
        //     await Collection.put(target, target.target_id);
        //     // 刷新左侧目录列表
        //     global$.next({
        //         action: 'RELOAD_LOCAL_COLLECTIONS',
        //         payload: CURRENT_PROJECT_ID,
        //     });
        // } else if (notFindIdNew) {
        //     await Collection.put(data, data?.target_id);
        //     // 刷新左侧目录列表
        //     global$.next({
        //         action: 'RELOAD_LOCAL_COLLECTIONS',
        //         payload: CURRENT_PROJECT_ID,
        //     });
        // }
    };

    const updateTarget = async (data) => {
        console.log(data);
        const { target_id, pathExpression, value, ignore } = data;
        const tempOpenApis = open_apis;
        if (!tempOpenApis.hasOwnProperty(target_id)) {
            return;
        }
        // TODO 修改本地库
        set(tempOpenApis[target_id], pathExpression, value);
        // url兼容处理
        if (pathExpression === 'request.url') {
            let reqUrl = value;
            let queryList = [];
            const restfulList = [];
            if (reqUrl) {
                // 自动拼接url http://
                if (!isURL(reqUrl)) {
                    reqUrl = `http://${reqUrl}`;
                }

                const urlObj = createUrl(reqUrl);

                if (isArray(tempOpenApis[target_id]?.request?.query?.parameter)) {
                    // 提取query
                    const searchParams = GetUrlQueryToArray(urlObj?.search || '');
                    queryList = tempOpenApis[target_id].request.query.parameter.filter(
                        (item) => item?.is_checked < 0
                    );
                    searchParams.forEach((item) => {
                        const key = item?.key;
                        const value = item?.value;
                        let obj = {};
                        const i = findIndex(tempOpenApis[target_id].request.query.parameter, { key });
                        if (i !== -1) obj = tempOpenApis[target_id].request.query.parameter[i];
                        queryList.push({
                            description: obj?.description || '', // 字段描述
                            is_checked: obj?.is_checked || 1, // 是否启用
                            key: key?.trim(), // 参数名
                            type: obj?.type || 'Text', // 字段类型
                            not_null: obj?.not_null || 1, // 必填｜-1选填
                            field_type: obj?.field_type || 'String', // 类型
                            // value: value?.trim(), // 参数值
                            value: decodeURIComponent(value.trim())
                        });
                    });
                    set(tempOpenApis[target_id], 'request.query.parameter', queryList);
                }

                if (isArray(tempOpenApis[target_id]?.request?.resful?.parameter)) {
                    // 提取restful
                    const paths = urlObj.pathname.split('/');
                    paths.forEach((p) => {
                        if (p.substring(0, 1) === ':' && p.length > 1) {
                            let obj = {};
                            const i = findIndex(tempOpenApis[target_id]?.request?.resful?.parameter, {
                                key: p.substring(1, p.length),
                            });
                            if (i !== -1) obj = tempOpenApis[target_id]?.request?.resful?.parameter[i];
                            restfulList.push({
                                key: p.substring(1, p.length),
                                description: obj?.description || '',
                                is_checked: 1,
                                type: 'Text',
                                not_null: 1,
                                field_type: 'String',
                                value: obj?.value || '',
                            });
                        }
                    });
                    set(tempOpenApis[target_id], 'request.resful.parameter', restfulList);
                }
            }
            // 自动生成mockurl
            if (tempOpenApis[target_id].target_type === 'api') {
                // const userInfo = await User.get(localStorage.getItem('uuid') || '-1');
                // if (isPlainObject(userInfo?.config) && userInfo.config?.AUTO_GEN_MOCK_URL > 0) {
                //     set(tempOpenApis[target_id], 'mock_url', urlParseLax(value)?.pathname || '');
                // }
            }
            set(tempOpenApis[target_id], 'url', value);
            // set(tempOpenApis[target_id], 'request.url', reqUrl);
            // set(tempOpenApis[target_id], 'request.url', reqUrl);
        } else if (pathExpression === 'request.query.parameter') {
            let paramsStr = '';
            let url = tempOpenApis[target_id]?.request?.url || '';
            if (
                isArray(tempOpenApis[target_id]?.request?.query?.parameter) &&
                tempOpenApis[target_id]?.request?.query?.parameter.length > 0
            ) {
                tempOpenApis[target_id].request.query.parameter.forEach((ite) => {
                    if (ite.key !== '' && ite.is_checked == 1)
                        paramsStr += `${paramsStr === '' ? '' : '&'}${ite.key}=${ite.value}`;
                });
                const newUrl = `${url.split('?')[0]}${paramsStr !== '' ? '?' : ''}${paramsStr}`;
                set(tempOpenApis[target_id], 'url', newUrl);
                set(tempOpenApis[target_id], 'request.url', newUrl);
            } else {
                url = url.split('?')[0];
                set(tempOpenApis[target_id], 'url', url);
                set(tempOpenApis[target_id], 'request.url', url);
            }
        }
        // 小红点判断
        await targetIfChanged(tempOpenApis[target_id], pathExpression, ignore);
        // 修改opens 数据 （包括indexedDB和redux）
        await updateOpensById({ id: target_id, data: tempOpenApis[target_id] });
    };

    // 通过id克隆接口
    const cloneTargetById = async (id) => {
        let newTarget = null;
        const _open_apis = cloneDeep(open_apis);

        const query = {
            team_id: sessionStorage.getItem('team_id'),
            target_ids: id,
        }

        fetchApiDetail(query).pipe(
            concatMap((res) => {
                const { data: { targets } } = res;
                newTarget = targets[0];
                newTarget.target_id = uuidv4();
                // delete newTarget.target_id;
                newTarget.name += '副本';


                return fetchHandleApi(newTarget).pipe((res) => {
                    return res;
                });
            }),
            tap((res) => {
                const { data: { target_id }, code } = res;
                if (code === 0) {
                    newTarget.target_id = target_id;
                    _open_apis[target_id] = newTarget;
                    dispatch({
                        type: 'opens/coverOpenApis',
                        payload: _open_apis
                    })
                    if (Object.entries(_open_apis).length === 1) {
                        dispatch({
                            type: 'opens/updateOpenApiNow',
                            payload: target_id
                        })
                    }
                    Message('success', '克隆成功');
                    global$.next({
                        action: 'GET_APILIST',
                        params: {
                            page: 1,
                            size: 100,
                            team_id: sessionStorage.getItem('team_id'),
                        }
                    });
                }
            })
        ).subscribe();

        // if (newTarget) {
        //     // 克隆目标
        //     newTarget.target_id = uuidv4();
        //     newTarget.is_changed = 1;
        //     newTarget.is_example = 0;
        //     if (newTarget?.name === '') newTarget.name = '新建';
        //     newTarget.name += ' 副本';
        //     tempOpenApis[newTarget.target_id] = newTarget;
        //     // Opens.put(newTarget, newTarget.target_id).then(() => {
        //     //     dispatch({
        //     //         type: 'opens/coverOpenApis',
        //     //         payload: tempOpenApis,
        //     //     });
        //     //     User.get(localStorage.getItem('uuid') || '-1').then((userInfo) => {
        //     //         if (isPlainObject(userInfo?.config) && userInfo.config?.AUTO_OPEN_CLONE_NEWAPI_TAB > 0) {
        //     //             Bus.$emit('updateTargetId', newTarget.target_id);
        //     //         }
        //     //     });

        //     //     const openNavs =
        //     //         apGlobalConfigStore.get(`project_current:${CURRENT_PROJECT_ID}`)?.open_navs || [];
        //     //     openNavs.push(newTarget.target_id);
        //     //     apGlobalConfigStore.set(`project_current:${CURRENT_PROJECT_ID}`, {
        //     //         open_navs: openNavs,
        //     //     });
        //     // });
        // }
    };
    // 通过对象克隆接口
    const cloneTargetByObj = async (data, showMessage = true) => {
        const newTarget = cloneDeep(data);
        const tempOpenApis = cloneDeep(open_apis);
        if (!newTarget && !isObject(newTarget)) {
            return;
        }
        if (newTarget) {
            // 克隆目标
            newTarget.target_id = uuidv4();
            newTarget.is_changed = 1;
            newTarget.is_example = 0;
            if (newTarget?.name === '') newTarget.name = '新建';
            tempOpenApis[newTarget.target_id] = newTarget;
            // Opens.put(newTarget, newTarget.target_id).then(() => {
            //     dispatch({
            //         type: 'opens/coverOpenApis',
            //         payload: tempOpenApis,
            //     });
            //     User.get(localStorage.getItem('uuid') || '-1').then((userInfo) => {
            //         if (isPlainObject(userInfo?.config) && userInfo.config?.AUTO_OPEN_CLONE_NEWAPI_TAB > 0) {
            //             Bus.$emit('updateTargetId', newTarget.target_id);
            //         }
            //     });

            //     const openNavs =
            //         apGlobalConfigStore.get(`project_current:${CURRENT_PROJECT_ID}`)?.open_navs || [];
            //     openNavs.push(newTarget.target_id);
            //     apGlobalConfigStore.set(`project_current:${CURRENT_PROJECT_ID}`, {
            //         open_navs: openNavs,
            //     });
            // });
            showMessage && Message('success', '克隆成功');
        }
    };

    const addOpenItem = async (data) => {

        const { type, id, pid } = data;
        let newApi = '';

        dispatch({
            type: 'opens/updateSaveId',
            payload: null,
        })

        if (id) {
            Bus.$emit('updateTargetId', id);
            dispatch({
                type: 'opens/updateOpenApiNow',
                payload: id,
            })
            if (!open_apis.hasOwnProperty(id)) {
                const query = {
                    team_id: sessionStorage.getItem('team_id'),
                    target_ids: [id]
                };

                fetchApiDetail(query).subscribe({
                    next: (res) => {
                        const { code, data: { targets } } = res;
                        if (code === 0) {
                            const tempApis = {
                                ...open_apis
                            };

                            targets[0].is_changed = -1;
                            tempApis[id] = targets[0];

                            // delete tempApis[id].is_changed;

                            dispatch({
                                type: 'opens/coverOpenApis',
                                payload: tempApis,
                                // first: true
                            })

                            Bus.$emit('updateTargetId', tempApis[id].target_id);
                            const team_id = sessionStorage.getItem('team_id');
                            const openNavs =
                                apGlobalConfigStore.get(`project_current:${team_id}`)?.open_navs || [];
                            openNavs.push(tempApis[id].target_id);
                            apGlobalConfigStore.set(`project_current:${team_id}`, {
                                open_navs: openNavs,
                            });
                        }
                    },
                    err: (err) => {
                    }
                })
            }
            // await Collection.get(id).then((res) => {
            //     newApi = completionTarget(res);
            // });
        } else {
            newApi = getBaseCollection(type);
            // newApi.project_id = CURRENT_PROJECT_ID || '-1';
            newApi.is_changed = 1;
            // const userInfo = await User.get(localStorage.getItem('uuid') || '-1');
            if (type === 'api') {
                // 默认请求method
                // newApi.method = userInfo.config?.AJAX_DEFAULT_METHOD || 'POST';
                newApi.method = 'POST'
                // 默认请求方式
                // newApi.request.body.mode = userInfo.config?.AJAX_DEFAULT_MODE || 'none';
                newApi.request.body.mode = 'none';
            }
            // newApi.sort = getSort(apiDatas);
        }
        if (!newApi) return;

        if (isString(pid) && pid.length > 0) {
            newApi.parent_id = pid;
        }
        addOpensByObj(newApi, true);
    };

    const updateTargetId = async (id) => {

        // const uuid = localStorage.getItem('uuid');
        // User.update(uuid, { 'workspace.CURRENT_TARGET_ID': id }).then(() => {
        const team_id = sessionStorage.getItem('team_id');
        if (typeof id === 'number') {
            apGlobalConfigStore.set(`project_current:${team_id}`, { CURRENT_TARGET_ID: id });
        }
        dispatch({
            type: 'workspace/updateWorkspaceState',
            payload: { CURRENT_TARGET_ID: id },
        });
        dispatch({
            type: 'opens/updateOpenApiNow',
            payload: id,
        })
        // });
    };

    const addOpenItemByObj = async ({
        Obj,
        pid,
        callback,
    }) => {
        let newItem = cloneDeep(Obj);
        newItem = { ...newItem, target_id: uuidv4(), project_id: CURRENT_PROJECT_ID };
        if (pid && isString(pid)) newItem.parent_id = pid;
        addOpensByObj(newItem, true, callback);
    };

    const removeOpenItem = async (id, api_now) => {
        // 判断是否为socket 关闭连接
        // const target = await Opens.get(id);
        // if (target?.target_type === 'websocket') {
        //     // 关闭socket连接
        //     if (desktop_proxy && desktop_proxy?.connected) {
        //         desktop_proxy.emit('websocket', {
        //             action: 'disconnect',
        //             target,
        //         });
        //     }
        // }
        // await Opens.delete(id).then(() => {
        // return;
        let _open_api_now = api_now ? api_now : open_api_now;
        let ids = [];
        for (let id in open_apis) {
            ids.push(typeof open_apis[id].parent_id === 'number' ? parseInt(id) : id);
        }
        const team_id = sessionStorage.getItem('team_id');

        const openNavs =
            apGlobalConfigStore.get(`project_current:${team_id}`)?.open_navs || [];
        const index_1 = ids.indexOf(id);
        if (`${id}` === `${_open_api_now}`) {
            let newId = '';
            if (index_1 > 0) {
                newId = ids[index_1 - 1];
            } else {
                newId = ids[index_1 + 1];
            }
            // 更新当前id
            newId && updateTargetId(newId);
            dispatch({
                type: 'opens/updateOpenApiNow',
                payload: newId,
            })
        }

        dispatch({
            type: 'opens/removeApiById',
            payload: { target_id: id },
        });

        index_1 > -1 && openNavs.splice(index_1, 1);
        apGlobalConfigStore.set(`project_current:${team_id}`, { open_navs: openNavs });
        // });
    };

    const saveDubboById = (data) => {
        const { id, pid, callback } = data;
        const target_id = id;
        const tempOpenApis = cloneDeep(open_apis);
        let tempTarget = tempOpenApis[target_id];

        if (pid && isObject(tempTarget)) tempTarget.parent_id = pid;

        if (!isUndefined(tempTarget) && isObject(tempTarget)) {
            tempTarget.is_changed = -1;
        }

        if (tempTarget.sort == -1) {
            tempTarget = targetReorder(tempTarget);
        }

        tempTarget.team_id = sessionStorage.getItem('team_id');
        tempTarget.source = 0;

        fetchHandleApi(tempTarget).subscribe({
            next: async (res) => {
                const { code, data } = res;

                if (code === 0) {
                    await updateOpensById({
                        id: tempTarget?.target_id,
                        data: tempTarget,
                    });

                    global$.next({
                        action: 'GET_APILIST',
                    });

                    if (callback) {
                        callback && callback(code, data.target_id);
                    }
                }
            }
        })
    }

    const saveWsById = (data) => {
        const { id, pid, callback } = data;
        const target_id = id;
        const tempOpenApis = cloneDeep(open_apis);
        let tempTarget = tempOpenApis[target_id];

        if (pid && isObject(tempTarget)) tempTarget.parent_id = pid;

        if (!isUndefined(tempTarget) && isObject(tempTarget)) {
            tempTarget.is_changed = -1;
        }

        if (tempTarget.sort == -1) {
            tempTarget = targetReorder(tempTarget);
        }

        tempTarget.team_id = sessionStorage.getItem('team_id');
        tempTarget.source = 0;

        fetchHandleApi(tempTarget).subscribe({
            next: async (res) => {
                const { code, data } = res;

                if (code === 0) {
                    await updateOpensById({
                        id: tempTarget?.target_id,
                        data: tempTarget,
                    });

                    global$.next({
                        action: 'GET_APILIST',
                    });

                    if (callback) {
                        callback && callback(code, data.target_id);
                    }
                }
            }
        })
    }

    const saveMqttById = (data) => {
        const { id, pid, callback } = data;
        const target_id = id;
        const tempOpenApis = cloneDeep(open_apis);
        let tempTarget = tempOpenApis[target_id];

        if (pid && isObject(tempTarget)) tempTarget.parent_id = pid;

        if (!isUndefined(tempTarget) && isObject(tempTarget)) {
            tempTarget.is_changed = -1;
        }

        if (tempTarget.sort == -1) {
            tempTarget = targetReorder(tempTarget);
        }

        tempTarget.team_id = sessionStorage.getItem('team_id');
        tempTarget.source = 0;

        fetchHandleApi(tempTarget).subscribe({
            next: async (res) => {
                const { code, data } = res;

                if (code === 0) {
                    await updateOpensById({
                        id: tempTarget?.target_id,
                        data: tempTarget,
                    });

                    global$.next({
                        action: 'GET_APILIST',
                    });

                    if (callback) {
                        callback && callback(code, data.target_id);
                    }
                }
            }
        })
    }

    const saveTcpById = (data) => {
        const { id, pid, callback } = data;
        const target_id = id;
        const tempOpenApis = cloneDeep(open_apis);
        let tempTarget = tempOpenApis[target_id];

        if (pid && isObject(tempTarget)) tempTarget.parent_id = pid;

        if (!isUndefined(tempTarget) && isObject(tempTarget)) {
            tempTarget.is_changed = -1;
        }

        if (tempTarget.sort == -1) {
            tempTarget = targetReorder(tempTarget);
        }

        tempTarget.team_id = sessionStorage.getItem('team_id');
        tempTarget.source = 0;

        fetchHandleApi(tempTarget).subscribe({
            next: async (res) => {
                const { code, data } = res;

                if (code === 0) {
                    await updateOpensById({
                        id: tempTarget?.target_id,
                        data: tempTarget,
                    });

                    global$.next({
                        action: 'GET_APILIST',
                    });

                    if (callback) {
                        callback && callback(code, data.target_id);
                    }
                }
            }
        })
    }

    const saveSqlById = (data) => {
        const { id, pid, callback } = data;
        const target_id = id;
        const tempOpenApis = cloneDeep(open_apis);
        let tempTarget = tempOpenApis[target_id];

        if (pid && isObject(tempTarget)) tempTarget.parent_id = pid;

        if (!isUndefined(tempTarget) && isObject(tempTarget)) {
            tempTarget.is_changed = -1;
        }

        if (tempTarget.sort == -1) {
            tempTarget = targetReorder(tempTarget);
        }

        tempTarget.team_id = sessionStorage.getItem('team_id');
        tempTarget.source = 0;

        fetchHandleApi(tempTarget).subscribe({
            next: async (res) => {
                const { code, data } = res;

                if (code === 0) {
                    await updateOpensById({
                        id: tempTarget?.target_id,
                        data: tempTarget,
                    });

                    global$.next({
                        action: 'GET_APILIST',
                    });

                    if (callback) {
                        callback && callback(code, data.target_id);
                    }
                }
            }
        })
    }

    const saveTargetById = async (data, options = { is_socket: 1 }, callbacks) => {
        const { id, saveId, pid, callback } = data;
        const target_id = id;
        const tempOpenApis = cloneDeep(open_apis);
        let tempTarget = tempOpenApis[target_id];

        if (pid && isObject(tempTarget)) tempTarget.parent_id = pid;
        if (!isUndefined(tempTarget) && isObject(tempTarget)) {
            // tempTarget.update_day = new Date(new Date().toLocaleDateString()).getTime();
            // tempTarget.update_dtime = ~~(new Date().getTime() / 1000);
            tempTarget.is_changed = -1;
            // tempTarget.modifier_id = localStorage.getItem('uuid');
            switch (tempTarget?.target_type) {
                case 'api':
                    if (tempTarget.name === '') tempTarget.name = '新建接口';
                    if (isEmpty(tempTarget.mock)) tempTarget.mock = '{}';
                    break;
                case 'doc':
                    if (tempTarget.name === '') tempTarget.name = '新建文本';
                    break;
                case 'websocket':
                    if (tempTarget.name === '') tempTarget.name = '新建webSocket';
                    break;
                default:
                    break;
            }


            // return;
            // sort 排序
            if (tempTarget.sort == -1) {
                tempTarget = targetReorder(tempTarget);
            }

            // 过滤key为空的数据
            // filterEmptyKey(tempTarget);

            // 添加最新保存记录
            // Recently_Save.put(tempTarget);

            if (options?.is_archive > 0) {
                tempTarget.is_example = 1;
            }


            // await updateCollectionById({
            //     id: tempTarget?.target_id,
            //     data: tempTarget,
            //     notFindIdNew: true,
            // });
            // 更新opens

            // TODO:
            // if (typeof tempTarget.target_id === 'string') {
            //     delete tempTarget['target_id'];
            // }

            tempTarget.parent_id = tempTarget.parent_id;
            tempTarget.team_id = sessionStorage.getItem('team_id');
            // 5月份开始, 所有接口管理的接口和目录都加上source字段, 值为0
            tempTarget.source = 0;

            if (saveId && typeof id === 'string') {
                tempTarget.target_id = saveId;
            }

            fetchHandleApi(tempTarget)
                .pipe(
                    tap(async (res) => {
                        const { code, data } = res;

                        if (code === 0) {

                            // if (typeof id === 'string') {
                            //     const _old = cloneDeep(tempOpenApis[id]);
                            //     _old.target_id = data.target_id;
                            //     delete tempOpenApis[id];
                            //     tempOpenApis[data.target_id] = _old;

                            //     dispatch({
                            //         type: 'opens/coverOpenApis',
                            //         payload: tempOpenApis,
                            //     })

                            //     dispatch({
                            //         type: 'opens/updateOpenApiNow',
                            //         payload: data.target_id,
                            //     })
                            // }
                            await updateOpensById({
                                id: tempTarget?.target_id,
                                data: tempTarget,
                            });
                            global$.next({
                                action: 'GET_APILIST',
                                params: {
                                    page: 1,
                                    size: 100,
                                    team_id: sessionStorage.getItem('team_id'),
                                }
                            });
                            // dispatch({
                            //     type: 'opens/updateSaveApi',
                            //     payload: tempTarget.target_id,
                            // })

                            if (callbacks) {
                                callbacks && callbacks(code, data.target_id);
                                // await updateCollectionById();
                            }

                            if (callback) {
                                callback && callback(code, data.target_id);
                            }
                        }


                        // if (code === 0) {
                        //     Message('success', '保存成功!');
                        //     // 更新collection

                        // } else {
                        //     Message('error', '保存失败!');
                        // }
                    })
                )
                .subscribe();

            // 执行接口 失败添加异步任务
            // if (tempTarget?.target_type) {
            //     try {
            //         const resp = await lastValueFrom(SaveTargetRequest({ ...tempTarget, ...options }));
            //         if (resp?.code === 10000) {
            //             // 更新本地数据库版本
            //             await updateCollectionById({
            //                 id: tempTarget?.target_id,
            //                 data: {
            //                     ...tempTarget,
            //                     version: resp?.data?.version,
            //                 },
            //                 notFindIdNew: true,
            //             });
            //             await updateOpensById({
            //                 id: tempTarget?.target_id,
            //                 data: {
            //                     ...tempTarget,
            //                     version: resp?.data?.version,
            //                 },
            //             });

            //         } else {
            //             // 添加异步任务
            //             pushTask(
            //                 {
            //                     task_id: tempTarget.target_id,
            //                     action: 'SAVE',
            //                     model: tempTarget?.target_type.toUpperCase(),
            //                     payload: tempTarget.target_id,
            //                     project_id: CURRENT_PROJECT_ID,
            //                 },
            //                 -1
            //             );
            //         }
            //     } catch (error) {
            //         // 添加异步任务
            //         pushTask(
            //             {
            //                 task_id: tempTarget.target_id,
            //                 action: 'SAVE',
            //                 model: tempTarget?.target_type.toUpperCase(),
            //                 payload: tempTarget.target_id,
            //                 project_id: CURRENT_PROJECT_ID,
            //             },
            //             -1
            //         );
            //     }
            // }

            callback && callback();
        }
    };

    const saveTargetByObj = async (data) => {
        const { Obj, callback, IncompleteObject } = data;
        let tempTarget = {};
        const tempOpenApis = cloneDeep(open_apis);
        if (isPlainObject(IncompleteObject) && isString(IncompleteObject?.target_id)) {
            if (tempOpenApis.hasOwnProperty(IncompleteObject.target_id)) {
                tempTarget = { ...tempOpenApis[IncompleteObject.target_id], ...IncompleteObject };
            } else {
                const collection = await Collection.get(IncompleteObject.target_id);
                if (!isUndefined(collection) && isPlainObject(collection)) {
                    tempTarget = { ...collection, ...IncompleteObject };
                }
            }
        } else {
            tempTarget = Obj;
        }
        // 传入对象 直接存 不走open库
        if (!isUndefined(tempTarget) && isObject(tempTarget) && isString(tempTarget?.target_id)) {
            tempTarget.update_day = new Date(new Date().toLocaleDateString()).getTime();
            tempTarget.update_dtime = ~~(new Date().getTime() / 1000);
            tempTarget.is_changed = -1;
            tempTarget.modifier_id = localStorage.getItem('uuid');
            switch (tempTarget?.target_type) {
                case 'api':
                    if (tempTarget.name === '') tempTarget.name = '新建接口';
                    if (isEmpty(tempTarget.mock)) tempTarget.mock = '{}';
                    break;
                case 'doc':
                    if (tempTarget.name === '') tempTarget.name = '新建文本';
                    break;
                case 'websocket':
                    if (tempTarget.name === '') tempTarget.name = '新建webSocket';
                    break;
                default:
                    break;
            }
            // sort 排序
            if (tempTarget?.sort == -1) await targetReorder(tempTarget);

            // 过滤key为空的数据
            filterEmptyKey(tempTarget);

            // 最近保存记录
            Recently_Save.put(tempTarget);

            // 更新collection
            await updateCollectionById({ id: tempTarget?.target_id, data: tempTarget });

            // open库中有的话 更新
            if (tempOpenApis.hasOwnProperty(tempTarget?.target_id)) {
                await updateOpensById({ id: tempTarget?.target_id, data: tempTarget });
            }

            // 执行接口 失败添加异步任务
            if (tempTarget?.target_type) {
                from(SaveTargetRequest({ ...tempTarget, is_socket: 1 })).subscribe({
                    next(resp) {
                        if (resp?.code === 10000) {
                            // 更新本地数据库版本
                            updateCollectionById({
                                id: tempTarget?.target_id,
                                data: {
                                    ...tempTarget,
                                    version: resp?.data?.version,
                                },
                                notFindIdNew: true,
                            });

                            updateOpensById({
                                id: tempTarget?.target_id,
                                data: {
                                    ...tempTarget,
                                    version: resp?.data?.version,
                                },
                            });
                        } else {
                            
                        }
                    },
                    error() {
                        
                    },
                });
            }

            callback && callback();
        }
    };

    const backupTargetById = (id) => {
        const tempTarget = open_apis[id];
        if (tempTarget.is_changed > 0) {
            return Message('error', '请先保存当前数据后再备份');
        }
        saveApiBakRequest({
            target_id: id,
            project_id: CURRENT_PROJECT_ID,
        }).subscribe({
            next(resp) {
                if (resp?.code === 10000) Message('success', '备份成功');
            },
        });
    };

    const compareJson = (data) => {
        const { responseUrl, server_json, local_json, version } = data;
        const url = `/${responseUrl.split('/api/')[1]}`;
        let type = CONFILCTURL[url];
        if (type === 'save') {
            type = local_json.target_type;
        }
        if (type === 'env') {
            local_json.env_vars = Object.keys(local_json.env_vars).map((k) => {
                return {
                    ...local_json.env_vars[k],
                    key: k,
                };
            });
            server_json.env_vars = Object.keys(server_json.env_vars).map((k) => {
                return {
                    ...server_json.env_vars[k],
                    key: k,
                };
            });
        }
        const diffList = versionCheck(server_json, local_json, type, version);
        const conflictData = {
            diff: diffList,
            type,
            isArchive: false,
        };
        dispatch({
            type: 'conflict/setConflict',
            payload: conflictData,
        });
        Bus.$emit('openModal', 'ConfilctModal');
    };

    const reloadOpens = () => {
        const team_id = sessionStorage.getItem('team_id');
        if (team_id) {
            const openNavs =
                apGlobalConfigStore.get(`project_current:${team_id}`)?.open_navs || [];
            if (openNavs && openNavs.length > 0 && openNavs.filter(item => typeof item === 'number').length > 0) {
                const query = {
                    team_id: sessionStorage.getItem('team_id'),
                    target_ids: openNavs.filter(item => typeof item === 'number')
                };
                fetchApiDetail(QueryString.stringify(query, { indices: false })).subscribe({
                    next: (res) => {
                        const { data: { targets } } = res;
                        // const _open_apis = cloneDeep(open_apis);
                        // targets.forEach(item => {
                        //     _open_apis[item.target_id] = item;
                        // });
                        const tempApiList = {};
                        for (let i = 0; i < targets.length; i++) {
                            tempApiList[targets[i].target_id] = targets[i];
                        }
                        dispatch({
                            type: 'opens/coverOpenApis',
                            payload: tempApiList,
                        })
                    }
                })
            } else {
                dispatch({
                    type: 'opens/coverOpenApis',
                    payload: {},
                })
            }

            // 恢复上次打开的targetID
            const current_target_id = apGlobalConfigStore.get(
                `project_current:${team_id}`
            )?.CURRENT_TARGET_ID;
            if (current_target_id) {
                dispatch({
                    type: 'opens/updateOpenApiNow',
                    payload: current_target_id,
                })
                dispatch({
                    type: 'workspace/updateWorkspaceState',
                    payload: { CURRENT_TARGET_ID: current_target_id },
                });
            }
        }
        // Opens.bulkGet(openNavs).then((res) => {
        //     const open_init_apis = {};
        //     if (res && res.length > 0) {
        //         res.forEach((i) => {
        //             if (i) {
        //                 res.push(i);
        //                 open_init_apis[i.target_id] = completionTarget(i);
        //             }
        //         });
        //     }
        //     dispatch({
        //         type: 'opens/coverOpenApis',
        //         payload: open_init_apis,
        //     });
        // });
    };

    const dragUpdateTarget = ({ ids, targetList }) => {
        const _ids = cloneDeep(ids);
        _ids.forEach(item => {
            if (typeof item.parent_id === 'string') {
                item.parent_id = parseInt(item.parent_id);
            }
        })
        const targetDatas = {};
        targetList.forEach(item => {
            targetDatas[item.target_id] = item;
        })

        const params = {
            targets: targetList,
        };
        fetchChangeSort(params).subscribe({
            next: (res) => {
                global$.next({
                    action: 'GET_APILIST'
                })
            }
        });
    }

    const sendAutoReportApi = (id) => {

        const _open_res = cloneDeep(open_res);
        _open_res[id] = {
            ..._open_res[id],
            status: 'running',
        };
        dispatch({
            type: 'opens/updateOpenRes',
            payload: _open_res
        })
        const params = {
            api_detail: debug_target_id,
            team_id: sessionStorage.getItem('team_id'),
        };
        fetchRunAutoReportApi(params).pipe(
            tap(res => {
                const { data: { ret_id }, code } = res;
                if (code === 0) {
                    clearInterval(send_api_t);
                    const query = {
                        ret_id,
                    };

                    send_api_t = setInterval(() => {
                        fetchGetResult(query).subscribe({
                            next: (res) => {
                                const { data } = res;
                                if (data) {
                                    clearInterval(send_api_t);
                                    const _open_res = cloneDeep(open_res);
                                    _open_res[id] = {
                                        ...data,
                                        status: 'finish',
                                    };
                                    dispatch({
                                        type: 'opens/updateOpenRes',
                                        payload: _open_res
                                    })
                                }
                            }
                        })
                    }, 1000);
                }

            })
        )
            .subscribe()
    };

    const sendApi = (id) => {
        const params = {
            target_id: id ? id : open_api_now,
            team_id: sessionStorage.getItem('team_id'),
        };
        const _open_res = cloneDeep(open_res);
        _open_res[id] = {
            ..._open_res[id],
            status: 'running',
        };
        dispatch({
            type: 'opens/updateOpenRes',
            payload: _open_res
        })
        fetchSendApi(params).pipe(
            tap(res => {
                const { data: { ret_id }, code } = res;
                if (code === 0) {
                    clearInterval(send_api_t);
                    const query = {
                        ret_id,
                    };

                    send_api_t = setInterval(() => {
                        fetchGetResult(query).subscribe({
                            next: (res) => {
                                const { data, code } = res;

                                if (code !== 0 || data) {
                                    clearInterval(send_api_t);
                                    const _open_res = cloneDeep(open_res);

                                    if (data) {
                                        _open_res[id] = {
                                            ...data,
                                            status: 'finish',
                                        };
                                    } else {
                                        _open_res[id] = {
                                            status: 'finish',
                                        };
                                    }

                                    dispatch({
                                        type: 'opens/updateOpenRes',
                                        payload: _open_res
                                    })
                                }
                            }
                        })
                    }, 1000);
                }

            })
        )
            .subscribe()
    };

    const stopSend = (id) => {
        clearInterval(send_api_t);
        const _open_res = cloneDeep(open_res);
        _open_res[id] = {
            // ...data,
            status: 'finish',
        };
        dispatch({
            type: 'opens/updateOpenRes',
            payload: _open_res
        })
    }

    const toDeleteFolder = (target_id, from, plan_id, callback) => {

        fetchDeleteApi({ target_id }).subscribe({
            next: (res) => {
                if (res.code === 0) {
                    if (from === 'scene') {
                        dispatch({
                            type: 'scene/updateOpenScene',
                            payload: null,
                        })
                        dispatch({
                            type: 'scene/updateRunStatus',
                            payload: 'finish',
                        })
                        global$.next({
                            action: 'RELOAD_LOCAL_SCENE',
                        });
                        localStorage.removeItem('open_scene');
                    } else if (from === 'plan') {
                        dispatch({
                            type: 'plan/updateOpenScene',
                            payload: null,
                        })
                        dispatch({
                            type: 'plan/updateRunStatus',
                            payload: 'finish',
                        })
                        global$.next({
                            action: 'RELOAD_LOCAL_PLAN',
                            id: plan_id
                        });
                    } else if (from === 'auto_plan') {
                        dispatch({
                            type: 'auto_plan/updateOpenScene',
                            payload: null,
                        })
                        dispatch({
                            type: 'auto_plan/updateRunStatus',
                            payload: 'finish',
                        })
                        global$.next({
                            action: 'RELOAD_LOCAL_AUTO_PLAN',
                            id: plan_id
                        });
                    } else {

                        let _open_apis = cloneDeep(open_apis);
                        let localApi = JSON.parse(localStorage.getItem(`project_current:${sessionStorage.getItem('team_id')}`)).open_navs;
                        for (let i in _open_apis) {
                            if (_open_apis[i].parent_id === target_id) {
                                delete _open_apis[i];
                                let index = localApi.indexOf(i);
                                localApi.splice(index, 1);
                                if (open_api_now === i) {
                                    let newId = '';
                                    if (index > 0) {
                                        newId = localApi[index - 1];
                                    } else {
                                        newId = localApi[index + 1];
                                    }
                                    dispatch({
                                        type: 'opens/updateOpenApiNow',
                                        payload: newId,
                                    })
                                }
                            }
                        }
                        dispatch({
                            type: 'opens/coverOpenApis',
                            payload: _open_apis
                        })
                        localStorage.setItem(`project_current:${sessionStorage.getItem('team_id')}`, JSON.stringify({ open_navs: localApi }));


                        global$.next({
                            action: 'GET_APILIST',
                        });
                    }

                    callback && callback();
                }
            }
        });
        // })
    }

    const copyApi = (target_id) => {
        const query = {
            team_id: sessionStorage.getItem('team_id'),
            target_ids: target_id
        };
        fetchApiDetail(query).subscribe({
            next: (res) => {
                const { data: { targets } } = res;
                const newTarget = cloneDeep(targets[0]);
                delete newTarget.target_id;
                newTarget.parent_id = 0;
                copyStringToClipboard(JSON.stringify(newTarget));
            }
        })
    };

    const pasteApi = (target) => {
        let _target = JSON.parse(target);
        _target = targetReorder(_target);

        fetchHandleApi(_target).subscribe({
            next: (res) => {
                const { data, code } = res;
                if (code === 0) {
                    global$.next({
                        action: 'GET_APILIST',
                        params: {
                            page: 1,
                            size: 100,
                            team_id: sessionStorage.getItem('team_id'),
                        }
                    });
                }
            }
        })
    }

    const recordOpenApi = () => {
        let ids = [];
        const _openApis = Object.values(open_apis);
        if (_openApis.length > 0) {
            _openApis.forEach(item => {
                const { target_id } = item;
                if (typeof target_id === 'number' && apiDatas[target_id]) {
                    ids.push(target_id);
                }
            })
            localStorage.setItem('open_apis', JSON.stringify(ids));
        }
    }

    const openRecordApi = () => {
        const ids = localStorage.getItem('open_apis');
        if (ids) {
            const _ids = JSON.parse(ids);
            const query = {
                team_id: sessionStorage.getItem('team_id'),
                target_ids: _ids
            };
            fetchApiDetail(QueryString.stringify(query, { indices: false })).subscribe({
                next: (res) => {
                    const { data: { targets } } = res;
                    const _open_apis = cloneDeep(open_apis);
                    targets.forEach(item => {
                        _open_apis[item.target_id] = item;
                    });
                    dispatch({
                        type: 'opens/coverOpenApis',
                        payload: _open_apis,
                    })
                    dispatch({
                        type: 'opens/updateOpenApiNow',
                        payload: targets[0].target_id,
                    })
                    Bus.$emit('updateTargetId', targets[0].target_id);
                }
            })
        }
    }


    const runSql = (callback) => {
        if (!open_api_now) {
            return;
        }
        const params = {
            target_id: open_api_now,
            team_id: sessionStorage.getItem('team_id'),
        };

        fetchRunSql(params).subscribe({
            next: (res) => {
                const { data: { ret_id }, code } = res;
                if (code === 0 && ret_id) {
                    clearInterval(send_mysql_t);

                    const params = {
                        ret_id,
                    };

                    send_mysql_t = setInterval(() => {
                        fetchGetSqlResult(params).subscribe({
                            next: (res) => {
                                const { code, data } = res;

                                if (code !== 0) {
                                    clearInterval(send_mysql_t);

                                    let _sql_res = cloneDeep(sql_res);

                                    _sql_res[open_api_now] = {
                                        status: 'finish',
                                    };

                                    dispatch({
                                        type: 'opens/updateSqlRes',
                                        payload: _sql_res
                                    })

                                    callback && callback();
                                }

                                if (data) {
                                    clearInterval(send_mysql_t);

                                    let _sql_res = cloneDeep(sql_res);

                                    _sql_res[open_api_now] = {
                                        status: 'finish',
                                        ...data
                                    };

                                    dispatch({
                                        type: 'opens/updateSqlRes',
                                        payload: _sql_res
                                    })

                                    callback && callback();
                                }
                            }
                        })
                    }, 1000);
                }
            }
        })
    };


    const connectTestDB = (data, callback) => {
        fetchConnectDB(data).subscribe({
            next: (res) => {
                const { code, data } = res;
                callback && callback(code, data);
            }
        })
    }


    // 连接tcp接口
    const connectTcp = (callback) => {
        if (!open_api_now) {
            return;
        }
        const params = {
            team_id: sessionStorage.getItem('team_id'),
            target_id: open_api_now
        };
        fetchRunTcp(params).subscribe({
            next: (res) => {
                const { data: { ret_id }, code } = res;

                if (code === 0 && ret_id) {
                    send_tcp_ret_id = ret_id;
                    clearInterval(send_tcp_t);

                    const params = {
                        ret_id,
                    };

                    send_tcp_t = setInterval(() => {
                        fetchGetTcpResult(params).subscribe({
                            next: (res) => {
                                const { code, data } = res;

                                if (code !== 0) {
                                    clearInterval(send_tcp_t);
                                    let _tcp_res = cloneDeep(tcp_res);

                                    _tcp_res[open_api_now] = {
                                        status: 'finish',
                                        result: data || []
                                    };

                                    dispatch({
                                        type: 'opens/updateTcpRes',
                                        payload: _tcp_res
                                    })

                                    send_tcp_ret_id = null;

                                    callback && callback();
                                } else if (data) {
                                    let index = data.findIndex(item => item.is_stop);

                                    if (index !== -1) {
                                        clearInterval(send_tcp_t);

                                        let _tcp_res = cloneDeep(tcp_res);

                                        _tcp_res[open_api_now] = {
                                            status: 'finish',
                                            result: data || []
                                        };

                                        dispatch({
                                            type: 'opens/updateTcpRes',
                                            payload: _tcp_res
                                        })

                                        send_tcp_ret_id = null;

                                        callback && callback();
                                    } else {
                                        let _tcp_res = cloneDeep(tcp_res);

                                        _tcp_res[open_api_now] = {
                                            status: 'running',
                                            result: data || []
                                        };

                                        dispatch({
                                            type: 'opens/updateTcpRes',
                                            payload: _tcp_res
                                        })

                                    }

                                }
                            }
                        })
                    }, 1000);

                }
            }
        })
    }

    // 停止轮询tcp
    const stopRunTcp = () => {

        const params = {
            ret_id: send_ws_ret_id,
            connection_status_change: {
                type: 1,
            }
        };

        fetchSendOrStopTcp(params).subscribe({
            next: (res) => {
                const { code } = res;

                if (code === 0) {
                    let _tcp_res = cloneDeep(tcp_res);

                    if (_tcp_res[open_api_now]) {
                        _tcp_res[open_api_now].status = 'finish';
                    }

                    dispatch({
                        type: 'opens/updateTcpRes',
                        payload: _tcp_res
                    })
                    clearInterval(send_tcp_t);
                    send_tcp_ret_id = null;
                }
            }
        })
    }

    // 发送tcp消息
    const sendTcpMsg = (msg_type, msg) => {
        const params = {
            ret_id: send_tcp_ret_id,
            connection_status_change: {
                type: 2,
                message_type: msg_type,
                message: msg
            }
        };

        fetchSendOrStopTcp(params).subscribe();
    }

    // 连接websocket接口
    const connectWs = (callback) => {
        if (!open_api_now) {
            return;
        }
        const params = {
            team_id: sessionStorage.getItem('team_id'),
            target_id: open_api_now
        };
        fetchRunWebSocket(params).subscribe({
            next: (res) => {
                const { data: { ret_id }, code } = res;

                if (code === 0 && ret_id) {
                    send_ws_ret_id = ret_id;
                    clearInterval(send_ws_t);

                    const params = {
                        ret_id,
                    };

                    send_ws_t = setInterval(() => {
                        fetchGetWebSocketResult(params).subscribe({
                            next: (res) => {
                                const { code, data } = res;

                                if (code !== 0) {
                                    clearInterval(send_ws_t);
                                    let _ws_res = cloneDeep(ws_res);

                                    _ws_res[open_api_now] = {
                                        status: 'finish',
                                        result: data || []
                                    };

                                    dispatch({
                                        type: 'opens/updateWsRes',
                                        payload: _ws_res
                                    })

                                    send_ws_ret_id = null;

                                    callback && callback();
                                } else if (data) {
                                    let index = data.findIndex(item => item.is_stop);

                                    if (index !== -1) {
                                        clearInterval(send_ws_t);

                                        let _ws_res = cloneDeep(ws_res);

                                        _ws_res[open_api_now] = {
                                            status: 'finish',
                                            result: data || []
                                        };

                                        dispatch({
                                            type: 'opens/updateWsRes',
                                            payload: _ws_res
                                        })

                                        send_ws_ret_id = null;


                                        callback && callback();
                                    } else {
                                        let _ws_res = cloneDeep(ws_res);

                                        _ws_res[open_api_now] = {
                                            status: 'running',
                                            result: data || []
                                        };

                                        dispatch({
                                            type: 'opens/updateWsRes',
                                            payload: _ws_res
                                        })

                                    }

                                }
                            }
                        })
                    }, 1000);

                }
            }
        })
    }

    // 停止轮询websocket
    const stopRunWs = () => {

        const params = {
            ret_id: send_ws_ret_id,
            connection_status_change: {
                type: 1,
            }
        };

        fetchSendOrStopWs(params).subscribe({
            next: (res) => {
                const { code } = res;

                if (code === 0) {
                    let _ws_res = cloneDeep(ws_res);

                    if (_ws_res[open_api_now]) {
                        _ws_res[open_api_now].status = 'finish';
                    }

                    dispatch({
                        type: 'opens/updateWsRes',
                        payload: _ws_res
                    })
                    clearInterval(send_ws_t);
                    send_ws_ret_id = null;
                }
            }
        })
    }

    // 发送websocket消息
    const sendWsMsg = (msg_type, msg) => {
        const params = {
            ret_id: send_ws_ret_id,
            connection_status_change: {
                type: 2,
                message_type: msg_type,
                message: msg
            }
        };

        fetchSendOrStopWs(params).subscribe();
    }

    // 运行dubbo接口
    const runDubbo = (callback) => {
        if (!open_api_now) {
            return;
        }
        const params = {
            team_id: sessionStorage.getItem('team_id'),
            target_id: open_api_now
        };
        fetchRunDubbo(params).subscribe({
            next: (res) => {
                const { data: { ret_id }, code } = res;

                if (code === 0 && ret_id) {
                    clearInterval(send_dubbo_t);

                    const params = {
                        ret_id,
                    };

                    send_dubbo_t = setInterval(() => {
                        fetchGetDubboResult(params).subscribe({
                            next: (res) => {
                                const { code, data } = res;

                                if (code !== 0 || data) {
                                    clearInterval(send_dubbo_t);
                                    let _dubbo_res = cloneDeep(dubbo_res);

                                    if (data) {
                                        _dubbo_res[open_api_now] = {
                                            ...data,
                                            status: 'finish'
                                        };
                                    } else {
                                        _dubbo_res[open_api_now] = {
                                            status: 'finish'
                                        };
                                    }

                                    dispatch({
                                        type: 'opens/updateDubboRes',
                                        payload: _dubbo_res
                                    })

                                    callback && callback();
                                }
                            }
                        })
                    }, 1000);

                }
            }
        })
    }

    // 停止轮询dubbo
    const stopRunDubbo = () => {
        let _dubbo_res = cloneDeep(dubbo_res);

        if (_dubbo_res[open_api_now]) {
            _dubbo_res[open_api_now].status = 'finish';
        }

        dispatch({
            type: 'opens/updateDubboRes',
            payload: _dubbo_res
        })
        clearInterval(send_dubbo_t);
    }

    // 新建open tabs item   参数 type:api/doc/websocket/folder/grpc id:打开的target_id
    useEventBus('addOpenItem', addOpenItem, [CURRENT_PROJECT_ID, open_apis, apiDatas]);

    // 修改当前选中targetID
    useEventBus('updateTargetId', updateTargetId, [CURRENT_PROJECT_ID]);

    // 修改当前target的值
    useEventBus('updateTarget', updateTarget, [open_apis]);

    // 添加open tabs item  通过obj
    useEventBus('addOpenItemByObj', addOpenItemByObj, [open_apis, CURRENT_PROJECT_ID]);

    // 移除opens 某一项
    useEventBus('removeOpenItem', removeOpenItem, [
        open_apis,
        open_api_now,
    ]);

    // 保存接口 ByID
    useEventBus('saveTargetById', saveTargetById, [open_apis, CURRENT_PROJECT_ID, CURRENT_TARGET_ID]);

    // 保存接口 ByObject （不修改open库）
    useEventBus('saveTargetByObj', saveTargetByObj, [open_apis, CURRENT_PROJECT_ID]);

    // 备份接口
    useEventBus('backupTargetById', backupTargetById, [open_apis, CURRENT_PROJECT_ID]);

    // 修改opens 数据 （包括indexedDB和redux）
    useEventBus('updateOpensById', updateOpensById, [open_apis]);

    // 修改Collection 数据 （包括indexedDB和redux）
    useEventBus('updateCollectionById', updateCollectionById, [CURRENT_PROJECT_ID]);

    // 克隆目标 ByID
    useEventBus('cloneTargetById', cloneTargetById, [open_apis, CURRENT_PROJECT_ID]);

    // 克隆目标 ByObj
    useEventBus('cloneTargetByObj', cloneTargetByObj, [open_apis, CURRENT_PROJECT_ID]);

    // 冲突数据对比
    useEventBus('compareJson', compareJson, []);

    // 重新加载标签页
    useEventBus('reloadOpens', reloadOpens, [CURRENT_PROJECT_ID]);

    //
    useEventBus('dragUpdateTarget', dragUpdateTarget);

    useEventBus('sendApi', sendApi, [open_api_now]);

    useEventBus('sendAutoReportApi', sendAutoReportApi, [debug_target_id, open_res]);

    useEventBus('stopSend', stopSend);

    useEventBus('toDeleteFolder', toDeleteFolder, [apiDatas, open_api_now]);

    useEventBus('copyApi', copyApi, [open_apis]);

    useEventBus('pasteApi', pasteApi, [apiDatas]);

    useEventBus('recordOpenApi', recordOpenApi, [open_apis, apiDatas]);

    useEventBus('openRecordApi', openRecordApi, [open_apis]);

    useEventBus('updateAutoReportApi', updateAutoReportApi, [debug_target_id]);

    useEventBus('saveSqlById', saveSqlById, [open_apis]);

    useEventBus('saveTcpById', saveTcpById, [open_apis]);

    useEventBus('saveMqttById', saveMqttById, [open_apis]);

    useEventBus('saveWsById', saveWsById, [open_apis]);

    useEventBus('saveDubboById', saveDubboById, [open_apis]);

    useEventBus('runSql', runSql, [open_api_now, sql_res]);

    useEventBus('connectTestDB', connectTestDB);

    useEventBus('connectTcp', connectTcp, [open_api_now, tcp_res]);

    useEventBus('stopRunTcp', stopRunTcp, [open_api_now, tcp_res]);

    useEventBus('sendTcpMsg', sendTcpMsg);

    useEventBus('connectWs', connectWs, [open_api_now, ws_res]);

    useEventBus('stopRunWs', stopRunWs, [open_api_now, ws_res]);

    useEventBus('sendWsMsg', sendWsMsg);

    useEventBus('runDubbo', runDubbo, [open_api_now, dubbo_res]);

    useEventBus('stopRunDubbo', stopRunDubbo, [open_api_now, dubbo_res]);
    // 初始化tabs
    // useEffect(() => {
    //     reloadOpens();
    // }, [CURRENT_PROJECT_ID]);
};

export default useOpens;
