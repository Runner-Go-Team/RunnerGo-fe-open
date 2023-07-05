import { cloneDeep, isArray, isObject, isUndefined } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

// Json转List数组
export const jsonToList = (jsonData) => {
  const list = [];
  const parseItem = (
    params,
    deepIndex,
    __APIPOST_PARENT_KEY__,
    __APIPOST_REQUIRED__
  ) => {
    const __APIPOST_KEY__ = uuidv4();
    const { properties, items, ...restParams } = params;

    // 注意先后顺序！！
    list.push({
      __APIPOST_PARENT_KEY__,
      __APIPOST_KEY__,
      __APIPOST_REQUIRED__,
      ...restParams,
      deepIndex,
    });

    if (params?.type === 'object' && isObject(properties)) {
      Object.entries(properties).map(([title, param]) => {
        parseItem(
          {
            ...param,
            title,
            // deepIndex,
          },
          deepIndex + 1,
          __APIPOST_KEY__,
          params?.required?.includes?.(title) // 是否必填
        );
      });
    }

    if (params?.type === 'array' && isObject(items)) {
      parseItem(
        {
          ...items,
          title: 'items',
          __APIPOST_READONLY__: true, // 只读
          __APIPOST_ARRAY_ITEM__: true,
          // deepIndex,
        },
        deepIndex + 1,
        __APIPOST_KEY__,
        false
      );
    }

    if (isObject(params?.oneOf) || isObject(params?.anyOf) || isObject(params?.allOf)) {
      Object.entries(params.oneOf || params.anyOf || params.allOf).map(
        ([title, param]) => {
          parseItem(
            {
              ...param,
              title,
            },
            deepIndex + 1,
            __APIPOST_KEY__,
            params?.required?.includes?.(title) // 是否必填
          );
        }
      );
    }
  };
  parseItem({ ...jsonData, __APIPOST_READONLY__: true }, 0, '0', false);
  return list;
};
// 数组转json
export const listToJson = (oldList) => {
  const list = cloneDeep(oldList);

  // step1.把数组转对象
  const treeData = {};
  for (const dataItem of list) {
    let itemType = dataItem?.type;
    if (!isUndefined(dataItem?.oneOf)) {
      itemType = 'oneOf';
    } else if (!isUndefined(dataItem?.anyOf)) {
      itemType = 'anyOf';
    } else if (!isUndefined(dataItem?.allOf)) {
      itemType = 'allOf';
    }
    treeData[dataItem.__APIPOST_KEY__] = {
      ...dataItem,
      __APIPOST_ITEM_TYPE__: itemType,
    };
  }

  // step2.把子对象挂载到父级对象下
  for (let i = 0; i < list.length; i++) {
    const childItem = treeData[list[i].__APIPOST_KEY__];
    const parentNode = treeData[childItem?.__APIPOST_PARENT_KEY__];
    if (!isUndefined(parentNode)) {
      if (isUndefined(parentNode.__APIPOST_CHILDREN__)) {
        parentNode.__APIPOST_CHILDREN__ = [];
      }
      parentNode.__APIPOST_CHILDREN__.push(treeData[childItem.__APIPOST_KEY__]);
    }
  }

  let result = null;

  // step3.把挂载对象转换成真实对象
  for (let i = 0; i < list.length; i++) {
    const childItem = treeData[list[i].__APIPOST_KEY__];
    if (isUndefined(childItem?.__APIPOST_CHILDREN__)) {
      continue;
    }
    const childList = childItem?.__APIPOST_CHILDREN__;
    const treeDataItem = treeData[childItem.__APIPOST_KEY__];

    if (treeDataItem.__APIPOST_ITEM_TYPE__ === 'object') {
      treeDataItem.properties = {};
      childList.forEach((item) => {
        treeDataItem.properties[item.title] = treeData[item.__APIPOST_KEY__];
      });
      delete treeDataItem.__APIPOST_CHILDREN__;
    } else if (treeDataItem.__APIPOST_ITEM_TYPE__ === 'array') {
      treeDataItem.items = {};
      childList.forEach((item) => {
        treeDataItem[item.title] = treeData[item.__APIPOST_KEY__];
      });
      delete treeDataItem.__APIPOST_CHILDREN__;
    } else if (treeDataItem.__APIPOST_ITEM_TYPE__ === 'oneOf') {
      treeDataItem.oneOf = [];
      childList.forEach((item) => {
        treeDataItem.oneOf.push(treeData[item.__APIPOST_KEY__]);
      });
      delete treeDataItem.__APIPOST_CHILDREN__;
    } else if (treeDataItem.__APIPOST_ITEM_TYPE__ === 'anyOf') {
      treeDataItem.anyOf = [];
      childList.forEach((item) => {
        treeData[item.__APIPOST_KEY__].__APIPOST_READONLY__ = true;
        treeDataItem.anyOf.push(treeData[item.__APIPOST_KEY__]);
      });
      delete treeDataItem.__APIPOST_CHILDREN__;
    } else if (treeDataItem.__APIPOST_ITEM_TYPE__ === 'allOf') {
      treeDataItem.allOf = [];
      childList.forEach((item) => {
        treeDataItem.allOf.push(treeData[item.__APIPOST_KEY__]);
      });
      delete treeDataItem.__APIPOST_CHILDREN__;
    }

    if (childItem.__APIPOST_PARENT_KEY__ === '0') {
      result = childItem;
    }
  }

  return result;
};

