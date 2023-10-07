import { isLogin } from '@utils/common';
import { Message } from 'adesign-react';
import {
    iif,
    catchError,
    Observable,
    of,
    from,
    map,
    tap,
    mergeMap,
    concatMap,
    throwError,
    switchMap,
    timeout,
} from 'rxjs';
// import { ShareList } from '@indexedDB/share';
// import { ICreateShare } from '@dto/share/index';
import { createShareRequest, fetchUserShareList, fetchUserShareSimpleList } from '@services/share';
import { chunk, cloneDeep, isArray, isString, isUndefined } from 'lodash';
import { getUserConfig$ } from '../user';

// 创建本地分享信息
const createLocalShareInfo = async (shareInfo) => {
    // await ShareList.put(shareInfo, shareInfo?.issue_id);
    return true;
};

const getLocalShareInfo = async (issue_id) => {
    // const result = await ShareList.get(issue_id);
    return result;
};

// 获取本地分享详情列表
export const getLocalShareList = async (project_id) => {
    // const result = await ShareList.where({ project_id }).sortBy('update_time', (list) =>
    //     list.reverse()?.filter((item) => item?.status === 1)
    // );
    // return result;
    return {};
};

// 获取本地分享Items
const getLocalShareDatas = async (project_id) => {
    // const result = await ShareList.where({ project_id }).toArray();
    const datas = {};
    // for (const item of result) {
    //     datas[item.issue_id] = item;
    // }
    return datas;
};

// 更新用户本地分享列表
const updateLocalShareList = async (serverList, project_id) => {
    const needUpdateItems = []; // 需要更新的数据

    // 本地数据
    const localData = await getLocalShareDatas(project_id);

    const physicsDeleteItems = []; // 物理删除的数据

    for (const serverItem of serverList) {
        const localItem = localData?.[serverItem?.issue_id];
        if (serverItem.status === 1) {
            if (
                isUndefined(localItem) ||
                serverItem?.version > localItem?.version ||
                localItem?.is_push === false
            ) {
                const needUpdateItem = cloneDeep(serverItem);
                needUpdateItem.is_push = 1;
                needUpdateItems.push(needUpdateItem);
            }
        } else if (isUndefined(localItem) === false) {
            physicsDeleteItems.push(serverItem.issue_id);
        }
    }

    // 批量删除
    if (physicsDeleteItems.length > 0) {
        // await ShareList.bulkDelete(physicsDeleteItems);
    }

    // 批量更新
    if (needUpdateItems.length > 0) {
        // await ShareList.bulkPut(needUpdateItems);
    }
};

// 更新本地分享详情
const updateLocalShareInfo = async (shareInfo) => {
    // await ShareList.update(shareInfo?.issue_id, {
    //     ...shareInfo,
    //     is_push: 1,
    // });
};

// 对比本地和服务器分享列表数据
const compareLoaclAndRemoteShareList = async (remoteShareList, project_id) => {
    const localShareList = (await getLocalShareList(project_id)) || [];
    const localShareObj = {};
    localShareList.forEach((item) => {
        if (item.hasOwnProperty('issue_id')) localShareObj[item.issue_id] = item;
    });
    const addArr = [];
    const deleteArr = [];
    if (isArray(remoteShareList)) {
        remoteShareList.forEach((i) => {
            const issue_id = i?.issue_id;
            const status = i?.status;
            if (isString(issue_id) && issue_id.length > 0) {
                // 本地不存在直接添加
                if (!localShareObj.hasOwnProperty(issue_id)) {
                    addArr.push(issue_id);
                }
                // 服务器版本大于本地版本
                if (i?.version > localShareObj[issue_id]?.version && status == 1) {
                    addArr.push(issue_id);
                }
                // 本地需要删除的列表
                if (localShareObj.hasOwnProperty(issue_id) && status != 1) {
                    deleteArr.push(issue_id);
                }
            }
        });
    }
    // 删除本地数据
    if (deleteArr.length > 0) {
        // ShareList.bulkDelete(deleteArr);
    }

    return chunk(addArr, 500);
};

