import { isArray, isPlainObject } from "lodash";

export const getSqlDataItems = (apiDatas, checkedApiKeys) => {
  if (!isPlainObject(apiDatas) || !isArray(checkedApiKeys)) {
    return [];
  }
  const apiIds = [];
  Object.keys(apiDatas).forEach((key) => {
    const nodeItem = apiDatas[key];
    if (nodeItem?.target_type == 'sql' && checkedApiKeys.includes(key)) {
      apiIds.push(key);
    }
  })
  return apiIds;
};
