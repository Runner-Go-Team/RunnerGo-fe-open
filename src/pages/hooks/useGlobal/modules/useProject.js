import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { of, from, lastValueFrom } from 'rxjs';
import { tap, filter, concatMap, map, switchMap, catchError } from 'rxjs/operators';
import { uploadUserProjectRequest } from '@services/projects';
import { getUserConfig$, getProjectUserList$ } from '@rxUtils/user';
import { getMultiProjectDetails$, switchProject$ } from '@rxUtils/project';
import { uploadTasks } from '@rxUtils/task';
import { getUserTargetList$ } from '@rxUtils/collection';
import { getShareList } from '@rxUtils/share';
import { getSingleTestList$ } from '@rxUtils/runner/singleTest';
import { getCombinedTestList$ } from '@rxUtils/runner/combinedTest';
import { getReportList$ } from '@rxUtils/runner/testReports';
import { pushTask } from '@asyncTasks/index';
import { getLocalTargets } from '@busLogics/projects';
import isObject from 'lodash/isObject';
import Bus, { useEventBus } from '@utils/eventBus';
import { useEventCallback } from 'rxjs-hooks';
// import { UserProjects } from '@indexedDB/project';
import { getLocalEnvsDatas } from '@rxUtils/env';
import { isArray, isPlainObject, isString, trim } from 'lodash';
import { webSocket } from '@utils/websocket/websocket';
import { global$ } from '../global';

const useProject = () => {
    const dispatch = useDispatch();
    const { CURRENT_PROJECT_ID } = useSelector((d) => d?.workspace);
    const { tempParamsDesc } = useSelector((store) => store?.projects);
    // 项目初始化完成
    const handleInitProjectFinish = async (project_id) => {
        const apiDatas = await getLocalTargets(project_id);
        dispatch({
            type: 'apis/updateApiDatas',
            payload: apiDatas,
        });

        // 停止右上角转圈圈
        dispatch({
            type: 'global/setDownloadStatus',
            payload: -1,
        });

        // 加载本地环境信息
        const envDatas = await getLocalEnvsDatas(project_id);
        dispatch({
            type: 'envs/setEnvDatas',
            payload: envDatas,
        });
    };

    // 展示团队列表
    const handleInitTeams = (teamList) => {
        const teamData = {};
        teamList.forEach((data) => {
            teamData[data.team_id] = data;
        });
        dispatch({
            type: 'teams/updateTeamData',
            payload: teamData,
        });
    };

    // 展示项目列表
    const handleInitProjects = (projectList) => {
        const projectData = {};
        projectList.forEach((data) => {
            projectData[data.project_id] = data;
        });
        dispatch({
            type: 'projects/setProjectData',
            payload: projectData,
        });
    };
    const [getSingleTestList] = useEventCallback(getSingleTestList$);
    const [getCombinedTestList] = useEventCallback(getCombinedTestList$);
    const [getReportList] = useEventCallback(getReportList$);

    // 展示用户配置信息
    const handleInitUserConfig = (userConfig) => {
        const {
            DEFAULT_PROJECT_ID = '-1',
            DEFAULT_TEAM_ID = '-1',
            CURRENT_PROJECT_ID = '-1',
            CURRENT_TEAM_ID = '-1',
            CURRENT_ENV_ID = '-1',
        } = userConfig?.workspace || {};
        window.currentProjectId = CURRENT_PROJECT_ID;
        dispatch({
            type: 'workspace/updateWorkspaceState',
            payload: {
                DEFAULT_TEAM_ID,
                DEFAULT_PROJECT_ID,
                CURRENT_PROJECT_ID,
                CURRENT_TEAM_ID,
                CURRENT_ENV_ID,
            },
        });
    };

    // 切换项目
    const handleSwitchProject = (project_id) => {

        const uuid = localStorage.getItem('uuid');

        dispatch({
            type: 'apis/recoverApiDatas',
        });

        // 开始右上角转圈圈
        dispatch({
            type: 'global/setDownloadStatus',
            payload: 1,
        });
        return switchProject$(project_id).pipe(
            concatMap(() => getUserConfig$(uuid).pipe(tap(handleInitUserConfig))),
            concatMap(() => uploadTasks(project_id)),
            concatMap(() => getMultiProjectDetails$(uuid, [project_id])),
            // 获取项目下用户信息列表
            concatMap(() => getProjectUserList$(project_id)),
            tap((res) => {

            }),
            // 加载分享列表
            switchMap(() =>
                getShareList(project_id).pipe(
                    tap((shareList) => {
                        global$.next({
                            action: 'RELOAD_SHARE_LIST',
                        });
                    })
                )
            ),
            // 加载测试列表 包括测试报告
            switchMap(() => {
                getSingleTestList(project_id);
                getCombinedTestList(project_id);
                return of(getReportList(project_id));
            }),
            switchMap(() =>
                getUserTargetList$(project_id).pipe(concatMap(() => handleInitProjectFinish(project_id)))
            )
        );
    };

    // 保存项目
    const saveProject = async (project) => {
        if (project && isObject(project)) {
            const uuid = localStorage.getItem('uuid') || '-1';
            project.is_push = -1;
            project.id = `${project.project_id}/${uuid}`;
            project.uuid = uuid;
            await UserProjects.put(project, project.id);
            project.intro = project?.description || '';
            // todo 请求接口 失败才添加异步任务
            try {
                const resp = await lastValueFrom(uploadUserProjectRequest(project));
                if (resp?.code === 10000) {
                    await UserProjects.update(project, { is_push: 1 });
                } else {
                    pushTask(
                        {
                            task_id: project.id,
                            action: 'SAVE',
                            model: 'PROJECT',
                            payload: project.id,
                            project_id: 'NOT_NEED',
                        },
                        -1
                    );
                }
            } catch (error) {
                pushTask(
                    {
                        task_id: project.id,
                        action: 'SAVE',
                        model: 'PROJECT',
                        payload: project.id,
                        project_id: 'NOT_NEED',
                    },
                    -1
                );
            }
        }
    };

    const getProjectDescList = async (key) => {
        // const currentProjectInfo = await UserProjects.get(
        //     `${CURRENT_PROJECT_ID}/${localStorage.getItem('uuid')}`
        // );

        // const { details } = currentProjectInfo;
        let descList = [];
        // // 获取当前项目参数描述
        // if (isArray(details?.globalDescriptionVars)) {
        //     descList = descList.concat(details.globalDescriptionVars);
        // }
        // // 获取当前项目临时参数描述
        // if (isArray(tempParamsDesc)) {
        //     descList = descList.concat(tempParamsDesc);
        // }
        // if (isString(key) && trim(key).length > 0) {
        //     if (isArray(descList) && descList.length > 0) {
        //         const keyObj = descList.find((i) => i?.key === key);
        //         if (
        //             isPlainObject(keyObj) &&
        //             isString(keyObj?.description) &&
        //             keyObj.description.length > 0
        //         ) {
        //             return keyObj.description;
        //         }
        //     }
        //     return '';
        // }

        return descList;
    };
    useEventBus('getProjectDescList', getProjectDescList, [tempParamsDesc, CURRENT_PROJECT_ID]);
    useEventBus('saveProject', saveProject, []);
    useEffect(() => {
        // 切换项目
        global$
            .pipe(
                filter((d) => d?.action === 'SWITCH_PROJECT'),
                tap(() => {
                }),
                map((d) => d?.payload),
                switchMap(handleSwitchProject),
                catchError((err, scop$) => scop$)
            )
            .subscribe();
    }, []);
};

export default useProject;
