// import { CombinedProcessTest, CombinedOpens } from '@indexedDB/runner';
import { Message } from 'adesign-react';
import { isLogin } from '@utils/common';
// import { TYPE_SAVE_PROCESS_TEST_SORT_REQUEST, TYPE_SORT_TARGET_LIST } from '@dto/runner';
import { getAllSimpleProcessTestList, getMultiProcessTestList } from '@services/projects';
import {
    mergeMap,
    Observable,
    switchMap,
    concatMap,
    from,
    of,
    throwError,
    catchError,
    tap,
    iif,
} from 'rxjs';

import { chunk, isArray, isString, isUndefined } from 'lodash';
// import { ICombinedProcessTest } from '@models/runner/combinedProcessTest';
import { deleteProcessTest, saveProcessTestSortRequest } from '@services/test';
// import { TYPE_GET_COMBINED_TEST_LIST, TYPE_GET_COMBINED_TEST_MAX_SORT } from './types';

// 获取测试套件最大sort
export const getTestMaxSort = async (project_id, parent_id) => {
    // const testList = await CombinedProcessTest.where({
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

export const getLocalCombineTestList = async (project_id) => {
    // const list = await CombinedProcessTest.where({ project_id }).toArray();

    // return isArray(list) ? list : [];
    return [];
};

export const saveLocalCombinedTestData = async (data) => {
    // await CombinedProcessTest.put(data, data.combined_id);
    // await CombinedOpens.put(data, data.combined_id);
};
// 对比本地和服务器分享列表数据
const compareLoaclAndRemoteCombinedTestList = async (remoteShareList, project_id) => {
    const localCombinedList = (await getLocalCombineTestList(project_id)) || [];
    const localCombinedObj = {};
    localCombinedList.forEach((item) => {
        if (item.hasOwnProperty('combined_id')) localCombinedObj[item.combined_id] = item;
    });
    const addArr = [];
    const deleteArr = [];
    if (isArray(remoteShareList)) {
        remoteShareList.forEach((i) => {
            const combined_id = i?.combined_id;
            const status = i?.status;
            if (isString(combined_id) && combined_id.length > 0) {
                // 本地不存在直接添加
                if (!localCombinedObj.hasOwnProperty(combined_id)) {
                    addArr.push(combined_id);
                }
                // 服务器版本大于本地版本
                if (i?.version > localCombinedObj[combined_id]?.version && status == 1) {
                    addArr.push(combined_id);
                }
                // 本地需要删除的列表
                if (localCombinedObj.hasOwnProperty(combined_id) && status != 1) {
                    deleteArr.push(combined_id);
                }
            }
        });
    }
    // 删除本地数据
    if (deleteArr.length > 0) {
        // CombinedProcessTest.bulkDelete(deleteArr);
    }

    return chunk(addArr, 500);
};
// 获取测试套件用例列表
export const getCombinedTestList$ = (event$) => {
    return event$.pipe(
        mergeMap((project_id) => {
            const current_project_id = project_id || '-1';
            if (isLogin()) {
                return getAllSimpleProcessTestList({
                    project_id: current_project_id,
                    process_test_type: 'combined',
                }).pipe(
                    mergeMap((resp) => {
                        if (resp.code === 10000) {
                            return from(
                                compareLoaclAndRemoteCombinedTestList(resp?.data, current_project_id)
                            ).pipe(
                                switchMap((arrs) => {
                                    if (arrs.length <= 0) {
                                        return throwError(() => new Error(''));
                                    }
                                    return of(...arrs);
                                }),
                                concatMap((arr) => {
                                    return getMultiProcessTestList({
                                        project_id: current_project_id,
                                        process_test_type: 'combined',
                                        test_ids: arr,
                                    }).pipe(
                                        concatMap((resp) => {
                                            if (resp.code === 10000) {
                                                if (isArray(resp.data)) {
                                                    // CombinedProcessTest.bulkPut(resp.data);
                                                }
                                            }
                                            throwError(() => new Error(''));
                                        })
                                    );
                                })
                            );
                        }
                        return getLocalCombineTestList(current_project_id);
                    }),
                    catchError(() => {
                        return getLocalCombineTestList(current_project_id);
                    })
                );
            }
            return getLocalCombineTestList(current_project_id);
        })
    );
};

// 删除测试套件用例/目录
export const deleteLocalCombinedTestItem = async (combined_id, project_id) => {
    // await CombinedProcessTest.where({ combined_id }).delete();
    // await CombinedOpens.where({ combined_id }).delete();
    const reqData = {
        project_id,
        process_test_type: 'combined',
        test_ids: [combined_id],
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

// 获取本地测试套件用例详情
export const getLocalCombinedTestDataInfo = async (combined_id) => {
    let dataInfo = await CombinedOpens.get(combined_id);
    if (isUndefined(dataInfo)) {
        // dataInfo = await CombinedProcessTest.get(combined_id);
        // CombinedOpens.put(dataInfo, combined_id);
    }

    if (isUndefined(dataInfo)) {
        return null;
    }

    return dataInfo;
};

// 更新本地排序
export const updateLocalCombinedTestSort = async (target_list) => {
    if (isArray(target_list)) {
        for (const item of target_list) {
            // eslint-disable-next-line no-await-in-loop
            // await CombinedProcessTest.update(item.combined_id, {
            //     parent_id: item.parent_id,
            //     sort: item.sort,
            // });
        }
    }
};

export const updateCombinedTestSort$ = (params) => {
    const updateCombinedTestSortError$ = of(params).pipe(
        tap(() => {
        }),
        concatMap(updateLocalCombinedTestSort.bind(null, params.target_list)),
        tap(() => {
           
        })
    );

    return iif(
        isLogin,
        saveProcessTestSortRequest(params).pipe(
            concatMap((resp) => {
                if (resp.code === 10000) {
                    return updateLocalCombinedTestSort(params.target_list);
                }
                return throwError(() => new Error('保存失败'));
            }),
            catchError((message) => {
                Message('error', message);
                return updateCombinedTestSortError$;
            })
        ),
        updateCombinedTestSortError$
    );
};

// 组合测试打开详情（先获取opens数据，如果没有将数据插入到opens）

export default {
    getTestMaxSort,
    getLocalCombineTestList,
    saveLocalCombinedTestData,
    getCombinedTestList$,
    deleteLocalCombinedTestItem,
    getLocalCombinedTestDataInfo,
    updateCombinedTestSort$,
};
