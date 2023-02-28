import { from, iif, of, tap, reduce } from 'rxjs';
import { mergeMap, switchMap, concatMap, map, delay, catchError } from 'rxjs/operators';
import { fetchTargetIdsRequest, fetchApiList } from '@services/apis';
// import { IBaseCollection } from '@models/collection';
import { isLogin } from '@utils/common';
import isArray from 'lodash/isArray';
// import { Collection } from '@indexedDB/project';
import { isObject, isUndefined } from 'lodash';
import {
    getUnDownloadList,
    getLocalCollectionData,
    getTargetIdBuffers,
    multiDownloadCollection,
} from './pullTask';

const downloadCollections$ = (project_id, serverList) => {
    return from(getUnDownloadList(project_id, serverList)).pipe(
        map(getTargetIdBuffers),
        switchMap((targetIds) => of(...targetIds)),
        map((d) => ({ project_id, target_ids: d })),
        concatMap(multiDownloadCollection),
        tap((d) => {
        }),
        reduce((a, b) => a + 1, 0),
        tap((d) => {
        })
    );
};

// 获取用户左侧目录列表
export const getUserTargetList$ = (project_id) => {
    return iif(
        isLogin,
        fetchTargetIdsRequest({ project_id }).pipe(
            mergeMap((res) => {
                if (res?.code === 10000 && isArray(res?.data?.list)) {
                    return downloadCollections$(project_id, res?.data?.list);
                }
                return getLocalCollectionData(project_id);
            }),
            catchError((eee) => {
                return getLocalCollectionData(project_id);
            })
        ),
        getLocalCollectionData(project_id)
    );
};

// 获取所选接口及父级全部接口信息列表
export const getAllEffectCollections = async (project_id, target_Ids) => {
    // step1.获取当前项目下全部接口列表
    const collectionList = await Collection.where({ project_id }).toArray();
    const tempObj = {};
    for (const item of collectionList) {
        tempObj[item.target_id] = item;
    }

    const resultObj = {};

    const digFindParent = (target_id) => {
        const dataItem = tempObj[target_id];
        if (isObject(dataItem)) {
            resultObj[dataItem.target_id] = dataItem;

            const parent = tempObj[dataItem.parent_id];
            if (isObject(parent) && isUndefined(resultObj[dataItem.parent_id])) {
                digFindParent(dataItem.parent_id);
            }
        }
    };

    for (const target_id of target_Ids) {
        digFindParent(target_id);
    }
    return Object.values(resultObj);
};

const loopGetApiList = (page, size) => {
    
}

export const getApiList$ = (params) => {
    const defaultParams = {
        // page: 1,
        // size: 100,
        team_id: localStorage.getItem('team_id'),
    }
    return from(fetchApiList(params ? params : defaultParams)).pipe(
        tap(res => {
            return res;
        })
    )
};