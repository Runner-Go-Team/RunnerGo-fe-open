import React from 'react';
import { useSelector } from 'react-redux';
// import { ITreeMenuItem } from '@dto/apis';
import { cloneDeep, isEqual, merge, isUndefined } from 'lodash';


const useListData = (props) => {
  const { filterParams, treeData } = props;

  const removeEmptyFolders = (arr) => {
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
        let hasChild = false;
        // 再次遍历原数组，查找是否有其他元素的parent_id等于当前元素的target_id
        for (let other of arr) {
          if (other.parent_id === item.target_id) {
            // 如果找到了，就将标志变量设为true，并跳出循环
            hasChild = true;
            break;
          }
        }
        // 如果标志变量仍为false，说明当前元素没有子节点，就不加入结果数组
        // 如果标志变量为true，说明当前元素有子节点，就加入结果数组
        if (hasChild) {
          result.push(item);
        }
      }
    }
    // 返回结果数组
    return result;
  }
  

  // 查找当前节点及全部上层对象
  const getParentItems = (
    sourObj,
    parent_id
  ) => {
    const result = {};
    const dig = (parentId) => {
      const parentNode = sourObj[parentId];
      if (parentNode !== undefined && result[parentId] === undefined) {
        result[parentId] = parentNode;
        dig(parentNode.parent_id);
      }
    };
    dig(parent_id);
    return result;
  };

  // 被过滤后的目录菜单列表，平级结构，不带children，parent属性
  const filteredTreeList = React.useMemo(() => {
    if (treeData === undefined) {
      return [];
    }
    const { key, status = 'all' } = filterParams;
    const sourceData = cloneDeep(treeData);
    const newList = {};
    Object.entries(sourceData).forEach(([target_id, data]) => {
      const includeUrl = `${data?.url}`.toLowerCase().indexOf(key.toLowerCase()) !== -1;
      const includeName =
        key === '' || `${data?.name}`.toLowerCase().indexOf(key.toLowerCase()) !== -1;

      if (
        (includeName === true || includeUrl === true) &&
        (data.mark === status || status === 'all')
      ) {
        newList[target_id] = data;
        let parent = sourceData[data.parent_id];
        while (parent !== undefined && newList[parent.target_id] !== parent) {
          newList[parent.target_id] = parent;
          parent = sourceData[parent.parent_id];
        }
      }
    });
    const dataList = [];
    Object.entries(newList).forEach(([target_id, data]) => {
      if (['api', 'folder'].includes(data.target_type)) {
        dataList.push({
          ...data,
          target_id,
        });
      }
    });

    return removeEmptyFolders(dataList);
  }, [treeData, filterParams]);

  // 被过滤后的树形菜单对象，带children
  const filteredTreeData = React.useMemo(() => {
    const newTreeData= {};
    const dataList = cloneDeep(filteredTreeList);
    dataList.forEach((item) => {
      if (!isUndefined(item.target_id)) {
        newTreeData[item.target_id] = item;
      }
    });
    const rootList = [];
    for (const item of dataList) {
      const parent = newTreeData[item.parent_id];
      if (parent !== undefined) {
        if (isUndefined(parent?.children)) {
          parent.children = [];
        }
        parent.children.push(item);
      }
      if (item.parent_id === '0') {
        rootList.push(item);
      }
    }
    return rootList;
  }, [filteredTreeList]);

  return {
    filteredTreeList,
    filteredTreeData,
  };
};
export default useListData;
