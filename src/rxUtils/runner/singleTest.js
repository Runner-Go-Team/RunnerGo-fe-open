// import { SingleProcessTest, SingleOpens } from '@indexedDB/runner';
import { Message } from 'adesign-react';
import { arrayToTreeObject, isLogin } from '@utils/common';
import {
    mergeMap,
    Observable,
    switchMap,
    concatMap,
    from,
    of,
    throwError,
    catchError,
    iif,
    tap,
} from 'rxjs';
import { chunk, isArray, isString, isUndefined, sortBy } from 'lodash';
// import { TYPE_SORT_TARGET_LIST, TYPE_SAVE_PROCESS_TEST_SORT_REQUEST } from '@dto/runner';
import { getAllSimpleProcessTestList, getMultiProcessTestList } from '@services/projects';
import React from 'react';
import { deleteProcessTest, saveProcessTestSortRequest } from '@services/test';
// import { ISingleProcessTest } from '@models/runner/singleProcessTest';
// import { TYPE_GET_TEST_MAX_SORT, TYPE_GET_TEST_LIST } from './types';

export const getTestMaxSort = async (project_id, parent_id) => {
    // const testList = await SingleProcessTest.where({
    //     parent_id,
    //     project_id,
    // }).toArray();
    let maxSort = 0;
    if (isArray(testList)) {
        for (const item of testList) {
            if (item.sort > maxSort) {
                maxSort = item.sort;
            }
        }
    }
    return maxSort;
};

export const getLocalTestList = async (project_id) => {
    if (!isString(project_id)) {
        return [];
    }
    // const list = await SingleProcessTest.where({ project_id }).toArray();

    // return isArray(list) ? list : [];
    return [];
};

export const saveLocalTestData = async (data) => {
    // 保存opens数据
    await SingleOpens.put(data, data.test_id);

    // await SingleProcessTest.put(data, data.test_id);
};

// 对比本地和服务器分享列表数据
const compareLoaclAndRemoteSingleTestList = async (remoteShareList, project_id) => {
    const localSingleList = (await getLocalTestList(project_id)) || [];
    const localSingleObj = {};
    localSingleList.forEach((item) => {
        if (item.hasOwnProperty('test_id')) localSingleObj[item.test_id] = item;
    });
    const addArr = [];
    const deleteArr = [];
    if (isArray(remoteShareList)) {
        remoteShareList.forEach((i) => {
            const test_id = i?.test_id;
            const status = i?.status;
            if (isString(test_id) && test_id.length > 0) {
                // 本地不存在直接添加
                if (!localSingleObj.hasOwnProperty(test_id)) {
                    addArr.push(test_id);
                }
                // 服务器版本大于本地版本
                if (i?.version > localSingleObj[test_id]?.version && status == 1) {
                    addArr.push(test_id);
                }
                // 本地需要删除的列表
                if (localSingleObj.hasOwnProperty(test_id) && status != 1) {
                    deleteArr.push(test_id);
                }
            }
        });
    }
    // 删除本地数据
    if (deleteArr.length > 0) {
        // SingleProcessTest.bulkDelete(deleteArr);
    }

    return chunk(addArr, 500);
};

// 获取测试用例用例列表
export const getSingleTestList$ = (event$) => {
    return event$.pipe(
        mergeMap((project_id) => {
            const current_project_id = project_id || '-1';
            if (isLogin()) {
                return getAllSimpleProcessTestList({
                    project_id: current_project_id,
                    process_test_type: 'single',
                }).pipe(
                    mergeMap((resp) => {
                        if (resp.code === 10000) {
                            return from(compareLoaclAndRemoteSingleTestList(resp?.data, current_project_id)).pipe(
                                switchMap((arrs) => {
                                    if (arrs.length <= 0) {
                                        return throwError(() => new Error(''));
                                    }
                                    return of(...arrs);
                                }),
                                concatMap((arr) => {
                                    return getMultiProcessTestList({
                                        project_id: current_project_id,
                                        process_test_type: 'single',
                                        test_ids: arr,
                                    }).pipe(
                                        concatMap((resp) => {
                                            if (resp.code === 10000) {
                                                if (isArray(resp?.data)) {
                                                    // SingleProcessTest.bulkPut(resp.data);
                                                    return of('');
                                                }
                                            }
                                            return throwError(() => new Error(''));
                                        })
                                    );
                                })
                            );
                        }
                        return getLocalTestList(current_project_id);
                    }),
                    catchError(() => {
                        return getLocalTestList(current_project_id);
                    })
                );
            }
            return getLocalTestList(current_project_id);
        })
    );
};

