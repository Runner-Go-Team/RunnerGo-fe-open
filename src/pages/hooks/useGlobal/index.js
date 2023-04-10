import { useEffect } from 'react';
import useCollection from './modules/useCollection';
import useProject from './modules/useProject';
import useEnvs from './modules/useEnvs';
import useOpens from './modules/useOpens';
import useOpenTabs from './modules/useOpenTabs';
import useAutoImport from './modules/useAutoImport';
import useDescription from './modules/useDescription';
import useWebsocket from './modules/useWebsocket';
import useUser from './modules/useUser';
import useApplication from './modules/useApplication';
import useScene from './modules/useScene';
import usePlan from './modules/usePlan';
import useCase from './modules/useCase';
import useAutoPlan from './modules/useAutoPlan';
import { global$ } from './global';
// import { useLocation } from 'react-router-dom';

import { getCookie } from '../../../utils/cookie';

const useGlobal = (props) => {

    useApplication();
    useUser();
    useProject();
    useEnvs();
    useCollection();
    useOpens();
    useOpenTabs();
    useAutoImport();
    useDescription();
    useWebsocket();
    useScene(),
    useCase(),
    useAutoPlan(),
    usePlan(),
        useEffect(() => {
            const token = localStorage.getItem('runnergo-token');
            // const uuid = localStorage.getItem('uuid')
            // 项目初始化
            if (token) {
                global$.next({
                    action: 'INIT_APPLICATION',
                });
            }

        }, []);
};

export default useGlobal;
