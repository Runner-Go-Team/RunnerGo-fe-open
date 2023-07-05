import { isArray, isPlainObject } from "lodash";

export const getApiDataItems = (apiDatas, checkedApiKeys) => {
  if (!isPlainObject(apiDatas) || !isArray(checkedApiKeys)) {
    return [];
  }
  const apiIds = [];
  Object.keys(apiDatas).forEach((key) => {
    const nodeItem = apiDatas[key];
    if (nodeItem?.target_type == 'api' && checkedApiKeys.includes(key)) {
      apiIds.push(key);
    }
  })
  return apiIds;
};
