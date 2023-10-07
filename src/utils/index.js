/* eslint-disable eqeqeq */
import * as jsondiffpatch from 'jsondiffpatch';
import { REQUEST_DIST } from '@constants/confilct';
import { FE_HOST } from '@config/client';
import Mock from 'mockjs';
import ATools, { isJson } from 'apipost-tools';
import IATools from 'apipost-inside-tools';
import { v4 as uuidV4 } from 'uuid';
import { getBaseCollection } from '@constants/baseCollection';
import JSON5 from 'json5';
import X2JS from 'x2js';
import jsonpath from 'jsonpath';
import { VARTYPES } from '@constants/typeList';
import { Message } from '@arco-design/web-react';
import i18next from 'i18next';

import copy from 'copy-to-clipboard'

import _, {
    isArray,
    isBoolean,
    isDate,
    isEmpty,
    isFunction,
    isInteger,
    isNull,
    isNumber,
    isObject,
    isPlainObject,
    isRegExp,
    isString,
    isUndefined,
    trim,
    cloneDeep,
    mergeWith,
} from 'lodash';
import Bus from './eventBus';
import dayjs from 'dayjs';

// 复制文本到剪切板
export const copyStringToClipboard = (str, showMessage = true) => {
    try {
        showMessage && Message.success(i18next.t('message.copyClipboard'));
        copy(str);
    } catch (error) {
        showMessage && Message.error(i18next.t('message.copyError'));
    }
};

// 邮箱教研
export const EamilReg = ATools.isEmail;

// 手机号校验
export const PhoneReg = (phone) => {
    if ((/^1[3456789]\d{9}$/.test(phone))) {
        return true;
    } else {
        return false;
    }
}

// 获取当前设备类型
export const getSystemPlatform = () => {
    const sUserAgent = navigator.userAgent.toLowerCase();

    const isWin =
        navigator.platform == 'Win32' || navigator.platform == 'Win64' || navigator.platform == 'wow64';

    const isMac =
        navigator.platform == 'Mac68K' ||
        navigator.platform == 'MacPPC' ||
        navigator.platform == 'Macintosh' ||
        navigator.platform == 'MacIntel';
    if (isMac) return 'Mac';
    const isUnix = navigator.platform == 'X11' && !isWin && !isMac;
    if (isUnix) return 'Unix';
    const isLinux = String(navigator.platform).indexOf('Linux') > -1;
    const bIsAndroid = sUserAgent.toLowerCase().match(/android/i) == 'android';
    if (isLinux) {
        if (bIsAndroid) return 'Android';
        return 'Linux';
    }
    if (isWin) {
        const isWin2K =
            sUserAgent.indexOf('Windows nt 5.0') > -1 || sUserAgent.indexOf('Windows 2000') > -1;
        if (isWin2K) return 'Win2000';
        const isWinXP =
            sUserAgent.indexOf('Windows nt 5.1') > -1 || sUserAgent.indexOf('Windows XP') > -1;
        sUserAgent.indexOf('Windows XP') > -1;
        if (isWinXP) return 'WinXP';
        const isWin2003 =
            sUserAgent.indexOf('Windows nt 5.2') > -1 || sUserAgent.indexOf('Windows 2003') > -1;
        if (isWin2003) return 'Win2003';
        const isWinVista =
            sUserAgent.indexOf('Windows nt 6.0') > -1 || sUserAgent.indexOf('Windows Vista') > -1;
        if (isWinVista) return 'WinVista';
        const isWin7 =
            sUserAgent.indexOf('Windows nt 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1;
        if (isWin7) return 'Win7';
        const isWin8 =
            sUserAgent.indexOf('windows nt 6.2') > -1 || sUserAgent.indexOf('Windows 8') > -1;
        if (isWin8) return 'Win8';
        const isWin10 =
            sUserAgent.indexOf('windows nt 10.0') > -1 || sUserAgent.indexOf('Windows 10') > -1;
        if (isWin10) return 'Win10';
    }
    return '其他';
};

export const isJSON = ATools.isJson;

export const setCookie = (name, value, expiredays) => {
    IATools.setCookie(name, value, FE_HOST || '', expiredays);
};

export const getCookie = IATools.getCookie;

// 保存本地localData数据 token....
export const saveLocalData = (data) => {
    const storage = window.localStorage;
    setCookie('token', data.token);
    storage.identity = data?.identity || '-1';
    storage.uuid = data?.user?.uuid || '-1';
};

export const isElectron = IATools.isElectron;
// 清除用户信息
export const clearUserData = () => {
    Bus.$emit('closeWs');
    localStorage.clear();
    sessionStorage.clear();
    setCookie('token', '');
};

export const getClipboardText = () =>
    new Promise((resolve, reject) => {
        navigator.clipboard
            .readText()
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject(new Error(''));
            });
    });

export const getSafeJSON = (text) => {
    try {
        const data = JSON.parse(text);
        return data;
    } catch (ex) {
        return null;
    }
};

export const getJSONObj = (text) => {
    try {
        const data = JSON.parse(text);
        return data;
    } catch (ex) {
        return text;
    }
};

const recursiveFolderPath = (path, sourceObj, pid, pidName = 'pid') => {
    if (pid && sourceObj[pid]) {
        path = `${sourceObj[pid].name}.${path}`;
        if (sourceObj[pid][pidName] && sourceObj[pid][pidName] != '0')
            return recursiveFolderPath(path, sourceObj, sourceObj[pid][pidName], pidName);
        return path;
    }
    return path;
};
export const array2NamePathObj = (
    items,
    newItems,
    idName = 'id',
    pidName = 'pid'
) => {
    try {
        const result = {};
        const sourceObj = {};
        items.forEach((item) => {
            sourceObj[item[idName]] = item;
        });
        for (const item of items) {
            const id = item[idName];
            const pid = item[pidName];
            if (!id || id == undefined) {
                continue;
            }
            if (item.target_type != 'folder') {
                const path = recursiveFolderPath(
                    `${item?.url}.${item?.method}.${item?.target_type}`,
                    sourceObj,
                    pid,
                    pidName
                );
                item.path = path;
                if (!result.hasOwnProperty(path)) {
                    result[path] = [];
                }

                result[path].push(id);
            } else {
                const path = recursiveFolderPath(
                    `${item?.name}.${item?.target_type}`,
                    sourceObj,
                    pid,
                    pidName
                );
                item.path = path;
                if (!result.hasOwnProperty(path)) {
                    result[path] = [];
                }

                result[path].push(id);
            }
            newItems.push(item);
        }
        return result;
    } catch (error) {
        return {};
    }
};