// 获取分享信息详情
export const getShareInfo = ({ issue_id, project_id }) => {
    return iif(
        isLogin,
        fetchUserShareList({ issue_ids: [issue_id], project_id }).pipe(
            mergeMap((res) => {
                if (res?.code === 10000 && Array.isArray(res?.data) && res?.data?.length === 1) {
                    return from(updateLocalShareInfo(res.data?.[0])).pipe(
                        mergeMap(() => getLocalShareInfo(issue_id))
                    );
                }
                return getLocalShareInfo(issue_id);
            }),

            catchError(() => {
                return from(getLocalShareInfo(issue_id));
            })
        ),
        from(getLocalShareInfo(issue_id))
    );
};

// 获取分享列表
export const getShareList = (project_id) => {
    return iif(
        isLogin,
        fetchUserShareSimpleList({ project_id }).pipe(
            mergeMap((resp) => {
                if (resp.code === 10000) {
                    return from(compareLoaclAndRemoteShareList(resp?.data, project_id)).pipe(
                        switchMap((arrs) => {
                            if (arrs.length <= 0) {
                                return of([]);
                            }
                            return of(...arrs);
                        }),
                        concatMap((arr) => {
                            return fetchUserShareList({ project_id, issue_ids: arr }).pipe(
                                concatMap((resp) => {
                                    if (resp.code === 10000) {
                                        if (isArray(resp.data)) {
                                            // ShareList.bulkPut(resp.data);
                                        }
                                        throwError(() => new Error(''));
                                    }
                                })
                            );
                        })
                    );
                }
                throwError(() => new Error(''));
            }),
            catchError(() => {
                return from(getLocalShareList(project_id));
            })
        ),
        of('').pipe(mergeMap(() => getLocalShareList(project_id)))
    );
};

// 添加分享异步任务
const addCreateShareTask = (shareInfo) => {
   
};

// 新建分享信息 若云端新建成功返回true
export const createShareInfo = (shareInfo) => {
    const createShareError$ = of(shareInfo).pipe(
        tap(() => {
        }),
        concatMap(createLocalShareInfo),
        tap(() => addCreateShareTask(shareInfo)),
        map(() => shareInfo)
    );
    return iif(
        isLogin,
        of(shareInfo).pipe(
            // concatMap((shareData) => createLocalShareInfo(shareData)), // 存本地信息
            concatMap(() => createShareRequest(shareInfo).pipe(timeout(2500))), // 调api
            concatMap((resp) => {
                if (resp?.code === 10000) {
                    const newShareData = cloneDeep(resp?.data);
                    newShareData.is_push = 1;
                    newShareData.status = 1;
                    return from(createLocalShareInfo(newShareData)).pipe(map(() => newShareData));
                }
                return throwError(() => new Error('保存失败'));
            }),
            catchError(() => createShareError$)
        ),
        createShareError$
    );
};

// 删除数据并添加异步任务并返回删除成功失败状态
const deleteLocalData = async (issue_id) => {
    // todo判断用户是否只读权限
    const enableDelete = true;
    if (enableDelete) {
        // await ShareList.update(issue_id, {
        //     status: 0,
        // });
        //  await ShareList.delete(issue_id);
    }
    return enableDelete;
};

// 添加删除异步任务
const pushTaskForDeleteShare = ({ issue_id, project_id, shareName }) => {
   
};

// 删除本地分享
export const deleteShareData = ({ issue_id, project_id, shareName }) => {
    return from(deleteLocalData(issue_id)).pipe(
        tap((isDeleted) => isDeleted && pushTaskForDeleteShare({ issue_id, project_id, shareName }))
    );
};

// export const initPage = () => {
//     // 1. 获取用户基本配置
//     //
//     return getUserConfig$().
// }