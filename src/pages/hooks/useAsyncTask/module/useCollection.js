import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IBaseCollection } from '@dto/collection';
import { from } from 'rxjs';
import { pluck, filter, map, switchMap, tap, mergeMap, catchError } from 'rxjs/operators';
import { ITaskAction } from '@dto/asyncTask';
import { Collection } from '@indexedDB/project';
import pick from 'lodash/pick';
import { Message } from 'adesign-react';
import { taskObservable$, pushTask } from '../taskWorker';

const useProject = (uuid, token) => {
    const dispatch = useDispatch();

    const handlePullCollectionResponse = (resp) => {
        if (resp.code !== 10000) {
            Message('error', resp.msg);
        }

        const project_id = resp?.data?.project_id;
        return from(Collection.where('project_id').equals(project_id).toArray()).pipe(
            tap((dataList) => {
                const apiData = {};
                dataList.forEach((item) => {
                    apiData[`${item.target_id}`] = pick(item, [
                        'target_type',
                        'target_id',
                        'name',
                        'sort',
                        'mark',
                        'status',
                        'method',
                        'parent_id',
                        'is_locked',
                        'is_example',
                        'url',
                    ]);
                });
                dispatch({
                    type: 'apis/updateApiDatas',
                    payload: apiData,
                });
            })
        );
    };

    useEffect(() => {
        taskObservable$
            .pipe(
                filter((message) => message.actionType === 'PULL'),
                filter((message) => message.module === 'COLLECTION'),
                map((message) => message.payload),
                switchMap(handlePullCollectionResponse)
            )
            .subscribe();
    }, []);
};

export default useProject;