export const findSon = (res = [], list = [], target_id = -1) => {
    list.forEach((item) => {
        if (target_id === item.parent_id) {
            res.push(item);
            findSon(res, list, item.target_id);
        }
    });
};

export const findParent = (res = [], list = [], parent_id = -1) => {
    list.forEach((item) => {
        if (parent_id === item.target_id) {
            res.push(item);
            findParent(res, list, item.parent_id);
        }
    });
};

/**
 * 编辑器内容格式化
 */
export const EditFormat = (value) => {
    return ATools.beautifyRaw(value);
};

/**
 * 请求参数数组转对象
 * @return {[type]} [description]
 */
export const targetParameter2Obj = (parameter) => {
    const obj = {};
    if (!isEmpty(parameter)) {
        for (const _x in parameter) {
            if (parameter[_x] instanceof Array) {
                parameter[_x].forEach(function (item) {
                    if (item.key) {
                        obj[item.key] = {
                            description: item.description,
                            key: item.key,
                            not_null: `${item.not_null}`,
                            field_type: `${item.field_type}`,
                            type: item.type,
                        };
                    } else if (item.name) {
                        obj[item.name] = {
                            description: item.description,
                            name: item.name,
                            not_null: `${item.not_null}`,
                            field_type: `${item.field_type}`,
                            type: item.type,
                        };
                    }
                });
            } else if (typeof parameter[_x] == 'object') {
                obj[_x] = targetParameter2Obj(parameter[_x]);
            } else if (parameter[_x]) {
                obj[_x] = parameter[_x].toString().replace(/[\s\n\t]+/g, '');
            } else {
                obj[_x] = parameter[_x];
            }
        }
    }

    return obj;
};

export const arrayToTreeObject = (arr, idName = 'target_id', pidName = 'parent_id') => {
    return ATools.array2Tree(arr, idName, pidName);
};

// 打开树形目录
export const flatTreeItems = (nodes = [], sortFn) => {
    const nodeList = [];
    if (sortFn !== undefined) {
        nodes.sort(sortFn);
    }
    const dig = (childList = [], level) => {
        childList.forEach((item) => {
            nodeList.push({ ...item, level });

            const childItemList = item.children;
            if (sortFn !== undefined && childItemList !== undefined) {
                childItemList.sort(sortFn);
            }
            dig(childItemList, level + 1);
        });
    };
    dig(nodes, 1);
    return nodeList;
};

// 对比本地云端数据
export const jsonCompare = (server_json = {}, local_json = {}, type = 'api') => {
    const _clone_server_json = cloneDeep(server_json);
    const _clone_local_json = cloneDeep(local_json);

    // 清除不比对的项
    delete _clone_server_json.url;
    delete _clone_server_json.update_day;
    delete _clone_server_json.update_dtime;
    delete _clone_server_json.hash;
    delete _clone_server_json.is_changed;
    delete _clone_local_json.url;
    delete _clone_local_json.update_day;
    delete _clone_local_json.update_dtime;
    delete _clone_local_json.hash;
    delete _clone_local_json.is_changed;
    // 清楚本地数据请求list key值为空的值
    const arr = [
        '$.request.query.parameter',
        '$.request.header.parameter',
        '$.request.body.parameter',
        '$.request.header',
        '$.request.query',
        '$.request.body',
        '$.list',
        '$.env_vars',
    ];
    Object.keys(REQUEST_DIST[type]).forEach((k) => {
        if (arr.includes(k)) {
            let newList = jsonpath.query(_clone_local_json, k)[0];
            if (newList.length > 0) {
                newList = newList.filter((ite) => ite.key !== '');
                jsonpath.apply(_clone_local_json, k, () => newList);
            }
        }
    });

    // 开始比对
    const _delta_diffs = jsondiffpatch
        .create({
            objectHash: (obj) => obj._key || obj.key,
            textDiff: {
                minLength: 600000, // default value
            },
        })
        .diff(_clone_server_json, _clone_local_json);
    const list = [];
    if (_delta_diffs) {
        // eslint-disable-next-line guard-for-in
        for (const _path in REQUEST_DIST[type]) {
            const _diff_server_json_block = jsonpath.query(_clone_server_json, _path)[0];
            const _diff_block = jsonpath.query(_delta_diffs, _path)[0];

            if (_diff_block && typeof _diff_block == 'object') {
                let _local_changes = '';
                let _server_changes = '';

                if (_diff_block instanceof Array) {
                    // 字符串
                    _local_changes = _diff_block[1];
                    _server_changes = _diff_block[0];
                } else {
                    // 对象或数组
                    _local_changes = [];
                    _server_changes = [];

                    if (_diff_block._t == 'a') {
                        // 数组
                        for (const _d in _diff_block) {
                            if (_d != '_t') {
                                if (
                                    _d.substr(0, 1) == '_' &&
                                    isArray(_diff_block[_d]) &&
                                    _diff_block[_d][1] === 0 &&
                                    _diff_block[_d][2] === 0
                                ) {
                                    // removed
                                    // _local_changes.push(null);
                                    _server_changes.push(_diff_server_json_block[_d.substr(1)]);
                                } else if (isArray(_diff_block[_d])) {
                                    // added
                                    _local_changes.push(_diff_block[_d][0]);
                                    // _server_changes.push(null);
                                } else {
                                    // edited
                                    const _entries = [];
                                    if (_diff_server_json_block?.[_d]) {
                                        Object.keys(_diff_server_json_block[_d]).forEach(function (key) {
                                            _entries.push([key, _diff_server_json_block[_d][key]]);
                                        });
                                    }

                                    const _local = Object.fromEntries(new Map(_entries));
                                    const _server = Object.fromEntries(new Map(_entries));

                                    // eslint-disable-next-line no-prototype-builtins
                                    if (_diff_server_json_block?.[_d]?.hasOwnProperty('key')) {
                                        _local.key = _diff_server_json_block[_d].key;
                                        _server.key = _diff_server_json_block[_d].key;
                                    }

                                    for (const _field in _diff_block[_d]) {
                                        if (_diff_block[_d][_field] instanceof Array) {
                                            _server[_field] = _diff_block[_d][_field][0];
                                            _local[_field] = _diff_block[_d][_field][1];
                                        }
                                    }

                                    _local_changes.push(_local);
                                    _server_changes.push(_server);
                                }
                            }
                        }
                    } else {
                        // 对象
                        let _server = cloneDeep(_diff_server_json_block);
                        let _local = cloneDeep(_diff_server_json_block);

                        if (type == 'env' && _path == 'env_vars') {
                            _server = Object.values(jsonpath.query(server_json, _path)[0]);
                            // eslint-disable-next-line no-loop-func
                            _server.forEach((item, index) => {
                                _server[index].key = Object.keys(jsonpath.query(server_json, _path)[0])[index];
                            });
                            _local = Object.values(jsonpath.query(local_json, _path)[0]);
                            // eslint-disable-next-line no-loop-func
                            _local.forEach((item, index) => {
                                _local[index].key = Object.keys(jsonpath.query(local_json, _path)[0])[index];
                            });
                        } else {
                            for (const _d in _diff_block) {
                                if (_diff_block[_d] instanceof Array) {
                                    _server[_d] = _diff_block[_d][0];
                                    _local[_d] = _diff_block[_d][1];
                                }
                            }
                        }

                        _local_changes = _local;
                        _server_changes = _server;
                    }
                }

                // push 结果数组
                if (_local_changes || _server_changes) {
                    list.push({
                        title: REQUEST_DIST[type][_path],
                        jsonpath: _path,
                        delta: _diff_block,
                        local_changes: _local_changes || '',
                        server_changes: _server_changes || '',
                    });
                }
            }
        }
    }

    return list;
};

