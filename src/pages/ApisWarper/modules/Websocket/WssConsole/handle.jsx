import React from 'react';
import MultiLevel from '@components/MultiLevel';
import { v4 as uuidv4 } from 'uuid';
import isObject from 'lodash/isObject';
import { EditFormat } from '@utils';
import { isString, trim } from 'lodash';

// 处理websocket数据
export const handleSocketResponse = (
  response,
  headerParameter,
  url,
  method,
  searchVal,
  listFilterVal
) => {
  const resArr = [];

  for (const res of response) {
    if (isString(listFilterVal) && listFilterVal !== 'all' && res?.action !== listFilterVal) {
      continue;
    }
    switch (res?.action) {
      case 'connect':
        let host = '';
        const hasWSS =
          url.substr(0, 5).toLowerCase() === 'ws://' || url.substr(0, 6).toLowerCase() === 'wss://';
        if (!hasWSS) url = `ws://${url}`;
        try {
          const _hostReg = /(ws([s]?):\/\/)([^\/\?\\#]*)([\/|\?|\\#]?)/i;
          host = url.match(_hostReg)[3];
        } catch (error) {}

        const wssHeader = {
          Connection: 'Upgrade',
          Upgrade: 'websocket',
          Host: host,
        };
        const heaParam = headerParameter;
        heaParam.forEach((item) => {
          if (isString(item?.key) && trim(item.key).length > 0) {
            wssHeader[item.key] = item.value;
          }
        });
        if (
          isString(searchVal) &&
          trim(searchVal).length > 0 &&
          url.indexOf(trim(searchVal)) === -1
        )
          continue;
        resArr.push({
          requestCon: {
            'Request URL': url,
            'Request Method': method,
            'Status Code': '101 Switching Protocols',
            'Request Headers': wssHeader,
          },
          ...res,
          id: res?.id || uuidv4(),
        });
        break;
      case 'disconnect':
        if (
          isString(searchVal) &&
          trim(searchVal).length > 0 &&
          url.indexOf(trim(searchVal)) === -1
        ) {
          continue;
        }
        resArr.push({
          requestCon: {
            'Request URL': url,
            'Request Method': method,
          },
          ...res,
          id: res?.id || uuidv4(),
          mode: EditFormat(res?.message).mode || 'text',
        });
        break;
      case 'error':
        if (
          isString(searchVal) &&
          trim(searchVal).length > 0 &&
          res?.message?.indexOf(trim(searchVal)) === -1
        ) {
          continue;
        }
        resArr.push({
          requestCon: {
            Error: res?.message || '',
            'Request URL': url,
            'Request Method': method,
          },
          ...res,
          id: res?.id || uuidv4(),
          mode: EditFormat(res?.message).mode || 'text',
        });
        break;
      case 'message':
        if (
          isString(searchVal) &&
          trim(searchVal).length > 0 &&
          res?.message?.indexOf(trim(searchVal)) === -1
        )
          continue;

        resArr.push({
          size: new Blob([res?.message || ''])?.size,
          mode: EditFormat(res?.message).mode || 'text',
          ...res,
          id: res?.id || uuidv4(),
        });
        break;
      case 'send':
        if (
          isString(searchVal) &&
          trim(searchVal).length > 0 &&
          res?.message?.indexOf(trim(searchVal)) === -1
        )
          continue;

        resArr.push({
          size: new Blob([res?.message || ''])?.size,
          mode: EditFormat(res?.message).mode || 'text',
          ...res,
          id: res?.id || uuidv4(),
        });
        break;
      default:
        break;
    }
  }
  return resArr;
};
export const JsonString = (str) => {
  try {
    const jsonObj = JSON.parse(str);
    return JSON.stringify(jsonObj);
  } catch (error) {
    return `"${str}"`;
  }
};
export const RenderDeep = (wss) => {
  const isObj = isObject(wss);
  return (
    <div className="level-item">
      {isObj ? (
        <>
          {Object.keys(wss).map((key, index) => (
            <>
              {isObject(wss[key]) ? (
                <MultiLevel key={index} title={key}>
                  {RenderDeep(wss[key])}
                </MultiLevel>
              ) : (
                <div key={index}>
                  {typeof key === 'string' ? `${key || '""'}` : JsonString(key)}: {wss[key]}
                </div>
              )}
            </>
          ))}
        </>
      ) : (
        <div>{typeof wss === 'string' ? `${wss || '""'}` : JsonString(wss)}</div>
      )}
    </div>
  );
};
