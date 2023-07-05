import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Bus, { useEventBus } from '@utils/eventBus';
import { asyncModalConfirm } from '@modals/asyncModalConfirm';
import { v4 as uuidV4 } from 'uuid';
import { getBaseCollection } from '@constants/baseCollection';
import { fetchChangeSort, fetchSaveMockFolder, fetchMockApiList, fetchDeleteFolderOrApi, fetchMockSave, fetchGetMockDetail, fetchGetMockResult, fetchMockApiSend } from '@services/mock'
import i18next, { t } from 'i18next';
import { cloneDeep, findIndex, isArray, isObject, isPlainObject, isString, isUndefined, max, set, trim } from 'lodash';
import { GetUrlQueryToArray, createUrl, isURL, targetParameter2Obj } from '@utils';
import { Message } from 'adesign-react';
import { lastValueFrom } from 'rxjs';

// 发送mock_api时轮询的参数
var send_mock_api_t = null;

// 新建接口
const useMock = (props) => {
  const { refGlobal } = props;
  const dispatch = useDispatch();

  const updateTargetMockId = async (id) => {
    dispatch({
      type: 'mock/updateOpenApiNow',
      payload: id,
    })
  };

  const removeOpenItem = async (id, api_now) => {
    let _open_api_now = api_now ? api_now : refGlobal?.current?.CURRENT_MOCK_ID;
    let ids = [];
    const open_apis = refGlobal?.current?.openMockApis || {};
    for (let id in open_apis) {
      ids.push(id);
    }

    const index_1 = ids.indexOf(id);
    if (`${id}` === `${_open_api_now}`) {
      let newId = '';
      if (index_1 > 0) {
        newId = ids[index_1 - 1];
      } else {
        newId = ids[index_1 + 1];
      }
      // 更新当前id
      newId && updateTargetMockId(newId);
    }

    dispatch({
      type: 'mock/removeApiById',
      payload: { target_id: id },
    });
  };

  // 小红点判断
  const targetIfChanged = async (newTarget, pathExpression) => {
    const diffPaths = {
      name: 'name',
      method: 'method',
      mark: 'mark',
      client_mock_url: 'client_mock_url',
      server_mock_url: 'server_mock_url',
      request: 'request',
      response: 'response',
      socketConfig: 'socketConfig',
      script: 'script',
      mock_path:'mock_path',
      expects:'expects'
    };
    if (
      isString(pathExpression) &&
      pathExpression.length > 0 &&
      diffPaths.hasOwnProperty(pathExpression.split('.')[0])
    ) {
      const path = pathExpression.split('.')[0];
      const updateData = newTarget[diffPaths[path]];
      const change_json = {};
      if (isObject(updateData)) {
        change_json[path] = targetParameter2Obj(updateData);
      } else {
        change_json[path] = updateData;
      }
      newTarget.is_changed = 1;
    }
  };

  const updateOpensById = (req) => {
    const { id, data } = req;
    // TODO 修改本地库
    const open_apis = refGlobal?.current?.openMockApis || {};
    if (open_apis.hasOwnProperty(id) && isObject(open_apis[id])) {
      let target_temp = cloneDeep(open_apis[id]);
      target_temp = { ...target_temp, ...data };
      // await Opens.put(target_temp, target_temp.target_id);
      dispatch({
        type: 'mock/coverOpenMockApis',
        payload: { ...open_apis, [id]: target_temp },
      });
    }
  };

  const updateTarget = async (data) => {
    const { target_id, pathExpression, value } = data;
    const tempOpenApis = refGlobal?.current?.openMockApis || {};
    const pre_mock_url = refGlobal?.current?.pre_mock_url || '';
    if (!tempOpenApis.hasOwnProperty(target_id)) {
      return;
    }
    // TODO 修改本地库
    set(tempOpenApis[target_id], pathExpression, value);
    // url兼容处理
    if (pathExpression === 'mock_path') {
      const firstStr = trim(value).charAt(0);
      let new_mock_path = value;
      if(firstStr == '/'){
        new_mock_path = trim(value).slice(1);
        set(tempOpenApis[target_id], 'mock_path', new_mock_path);
      }

      let reqUrl = pre_mock_url + new_mock_path;

      // 自动生成mockurl
      if (tempOpenApis[target_id].target_type === 'api') {
        // const userInfo = await User.get(localStorage.getItem('uuid') || '-1');
        // if (isPlainObject(userInfo?.config) && userInfo.config?.AUTO_GEN_MOCK_URL > 0) {
        //     set(tempOpenApis[target_id], 'mock_url', urlParseLax(value)?.pathname || '');
        // }
      }
      set(tempOpenApis[target_id], 'url', reqUrl);
      set(tempOpenApis[target_id], 'request.url', reqUrl);
      // set(tempOpenApis[target_id], 'request.url', reqUrl);
      // set(tempOpenApis[target_id], 'request.url', reqUrl);
    } else if (pathExpression === 'request.query.parameter') {
      let paramsStr = '';
      let url = tempOpenApis[target_id]?.request?.url || '';
      if (
        isArray(tempOpenApis[target_id]?.request?.query?.parameter) &&
        tempOpenApis[target_id]?.request?.query?.parameter.length > 0
      ) {
        tempOpenApis[target_id].request.query.parameter.forEach((ite) => {
          if (ite.key !== '' && ite.is_checked == 1)
            paramsStr += `${paramsStr === '' ? '' : '&'}${ite.key}=${ite.value}`;
        });
        const newUrl = `${url.split('?')[0]}${paramsStr !== '' ? '?' : ''}${paramsStr}`;
        set(tempOpenApis[target_id], 'url', newUrl);
        set(tempOpenApis[target_id], 'request.url', newUrl);
      } else {
        url = url.split('?')[0];
        set(tempOpenApis[target_id], 'url', url);
        set(tempOpenApis[target_id], 'request.url', url);
      }
    }
    // 小红点判断
    await targetIfChanged(tempOpenApis[target_id], pathExpression);
    // 修改opens 数据 （包括indexedDB和redux）
    await updateOpensById({ id: target_id, data: tempOpenApis[target_id] });
  };

  const addOpensByObj = async (Obj, selected = false, callback) => {
    const tempOpenApis = cloneDeep(refGlobal?.current?.openMockApis || {});
    tempOpenApis[Obj.target_id] = Obj;

    dispatch({
      type: 'mock/coverOpenMockApis',
      payload: tempOpenApis,
    });
    selected && updateTargetMockId(Obj.target_id);
    callback && callback();
  };

  const addOpenItem = async (data) => {
    const open_apis = refGlobal?.current?.openMockApis || {};
    const { id, pid } = data || {};
    let newApi = '';
    if (id) {
      if (!open_apis.hasOwnProperty(id)) {
        try {
          const resp = await lastValueFrom(fetchGetMockDetail({ team_id: localStorage.getItem('team_id'), target_ids: id }));
          if (resp?.code == 0 && isArray(resp?.data?.targets) && resp.data.targets.length > 0) {
            newApi = resp.data.targets[0];
            updateTargetMockId(id);
          }
        } catch (error) { }
      } else {
        updateTargetMockId(id);
      }
    } else {
      newApi = getBaseCollection('api');
      newApi.is_changed = 1;
      newApi.method = 'POST'
      newApi.request.body.mode = 'none';
      newApi.name = '新建Mock接口'
    }
    if (!newApi) return;
    if (isString(pid) && pid.length > 0) {
      newApi.parent_id = pid;
    }
    addOpensByObj(newApi, true);
  };
  // 重新排序
  const targetReorder = (target) => {
    const mockApis = refGlobal?.current?.mockApis || {};
    if (isObject(target) && target.hasOwnProperty('parent_id')) {
      const parentKey = target.parent_id || '0';
      const projectNodes = Object.values(mockApis);
      let sort = 0;
      const rootNodes = projectNodes.filter((item) => `${item.parent_id}` === `${parentKey}`);
      const nodeSort = rootNodes.map((item) => item.sort);
      sort = max(nodeSort) || 0;
      target.sort = sort + 1;
    }
    return target;
  };
  const saveMockFolder = async (data, callback) => {
    const { pid, param, oldFolder } = data;

    let newCollection = isPlainObject(oldFolder) ? cloneDeep(oldFolder) : getBaseCollection('folder');
    if (!newCollection) return;
    newCollection.parent_id = pid;
    if (isString(pid) && pid.length > 0) {
      newCollection.parent_id = pid;
    }

    if (isPlainObject(param)) {
      newCollection = { ...newCollection, ...param };
    }

    if (newCollection.sort = -1) {
      newCollection = targetReorder(newCollection);
    }
    newCollection['team_id'] = localStorage.getItem('team_id');

    try {
      const res = await lastValueFrom(fetchSaveMockFolder(newCollection))
      if (res?.code == 0) {
        // 更新目录区tree 
        Bus.$emit('mock/getMockList');
        callback && callback();
      }
    } catch (error) { }
  };

  // 关闭所有标签
  const closeAllTarget = async () => {
    const open_apis = refGlobal?.current?.openMockApis || {};
    if (Object.entries(open_apis).length > 0) {
      for (let id in open_apis) {
        const target = open_apis[id];
        if (target.hasOwnProperty('is_changed') && (target.is_changed > 0)) {
          const res = await asyncModalConfirm({
            title: i18next.t('modal.tips'),
            content: `${i18next.t('modal.now')}${target?.name || i18next.t('modal.tag')
              }${i18next.t('modal.notSave')}`,
            cancelText: i18next.t('btn.cancel'),
            diyText: i18next.t('apis.saveAndClose'),
            okText: i18next.t('apis.notSave'),
          });
          if (res === undefined) {
            // 保存并关闭
            saveTargetById({ id }, () => {
              removeOpenItem(id);
            })
          } else if (res) {
            // 不保存
            removeOpenItem(id);
          } else {
            // 取消
            updateTargetMockId(id);
          }
        } else {
          removeOpenItem(id);
        }
      }
    }
  };
  // 强制关闭所有标签
  const focreCloseAllTarget = async () => {
    const open_apis = refGlobal?.current?.openMockApis || {};
    if (Object.entries(open_apis).length > 0) {
      const res = await asyncModalConfirm({
        title: `${i18next.t('modal.forceClose')}？`,
        content: `${i18next.t('modal.closeNow')}${Object.entries(open_apis).length}${i18next.t('modal.closeNowLast')}`,
        cancelText: i18next.t('btn.cancel'),
        okText: i18next.t('modal.forceClose'),
      });
      if (res) {
        dispatch({
          type: 'mock/coverOpenMockApis',
          payload: {},
        })
      }
    }
  };
  // 关闭其他标签
  const closeOtherTargetById = async (current_id) => {
    const open_apis = refGlobal?.current?.openMockApis || {};
    if (Object.entries(open_apis).length > 1) {
      for (const id in open_apis) {
        if (`${current_id}` === `${id}`) {
          continue;
        }
        const target = open_apis[id];
        if (target.hasOwnProperty('is_changed') && target.is_changed > 0) {
          const res = await asyncModalConfirm({
            title: i18next.t('modal.tips'),
            content: `${i18next.t('modal.now')}${target?.name || i18next.t('modal.tag')
              }${i18next.t('modal.notSave')}`,
            cancelText: i18next.t('btn.cancel'),
            diyText: i18next.t('apis.saveAndClose'),
            okText: i18next.t('apis.notSave'),
          });
          if (res === undefined) {
            // 保存并关闭
            saveTargetById({ id }, () => {
              removeOpenItem(id);
            })
          } else if (res) {
            // 不保存
            removeOpenItem(id);
          } else {
            // 取消
            return;
          }
        } else {
          removeOpenItem(id);
        }
      }
    }
  };
  // 强制关闭其他标签
  const focreCloseOtherTargetById = async (current_id) => {
    const open_apis = refGlobal?.current?.openMockApis || {};
    if (Object.entries(open_apis).length > 1) {
      const res = await asyncModalConfirm({
        title: `${i18next.t('modal.forceClose')}？`,
        content: `${i18next.t('modal.closeOther')}${Object.entries(open_apis).length - 1}${i18next.t('modal.closeNowLast')}`,
        cancelText: i18next.t('btn.cancel'),
        okText: i18next.t('modal.forceClose'),
      });
      if (res) {
        for (const id in open_apis) {
          if (`${current_id}` !== `${id}`) {
            removeOpenItem(id);
          }
        }
      }
    }
  };
  // 保存所有标签
  const saveAllTarget = async () => {
    const open_apis = refGlobal?.current?.openMockApis || {};
    if (Object.entries(open_apis).length > 0) {
      for (const key in open_apis) {
        if (open_apis[key].is_changed > 0) {
          await saveTargetById({ id: key })
        }
      }
      Message('success', i18next.t('message.saveTagSuccess'));
    }
  };
  // 通过id克隆接口
  const cloneTargetById = async (id, point = 'tag') => {
    const apis = point == 'tag' ? refGlobal?.current?.openMockApis : refGlobal?.current?.mockApis;
    let newTarget = cloneDeep(apis?.[id] || '');

    if (newTarget && isPlainObject(newTarget)) {
      if (point == 'tag') {
        newTarget.target_id = uuidV4();
        newTarget.name += '副本';
        newTarget.is_changed = 1;
        addOpensByObj(newTarget);
      } else if (point == 'folder-open-tag') {
        try {
          const resp = await lastValueFrom(fetchGetMockDetail({ team_id: localStorage.getItem('team_id'), target_ids: id }));
          if (resp?.code == 0 && isArray(resp?.data?.targets) && resp.data.targets.length > 0) {
            newTarget = resp.data.targets[0];
            if (!isPlainObject(newTarget)) {
              return;
            }
          }
          newTarget.target_id = uuidV4();
          newTarget.name += '副本';
          newTarget.is_changed = 1;
          newTarget.team_id = localStorage.getItem('team_id');
          addOpensByObj(newTarget, true);
        } catch (error) { }
      } else {
        try {
          const resp = await lastValueFrom(fetchGetMockDetail({ team_id: localStorage.getItem('team_id'), target_ids: id }));
          if (resp?.code == 0 && isArray(resp?.data?.targets) && resp.data.targets.length > 0) {
            newTarget = resp.data.targets[0];
            if (!isPlainObject(newTarget)) {
              return;
            }
          }
          newTarget.target_id = uuidV4();
          newTarget.name += '副本';
          newTarget.is_changed = 1;
          newTarget = targetReorder(newTarget);
          newTarget.team_id = localStorage.getItem('team_id');
          const res = await lastValueFrom(fetchMockSave(newTarget))
          if (res?.code == 0) {
            // 刷新目录列表
            getMockList();
            Message('success', '克隆成功');
          }
        } catch (error) { }
      }
    }
  };
  const getMockList = async () => {
    try {
      const res = await lastValueFrom(fetchMockApiList({ team_id: refGlobal?.current?.CURRENT_TEAM_ID || localStorage.getItem('team_id') }))
      if (res?.code == 0 && isArray(res?.data?.targets)) {
        const tempApiList = {};
        const targets = res.data.targets;
        for (let i = 0; i < targets.length; i++) {
          tempApiList[targets[i].target_id] = targets[i];
        }
        dispatch({
          type: 'mock/coverMockApis',
          payload: tempApiList
        })
      }
    } catch (error) { }
  }
  const deleteMockItem = async (target_id, callback) => {
    try {
      const res = await lastValueFrom(fetchDeleteFolderOrApi({ target_id }))
      if (res.code === 0) {
        await removeOpenItem(target_id);
        await getMockList();

        callback && callback();
      }
    } catch (error) { }
  }
  const saveTargetById = async (data, callback) => {
    const { id, pid, options = {} } = data;
    const target_id = id;
    const open_apis = refGlobal?.current?.openMockApis || {};
    let tempTarget = cloneDeep(open_apis?.[target_id]);

    if (pid && isObject(tempTarget)) tempTarget.parent_id = pid;
    if (!isUndefined(tempTarget) && isObject(tempTarget)) {
      tempTarget.is_changed = -1;
      switch (tempTarget?.target_type) {
        case 'api':
          if (tempTarget.name === '') tempTarget.name = '新建接口';
          break;
        default:
          break;
      }
      if (tempTarget.sort == -1) {
        tempTarget = targetReorder(tempTarget);
      }
      tempTarget.team_id = localStorage.getItem('team_id');
      try {
        const res = await lastValueFrom(fetchMockSave({ ...tempTarget, ...options }))
        if (res?.code == 0) {
          // 更新open数据
          await updateOpensById({
            id: tempTarget?.target_id,
            data: tempTarget,
          });
          // 刷新目录列表
          getMockList();
          callback && callback();
        }
      } catch (error) { }
    }
  };

  const sendApi = async (id) => {
    const open_res = refGlobal?.current?.mockOpenRes || {};
    const params = {
      target_id: id,
      team_id: localStorage.getItem('team_id'),
    };
    const _open_res = cloneDeep(open_res);
    _open_res[id] = {
      ..._open_res[id],
      status: 'running',
    };
    dispatch({
      type: 'mock/updateOpenRes',
      payload: _open_res
    })
    try {
      const res = await lastValueFrom(fetchMockApiSend(params))
      if (res?.code == 0) {
        clearInterval(send_mock_api_t);
        if (isString(res?.data?.ret_id)) {
          send_mock_api_t = setInterval(() => {
            lastValueFrom(fetchGetMockResult({ ret_id: res.data.ret_id })).then((resp) => {
              const data = resp?.data;

              if (resp?.code == 0 || data) {
                clearInterval(send_mock_api_t);
                const _open_res = cloneDeep(open_res);

                if (data) {
                  _open_res[id] = {
                    ...data,
                    status: 'finish',
                  };
                } else {
                  _open_res[id] = {
                    status: 'finish',
                  };
                }

                dispatch({
                  type: 'mock/updateOpenRes',
                  payload: _open_res
                })
              }
            })
          }, 1000);
        }
      }
    } catch (error) { }
  };

  const stopSend = (id) => {
    const open_res = refGlobal?.current?.mockOpenRes || {};
    clearInterval(send_mock_api_t);
    const _open_res = cloneDeep(open_res);
    _open_res[id] = {
      // ...data,
      status: 'finish',
    };
    dispatch({
      type: 'mock/updateOpenRes',
      payload: _open_res
    })
  }
  const updateTreeData = async (params, callback) => {
    const { target_id, data } = params;
    try {
      let newApi = '';
      const resp = await lastValueFrom(fetchGetMockDetail({ team_id: localStorage.getItem('team_id'), target_ids: target_id }));
      if (resp?.code == 0 && isArray(resp?.data?.targets) && resp.data.targets.length > 0) {
        newApi = resp.data.targets[0];
      }
      if (!isPlainObject(newApi)) {
        return;
      }
      newApi = { ...newApi, ...data }
      const res = await lastValueFrom(fetchMockSave(newApi))
      if (res?.code == 0) {
        // 刷新目录列表
        getMockList();

        // open打开的需要更新
        await updateOpensById({ id: target_id, data });

        callback && callback();
      }
    } catch (error) { }
  }
  const dragUpdateTarget = ({ targetList }) => {
    const targetDatas = {};
    targetList.forEach(item => {
      targetDatas[item.target_id] = item;
    })

    const params = {
      targets: targetList,
    };
    fetchChangeSort(params).subscribe({
      next: (res) => {
        getMockList();
      }
    });
  }

  useEventBus("mock/updateOpensById",updateOpensById);
  useEventBus('mock/dragUpdateTarget', dragUpdateTarget);
  useEventBus('mock/sendApi', sendApi);
  useEventBus('mock/stopSend', stopSend);
  useEventBus('mock/saveTargetById', saveTargetById);
  useEventBus('mock/addOpenItem', addOpenItem);
  useEventBus('mock/updateOpenApiNow', updateTargetMockId);
  useEventBus('mock/removeOpenItem', removeOpenItem);
  useEventBus('mock/updateTarget', updateTarget);
  useEventBus('mock/cloneTargetById', cloneTargetById);
  useEventBus('mock/saveMockFolder', saveMockFolder);
  useEventBus('mock/getMockList', getMockList);
  useEventBus('mock/deleteMockItem', deleteMockItem);
  useEventBus('mock/updateTreeData', updateTreeData);
  // 关闭所有标签
  useEventBus('mock/closeAllTarget', closeAllTarget);
  // 强制关闭所有标签
  useEventBus('mock/focreCloseAllTarget', focreCloseAllTarget);
  // 关闭其他标签
  useEventBus('mock/closeOtherTargetById', closeOtherTargetById);
  // 强制关闭其他标签
  useEventBus('mock/focreCloseOtherTargetById', focreCloseOtherTargetById);
  // 保存所有标签
  useEventBus('mock/saveAllTarget', saveAllTarget);

};

export default useMock;