// 版本检查
export const versionCheck = (
    server_json = {},
    local_json = {},
    type = 'api',
    version = 1
) => {
    const list = jsonCompare(server_json, local_json, type);
    let name = local_json.name || '';
    if (name === '') {
        switch (type) {
            case 'global_descriptions':
                name = '参数描述库';
                break;
            case 'env':
                name = '环境变量';
                break;
            case 'global_paras':
                name = '全局参数';
                break;
            default:
                name = local_json.name || '暂无名称';
                break;
        }
    }
    const conflict = {
        server_json,
        local_json,
        version,
        list,
        name,
    };
    return conflict;
};

export const completionHttpProtocol = (data) => {
    return ATools.completionHttpProtocol(data);
};

export const completionWSProtocol = (data) => {
    if (isString(data)) {
        if (
            data.substr(0, 5).toLowerCase() !== 'ws://' &&
            data.substr(0, 6).toLowerCase() !== 'wss://'
        ) {
            data = `ws://${data}`;
        }
    } else if (isPlainObject(data) && data.hasOwnProperty('url')) {
        if (
            data.url.substr(0, 5).toLowerCase() !== 'ws://' &&
            data.url.substr(0, 6).toLowerCase() !== 'wss://'
        ) {
            data.url = `ws://${data.url}`;
        }
    }
    return data;
};

/**
 * 下载文件
 */
export const download = (data, name, type) => {

    const FileSaver = require('file-saver');
    if (!data) {
        return;
    }
    let saveAsData = data;
    // try {
    //   saveAsData = JSON.parse(data);
    // } catch (err) {
    // }

    if (isPlainObject(saveAsData)) {
        if (saveAsData.hasOwnProperty('data')) {
            saveAsData = new Int8Array(saveAsData.data);
        }
    }
    saveAsData = new Blob([saveAsData], {
        type: isString(type) ? type : 'application/zip',
    });
    FileSaver.saveAs(saveAsData, name);
};

/**
 * 校验是不是正确的 URL
 * @param url String
 * @return {Boolean}
 */
export const isURL = (_url) => {
    if (!_url) {
        return false;
    }
    _url = trim(_url);
    return (
        _url.substr(0, 7).toLowerCase() === 'http://' || _url.substr(0, 8).toLowerCase() === 'https://'
    );
};

/**
 * 创建URL 对象
 * @param _url String
 * @return {URLObj}
 */
export const createUrl = (_url) => {
    if (typeof _url !== 'string') {
        _url += '';
    }
    if (!isURL(_url)) {
        _url = `http://${_url}`;
    }

    const hostReg = /(http([s]?):\/\/)([^\/\?\\#]*)([\/|\?|\\#]?)/i;
    const host_arr = _url.match(hostReg);
    const protocol = host_arr[1];
    const host = host_arr[3];

    // 主域部分
    const origin = protocol + host;

    // 剩下部分
    _url = `https://www.runnergo.cn${_url.substring(origin.length)}`;

    let urls = {};
    try {
        urls = new URL(_url);
    } catch {
        const http_url = `https://www.runnergo.cn${_url.substring(origin.length)}`;
        const a = document.createElement('a');
        a.href = http_url;
        urls = {
            source: _url,
            href: a.href,
            protocol: a.protocol,
            host: a.hostname,
            hostname: a.hostname,
            port: a.port,
            origin: a.origin,
            search: a.search,
            pathname: a.pathname,
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || ['', ''])[1],
            hash: a.hash,
        };
    }
    return urls;
};



export const GetUrlQuery = (uri) => {
    let url = '';
    if (typeof uri === 'undefined') {
        url = window.location.search;
    } else {
        url = `?${uri.split('?')[1]}`;
    }
    const theRequest = {};
    if (url.indexOf('?') !== -1) {
        const str = url.substr(1);
        const strs = str.split('&');
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
        }
    }
    return theRequest;
};

