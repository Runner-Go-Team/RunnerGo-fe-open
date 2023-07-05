import {
  cloneDeep,
  isArray,
  isEmpty,
  isPlainObject,
  isString,
  isUndefined,
  omit,
  trim,
} from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import produce from 'immer';
import { Message } from 'adesign-react';
import { useMemoizedFn } from 'apt-hooks';
import { v4 as uuidV4 } from 'uuid';
import { useSelector } from 'react-redux';
import ItemNode from '../itemNode';

// interface ObjectItemProps {
//   deepIndex: number;
//   nodeValue: any;
//   onChange: (nodeKey: string, val: any) => void;
//   onMultiChange: (params: any) => void;
//   linkSchema: 'enable' | 'disable';
//   parentModels: React.MutableRefObject<string[]>;
// }

const ObjectItem = (props) => {
  const { deepIndex, nodeValue, onChange, onMultiChange, linkSchema, parentModels } = props;

  const schemaData = useSelector((store) => store?.dataModel?.simpleModels);

  // 必填字段列表
  const refRequiredData = useRef();
  const requiredKeys = isArray(nodeValue?.required) ? nodeValue.required : [];
  useEffect(() => {
    refRequiredData.current = isArray(nodeValue?.required) ? nodeValue.required : [];
  }, [nodeValue.required]);

  // 保证在修改key时，顺序不错乱
  const itemKeys = isArray(nodeValue?.APIPOST_ORDERS) ? nodeValue?.APIPOST_ORDERS : [];
  const setItemKeys = useMemoizedFn((newOrders) => {
    onChange('APIPOST_ORDERS', newOrders);
  });

  // 依赖的对象信息
  const refValues = isPlainObject(nodeValue?.APIPOST_REFS) ? nodeValue?.APIPOST_REFS : {};

  useEffect(() => {
    const tempKeys = isArray(itemKeys) ? cloneDeep(itemKeys) : [];
    const currentObjectKeys = isPlainObject(nodeValue?.properties)
      ? Object.keys(nodeValue?.properties)
      : [];
    if (nodeValue?.APIPOST_IS_MODEL) {
      return;
    }
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
    refData.current = isPlainObject(nodeValue?.properties) ? nodeValue.properties : {};
  }, [nodeValue]);

  // 修改值
  const handleChange = useMemoizedFn((attrName, newVal) => {
    const preProperties = isPlainObject(nodeValue?.properties) ? nodeValue.properties : {};
    const newData = produce(preProperties, (draft) => {
      draft[attrName] = newVal;
    });
    onChange('properties', newData);
  });

  // 修改key
  const handleNodeKeyChange = useMemoizedFn((preKey, newKey) => {
    // 已经有存在的key，则禁止操作
    if (itemKeys.includes(newKey)) {
      Message('warning', '已存在相同key');
      return;
    }

    // 更新最新key列表，保证排序准确
    const newKeyList = itemKeys.map((keyItem) => {
      if (keyItem === preKey) {
        return newKey;
      }
      return keyItem;
    });

    // 更新必选字段信息
    const preRequired = isArray(nodeValue?.required) ? nodeValue.required : [];
    const newRequired = preRequired?.map((reqKey) => {
      if (reqKey === preKey) {
        return newKey;
      }
      return reqKey;
    });

    // 修改key操作
    const preData = isPlainObject(nodeValue?.properties) ? nodeValue.properties : {};
    const newData = produce(preData, (draft) => {
      const entriesList = Object.entries(draft);
      const newList = entriesList.map(([key, data]) => {
        if (key !== preKey) {
          return [key, data];
        }

        // 如果存在APIPOST_NEW_EMPTY_ROW 则删除
        if (!isUndefined(data?.APIPOST_NEW_EMPTY_ROW)) {
          data = omit(data, ['APIPOST_NEW_EMPTY_ROW']);
        }

        return [newKey, data];
      });
      return Object.fromEntries(newList);
    });
    onMultiChange([
      ['required', newRequired],
      ['properties', newData],
      ['APIPOST_ORDERS', newKeyList],
    ]);
  });

  // 处理修改key之后排序错乱问题
  const listData = useMemo(() => {
    const resultList = [];

    if (!isArray(itemKeys) || !isPlainObject(nodeValue?.properties)) {
      if (!(isArray(nodeValue?.properties) && isEmpty(nodeValue?.properties))) {
        return [];
      }
    }

    itemKeys.forEach((key) => {
      const itemData = nodeValue?.properties[key];
      if (isPlainObject(itemData)) {
        if (isString(itemData?.ref)) {
          const md5Key = uuidV4().replace(/\-/g, '');
          const refModelValue = {
            APIPOST_ORDERS: [md5Key],
            APIPOST_REFS: {
              [md5Key]: {
                ref: itemData?.ref,
              },
            },
            properties: {},
            type: 'object',
          };
          resultList.push([key, refModelValue]);
          return;
        }
        resultList.push([key, itemData]);
        return;
      }
      const refData = nodeValue?.APIPOST_REFS?.[key];
      const schemaKey = nodeValue?.APIPOST_REFS?.[key]?.ref;

      const modelData = schemaData?.[schemaKey];
      if (isPlainObject(modelData) && isPlainObject(modelData?.schema)) {
        const modelSchema = produce(modelData?.schema, (draft) => {
          draft.type = 'dataModel';
          draft.APIPOST_MODEL_ID = schemaKey;
          draft.APIPOST_MODEL_KEY = key;
          draft.refData = refData;
        });
        resultList.push([key, modelSchema]);
      }
    });

    return resultList;
  }, [itemKeys, nodeValue, schemaData]);

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
    (keyRemove, is_model = false) => {
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
      let multiChanges = [
        ['required', newRequired],
        ['properties', newData],
        ['APIPOST_ORDERS', newKeyList],
      ];
      if (is_model) {
        multiChanges = multiChanges.concat([['APIPOST_REFS', omit(refValues, keyRemove)]]);
      }

      onMultiChange(multiChanges);
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
    },
    [itemKeys]
  );

  // 添加相邻节点
  const handleAddSiblingNode = useMemoizedFn((nodeKey) => {
    if (!isArray(itemKeys)) {
      return;
    }

    // 如果存在已有key为空的项，禁止添加
    if (itemKeys?.some((item) => isEmpty(trim(item)))) {
      return;
    }

    const dataIndex = itemKeys.findIndex((item) => item === nodeKey);
    if (dataIndex === -1) {
      return;
    }
    const newKey = ``;
    const initProperties = isPlainObject(nodeValue?.properties) ? nodeValue.properties : {};

    const newProperties = produce(initProperties, (draft) => {
      const entriesList = Object.entries(draft);
      entriesList.splice(dataIndex + 1, 0, [
        newKey,
        {
          type: 'string',
          APIPOST_NEW_EMPTY_ROW: true,
        },
      ]);
      return Object.fromEntries(new Map(entriesList));
    });
    const newKeys = cloneDeep(itemKeys);
    newKeys.splice(dataIndex + 1, 0, newKey);
    onMultiChange([
      ['properties', newProperties],
      ['APIPOST_ORDERS', newKeys],
    ]);
  });

  // 关联json-schema
  const handleLinkSchema = useMemoizedFn(async (nodeKey, dataModel) => {
    if (!isPlainObject(dataModel)) {
      return;
    }

    // 数据模型不能多次引用
    if (isPlainObject(nodeValue?.APIPOST_REFS)) {
      const modelIds = Object.values(nodeValue?.APIPOST_REFS).map((item) => item?.ref);
      if (modelIds.includes(dataModel.model_id)) {
        Message('error', '模型不能多次引用');
        return;
      }
    }

    // // 检查循环引用
    // if (isFunction(onBeforeLink)) {
    //   console.log('11111');
    //   const isLoopLink = await onBeforeLink(dataModel);
    //   console.log('2222222222');
    //   if (isLoopLink === true) {
    //     Message('error', '不能循环引用数据模型');
    //     return;
    //   }
    // }

    const preProperties = isPlainObject(nodeValue?.properties) ? nodeValue.properties : {};
    const newData = produce(preProperties, (draft) => {
      delete draft[nodeKey];
    });
    const dataIndex = itemKeys.findIndex((item) => item === nodeKey);
    if (dataIndex === -1) {
      return;
    }
    const newOrderKeys = [...itemKeys];
    const newRefKey = isEmpty(nodeKey) ? uuidV4().replace(/\-/g, '') : nodeKey;
    newOrderKeys.splice(dataIndex, 1, newRefKey);
    const newRefs = produce(refValues, (draft) => {
      draft[newRefKey] = {
        ref: dataModel.model_id,
      };
    });
    onMultiChange([
      ['properties', newData],
      ['APIPOST_ORDERS', newOrderKeys],
      ['APIPOST_REFS', newRefs],
    ]);
  });

  // 取消关联Json-schema
  const handleCancelLinkSchema = useMemoizedFn(async (nodeKey) => {
    const schemaKey = nodeValue?.APIPOST_REFS?.[nodeKey]?.ref;
    const modelJson = {};
    const modelProperties = modelJson?.properties ?? {};
    const preProperties = isPlainObject(nodeValue?.properties) ? nodeValue.properties : {};
    const orderIndex = itemKeys.findIndex((item) => item === nodeKey);

    const newData = produce(preProperties, (draft) => {
      Object.entries(modelProperties).forEach(([key, value]) => {
        draft[key] = value;
      });
    });

    const newOrderKeys = [...itemKeys];
    newOrderKeys.splice(orderIndex, 1, ...Object.keys(modelProperties));
    const newRefs = produce(nodeValue?.APIPOST_REFS ?? {}, (draft) => {
      delete draft[nodeKey];
    });

    const multiChanges = [
      ['properties', newData],
      ['APIPOST_ORDERS', newOrderKeys],
      ['APIPOST_REFS', newRefs],
    ];
    onMultiChange(multiChanges);
  });

  // 重写数据模型字段
  const handleChangeRefs = useMemoizedFn((modelKey, rowKey, newVal) => {
    const preRefValues = isPlainObject(nodeValue?.APIPOST_REFS) ? nodeValue?.APIPOST_REFS : {};

    const newRefs = produce(preRefValues, (draft) => {
      if (!isPlainObject(draft[modelKey].APIPOST_OVERRIDES)) {
        draft[modelKey].APIPOST_OVERRIDES = {};
      }
      if (isUndefined(newVal)) {
        delete draft[modelKey].APIPOST_OVERRIDES[rowKey];
      } else {
        draft[modelKey].APIPOST_OVERRIDES[rowKey] = newVal;
      }
    });

    onMultiChange([['APIPOST_REFS', newRefs]]);
  });

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
        onAddSiblingNode: handleAddSiblingNode,
        onLinkSchema: handleLinkSchema,
        onCancelLinkSchema: handleCancelLinkSchema,
        singleOnly: false,
        //  overrides: nodeValue?.APIPOST_REFS?.[modelKey]?.APIPOST_OVERRIDES?.[itemKey]
        onChangeRefs: handleChangeRefs,
        linkSchema,
        parentModels,
      }}
    />
  ));
};

export default React.memo(ObjectItem);
