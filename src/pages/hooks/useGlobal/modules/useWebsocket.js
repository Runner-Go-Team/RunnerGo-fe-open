/* eslint-disable no-await-in-loop */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Bus from '@utils/eventBus';
import { useTranslation } from 'react-i18next';
import { Message } from '@arco-design/web-react';
import { getUserConfig$ } from '@rxUtils/user';
import { global$ } from '@hooks/useGlobal/global';
import { useNavigate, useLocation } from 'react-router-dom';
import { RD_ADMIN_URL } from '@config';
import { isString } from 'lodash';

const useWebsocket = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const location = useLocation();

    // 处理协作推送的消息
    const handleWebSocket = (res) => {
        const { code, data, em, et, route_url } = res;
        if (code === 20003 || code === 10006) {
            Bus.$emit('closeWs');
            localStorage.removeItem('runnergo-token');
            localStorage.removeItem('expire_time_sec');
            localStorage.removeItem('team_id');
            localStorage.removeItem('settings');
            localStorage.removeItem('open_apis');
            localStorage.removeItem('open_scene');
            localStorage.removeItem('open_plan');
            localStorage.removeItem("package_info");
            window.location.href = `${RD_ADMIN_URL}/#/login`;
        }

        if (code !== 0) {
            if (i18n.language === 'en') {
                Message.error(em);
            } else {
                Message.error(et);
            }
            return;
        }



        if (route_url === 'home_page') {
            dispatch({
                type: 'dashboard/updateHomeData',
                payload: data
            })
        } else if (route_url === 'stress_plan_list') {
            dispatch({
                type: 'plan/updatePlanList',
                payload: data
            })
        } else if (route_url === 'stress_report_list') {
            dispatch({
                type: 'report/updateReportList',
                payload: data
            })
        } else if (route_url === 'auto_plan_list') {
            dispatch({
                type: 'auto_plan/updateAutoPlanList',
                payload: data
            })
        } else if (route_url === 'auto_report_list') {
            dispatch({
                type: 'auto_report/updateAutoReportList',
                payload: data
            })
        } else if (route_url === 'stress_plan_detail') {
            dispatch({
                type: 'plan/updatePlanDetail',
                payload: data
            })
        } else if (route_url === 'stress_report_debug') {
            dispatch({
                type: 'report/updateDebugList',
                payload: data
            })
        } else if (route_url === 'stress_report_machine_monitor') {
            dispatch({
                type: 'report/updateMonitorList',
                payload: data
            })
        } else if (route_url === 'stress_report_detail') {
            dispatch({
                type: 'report/updateReportDetail',
                payload: data
            })
        } else if (route_url === 'stress_report_task_detail') {
            dispatch({
                type: 'report/updateReportInfo',
                payload: data
            })
        } else if (route_url === 'stress_machine_list') {
            dispatch({
                type: 'machine/updateMachineList',
                payload: data
            })
        } else if (route_url === 'disband_team_notice') {
            let setIntervalList = window.setIntervalList;

            if (setIntervalList) {
                for (let i = 0; i < setIntervalList.length; i++) {
                    clearInterval(setIntervalList[i]);
                }
            }
            getUserConfig$().subscribe({
                next: () => {
                    global$.next({
                        action: 'INIT_APPLICATION',
                    });
                    window.location.href = "/#/index";
                }
            })
        } else if (route_url === 'user_logout') {
            let setIntervalList = window.setIntervalList;

            if (setIntervalList) {
                for (let i = 0; i < setIntervalList.length; i++) {
                    clearInterval(setIntervalList[i]);
                }
            }

            Bus.$emit('closeWs');
            localStorage.removeItem('runnergo-token');
            localStorage.removeItem('expire_time_sec');
            localStorage.removeItem('team_id');
            localStorage.removeItem('settings');
            localStorage.removeItem('open_apis');
            localStorage.removeItem('open_scene');
            localStorage.removeItem('open_plan');
            localStorage.removeItem("package_info");
            // localStorage.clear();
            window.location.href = `${RD_ADMIN_URL}/#/login`;
            Message.error(t('message.userLogout'));
        } else if (route_url === 'auto_plan_detail') {
            dispatch({
                type: 'auto_plan/updateAutoPlanDetail',
                payload: data
            })
        } else if (route_url === 'get_global_param') {
            dispatch({
                type: 'dashboard/updateGlobalParam',
                payload: data
            })
        } else if (route_url === 'get_scene_param') {
            dispatch({
                type: 'scene/updateSceneGlobalParam',
                payload: data
            })
        } else if (route_url === 'ui_engine_result') {
            console.log(location.pathname, "location.pathname",data);
            // 报告结果
            if (data?.is_report) {
                if (location.pathname.includes('/uiTestAuto/report') && isString(data?.topic)) {
                    Bus.$emit('element/getReportDetails', { report_id: data.topic })
                    if(data.end){
                        Bus.$emit('planList/debounceGetReportList')
                    }
                }
            } else {
                dispatch({
                    type: 'uitest_auto/updateSceneRunResult',
                    payload: data
                })
            }
        }

    };

    // websocket连接建立成功/断开
    const handleWsState = (state) => {
        dispatch({
            type: 'websocket/updateIsOpen',
            payload: state
        })
    }

    useEffect(() => {
        Bus.$on('websocket_worker', handleWebSocket);
        Bus.$on('websocket_change_state', handleWsState);
        return () => {
            Bus.$off('websocket_worker');
            Bus.$off('websocket_change_state');
        };
    }, [location.pathname]);
};

export default useWebsocket;
