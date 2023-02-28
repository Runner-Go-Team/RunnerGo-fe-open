// import { TestReports } from '@indexedDB/runner';
import {
    getAllSimpleProcessTestReportList,
    getMultiProcessTestReportList,
} from '@services/projects';
import { isLogin } from '@utils/common';
import { mergeMap, Observable, switchMap, concatMap, from, of, throwError, catchError } from 'rxjs';
import { sortBy, isArray, isObject, isString, chunk } from 'lodash';

export const getLocalReportList = async (project_id) => {
    // const list = await TestReports.where({ project_id }).toArray();
    // if (isArray(list)) {
    //     return sortBy(list, ['end_time']);
    // }
    return [];
};

export const getReportDetail = async (report_id) => {
    // const result = await TestReports.get(report_id);

    // if (isObject(result)) {
    //     return result;
    // }
    return null;
};
// 对比本地和服务器分享列表数据
const compareLoaclAndRemoteSingleTestList = async (remoteShareList, project_id) => {
    const localSingleList = (await getLocalReportList(project_id)) || [];
    const localSingleObj = {};
    localSingleList.forEach((item) => {
        if (item.hasOwnProperty('report_id')) localSingleObj[item.report_id] = item;
    });
    const addArr = [];
    const deleteArr = [];
    if (isArray(remoteShareList)) {
        remoteShareList.forEach((i) => {
            const report_id = i?.report_id;
            const status = i?.status;
            if (isString(report_id) && report_id.length > 0) {
                // 本地不存在直接添加
                if (!localSingleObj.hasOwnProperty(report_id)) {
                    addArr.push(report_id);
                }
                // 服务器版本大于本地版本
                if (i?.version > localSingleObj[report_id]?.version && status == 1) {
                    addArr.push(report_id);
                }
                // 本地需要删除的列表
                if (localSingleObj.hasOwnProperty(report_id) && status != 1) {
                    deleteArr.push(report_id);
                }
            }
        });
    }
    // 删除本地数据
    if (deleteArr.length > 0) {
        // TestReports.bulkDelete(deleteArr);
    }

    return chunk(addArr, 500);
};
// 获取测试报告列表
export const getReportList$ = (event$) => {
    return event$.pipe(
        mergeMap((project_id) => {
            const current_project_id = project_id || '-1';
            if (isLogin()) {
                return getAllSimpleProcessTestReportList({
                    project_id: current_project_id,
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
                                    return getMultiProcessTestReportList({
                                        project_id: current_project_id,
                                        report_ids: arr,
                                    }).pipe(
                                        concatMap((resp) => {
                                            if (resp.code === 10000) {
                                                if (isArray(resp.data)) {
                                                    // TestReports.bulkPut(resp.data);
                                                }
                                            }
                                            throwError(() => new Error(''));
                                        })
                                    );
                                })
                            );
                        }
                        return getLocalReportList(current_project_id);
                    }),
                    catchError(() => {
                        return getLocalReportList(current_project_id);
                    })
                );
            }
            return getLocalReportList(current_project_id);
        })
    );
};
export default {
    getLocalReportList,
    getReportDetail,
    getReportList$,
};
