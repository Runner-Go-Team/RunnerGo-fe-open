import { getCookie } from '@utils/cookie';
import isString from 'lodash/isString';
import prependHttp from 'prepend-http';
import parseUrl from 'url-parse';
import { isUndefined, isArray, isFunction, isNumber } from 'lodash';

export const isLogin = () => {
    const token = getCookie('token');
    const expire_time_sec = localStorage.getItem('expire_time_sec');
    const isExpire = new Date().getTime() < expire_time_sec;
    return (
        isString(token) && token !== 'NOLOGIN' && token.length > 0 && isExpire
    );
};

export const isClient = () => {
    return true;
};

export const onlineStatus = () => {
    return true;
};

export const isMac = () => /macintosh|mac os x/i.test(navigator.userAgent);

//
export const urlParseLax = (url, options) => {
    if (typeof url !== 'string') {
        return '';
        throw new TypeError(
            `Expected \`url\` to be of type \`string\`, got \`${typeof url}\` instead.`
        );
    }
    const finalUrl = prependHttp(url, options);
    return parseUrl(finalUrl);
};

// Array转树形结构对象
export const arrayToTreeObject = (data, params) => {
    const { key = 'target_id', parent = 'parent', children = 'children' } = params;

    const treeData = {};
    const rootData = [];
    if (!Array.isArray(data)) {
        return [];
    }
    // step1.把数字转换成对象
    data.forEach((item) => {
        treeData[item[key]] = {
            ...item,
            // key: item[key],
            [parent]: item[parent],
        };
    });

    for (let i = 0; i < data.length; i++) {
        const itemKey = data[i][key];
        const item = treeData[itemKey];
        const parentNode = treeData[item[parent]];
        if (isUndefined(parentNode)) {
            // parent未定义说明被放在了根节点下
            if (item[parent] === '0') {
                rootData.push(item);
            }
        } else {
            if (!isArray(parentNode[children])) {
                parentNode[children] = [];
            }
            try {
                parentNode[children].push(item);
            } catch (ex) { }
        }
    }

    return rootData;
};

// 树形菜单数据转List

export const treeListToFlattenList = (treeList, childKey = 'children') => {
    const list = [];

    const dig = (childList) => {
        if (!isArray(childList)) {
            return;
        }
        childList.forEach((item) => {
            const itemChild = item[childKey];
            if (!isUndefined(item[childKey])) {
                delete item[childKey];
            }
            list.push(item);
            dig(itemChild);
        });
    };
    dig(treeList);

    return list;
};

// export const flattenTreeData = (dataList, expandKeys, params, nodeSort) => {
//     // step1:  先转成树Object List
//     const treeObjList = arrayToTreeObject(dataList, params);
//     const flattenList = [];
//     const digFind = (list, parent = null) => {
//         list && list.forEach((item) => {
//             const childList = item[params.children];
//             // delete item[params.children];
//             flattenList.push(item);
//             if (expandKeys[item[params.key]] === true) {
//                 if (isFunction(nodeSort)) {
//                     childList['sort'] && childList.sort(nodeSort);
//                 }
//                 digFind(childList);
//             }
//         });
//     };
//     if (isFunction(nodeSort)) {
//         treeObjList['sort'] && treeObjList.sort(nodeSort);
//     }

//     digFind(treeObjList);
//     return flattenList;
// };

export const bindSafeHtml = (data, nullValue = '-') => {
    if (isUndefined(data)) {
        return nullValue;
    }
    if (isNumber(data) && data === 0) {
        return `${data}`;
    }
    if (isString(data) && data.length === 0) {
        return nullValue;
    }
    return data;
};
