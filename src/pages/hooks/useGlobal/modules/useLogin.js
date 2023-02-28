import { useEffect } from 'react';
// import { pushTask } from '@taskWorker';
import { filter, tap } from 'rxjs/operators';
import { global$ } from '../global';
import { getCookie } from '../../../../utils/cookie';

const useLogin = () => {
    useEffect(() => {
        const token = getCookie('token');
        const uuid = localStorage.getItem('uuid');

        // // 通知webworker初始化
        // global$.pipe(
        //   filter((message) => message.action === 'LOGIN_IN'),
        //   tap((message) => {
        //     pushTask({
        //       actionType: 'INIT_TASK',
        //       payload: {
        //         token,
        //         uuid,
        //       },
        //     });
        //   })
        // );

        // // 通知webworker停止任务
        // global$.pipe(
        //   filter((message) => message.action === 'LOGIN_OUT'),
        //   tap((message) => {
        //     pushTask({
        //       actionType: 'STOP_TASK',
        //       payload: null,
        //     });
        //   })
        // );
    }, []);
};

export default useLogin;