// 更新父节点下不为空节点列表
export const getUpdatedSchemaList = (dataList, parentKey) => {
  const requiredKeys = {};
  let parentIndex = -1;
  dataList.forEach((schemaItem, index) => {
    if (
      schemaItem.__APIPOST_REQUIRED__ === true &&
      schemaItem.__APIPOST_PARENT_KEY__ === parentKey
    ) {
      requiredKeys[schemaItem?.title] = true;
    }
    if (schemaItem.__APIPOST_KEY__ === parentKey) {
      parentIndex = index;
    }
  });
  if (parentIndex !== -1) {
    dataList[parentIndex].required = Object.keys(requiredKeys);
  }
  return dataList;
};

// Array转树形结构对象
export const arrayToTreeObject = (
  data=[],
  param = { key: 'target_id', parent: 'parent', children: 'children' }
) => {
  const treeData = {};
  const rootData = [];
  if (!Array.isArray(data)) {
    return;
  }
  // step1.把数字转换成对象
  data.forEach((item) => {
    treeData[item[param.key]] = {
      ...item,
      key: item[param.key],
      [param.parent]: item[param.parent],
    };
  });

  for (let i = 0; i < data.length; i++) {
    const itemKey = data[i][param.key];
    const item = treeData[itemKey];
    const parent = treeData[item[param.parent]];
    if (isUndefined(parent)) {
      // parent未定义说明被放在了根节点下
      rootData.push(item);
    } else {
      if (!isArray(parent[param?.children])) {
        parent[param.children] = [];
      }
      parent[param.children].push(item);
    }
  }

  return rootData;
};

// 展开树形列表
export const flattenTreeData = (dataList, expandKeys) => {
  // step1:  先转成树Object List
  const treeObjList = arrayToTreeObject(dataList, {
    key: '__APIPOST_KEY__',
    parent: '__APIPOST_PARENT_KEY__',
    children: '__APIPOST_CHILDREN__',
  });

  const flattenList = [];

  const digFind = (list, parent = null) => {
    list?.forEach((item, index) => {
      const { __APIPOST_CHILDREN__, ...restData } = item;
      if (restData.deepIndex === 0) {
        restData.title = 'rootNode';
        restData.disabled = true;
      }
      flattenList.push(restData);
      if (expandKeys[item.__APIPOST_KEY__] === true) {
        digFind(__APIPOST_CHILDREN__);
      }
    });
  };
  digFind(treeObjList);

  return flattenList;
};

// 获取对象所在数组中的index
export const getItemIndex = (schemaList, itemKey) => {
  let index = -1;
  schemaList.forEach((item, itemIndex) => {
    if (item.__APIPOST_KEY__ === itemKey) {
      index = itemIndex;
    }
  });
  return index;
};

// 获取对象类型
export const getItemType = (props) => {
  if (isArray(props?.type)) {
    if (props.type.length > 2) {
      return 'other';
    }
    return props.type?.[0] ?? '';
  }

  if (!isUndefined(props?.type)) {
    return props.type;
  }
  if (!isUndefined(props?.oneOf)) {
    return 'oneOf';
  }
  if (!isUndefined(props?.anyOf)) {
    return 'anyOf';
  }
  if (!isUndefined(props?.allOf)) {
    return 'allOf';
  }
  return '';
};
