import { useEffect } from 'react';
import { from } from 'rxjs';
import { tap, filter, map, catchError } from 'rxjs/operators';
import { saveEnvRequest } from '@services/envs';
import { pushTask } from '@asyncTasks/index';
import isObject from 'lodash/isObject';
// import { Envs } from '@indexedDB/project';
import { global$ } from '../global';

const useEnvs = () => {
    // 保存环境
    const saveEnv = async (env) => {
        if (env && isObject(env)) {
            await Envs.put(env, env.id);
            // todo 请求接口 失败才添加异步任务
            from(saveEnvRequest(env)).subscribe({
                next(resp) {
                    if (resp?.code === 10000) {
                    } else {
                        pushTask(
                            {
                                task_id: env.id,
                                action: 'SAVE',
                                model: 'ENVS',
                                payload: env.id,
                                project_id: env.project_id,
                            },
                            -1
                        );
                    }
                },
                error() {
                    pushTask(
                        {
                            task_id: env.id,
                            action: 'SAVE',
                            model: 'ENVS',
                            payload: env.id,
                            project_id: env.project_id,
                        },
                        -1
                    );
                },
            });
        }
    };
    useEffect(() => {
        // 保存环境
        global$
            .pipe(
                filter((d) => d?.action === 'SAVE_ENV'),
                tap(() => {
                    // console.log('保存环境----start');
                }),
                map((d) => d?.payload),
                tap((d) => saveEnv(d)),
                catchError((err, scop$) => scop$)
            )
            .subscribe();
    }, []);
};

export default useEnvs;
