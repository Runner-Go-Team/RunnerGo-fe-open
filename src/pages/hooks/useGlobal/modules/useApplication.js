import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { of } from 'rxjs';
import { tap, filter, concatMap, map, switchMap, mergeMap, catchError } from 'rxjs/operators';
import { getUserConfig$, getProjectUserList$, getIndexPage$, getRunningPlan$ } from '@rxUtils/user';
import { getUserTeamList$ } from '@rxUtils/team';
import { getUserProjectList$, getMultiProjectDetails$ } from '@rxUtils/project';
import { uploadTasks } from '@rxUtils/task';
import { getUserTargetList$, getApiList$ } from '@rxUtils/collection';
import { getShareList } from '@rxUtils/share';
import { getSingleTestList$ } from '@rxUtils/runner/singleTest';
import { getCombinedTestList$ } from '@rxUtils/runner/combinedTest';
import { getReportList$ } from '@rxUtils/runner/testReports';
import { getLocalTargets } from '@busLogics/projects';
import { useEventCallback } from 'rxjs-hooks';
import { getLocalEnvsDatas } from '@rxUtils/env';
import { isArray, isPlainObject, cloneDeep, concat } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { webSocket } from '@utils/websocket/websocket';
import WebSocket2 from '@utils/websocket/WebSocket2';
// import { LIVE_SOCKET_URL } from '@config/server';
import { isElectron } from '@utils';
import { APP_VERSION } from '@config/base';
import { fetchTeamMemberList, fetchTeamList, fetchUserConfig } from '@services/user';
import Bus, { useEventBus } from '@utils/eventBus';
import { useNavigate } from 'react-router-dom';
import { getSceneList$ } from '@rxUtils/scene';
import { getAutoPlanList$ } from '@rxUtils/auto_plan';
import { RD_WEBSOCKET_URL } from '@config';

import { fetchDashBoardInfo, fetchRunningPlan } from '@services/dashboard';
import { fetchApiList } from '@services/apis';
import { fetchTeamPackage } from '@services/pay';
import { useLocation } from 'react-router-dom';


import { global$ } from '../global';
import { Message } from 'adesign-react';

