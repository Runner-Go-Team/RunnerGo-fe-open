import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filter, switchMap, map, concatMap } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { getApiList$ } from '@rxUtils/collection';
import { getSceneList$ } from '@rxUtils/scene';
import { getLocalTargets } from '@busLogics/projects';
// import { Collection } from '@indexedDB/project';
// import { User } from '@indexedDB/user';
import { v4 as uuidv4 } from 'uuid';
import isObject from 'lodash/isObject';
import Bus, { useEventBus } from '@utils/eventBus';
import { getBaseCollection } from '@constants/baseCollection';
import { SaveTargetRequest, addMultiTargetRequest, fetchHandleFolder } from '@services/apis';
import { fetchCreateGroup, fetchCreateScene } from '@services/scene';
import { cloneDeep, isArray, isPlainObject, isString, isUndefined, max } from 'lodash';
import { pushTask } from '@asyncTasks/index';
import dayjs from 'dayjs';
import { global$ } from '../global';
import { fetchSceneList } from '@services/scene';
import { useParams } from 'react-router-dom';

const useCollection = () => {
    const dispatch = useDispatch();
    const { CURRENT_PROJECT_ID } = useSelector((store) => store?.workspace);
    const sceneDatas = useSelector((store) => store.scene.sceneDatas);
    const apiDatas = useSelector((store) => store.apis.apiDatas);
    const updateCollectionById = async (payload) => {
        const { id, data } = payload;
        let target = await Collection.get(id);
        if (target && isObject(target)) {
            target = { ...target, ...data };
            await Collection.put(target, target.target_id);
        }
    };
    const getSort = () => {
        if (Object.values(apiDatas).length === 0) {
            return 1;
        }
        const _list = Object.values(apiDatas).filter(item => `${item.parent_id}` === '0');
        return _list.length + 1;
    };
    // 重新排序
    const targetReorder = (target) => {
        if (isObject(target) && target.hasOwnProperty('parent_id')) {
            const parentKey = target.parent_id || '0';
            const project_id = target?.project_id;
            // const projectNodes = await Collection.where('project_id').anyOf(project_id).toArray();
            const projectNodes = Object.values(apiDatas);
            let sort = 0;
            const rootNodes = projectNodes.filter((item) => `${item.parent_id}` === `${parentKey}`);
            const nodeSort = rootNodes.map((item) => item.sort);
            sort = max(nodeSort) || 0;
            target.sort = sort + 1;
        }
        return target;
    };

    // 过滤key为空的值
    const filterEmptyKey = async (target) => {
        const { target_type } = target;
        if (target_type === 'api' || target_type === 'websocket') {
            if (target?.request) {
                if (isArray(target?.request?.header?.parameter)) {
                    target.request.header.parameter = target.request.header.parameter.filter(
                        (ite) => ite.key !== ''
                    );
                }
                if (isArray(target?.request?.body?.parameter)) {
                    target.request.body.parameter = target.request.body.parameter?.filter(
                        (ite) => ite.key !== ''
                    );
                    target.request.body.parameter?.forEach((ite) => {
                        // 过滤文件对象
                        if (ite.type === 'File' && ite.key !== '' && typeof ite?.value !== 'string') {
                            try {
                                ite.value = ite?.value?.map((it) => it.name).toString();
                            } catch (error) {
                                ite.value = '';
                            }
                        }
                    });
                }
                if (isArray(target?.request?.query?.parameter)) {
                    target.request.query.parameter = target.request.query.parameter.filter(
                        (ite) => ite.key !== ''
                    );
                }
            }
        }
        if (target_type === 'folder') {
            target.request.header =
                target?.request?.header?.filter((ite) => ite.key !== '') || target.request.header;
            target.request.body =
                target?.request?.body?.filter((ite) => ite.key !== '') || target.request.body;
            target.request.query =
                target?.request?.query?.filter((ite) => ite.key !== '') || target.request.query;
        }
        return target;
    };

    const addSceneItem = async (data, callback) => {
        const { type, pid, param, from, plan_id, clone, clone_id } = data;
        let newScene = getBaseCollection(type);
        if (!newScene) return;
        newScene.parent_id = pid;
        if (isPlainObject(param)) {
            newScene = { ...newScene, ...param };
        }
        newScene['team_id'] = localStorage.getItem('team_id');
        let from_list = {
            'scene': 1,
            'plan': 2,
            'auto_plan': 3
        }
        newScene.source = from_list[from];
        plan_id && (newScene.plan_id = plan_id);
        // return;
        fetchCreateScene(newScene).subscribe({
            next: async (resp) => {
                const { code, data } = resp;
                if (code === 0) {
                    if (clone) {
                        Bus.$emit('cloneSceneFlow', resp.data.target_id, clone_id);
                        if (from === 'plan') {
                            Bus.$emit('cloneSceneTask', resp.data.target_id, clone_id, plan_id);
                        }
                    }
                    if (from === 'scene') {
                        global$.next({
                            action: 'RELOAD_LOCAL_SCENE',
                        });
                    } else if (from === 'plan') {
                        global$.next({
                            action: 'RELOAD_LOCAL_PLAN',
                            id: plan_id
                        });
                    } else if (from === 'auto_plan') {
                        global$.next({
                            action: 'RELOAD_LOCAL_AUTO_PLAN',
                            id: plan_id
                        });
                    }
                }
                callback && callback(code, data);
            }
        })
    }

    const addSceneGroupItem = async (data, callback) => {
        const { type, pid, param, from, plan_id } = data;
        let newSceneGroup = getBaseCollection(type);
        if (!newSceneGroup) return;
        newSceneGroup.parent_id = pid;
        if (isPlainObject(param)) {
            newSceneGroup = { ...newSceneGroup, ...param };
        }
        newSceneGroup['team_id'] = localStorage.getItem('team_id');
        const from_list = {
            'scene': 1,
            'plan': 2,
            'auto_plan': 3
        }

        newSceneGroup.source = from_list[from];
        plan_id && (newSceneGroup.plan_id = plan_id);
        // return;
        fetchCreateGroup(newSceneGroup).subscribe({
            next: async (resp) => {
                const { code } = resp;
                if (code === 0) {
                    callback && callback();
                    if (from === 'scene') {
                        global$.next({
                            action: 'RELOAD_LOCAL_SCENE',
                        });
                    } else if (from === 'plan') {
                        global$.next({
                            action: 'RELOAD_LOCAL_PLAN',
                            id: plan_id,
                        });
                    } else if (from === 'auto_plan') {
                        global$.next({
                            action: 'RELOAD_LOCAL_AUTO_PLAN',
                            id: plan_id,
                        });
                    }
                }
            }
        })

        // setTimeout(() => {
        //     // 刷新左侧目录列表
        //     global$.next({
        //         action: 'RELOAD_LOCAL_COLLECTIONS',
        //     });
        // }, 100);

    }

    const addCollectionItem = async (data, callback) => {
        const { type, pid, param } = data;
        let newCollection = getBaseCollection(type);
        // newCollection.project_id = CURRENT_PROJECT_ID || '-1';
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
        // newCollection.sort = getSort(apiDatas);

        // sort 排序
        // if (newCollection?.sort == -1) await targetReorder(newCollection);

        // 过滤key为空的值
        // filterEmptyKey(newCollection);

        // 添加本地库
        // await Collection.put(newCollection, newCollection?.target_id);
        // 上传服务器 失败走异步任务
        newCollection['team_id'] = localStorage.getItem('team_id');

        // return;
        fetchHandleFolder(newCollection).subscribe({
            next: async (resp) => {
                const { code } = resp;
                if (code === 0) {
                    global$.next({
                        action: 'GET_APILIST',
                    });
                    callback && callback();
                }
            },
            error: () => {
                // 失败存异步任务
                pushTask(
                    {
                        task_id: newCollection.target_id,
                        action: 'SAVE',
                        model: newCollection?.target_type.toUpperCase(),
                        payload: newCollection.target_id,
                        project_id: CURRENT_PROJECT_ID,
                    },
                    -1
                );
            },
        });

    };
    const busUpdateCollectionById = async (req, callback) => {
        const { id, data, oldValue } = req;
 
        const collection = cloneDeep(oldValue);
        const params = {
            ...collection,
            ...data
        };
        fetchHandleFolder(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    callback && callback();
                    // 刷新左侧目录列表
                    global$.next({
                        action: 'GET_APILIST',
                    });
                }
            }
        })
    };
    // 删除目录区某个集合 通过id
    const deleteCollectionById = async (id) => {
        const deleteIds = Array.isArray(id) ? id : [id];

        for (const targetId of deleteIds) {
            Collection.update(targetId, {
                status: -1,
                update_dtime: dayjs().valueOf(),
            }).then(() => {
                // 删除opens
                Bus.$emit('removeOpenItem', targetId);
            });
        }

        // todo
        global$.next({
            action: 'GET_APILIST',
            payload: CURRENT_PROJECT_ID,
        });
    };

    // 批量新增
    const bulkAddCollection = async (
        targets,
        project_id,
        RELOAD_LOCAL_COLLECTIONS = true
    ) => {
        try {
            await Collection.bulkPut(targets);
            const resp = await lastValueFrom(
                addMultiTargetRequest({
                    targets,
                    is_socket: 1,
                    project_id,
                })
            );
            if (resp.code !== 10000) {
                // 失败存异步任务
                pushTask(
                    {
                        task_id: uuidv4(),
                        action: 'BATCHSAVE',
                        model: 'API',
                        payload: targets,
                        project_id,
                    },
                    -1
                );
            }
        } catch (error) {
            pushTask(
                {
                    task_id: uuidv4(),
                    action: 'BATCHSAVE',
                    model: 'API',
                    payload: targets,
                    project_id,
                },
                -1
            );
        }
        RELOAD_LOCAL_COLLECTIONS &&
            global$.next({
                action: 'RELOAD_LOCAL_COLLECTIONS',
                payload: project_id,
            });
    };

    const loopGetScene = (page, size, needReq) => {
        const params = {
            page,
            size,
            team_id: localStorage.getItem('team_id'),
            source: 1,
        };
        fetchSceneList(params).subscribe({
            next: ({ data: { targets, total } }) => {
                const tempSceneList = {};
                if (targets instanceof Array) {
                    for (let i = 0; i < targets.length; i++) {
                        tempSceneList[targets[i].target_id] = targets[i];
                    }
                }
                const sceneList = cloneDeep(sceneDatas);
                const _sceneList = Object.assign(sceneList, tempSceneList);
                dispatch({
                    type: 'scene/updateSceneDatas',
                    payload: _sceneList
                })
                if (needReq - 100 > 0) {
                    loopGetScene(page + 1, size, needReq - 100);
                }
            }
        })
    }

    useEffect(() => {
        // 修改collection 数据 （包括indexedDB和redux）
        global$
            .pipe(
                filter((d) => d.action === 'UPDATE_COLLECTION_BY_ID'),
                map((d) => d.payload),
                concatMap(updateCollectionById),
                switchMap(async () => {
                    const userData = await User.get(localStorage.getItem('uuid'));
                    global$.next({
                        action: 'RELOAD_LOCAL_COLLECTIONS',
                        payload: userData?.workspace?.CURRENT_PROJECT_ID || '-1',
                    });
                })
            )
            .subscribe();

        global$
            .pipe(
                filter((d) => d.action === 'RELOAD_LOCAL_COLLECTIONS'),
                map((d) => d.payload),
                concatMap(getApiList$),
                switchMap(async ({ data: { targets } }) => {
                    const tempApiList = {};
                    for (let i = 0; i < targets.length; i++) {
                        tempApiList[targets[i].target_id] = targets[i];
                    }
                    dispatch({
                        type: 'apis/updateApiDatas',
                        payload: tempApiList,
                    });
                })
            )
            .subscribe();

        global$
            .pipe(
                filter((d) => d.action === 'RELOAD_LOCAL_SCENE'),
                map((d) => d.payload),
                concatMap((e) => getSceneList$(e, 'scene')),
                switchMap(async ({ data: { targets, total } }) => {
                    const tempSceneList = {};
                    if (targets instanceof Array) {
                        for (let i = 0; i < targets.length; i++) {
                            tempSceneList[targets[i].target_id] = targets[i];
                        }
                    }
                    dispatch({
                        type: 'scene/updateSceneDatas',
                        payload: tempSceneList
                    })
                    // if (total > 100) {
                    //     loopGetScene(2, 100, total - 100);
                    // }
                })
            )
            .subscribe();
    }, []);
    useEventBus('bulkAddCollection', bulkAddCollection, []);
    useEventBus('addCollectionItem', addCollectionItem, [apiDatas]);
    useEffect(() => {
        Bus.$on('addCollectionItem', addCollectionItem);
        Bus.$on('addSceneGroupItem', addSceneGroupItem);
        Bus.$on('addSceneItem', addSceneItem);
        Bus.$on('busUpdateCollectionById', busUpdateCollectionById);
        Bus.$on('deleteCollectionById', deleteCollectionById);

        return () => {
            const offArr = ['addCollectionItem', 'busUpdateCollectionById', 'deleteCollectionById'];
            // 销毁订阅
            offArr.forEach((i) => {
                Bus.$off(i);
            });
        };
    }, [CURRENT_PROJECT_ID]);
};

export default useCollection;
