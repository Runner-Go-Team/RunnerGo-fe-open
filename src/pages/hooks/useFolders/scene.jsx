import React, { useEffect, useState } from 'react';
import { array2ArcoTree, filterArcoTree } from '@utils';
import { useSelector } from 'react-redux';
import { cloneDeep, isEmpty, isPlainObject, isString } from 'lodash';

export const useSceneFolders = (props) => {
  const { filterId = null, plan_id } = props || {};
  const [sceneFolders, setSceneFolders] = useState([]);
  const planSceneDatas = useSelector((store) => store?.uitest_auto?.planSceneDatas);
  const apiDatas = isString(plan_id) ? (isPlainObject(planSceneDatas?.[plan_id]) ? planSceneDatas?.[plan_id] : {}) : useSelector((store) => store?.uitest_auto.sceneDatas);

  useEffect(() => {
    if (isPlainObject(apiDatas) && !isEmpty(apiDatas)) {
      let apiArr = cloneDeep(Object.values(apiDatas)).filter(
        (item) =>
          item.scene_type === 'folder' &&
          item.status !== -1 &&
          item.status !== -2 &&
          item.status !== -99
      );
      apiArr = array2ArcoTree(apiArr, {
        keyName: 'scene_id',
      });
      if (filterId) {
        apiArr = filterArcoTree(apiArr, filterId)
      }
      setSceneFolders(apiArr);
    }
  }, [apiDatas]);

  return {
    sceneFolders,
  };
};

export default useSceneFolders;