const useProject = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector((store) => store.user.userInfo);
    const apiDatas = useSelector((store) => store.apis.apiDatas);
    const location = useLocation();
    const ws = useSelector((store) => store.websocket.ws);
    // const userData = useSelector((store) => store.dashboard.userData);

    // 展示团队列表
    const handleInitTeams = ({ data: { teams } }) => {
        const teamData = {};
        teams.length && teams.forEach((data) => {
            teamData[data.team_id] = data;
        });
        dispatch({
            type: 'teams/updateTeamData',
            payload: teamData,
        });
    };
    // 展示首页基本信息
    const handleInitIndex = (res) => {
        const { data, code } = res;
        if (code === 0) {
            const { api_num, plan_num, report_num, scene_num, user, operations } = data;
            const userData = {
                api_num,
                plan_num,
                report_num,
                scene_num,
            };
            dispatch({
                type: 'dashboard/updateUserData',
                payload: userData
            });

            const newInfo = cloneDeep(userInfo);

            newInfo.email = user.email;
            newInfo.nickname = user.nickname;
            newInfo.avatar = user.avatar;
            newInfo.user_id = user.user_id;
            newInfo.role_id = user.role_id;
            newInfo.mobile = user.mobile;

            dispatch({
                type: 'user/updateUserInfo',
                payload: newInfo
            })



            dispatch({
                type: 'teams/updateLogList',
                payload: operations,
            })

        }
    }

    // 展示运行中的计划
    const handleInitRunningPlan = ({ data }) => {
        const { plans } = data;
        dispatch({
            type: 'plan/updatePlanData',
            payload: plans
        });

        Bus.$emit('getTeamMemberList')
    }

    // 展示用户配置信息
    const handleInitUserConfig = ({ data: { settings, user_info } }) => {
        if (user_info) {
            dispatch({
                type: 'user/updateUserInfo',
                payload: user_info
            })
        }
    };

    // 推送websocket消息
    const sendWsMessage = (data) => {
        if (ws) {
            if (ws.WEB_SOCKET.readyState === WebSocket.OPEN) {
                ws.Send(data);
            } else {
                ws.reconnect(`${RD_WEBSOCKET_URL}/websocket/index`);
            }
        }
    }

    // 因为某些原因, 断开websocket连接
    const closeWs = () => {
        console.log(ws);
        if (ws) {
            ws.close();
        }
    }

    // 初始化websocket连接
    const initWebSocket = () => {
        const webSocket2 = new WebSocket2();
        webSocket2.connect(`${RD_WEBSOCKET_URL}/websocket/index`);

        dispatch({
            type: 'websocket/updateWs',
            payload: webSocket2
        })
    }


    // 应用程序初始化 第一次打开应用程序
    const handleInitApplication = () => {

        dispatch({
            type: 'apis/recoverApiDatas',
        });

        const ininTheme = (userConfig) => {
            // 用户配置放入redux中
            isPlainObject(userConfig?.config) &&
                dispatch({
                    type: 'user/updateConfig',
                    payload: userConfig.config,
                });
            let linkThemeName = '';
            const theme_color = localStorage.getItem('theme_color');

            if (theme_color) {
                linkThemeName = theme_color;
                dispatch({
                    type: 'user/updateTheme',
                    payload: theme_color
                })
            } else {
                linkThemeName = 'dark'
            }


            if (theme_color === 'dark' || !theme_color) {
                document.body.setAttribute('arco-theme', 'dark');
            } else if (theme_color === 'white') {
                document.body.removeAttribute('arco-theme');
            }

            const url = `/skins/${linkThemeName}.css`;
            document.querySelector(`link[name="apt-template-link"]`).setAttribute('href', url);
        };

        const initLanguage = () => {
            const language = localStorage.getItem('i18nextLng');
            dispatch({
                type: 'user/updateLanGuaGe',
                payload: language
            })
        }


        return getUserConfig$().pipe(
            tap(handleInitUserConfig),
            concatMap((userConfig) => {
                // 初始化主题色
                ininTheme(userConfig);
                initLanguage();
                // getPackageInfo();
                getTeamMemberList();
                Bus.$emit('getTeamList');
                Bus.$emit('initWebSocket');
                Bus.$emit('reloadOpens');
                const team_id = localStorage.getItem('team_id');
                return of(team_id).pipe(
                    // concatMap(() => getUserTeamList$().pipe(tap(handleInitTeams))),
                    // concatMap(() => getIndexPage$().pipe(tap(handleInitIndex))),
                    // concatMap(() => getRunningPlan$().pipe(tap(handleInitRunningPlan))),
                    // concatMap(() => getApiList$(apiListParams).pipe(tap(handleInitApiList))),
                    tap(() => {
                        global$.next({
                            action: 'GET_APILIST'
                        })

                        global$.next({
                            action: 'RELOAD_LOCAL_SCENE'
                        })
                        const { pathname } = location;
                        let _pathname = pathname.split('/');
                        if (_pathname[1] === 'plan' && _pathname[2] === 'detail') {
                            global$.next({
                                action: 'RELOAD_LOCAL_PLAN',
                                id: _pathname[3]
                            })
                        }
                        if (_pathname[1] === 'Tplan' && _pathname[2] === 'detail') {
                            global$.next({
                                action: 'RELOAD_LOCAL_AUTO_PLAN',
                                id: _pathname[3]
                            })
                        }
                    }),
                );
            })
        );
    };


    // 初始化用户统计长连接
    // const liveSocketInit = () => {
    //     const webSocket2 = new WebSocket2();
    //     let machineid = localStorage.getItem('machineid');
    //     if (!machineid) {
    //         machineid = uuidv4();
    //         localStorage.setItem('machineid', machineid);
    //     }
    //     webSocket2.connect(
    //         `${LIVE_SOCKET_URL}?machineid=${machineid}&terminal=${isElectron() ? 'client' : 'web'
    //         }&version=${APP_VERSION}`
    //     );
    //     return webSocket2;
    // };

    // 获取当前团队成员列表
    const getTeamMemberList = () => {
        const query = {
            team_id: localStorage.getItem('team_id'),
        }
        fetchTeamMemberList(query)
            .pipe(
                tap((res) => {
                    const { code, data: { members } } = res;

                    if (code === 0) {
                        dispatch({
                            type: 'teams/updateTeamMember',
                            payload: members
                        })
                    }
                })
            )
            .subscribe();
    }
    // 获取当前团队列表
    const getTeamList = () => {
        fetchTeamList().subscribe({
            next: (res) => {
                const { code, data } = res;
                if (code === 0) {
                    const { teams } = data;

                    if (isArray(teams)) {
                        const teamData = {};
                        teams.forEach((data) => {
                            teamData[data.team_id] = data;
                        });
                        dispatch({
                            type: 'teams/updateTeamData',
                            payload: teamData,
                        });
                    }
                }
            }
        })
    };
    // 获取当前运行中的计划
    const getRunningPlan = () => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            page: 1,
            size: 5
        };
        fetchRunningPlan(params).pipe(
            tap((res) => {
                const { data: { plans } } = res;
                dispatch({
                    type: 'plan/updatePlanData',
                    payload: plans
                })
            })
        )
    };
    // 获取当前用户基本配置
    const getUserConfig = () => {
        fetchUserConfig().pipe(
            tap((res) => {
                const { data: { settings } } = res;
                const team_id = settings.current_team_id;
                localStorage.setItem('team_id', team_id);
                dispatch({
                    type: 'user/updateTeamId',
                    payload: team_id
                });

            }),
            catchError((err) => console.log(err))
        )
    }
    // 获取接口列表
    const handleInitApiList = ({ data: { targets, total }, code }) => {
        if (code === 0) {
            // dispatch({
            //     type: 'apis/updateApiDatas',
            //     payload: targets
            // })
            const tempApiList = {};
            for (let i = 0; i < targets.length; i++) {
                tempApiList[targets[i].target_id] = targets[i];
            }
            dispatch({
                type: 'apis/updateApiDatas',
                payload: tempApiList
            })


            // dispatch({
            //     type: 'opens/coverOpenApis',
            //     payload: tempApiList
            // })
        } else {
            // Message('error', '接口列表获取失败!');
        }
    }

    const loopGetApi = (page, size, needReq) => {
        const params = {
            page,
            size,
            team_id: localStorage.getItem('team_id'),
        };
        fetchApiList(params).subscribe({
            next: ({ data: { targets, total }, code }) => {
                if (code === 0) {
                    const tempApiList = {};
                    for (let i = 0; i < targets.length; i++) {
                        tempApiList[targets[i].target_id] = targets[i];
                    }
                    const apis = cloneDeep(apiDatas);
                    const _apis = Object.assign(apis, tempApiList);
                    dispatch({
                        type: 'apis/updateApiDatas',
                        payload: _apis
                    })
                    if (needReq - 100 > 0) {
                        loopGetApi(page + 1, size, needReq - 100);
                    }
                }
            }
        })
    }

    useEventBus('getTeamMemberList', getTeamMemberList);
    useEventBus('getTeamList', getTeamList);
    useEventBus('getRunningPlan', getRunningPlan);
    useEventBus('getUserConfig', getUserConfig);
    useEventBus('sendWsMessage', sendWsMessage, [ws]);
    useEventBus('closeWs', closeWs, [ws]);
    useEventBus('initWebSocket', initWebSocket);

    useEffect(() => {

        // 项目初始化
        global$
            .pipe(
                filter((d) => d?.action === 'INIT_APPLICATION'),
                tap(() => {
                    console.log('应用程序初始化-----start=============');
                }),
                switchMap(handleInitApplication)
            )
            .subscribe();

        global$
            .pipe(
                filter((d) => d.action === 'GET_APILIST'),
                concatMap(({ params }) => getApiList$(params).pipe(tap(handleInitApiList)))
            )
            .subscribe();

        global$
            .pipe(
                filter((d) => d.action === 'RELOAD_LOCAL_PLAN'),
                map((d) => {
                    return {
                        params: d.payload,
                        id: d.id
                    }
                }),
                concatMap((e) => getSceneList$(e.params, 'plan', e.id)),
                // tap(e => console.log(e)),
                tap(e => {
                    const { data: { targets } } = e;
                    const tempPlanList = {};
                    if (targets instanceof Array) {
                        for (let i = 0; i < targets.length; i++) {
                            tempPlanList[targets[i].target_id] = targets[i];
                        }
                    }
                    dispatch({
                        type: 'plan/updatePlanMenu',
                        payload: tempPlanList
                    })
                }),
                tap(() => {

                })
            )
            .subscribe();

        global$
            .pipe(
                filter((d) => {
                    return d.action === 'RELOAD_LOCAL_AUTO_PLAN';
                }),
                map((d) => {
                    console.log('----------RELOAD_LOCAL_AUTO_PLAN');
                    return {
                        params: d.payload,
                        id: d.id
                    }
                }),
                concatMap((e) => getAutoPlanList$(e.id)),
                // tap(e => console.log(e)),
                tap(e => {
                    const { data: { targets } } = e;
                    const tempPlanList = {};
                    if (targets instanceof Array) {
                        for (let i = 0; i < targets.length; i++) {
                            tempPlanList[targets[i].target_id] = targets[i];
                        }
                    }
                    dispatch({
                        type: 'auto_plan/updatePlanMenu',
                        payload: tempPlanList
                    })
                }),
                tap(() => {

                })
            )
            .subscribe();

        // global$
        //     .pipe(
        //         filter((d) => d.action === 'GET_MEMBERLIST'),
        //         tap(() => {
        //         })
        //     )
        //     .subscribe();

        return () => {

        };
    }, []);
};

export default useProject;
