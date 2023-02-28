import { isArray } from 'lodash';
import isObject from 'lodash/isObject';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import produce from 'immer';
import { Message } from 'adesign-react';
import ItemNode from '../itemNode';

const ObjectItem = (props) => {
  const { deepIndex, nodeValue, onChange, onMultiChange } = props;

  // 必填字段列表
  const refRequiredData = useRef();
  const requiredKeys = isArray(nodeValue?.required) ? nodeValue.required : [];
  useEffect(() => {
    refRequiredData.current = isArray(nodeValue?.required) ? nodeValue.required : [];
  }, [nodeValue.required]);

  // 保证在修改key时，顺序不错乱
  const [itemKeys, setItemKeys] = useState(null);
  useEffect(() => {
    const tempKeys = isArray(itemKeys) ? itemKeys : [];
    const currentObjectKeys = isObject(nodeValue?.properties)
      ? Object.keys(nodeValue?.properties)
      : [];
    let isEqual = true;
    currentObjectKeys.forEach((item) => {
      if (tempKeys.includes(item) === false) {
        isEqual = false;
        tempKeys.push(item);
      }
    });
    if (!isEqual) {
      setItemKeys([...tempKeys]);
    }
  }, [nodeValue?.properties]);

  // 修改数据时，保证能取到最新值
  const refData = useRef(null);
  useEffect(() => {
    refData.current = isObject(nodeValue?.properties) ? nodeValue.properties : {};
  }, [nodeValue]);

  // 修改值
  const handleChange = useCallback((attrName, newVal) => {
    const preData = refData.current;
    const newData = produce(preData, (draft) => {
      draft[attrName] = newVal;
    });
    onChange('properties', newData);
  }, []);

  // 修改key
  const handleNodeKeyChange = useCallback(
    (preKey, newKey) => {
      // 已经有存在的key，则禁止操作
      if (itemKeys.includes(newKey)) {
        Message('error', '已存在相同key');
        return;
      }

      // 更新最新key列表，保证排序准确
      const newKeyList = itemKeys.map((keyItem) => {
        if (keyItem === preKey) {
          return newKey;
        }
        return keyItem;
      });
      setItemKeys(newKeyList);

      // 更新必选字段信息
      const newRequired = refRequiredData?.current?.map((reqKey) => {
        if (reqKey === preKey) {
          return newKey;
        }
        return reqKey;
      });

      // 修改key操作
      const preData = refData.current;
      const newData = produce(preData, (draft) => {
        const entriesList = Object.entries(draft);
        const newList = entriesList.map(([key, data]) => {
          if (key !== preKey) {
            return [key, data];
          }
          return [newKey, data];
        });
        return Object.fromEntries(newList);
      });
      onMultiChange([
        ['required', newRequired],
        ['properties', newData],
      ]);
    },
    [itemKeys]
  );

  // 处理修改key之后排序错乱问题
  const listData =
    isArray(itemKeys) && isObject(nodeValue?.properties)
      ? itemKeys.map((item) => [item, nodeValue?.properties[item]])
      : [];

  // 修改选必选状态
  const handleSetRequired = useCallback((key, required) => {
    const preRequired = isArray(refRequiredData?.current) ? refRequiredData?.current : [];

    // toObject
    const KeyData = {};
    preRequired.forEach((item) => {
      KeyData[item] = true;
    });
    if (required === true) {
      KeyData[key] = true;
    } else {
      KeyData[key] = false;
    }
    const newList = [];
    Object.entries(KeyData).map(([key, value]) => {
      if (value === true) {
        newList.push(key);
      }
    });
    onChange('required', newList);
  }, []);

  // 删除属性
  const handleDeleteNode = useCallback(
    (keyRemove) => {
      // 更新最新key列表，保证排序准确
      const newKeyList = itemKeys.filter((itemKey) => itemKey !== keyRemove);
      // 更新必选字段信息
      const requireds = isArray(refRequiredData?.current) ? refRequiredData?.current : [];
      const newRequired = requireds.filter((item) => item !== keyRemove);

      // 删除对象
      const preData = refData.current;
      const newData = produce(preData, (draft) => {
        delete draft[keyRemove];
      });
      onMultiChange([
        ['required', newRequired],
        ['properties', newData],
      ]);
      setItemKeys(newKeyList);
    },
    [itemKeys]
  );

  const handleAddNode = useCallback(
    (key) => {
      const preData = refData.current;

      const newData = produce(preData, (draft) => {
        draft.dsadsa = {
          type: 'string',
        };
      });
      onChange('properties', newData);

      // // 更新最新key列表，保证排序准确
      // const newKeyList = itemKeys.map((keyItem) => {
      //   if (keyItem === preKey) {
      //     return newKey;
      //   }
      //   return keyItem;
      // });
      // setItemKeys(newKeyList);
    },
    [itemKeys]
  );

  return listData.map(([itemKey, item], index) => (
    <ItemNode
      key={index}
      {...{
        value: item,
        nodeKey: itemKey,
        isRequired: requiredKeys.includes(itemKey),
        onSetRequired: handleSetRequired,
        readOnly: false,
        deepIndex: deepIndex + 1,
        onNodeKeyChange: handleNodeKeyChange,
        onChange: handleChange,
        onDeleteNode: handleDeleteNode,
        onAddNode: handleAddNode,
      }}
    />
  ));
};

export default React.memo(ObjectItem);
