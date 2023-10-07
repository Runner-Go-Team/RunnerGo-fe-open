import React from 'react';
import { useSelector } from 'react-redux';
// import { ITreeMenuItem } from '@dto/apis';
import { cloneDeep, isEqual, merge, isUndefined } from 'lodash';


const useListData = (props) => {
  const { filterParams, treeData } = props;

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
    Object.entries(sourceData).forEach(([scene_id, data]) => {
      const includeName =
        key === '' || `${data?.name}`.toLowerCase().indexOf(key.toLowerCase()) !== -1;

      if (
        (includeName === true) &&
        (data.mark === status || status === 'all')
      ) {
        newList[scene_id] = data;
        let parent = sourceData[data.parent_id];
        while (parent !== undefined && newList[parent.scene_id] !== parent) {
          newList[parent.scene_id] = parent;
          parent = sourceData[parent.parent_id];
        }
      }
    });
    const dataList = [];
    Object.entries(newList).forEach(([scene_id, data]) => {
      if (['scene', 'folder'].includes(data.scene_type)) {
        dataList.push({
          ...data,
          scene_id,
        });
      }
    });
    return dataList;
  }, [treeData, filterParams]);

  // 被过滤后的树形菜单对象，带children
  const filteredTreeData = React.useMemo(() => {
    const newTreeData= {};
    const dataList = cloneDeep(filteredTreeList);
    dataList.forEach((item) => {
      if (!isUndefined(item.scene_id)) {
        newTreeData[item.scene_id] = item;
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
