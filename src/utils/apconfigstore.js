/**
 * @code apGlobalConfigStore v1.0.0 跟用户无关的全局存储
 * @website https://www.apipost.cn/
 * @author jm+mhw
 * @copyright apipost版权所有
 */
// 念奴娇.赤壁怀古
// 【宋】苏轼
// 大江东去，浪淘尽，千古风流人物。

window.apGlobalConfigStore = {};
const isJSON = (str) => {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
};
/**
 * 获取
 * @param _key
 * @returns {apGlobalConfigStore}
 */
apGlobalConfigStore.get = (_key) => {
  let _val = localStorage.getItem(_key);

  if (isJSON(_val)) {
    _val = JSON.parse(_val);
  }
  return _val;
};

/**
 * 设置
 * @param _key
 * @param _val
 * @returns {apGlobalConfigStore}
 */
apGlobalConfigStore.set = (_key, _val) => {
  let obj = _val;

  if (typeof _val === 'object') {
    let oldVal = apGlobalConfigStore.get(_key);
    if (!oldVal) {
      oldVal = {};
    }
    obj = JSON.stringify(Object.assign(oldVal, _val));
    localStorage.setItem(_key, obj);
  } else {
    localStorage.setItem(_key, obj);
  }
  return obj;
};

export default { apGlobalConfigStore };
