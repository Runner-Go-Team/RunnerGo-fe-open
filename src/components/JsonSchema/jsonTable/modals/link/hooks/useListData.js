import React from 'react';
import { cloneDeep, isArray } from 'lodash';

// interface IUseListData {
//   menuList: IDataModel[];
//   filterName;
// }

const useListData =(props) => {
  const { menuList, filterName } = props;

  const filteredTreeList = React.useMemo(() => {
    if (!isArray(menuList)) {
      return [];
    }

    const sourceList = cloneDeep(menuList);

    const sourceData = {};
    for (const item of sourceList) {
      sourceData[item.model_id] = item;
    }

    const newList = {};
    for (const data of sourceList) {
      const includeName =
        filterName === '' ||
        `${data?.name}`.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        `${data?.display_name}`.toLowerCase().indexOf(filterName.toLowerCase()) !== -1;

      if (includeName === true) {
        newList[data.model_id] = data;
        let parent = sourceData[data.parent_id];
        while (parent !== undefined && newList[parent.model_id] !== parent) {
          newList[parent.model_id] = parent;
          parent = sourceData[parent.parent_id];
        }
      }
    }
    const dataList = [];
    Object.entries(newList).forEach(([model_id, data]) => {
      dataList.push({
        ...data,
        model_id,
      });
    });

    return dataList;
  }, [menuList, filterName]);

  return {
    filteredTreeList,
  };
};
export default useListData;
