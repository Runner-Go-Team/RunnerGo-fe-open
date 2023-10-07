import React from 'react';
import { useSelector } from 'react-redux';
// import { ITreeMenuItem } from '@dto/apis';
import { arrayToTreeObject } from '@utils';
import { cloneDeep, isEqual, merge, isUndefined, isString, isArray } from 'lodash';


const useTreeData = (props) => {
  const { filterParams, treeData, fieldNames,handleExpandAll } = props;

  const array2Tree = (items, idName = 'target_id', pidName = 'parent_id') => {
    try {
      const result=[];
      const itemMap ={};
      for (const item of items) {
        const id=item[idName];
        const pid=item[pidName];
        if(!id || id == undefined){
          continue;
        }
        if(!itemMap.hasOwnProperty(id)){
          itemMap[id]={
            children: [],
          }
        }
        
        itemMap[id]={
          ...item,
          children: itemMap[id]['children']
        }
        
        const treeItem = itemMap[id];
        if(pid == 0 || pid == undefined){
          result.push(treeItem);
          result.sort((a,b)=>a?.sort - b?.sort);
        }else{
          if(!itemMap.hasOwnProperty(pid)){
            itemMap[pid]={
              children:[],
            }
          }
          itemMap[pid].children.push(treeItem);
          itemMap[pid].children.sort((a,b)=>a?.sort - b?.sort);
        }
      }
      return result;
    } catch (error) {
      return [];
    }
  }

  const searchData = (TreeData, filters) => {
    const {keyword , fields } = filters;
    const loop = (data) => {
      const result = [];
      data.forEach((item) => {
        let exist= false;
        fields.forEach(field => {
          if(isString(field) && isString(item?.[field]) && item[field].toLowerCase().indexOf(keyword.toLowerCase()) > -1){
            exist= true;
          }
        });
        if (exist) {
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
  
    return loop(TreeData);
  }

  // 被过滤后的树形菜单对象，带children
  const filteredTreeData = React.useMemo(() => {
    const newTreeData = array2Tree(Object.values(treeData || {}),fieldNames?.key || 'target_id',fieldNames?.parentKey || 'parent_id');
    const {keyword , fields } = filterParams;
    if(isString(keyword) && isArray(fields) && keyword.length > 0 && fields.length > 0){
      let newData = searchData(newTreeData, filterParams);
      handleExpandAll(newData)
      return newData
    }

    return newTreeData;
  }, [treeData, filterParams]);


  return {
    filteredTreeData,
  };
};
export default useTreeData;
