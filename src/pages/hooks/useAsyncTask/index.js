import { useEffect } from 'react';
import { taskInit } from '../../../asyncTasks/index';

export const useAsyncTask = () => {
    useEffect(() => {
        //  taskInit();
    }, []);
};

export default useAsyncTask;