export const GetUrlQueryToArray = (url) => {
    return ATools.getUrlQueryArray(url);
};

export const multiObj2simpleObj = (obj) => {
    // eslint-disable-next-line guard-for-in
    for (const x in obj) {
        if (typeof obj[x] === 'object') {
            if (obj[x] instanceof Array) {
                if (obj[x][0]) {
                    obj[x] = [obj[x][0]];
                } else {
                    obj[x] = [];
                }
            }
            const res = multiObj2simpleObj(obj[x]);
            if (res) {
                obj[x] = res;
            }
        }
    }
    return obj;
};
export const arrayObj2simpleObj = (obj) => {
    for (const x in obj) {
        if (typeof obj[x] === 'object') {
            if (obj[x] instanceof Array) {
                obj[x] = obj[x][0] ? obj[x][0] : {};
            }
            if (obj[x]) {
                arrayObj2simpleObj(obj[x]);
            }
        }
    }
};

export const getVarType = (data) => {
    let type = 'Any';
    const isFuc = {
        Array: isArray,
        Boolean: isBoolean,
        Date: isDate,
        Function: isFunction,
        NaN: isNaN,
        Number: isNumber,
        Integer: isInteger,
        Object: isObject,
        RegExp: isRegExp,
        String: isString,
        Undefined: isUndefined,
        Null: isNull,
    };

    VARTYPES.forEach((t) => {
        if (isFuc.hasOwnProperty(t) && isFuc[t](data)) {
            type = t;
        }
    });
    return type;
};

export const multiObj2singleObj = (obj, pre = '', target_id = 0) => {
    const singleObj = {};
    if (pre === '') {
        arrayObj2simpleObj(obj);
    }

    for (const x in obj) {
        if (isPlainObject(obj[x]) && !isEmpty(obj[x]) && typeof obj[x] === 'object') {
            singleObj[pre + x] = '';
            const tmp = multiObj2singleObj(obj[x], `${pre + x}.`, target_id);

            // eslint-disable-next-line guard-for-in
            for (const n in tmp) {
                Object.assign(singleObj, tmp);
            }
        } else {
            singleObj[pre + x] = {
                type: getVarType(obj[x]),
                value: obj[x],
                description: '',
                jsonpath: jsonpath.stringify((pre + x).split('.')),
            };
        }
    }
    return singleObj;
};

/**
 * 获取json中的注释 type、value
 * @param  json
 */
