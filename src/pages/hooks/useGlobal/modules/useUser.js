/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/rules-of-hooks */
import { useSelector, useDispatch } from 'react-redux';
// import { User } from '@indexedDB/user';
import { useEventBus } from '@utils/eventBus';
import { pushTask } from '@asyncTasks/index';
import { setSysConfig } from '@services/user';
import { debounce, isPlainObject } from 'lodash';
import { Settings } from '@constants/user';

const useUser = () => {
    const { CURRENT_PROJECT_ID } = useSelector((d) => d?.workspace);
    const dispatch = useDispatch();
    const saveUserConfig = async () => {
        // 读取本地数据库数据
        const uuid = localStorage.getItem('uuid') || '-1';
        // const userInfo = await User.get(uuid);
        // const { config } = userInfo || { config: Settings };
        // if (isPlainObject(config)) {
        //     setSysConfig({
        //         uuid,
        //         configure: config,
        //     }).subscribe({
        //         next: (resp) => {
        //             if (resp?.code === 10000) {
        //             } else {
        //                 // 添加异步任务
        //                 pushTask(
        //                     {
        //                         task_id: uuid,
        //                         action: 'SAVE',
        //                         model: 'CONFIG',
        //                         payload: uuid,
        //                         project_id: CURRENT_PROJECT_ID,
        //                     },
        //                     -1
        //                 );
        //             }
        //         },
        //         error: () => {
        //             // 添加异步任务
        //             pushTask(
        //                 {
        //                     task_id: uuid,
        //                     action: 'SAVE',
        //                     model: 'CONFIG',
        //                     payload: uuid,
        //                     project_id: CURRENT_PROJECT_ID,
        //                 },
        //                 -1
        //             );
        //         },
        //     });
        // }
        dispatch({
            type: 'user/updateConfig',
            // payload: config,
            payload: {}
        });
    };

    // 保存用户配置
    useEventBus('saveUserConfig', debounce(saveUserConfig, 300), [CURRENT_PROJECT_ID]);
};

export default useUser;
