import React, { useEffect, useState } from 'react';
import { array2ArcoTree, filterArcoTree } from '@utils';
import { useSelector } from 'react-redux';
import { cloneDeep, isEmpty, isPlainObject } from 'lodash';

export const useElementFolders = (props) => {
  const { filterId = null } = props || {};
  const [elementFolders, setElementFolders] = useState([]);

  const apiDatas = useSelector((store) => store?.uitest_auto.elementFolderDatas);


  useEffect(() => {
    if (isPlainObject(apiDatas) && !isEmpty(apiDatas)) {
      let apiArr = cloneDeep(Object.values(apiDatas)).filter(
        (item) =>
          item.element_type === 'folder' &&
          item.status !== -1 &&
          item.status !== -2 &&
          item.status !== -99
      );
      apiArr = array2ArcoTree(apiArr, {
        keyName: 'element_id',
      });
      if (filterId) {
        apiArr = filterArcoTree(apiArr, filterId)
      }
      setElementFolders(apiArr);
    }
  }, [apiDatas]);

  return {
    elementFolders,
  };
};

export default useElementFolders;