const getJsonComment = (json) => {
    try {
        return multiObj2singleObj(
            JSON5.parse(
                json.replace(/:\s*['|\"]?.*['|\"]?\s*[,]?\s*(\/\/\s*.*?)(?:\r|\n|$)/gi, ':"$1", \n')
            )
        );
    } catch (e) {
        return null;
    }
};

/**
 * JSON | XML 提取字段描述
 * @param {JOSN || XML} jsonStr 待处理json，XMl字符串
 * @param {Array} _descList 描述列表
 * @return {Array} 带参数列表list
 */
export const JsonXml2Obj = (json, _descList, Parameter) => {
    const returnList = [];
    let jsonStr = json;
    if (IATools.isXml(jsonStr)) {
        const x2js = new X2JS();
        jsonStr = JSON5.stringify(x2js.xml2js(jsonStr));
    }

    // 需要修改
    if (ATools.isJsonp(jsonStr)) {
        jsonStr = ATools.jsonp2Obj(jsonStr);
    }
    if (isJSON(jsonStr)) {
        try {
            jsonStr = Mock.mock(JSON.parse(jsonStr));
        } catch (error) {
            jsonStr = JSON.parse(jsonStr);
        }
    } else if (ATools.isJson5(jsonStr)) {
        try {
            jsonStr = Mock.mock(JSON5.parse(jsonStr));
        } catch (e) {
            jsonStr = JSON5.parse(jsonStr);
        }
        if (isArray(jsonStr)) {
            if (jsonStr.length > 0) {
                json = trim(json, '[]');
                jsonStr = jsonStr[0];
            } else {
                jsonStr = {};
            }
        }
    } else {
        Message.error('当前仅支持JSON、XML格式的快速提取，其他格式请手动添加');
        return [];
    }
    const lists = multiObj2singleObj(jsonStr);
    // eslint-disable-next-line guard-for-in
    for (const item in lists) {
        const c = getJsonComment(json);
        if (
            c &&
            c[item] &&
            (c[item].type == 'String' || c[item].type == 'Integer') &&
            String(c[item].value).substr(0, 2) == '//'
        ) {
            const d = c[item].value
                .substr(2)
                .replace(/\s*\[n\]\s*/gi, '\n')
                .trim();

            if (d != '') {
                lists[item].description = d;
                if (isArray(window.JC_COMMENTS_DB)) {
                    window.JC_COMMENTS_DB.push({
                        key: item,
                        description: lists[item].description,
                    });
                }
            }
        } else {
            // 从现有参数描述库读取 todo...
            const splitArr = item.split('.');
            const splitStr = splitArr[splitArr.length - 1];
            let Aidesc = '';
            const aiArr = _descList.filter((it) => !!it && (it.key === item || it.key === splitStr))[0];
            if (aiArr) {
                Aidesc = aiArr?.description;
            }
            if (isString(lists[item]?.description)) {
                lists[item].description =
                    Parameter.filter((it) => it.key === item)[0]?.description || Aidesc;
            }
        }

        const field_type = lists[item].type;

        lists[item] = lists[item] === null || lists[item] === undefined ? '' : lists[item];
        returnList.push({
            key: item,
            value: !isObject(lists[item]?.value) ? lists[item]?.value : '',
            description: lists[item]?.description || '',
            not_null: Parameter.filter((it) => it.key === item)[0]?.not_null || 1,
            field_type,
            type: 'Text',
            is_checked: 1,
        });
    }
    // returnList.push({
    //   is_checked: 1, // 是否选中
    //   type: '类型', // 类型
    //   key: '', // 参数名
    //   value: '', // 参数值
    //   description: '', // 参数描述/订单描述
    //   field_type: 'Text',
    // });
    return returnList;
};

export const timeStatus = (time) => {
    time = +time;
    let str = '';
    if (time < 1000) {
        str = `${time.toFixed(2)}ms`;
    } else if (time < 1000 * 60) {
        str = `${(time / 1000).toFixed(2)}s`;
    } else if (time < 1000 * 60 * 60) {
        str = `${(time / (1000 * 60)).toFixed(2)}m`;
    } else if (time < 1000 * 60 * 60 * 24) {
        str = `${time / (1000 * 60 * 60).toFixed(2)}h`;
    }
    return str;
};

export const sizeFormat = (size) => {
    if (size < 1024) {
        return `${size}B`;
    }
    if (size >= 1024 && size < Math.pow(1024, 2)) {
        return `${parseFloat(size / 1024).toFixed(2)}KB`;
    }
    if (size >= Math.pow(1024, 2) && size < Math.pow(1024, 3)) {
        return `${parseFloat(size / Math.pow(1024, 2)).toFixed(2)}MB`;
    }
    if (size > Math.pow(1024, 3)) {
        return `${parseFloat(size / Math.pow(1024, 3)).toFixed(2)}GB`;
    }
    return `${0}B`;
};
// 字符串转base64
const str2Base64 = (str) => {
    // 对字符串进行编码
    const encode = encodeURI(str);

    // 对编码的字符串转化base64
    const base64 = btoa(encode);

    return base64;
};

// 字符串转16进制
const string2Hex = (str) => {
    let val = '';
    for (let i = 0; i < str.length; i++) {
        if (val == '') val = str.charCodeAt(i).toString(16);
        else val += `,${str.charCodeAt(i).toString(16)}`;
    }
    return val;
};

// 处理socket消息通过类型
export const hanldeSocketMessageByType = (message, type) => {
    switch (type) {
        case 'Text':
            message = String(message);
            break;
        case 'Json':
            message = String(message);
            break;
        case 'Base64':
            message = str2Base64(message);
            break;
        case 'Hexadecimal':
            message = string2Hex(message);
            break;
        default:
            break;
    }

    return message;
};

/*
 * 获取光标所在位置
 */
export const iGetFieldPos = (dom) => {
    const field = dom;
    if (document.selection) {
        // IE
        // $(this).focus();
        const sel = document.selection;
        const range = sel.createRange();
        const dupRange = range.duplicate();
        dupRange.moveToElementText(field);
        dupRange.setEndPoint('EndToEnd', range);
        field.selectionStart = dupRange.text.length - range.text.length;
        field.selectionEnd = field.selectionStart + range.text.length;
    }
    return field.selectionStart;
};

// 获取光标在文本框的位置
export const getFocus = (elem) => {
    let index = 0;
    if (document.selection) {
        // IE Support
        elem.focus();
        const Sel = document.selection.createRange();
        if (elem.nodeName === 'TEXTAREA') {
            // textarea
            const Sel2 = Sel.duplicate();
            Sel2.moveToElementText(elem);
            let index = -1;
            while (Sel2.inRange(Sel)) {
                Sel2.moveStart('character');
                index++;
            }
        } else if (elem.nodeName === 'INPUT') {
            // input
            Sel.moveStart('character', -elem.value.length);
            index = Sel.text.length;
        }
    } else if (elem.selectionStart || elem.selectionStart == '0') {
        // Firefox support
        index = elem.selectionStart;
    }
    return index;
};

// 流程测试选择文件
export const str2testData = (_str) => {
    let returnList = [];
    let jsonObj;
    if (!isJSON(_str)) {
        jsonObj = _str.split(/((\r\n)|[\r\n])+/gi);
        let testDataheader = [];
        for (const x in jsonObj) {
            if (typeof jsonObj[x] === 'string' && jsonObj[x].length > 0) {
                const row = `${jsonObj[x]}`;
                if (_.trim(row).length > 0) {
                    const kv = jsonObj[x].split(',');
                    if (x == 0) {
                        testDataheader = kv;
                    } else {
                        const obj = {};
                        for (let index = 0; index < testDataheader.length; index++) {
                            const name = String(testDataheader[index]);
                            if (!obj[name]) {
                                try {
                                    if (kv[index]) {
                                        obj[name] = String(kv[index]);
                                    } else {
                                        obj[name] = '';
                                    }
                                } catch (error) {
                                    obj[name] = '';
                                }
                            }
                        }
                        returnList.push(obj);
                    }
                }
            }
        }
    } else {
        jsonObj = JSON.parse(_str);
        if (jsonObj instanceof Array) {
            returnList = jsonObj;
        } else {
            for (const key in jsonObj) {
                if (!isString(jsonObj[key])) jsonObj[key] = '';
            }
            returnList.push(jsonObj);
        }
    }
    return returnList;
};

/**
 * 根据url生成URL 对象
 */
export const NewURL = (_url) => {
    if (typeof _url !== 'string') {
        _url += '';
    }

    let http_url = _url;
    const hostReg = /(http([s]?):\/\/)([^\/\?\\#]*)([\/|\?|\\#]?)/i;

    if (!isURL(_url)) {
        http_url = `http://${_url}`;
    } else {
        http_url = _url;
    }
    const host_arr = http_url.match(hostReg);
    const protocol = host_arr[1];
    const host = host_arr[3];
    const hs = host.split(':');
    const hostname = hs[0];
    const port = hs[1] ? hs[1] : '';

    // 主域部分
    const origin = protocol + host;

    // 剩下部分
    http_url = `https://www.apipost.cn${http_url.substring(origin.length)}`;

    let urls = {};
    try {
        const tmp_urls = new URL(http_url);
        const searchParams = new URLSearchParams(tmp_urls.search);
        tmp_urls.params = {};

        for (const x of searchParams) {
            tmp_urls.params[x[0]] = x[1];
        }

        for (const x of tmp_urls) {
            urls[x] = tmp_urls[x];
        }
    } catch (e) {
        const a = document.createElement('a');
        a.href = http_url;
        urls = {
            source: _url,
            href: a.href,
            protocol: a.protocol,
            host: a.hostname,
            hostname: a.hostname,
            port: a.port,
            origin: a.origin,
            search: a.search,
            params: (function () {
                const ret = {};
                const seg = a.search.replace(/^\?/, '').split('&');
                const len = seg.length;
                let i = 0;
                let s;
                for (; i < len; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    s = seg[i].split('=');
                    ret[s[0]] = s[1];
                }
                return ret;
            })(),
            pathname: a.pathname,
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
            hash: a.hash,
        };

        if (urls.port) {
            urls.host = `${urls.host}:${urls.port}`;
        }
    }

    if (urls.host) {
        urls.host = urls.host.replace(/%7B/g, '{').replace(/%7D/g, '}');
    }

    let hash = urls.hash;

    if (hash.substring(0, 1) === '#') {
        hash = hash.substring(1);
    }
    const res_urls = {
        protocol,
        host,
        hostname,
        origin,
        port,
        search: urls.search,
        params: urls.params,
        pathname: urls.pathname,
        hash,
    };

    if (!isURL(_url) && res_urls.origin) {
        res_urls.origin = res_urls.origin.substring(7);
    }

    return res_urls;
};

/**
 * 获取匹配path的数组
 */
export const pathArr = (array) => {
    let endIndex = '';
    let startIndex = '';
    const temp = [];
    for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if (item !== '') {
            if (startIndex === '') {
                startIndex = index;
            }
            endIndex = index + 1;
            let str = '';
            for (let index = startIndex; index < endIndex; index++) {
                str = `${str}/${array[index]}`;
            }
            temp.push(str);
            if (endIndex === array.length) {
                break;
            }
        }
    }
    temp.push('/');
    return temp;
};
export const openUrl = (url) => {
    // if (isElectron()) {
    //     const { shell } = window?.electron || {};
    //     const token = getCookie('token');
    //     // BASE_URL/api/uc?url=&token=
    //     const _res = shell.openExternal(
    //         `${FE_BASEURL}/api/uc?hash_token=${token}&reffer=${encodeURI(url)}`
    //     );

    //     if (!_res) {
    //         window.open(url);
    //     }
    // } else {
    window.open(url);
    // }
};
export const customizer = (objValue, srcValue) => {
    if (Object.prototype.toString.call(objValue) == Object.prototype.toString.call(srcValue)) {
        return srcValue;
    }
    return objValue;
};
export const completionTarget = (target) => {
    const templateData = getBaseCollection(target?.target_type);
    return mergeWith(templateData, target, customizer);
};


export const spliceIntoChunks = (arr, chunkSize) => {
    const res = [];
    while (arr.length > 0) {
        const chunk = arr.splice(0, chunkSize);
        res.push(chunk);
    }
    return res;
};

// 格式化场景管理中的数据
export const formatSceneData = (nodes, edges) => {
    const idArray = [];
    const sourceArray = [];
    const targetArray = [];
    const firstNodeArray = [];
    const lastNodeArray = [];

    for (let i of nodes) {
        idArray.push(i.id);
    }

    for (let i of edges) {
        targetArray.push(i.target);
        sourceArray.push(i.source);
    }

    for (let i of idArray) {
        if (targetArray.indexOf(i) === -1) {
            firstNodeArray.push(i);
        }
        if (sourceArray.indexOf(i) === -1) {
            lastNodeArray.push(i)
        }
    }

    let data = [];

    const getNode = (id, nodes) => {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id) {
                return nodes[i];
            }
        }
    }

    for (let i of firstNodeArray) {
        data.push([getNode(i, nodes)]);
    }

    const getTarget = (id, edges) => {
        let targets = [];

        edges.forEach(item => {
            if (item.source === id) {
                if (lastNodeArray.includes(item.target)) {
                    targets.push(getNode(item.target, nodes));
                } else {
                    targets.push([getNode(item.target, nodes)]);
                }
            }
        })
        if (targets.length === 1) {
            targets = lastNodeArray.includes(targets[0]) ? targets[0] : targets;
        }
        return targets;
    }



    const loopGetChild = (data) => {
        data.forEach(item => {
            if (Array.isArray(item)) {
                let res = getTarget(item[0].id, edges);
                if (Array.isArray(res)) {
                    item.push(loopGetChild(res));
                } else {
                    item.push(res);
                }
            }
        })

        return data;
    }

    loopGetChild(data);

    return data;
}
// 将数据模型转换成json-schema
export const parseModelToJsonSchema = async (model, parentModels = []) => {
    const result = cloneDeep(model);
    if (isString(result?.ref)) {
        const md5Key = uuidV4().replace(/\-/g, '');
        result.APIPOST_ORDERS = [md5Key];
        result.APIPOST_REFS = {
            [md5Key]: {
                ref: result?.ref,
            },
        };
        result.properties = {};
        result.type = 'object';
        delete result.ref;
    }
    if (isArray(result?.type) && result?.type.length > 0) {
        result.type = result.type[0];
    }
    if (result?.type === 'array') {
        result.items = await parseModelToJsonSchema(result.items, parentModels);
    }
    if (result?.type !== 'object') {
        return result;
    }

    // 将所有的ref信息从库里读出来
    const refData = {};

    // const nodeRefsData = result?.APIPOST_REFS || {};
    // for (const key in nodeRefsData) {
    //   const data = nodeRefsData[key];
    //   if (!isString(data?.ref)) {
    //     continue;
    //   }
    //   // eslint-disable-next-line no-await-in-loop
    //   const dataModel = await getModelItem(data?.ref);
    //   const overrideData = data?.APIPOST_OVERRIDES ?? {};
    //   if (parentModels?.includes(dataModel?.model_id)) {
    //     continue;
    //   }

    //   // eslint-disable-next-line no-await-in-loop
    //   const newData: any = await parseModelToJsonSchema(dataModel?.schema || {}, [
    //     ...parentModels,
    //     dataModel.model_id,
    //   ]);
    //   newData.properties = merge(overrideData, newData.properties || {});

    //   //  重新排序
    //   if (isArray(newData?.APIPOST_ORDERS)) {
    //     const newProperties = [];
    //     for (const dataKey of newData?.APIPOST_ORDERS) {
    //       newProperties.push([dataKey, newData?.properties?.[dataKey]]);
    //     }
    //     newData.properties = Object.fromEntries(newProperties);
    //   }
    //   delete newData.APIPOST_OVERRIDES;
    //   delete newData.APIPOST_REFS;
    //   delete newData.APIPOST_ORDERS;
    //   refData[key] = newData;
    // }

    //
    if (isArray(result?.APIPOST_ORDERS)) {
        // const newProperties = {};
        const newProperties = [];
        let requireds = isArray(result?.required) ? result.required : [];
        for (const key of result?.APIPOST_ORDERS) {
            if (isPlainObject(refData?.[key]?.properties)) {
                Object.entries(refData?.[key]?.properties).forEach(([refKey, refValue]) => {
                    newProperties.push([refKey, refValue]);
                });
            } else if (isPlainObject(result?.properties?.[key])) {
                newProperties.push([key, result?.properties?.[key]]);
            }

            const required = refData?.[key]?.required;
            if (isArray(required)) {
                requireds = requireds.concat(required);
            }
        }
        result.required = requireds;
        result.properties = Object.fromEntries(newProperties);
    }

    // 递归对内部元素再次解析
    for (const modelKey in result.properties) {
        const modelData = result.properties[modelKey];
        // eslint-disable-next-line no-await-in-loop
        result.properties[modelKey] = await parseModelToJsonSchema(modelData, parentModels);
    }
    delete result.APIPOST_ORDERS;
    delete result.APIPOST_REFS;
    delete result.APIPOST_OVERRIDES;
    return result;
};

export const FotmatTimeStamp = (timeStamp, format) => {
    try {
        let time_temp = `${timeStamp}`;
        if (time_temp.length === 10) {
            time_temp = time_temp * 1000;
        }
        time_temp = parseInt(time_temp, 10);

        return dayjs(time_temp).format(format);
    } catch (error) {
        return '-';
    }
}

export const array2ArcoTree = (items, fieldNames = {}) => {
    try {
        const tempFieldNames = {
            keyName: 'target_id',
            titleName: 'name',
            pidName: 'parent_id',
            ...fieldNames
        }
        const result = [];
        const itemMap = {};
        for (const item of items) {
            const id = item[tempFieldNames.keyName];
            const pid = item[tempFieldNames.pidName];
            if (!id || id == undefined) {
                continue;
            }
            if (!itemMap.hasOwnProperty(id)) {
                itemMap[id] = {
                    children: [],
                }
            }

            itemMap[id] = {
                ...item,
                key: id,
                title: item[tempFieldNames.titleName],
                children: itemMap[id]['children']
            }

            const treeItem = itemMap[id];
            if (pid == 0 || pid == undefined) {
                result.push(treeItem);
                result.sort((a, b) => a?.sort - b?.sort);
            } else {
                if (!itemMap.hasOwnProperty(pid)) {
                    itemMap[pid] = {
                        children: [],
                    }
                }
                itemMap[pid].children.push(treeItem);
                itemMap[pid].children.sort((a, b) => a?.sort - b?.sort);
            }
        }
        return result;
    } catch (error) {
        return [];
    }
}

export const filterArcoTree = (tree, key) => {
    if (!isArray(tree)) {
        return [];
    }
    for (let index = 0; index < tree.length; index++) {
        const item = tree[index];
        if (item.key === key) {
            tree.splice(index, 1)
            return tree;
        }
        if (isArray(item?.children)) {
            item.children = filterArcoTree(item.children, key);
        }
    }

    return tree;
}

// 根据json的key生成key所在的路径
export const findPathForKey = (json, keyToFind, currentPath = '') => {
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            const currentKeyPath = currentPath ? `${currentPath}.${key}` : key;

            if (key === keyToFind) {
                return currentKeyPath;
            }

            if (typeof json[key] === 'object') {
                const nestedResult = findPathForKey(json[key], keyToFind, currentKeyPath);
                if (nestedResult) {
                    return nestedResult;
                }
            }
        }
    }

    return null;
};


