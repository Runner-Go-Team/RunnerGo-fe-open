import { useEffect } from 'react';
import useCollection from './modules/useCollection';
import useProject from './modules/useProject';
import useEnvs from './modules/useEnvs';
import useOpens from './modules/useOpens';
import useOpenTabs from './modules/useOpenTabs';
import useAutoImport from './modules/useAutoImport';
import useDescription from './modules/useDescription';
import useWebsocket from './modules/useWebsocket';
import useglobalRef from './modules/useglobalRef';
import useUser from './modules/useUser';
import useApplication from './modules/useApplication';
import useScene from './modules/useScene';
import usePlan from './modules/usePlan';
import useCase from './modules/useCase';
import useMock from './modules/useMock';
import useAutoPlan from './modules/useAutoPlan';
import { global$ } from './global';
import { getCookie } from '@utils';
import { fetchUpdateConfig, fetchUserConfig } from '@services/user';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { lastValueFrom } from 'rxjs';
import qs from 'qs';
// import { useLocation } from 'react-router-dom';

const useGlobal = (props) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { search, pathname } = location;
    const { team_id } = qs.parse(search.slice(1));
    const dispatch = useDispatch();
    const refGlobal = useglobalRef();

    const initProject = async () => {
        try {
            if (team_id) {
                const params = {
                    settings: {
                        current_team_id: team_id
                    }
                };
                const res = await lastValueFrom(fetchUpdateConfig(params));
                if (res?.code == 0) {
                    localStorage.setItem('team_id', team_id);
                    localStorage.removeItem('open_scene');
                    navigate(location.pathname);
                    dispatch({
                        type: 'user/updateTeamId',
                        payload: team_id
                    })
                }
            } else {
                const resp = await lastValueFrom(fetchUserConfig());
                const { code, data: { settings: { current_team_id } } } = resp;
                if (code === 0) {
                    localStorage.setItem('team_id', current_team_id);
                    dispatch({
                        type: 'user/updateTeamId',
                        payload: current_team_id
                    })
                }
            }
        } catch (error) { }
        const token = getCookie('token');
        // const uuid = localStorage.getItem('uuid')
        // 项目初始化
        if (token) {
            global$.next({
                action: 'INIT_APPLICATION',
            });
        }
        // 预加载结束
        dispatch({
            type: 'global/updatePreLoader',
            payload:false
        })
    }

    useApplication({ refGlobal });
    useUser();
    useProject();
    useEnvs();
    useCollection();
    useMock({ refGlobal });
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
            initProject();
        }, []);
};

export default useGlobal;