// 删除测试用例/目录
export const deleteLocalTestItem = async (test_id, project_id) => {
    // await SingleProcessTest.where({ test_id }).delete();
    await SingleOpens.where({ test_id }).delete();
    // await TestEvents.where({ test_id }).delete();
    const reqData = {
        project_id,
        process_test_type: 'single',
        test_ids: [test_id],
    };

    deleteProcessTest({ ...reqData, is_socket: 1 }).subscribe({
        next(resp) {
            if (resp?.code === 10000) {
                Message('success', '删除成功');
            }
        },
        error() {
           
        },
    });
};

// 获取本地测试用例详情
export const getLocalTestDataInfo = async (test_id) => {
    // const dataInfo = await SingleProcessTest.get(test_id);

    if (isUndefined(dataInfo)) {
        return null;
    }

    return dataInfo;
};

// 测试用例打开详情（先获取opens数据，如果没有将数据插入到opens）
export const getLocalOpensData = async (test_id) => {
    let opensInfo = await SingleOpens.get(test_id);
    if (isUndefined(opensInfo) || opensInfo === null) {
        // opensInfo = await SingleProcessTest.get(test_id);
        await SingleOpens.put(opensInfo);
    }

    if (isUndefined(opensInfo)) {
        return null;
    }

    return opensInfo;
};

// 更新本地排序
export const updateLocalSingleTestSort = async (target_list) => {
    if (isArray(target_list)) {
        for (const item of target_list) {
            // eslint-disable-next-line no-await-in-loop
            // await SingleProcessTest.update(item.test_id, {
            //     parent_id: item.parent_id,
            //     sort: item.sort,
            // });
        }
    }
};

export const updateSingleTestSort$ = (params) => {
    const updateSingleTestSortError$ = of(params).pipe(
        tap(() => {
        }),
        concatMap(updateLocalSingleTestSort.bind(null, params.target_list)),
        tap(() => {
           
        })
    );

    return iif(
        isLogin,
        saveProcessTestSortRequest(params).pipe(
            concatMap((resp) => {
                if (resp.code === 10000) {
                    return updateLocalSingleTestSort(params.target_list);
                }
                return throwError(() => new Error('保存失败'));
            }),
            catchError((message) => {
                Message('error', message);
                return updateSingleTestSortError$;
            })
        ),
        updateSingleTestSortError$
    );
};

// 获取带层级关系的事件列表
export const getEventTreeList = (eventList) => {
    if (!isArray(eventList)) {
        return [];
    }
    const sortedList = sortBy(eventList, ['sort']);
    const beautifyList = sortedList?.map((item) => {
        const { parent_event_id: parent_id, childEvent: children, ...restItem } = item;
        return {
            ...restItem,
            children,
            parent_id,
        };
    });

    const treeList = arrayToTreeObject(beautifyList, {
        key: 'event_id',
        parent: 'parent_id',
        children: 'children',
    });

    return treeList;
};

// 根据多个test_id获取事件列表
export const getEventListFromMultiTestId = async (test_ids) => {
    if (!isArray(test_ids)) {
        return [];
    }
    // const dataList = await SingleProcessTest.where('test_id').anyOf(test_ids).toArray();
    if (isArray(dataList)) {
        let event_list = [];
        dataList.forEach((item) => {
            if (isArray(item?.event_list)) {
                event_list = event_list.concat(item?.event_list);
            }
        });
        return sortBy(event_list, ['sort']);
    }
    return [];
};
export default {
    getTestMaxSort,
    getLocalTestList,
    saveLocalTestData,
    getSingleTestList$,
    deleteLocalTestItem,
    getLocalTestDataInfo,
    getLocalOpensData,
    updateSingleTestSort$,
};