// 将json数据导出为json文件
export const exportJsonFile = (json, filename) => {
    let jsonDataStr = isJSON(json) ? json : JSON.stringify(json, null, 2);
    let blob = new Blob([jsonDataStr], { type: "application/json" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);

    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

const hasNonFolderChildren = (node, list) => {
    if (node?.target_type !== 'folder') {
        return true; // 如果当前节点不是目录，返回 true
    }

    for (let index = 0; index < list.length; index++) {
        const item = list[index];
        if (node?.target_id == item?.parent_id) {
            if (hasNonFolderChildren(item, list)) {
                return true;
            }
        }
    }
    return false;
}

// 移除空文件夹
export const removeEmptyFolders = (arr) => {
    // 创建一个新的空数组，用来存放结果
    let result = [];
    // 遍历原数组的每个元素
    for (let item of arr) {
        // 如果元素的target_type不是folder，就直接加入结果数组
        if (item.target_type !== "folder") {
            result.push(item);
        } else {
            // 否则，判断元素是否有子节点
            // 创建一个标志变量，初始值为false
            // let hasChild = false;
            // // 再次遍历原数组，查找是否有其他元素的parent_id等于当前元素的target_id
            // for (let other of arr) {
            //     if (other.parent_id === item.target_id) {
            //         // 如果找到了，就将标志变量设为true，并跳出循环

            //         hasChild = true;
            //         break;
            //     }
            // }
            // // 如果标志变量仍为false，说明当前元素没有子节点，就不加入结果数组
            // // 如果标志变量为true，说明当前元素有子节点，就加入结果数组
            // if (hasChild) {
            //     result.push(item);
            // }

            if (arr.find(elem => elem.parent_id === item.target_id) && hasNonFolderChildren(item,arr)) {
                result.push(item);
            }
        }
    }
    // 返回结果数组
    return result;
}

// 将key-value的tree data转换为arco tree需要的children连接的数据
export const buildTree = (data, renderName) => {
    if (isArray(data)) {
        return data;
    }
    let _data = Object.values(data);
    let root = _data.filter(item => item.parent_id === "0").map(item => {
        if (renderName) {
            return {
                ...item,
                render_name: item.target_type !== 'folder' ? `[${item.method}] ${item.name}` : `${item.name}`
            }
        } else {
            return item;
        }
    });

    const getChildren = (data, target_id, visited) => {
        const children = data.filter(item => item.parent_id === target_id).map(item => {
            if (renderName) {
                return {
                    ...item,
                    render_name: item.target_type !== 'folder' ? `[${item.method}] ${item.name}` : `${item.name}`
                }
            } else {
                return item;
            }
        });
        children.forEach(child => {
            if (child.target_type !== "folder") return;

            if (!visited.includes(child.target_id)) {
                visited.push(child.target_id);
                child.children = getChildren(data, child.target_id, visited);
            }

        });

        return children;
    }

    let visitedNodes = [];
    for (let i = 0; i < root.length; i++) {
        root[i].children = getChildren(_data, root[i].target_id, visitedNodes);
    }

    return root;
}

// 返回所有树形children节点的key
export const getAllKeys = (data, check, field = 'key') => {
    if (!isArray(data) || !(data.length > 0) || !check) {
        return [];
    }
    // 定义一个空数组，用来存放key
    let keys = [];
    // 定义一个递归函数，用来遍历树形数据的每个节点
    const traverse = (node) => {
        // 如果节点有key属性，就将其添加到数组中
        if (node[field]) {
            keys.push(node[field]);
        }
        // 如果节点有children属性，就遍历其子节点
        if (node.children) {
            for (let child of node.children) {
                traverse(child);
            }
        }
    }
    // 调用递归函数，从根节点开始遍历
    for (let i = 0; i < data.length; i++) {
        traverse(data[i]);
    }
    // 返回数组
    return keys;
};

// 模糊搜索arco tree结构数据
export const arcoTreeSearch = (data, searchTerm) => {
    const loop = (data) => {
        const result = [];
        data.forEach((item) => {
            if (item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                result.push({ ...item });
            } else if (item.children) {
                const filterData = loop(item.children);

                if (filterData.length) {
                    result.push({ ...item, children: filterData });
                }
            }
        });
        return result;
    };

    return loop(data);
};

// 判断B数组内是否完全包含A数组内的所有元素(基本类型)
export const isArrayFullyContained = (A, B) => {
    for (let i = 0; i < A.length; i++) {
        if (B.indexOf(A[i]) === -1) {
            return false;
        }
    }
    return true;
};

// 检查环境名是否需要tooltip展示
export const checkNameTooltip = (name, size = 100) => {
    const span = document.createElement('span');
    span.innerText = name;

    document.body.appendChild(span);

    let showTooltip = span.offsetWidth > size;

    document.body.removeChild(span);

    return showTooltip;
}


export default {
    copyStringToClipboard, // 复制字符串
    getClipboardText, // 获取剪贴板中文本内容
    EamilReg, // 邮箱检验
    getSystemPlatform, // 获取当前设备类型
    isJSON, // 判断数据是否为json
    setCookie, // 设置cookie
    getCookie, // 获取cookie
    saveLocalData, // 保存本地localData数据 token等等
    isElectron, // 当前环境是否为electron
    clearUserData, // 退出登陆 清楚用户信息
    getSafeJSON, // string转JSON
    getJSONObj, // string转json，如是对象直接返回
    array2NamePathObj, // 生成名字路径对象
    findSon, // 递归查找所有子集
    findParent, // 递归查找所有父集
    EditFormat, // 格式化编辑器
    targetParameter2Obj, // 请求参数数组转对象
    arrayToTreeObject, // 扁平数据转树状结构
    flatTreeItems, // 打开树形目录
    jsonCompare, // 数据对比
    versionCheck, // 冲突内容检查
    completionHttpProtocol, // 补齐http协议开头
    completionWSProtocol, // 补齐ws协议开头
    download, // 下载文件
    isURL, // 校验是不是正确的 URL
    createUrl, // 创建URL 对象
    GetUrlQuery, // 获取url query
    GetUrlQueryToArray, // 获取url中的query数据（数组）。
    multiObj2simpleObj,
    timeStatus,
    sizeFormat,
    hanldeSocketMessageByType, // 处理socket消息通过类型
    iGetFieldPos, // 获取光标位置
    getFocus, // 获取光标在文本框的位置
    str2testData, // 测试数据csv转换
    NewURL,
    pathArr, // 获取匹配path的数组
    openUrl,
    completionTarget, // 补全target数据
    spliceIntoChunks,
    customizer,
    PhoneReg,
    parseModelToJsonSchema,
    FotmatTimeStamp,
    array2ArcoTree,
    filterArcoTree,
    findPathForKey, // 根据json的key生成key所在的路径
    exportJsonFile, // 将json数据导出为json文件
    removeEmptyFolders, // 移除空文件夹
    buildTree, // 将key-value的tree data转换为arco tree需要的children连接的数据
    getAllKeys, // 返回所有树形节点的key
    arcoTreeSearch, // 模糊搜索arco tree结构数据
    isArrayFullyContained, // 判断B数组内是否完全包含A数组内的所有元素(基本类型)
    checkNameTooltip, // 检查名称是否需要tooltip展示
};
