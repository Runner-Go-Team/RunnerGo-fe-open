import {
    from,
    iif,
    of,
    catchError,
    mergeMap,
    concatMap,
    map,
    reduce,
    tap,
    zip,
    merge,
    throwError,
} from 'rxjs';
import {
    fetchUserProjectList,
    getMultiProjectDetailsRequest,
    switchProjectRequest,
    fetchSimpleTeamProjectListRequest,
} from '@services/projects';
// import { UserProjects, Envs } from '@indexedDB/project';
// import { UserTeams } from '@indexedDB/team';
// import { User } from '@indexedDB/user';
import { isLogin } from '@utils/common';
import { isArray, isUndefined } from 'lodash';
import { getUserLocalTeamList } from '../team';

// 获取用户本地项目列表
const getUserLocalProjectList = async (uuid) => {
    // const userProjectList = await UserProjects.where({ uuid }).toArray();
    // return userProjectList;
    return [];
};

// // 获取用户本地全部项目
// export const getUserLocalProjects = async (uuid: string) => {
//   const localList = await getUserLocalProjectList(uuid);
//   const localDataas = {};
//   for (const item of localList) {
//     localDataas[item.project_id] = item;
//   }
//   return localDataas;
// };

// 更新用户本地已上传的项目列表
const updateLocalProjectList = async (uuid, projectList) => {
    // 删除已上传的项目列表
    // UserProjects.where({ uuid })
    //     .filter((data) => data.is_push === 1)
    //     .delete();

    // 生成唯一标识ID
    // const userProjects = projectList?.map((projectInfo) => ({
    //     ...projectInfo,
    //     uuid,
    //     is_push: 1,
    //     id: `${projectInfo.project_id}/${uuid}`,
    // }));
    // await UserProjects.bulkPut(userProjects);
};

// 创建用户本地离线默认项目
const getDefaultOfflineProject = (uuid, default_project_id) => {
    const project_id = default_project_id;
    return {
        id: `${project_id}/${uuid}`,
        is_default: 1,
        is_lock: -1,
        is_manager: 1,
        is_push: -1,
        name: '默认离线项目',
        project_id,
        role: 2, // 1.只读  2.写
        team_id: '-1',
        uuid,
        details: {
            request: {
                auth: {
                    type: 'noauth', // 认证类型  noauth无需认证 kv私密键值对 bearer认证 basic认证
                    kv: {
                        key: '',
                        value: '',
                    },
                    bearer: {
                        key: '',
                    },
                    basic: {
                        username: '',
                        password: '',
                    },
                    digest: {
                        username: '',
                        password: '',
                        realm: '',
                        nonce: '',
                        algorithm: '',
                        qop: '',
                        nc: '',
                        cnonce: '',
                        opaque: '',
                    },
                    hawk: {
                        authId: '',
                        authKey: '',
                        algorithm: '',
                        user: '',
                        nonce: '',
                        extraData: '',
                        app: '',
                        delegation: '',
                        timestamp: '',
                        includePayloadHash: -1,
                    },
                    awsv4: {
                        accessKey: '',
                        secretKey: '',
                        region: '',
                        service: '',
                        sessionToken: '',
                        addAuthDataToQuery: -1,
                    },
                    ntlm: {
                        username: '',
                        password: '',
                        domain: '',
                        workstation: '',
                        disableRetryRequest: 1,
                    },
                    edgegrid: {
                        accessToken: '',
                        clientToken: '',
                        clientSecret: '',
                        nonce: '',
                        timestamp: '',
                        baseURi: '',
                        headersToSign: '',
                    },
                    oauth1: {
                        consumerKey: '',
                        consumerSecret: '',
                        signatureMethod: '',
                        addEmptyParamsToSign: -1,
                        includeBodyHash: -1,
                        addParamsToHeader: -1,
                        realm: '',
                        version: '1.0',
                        nonce: '',
                        timestamp: '',
                        verifier: '',
                        callback: '',
                        tokenSecret: '',
                        token: '',
                    },
                },
            },
        },
    };
};

// 获取用户下项目列表
export const getUserProjectList$ = (uuid, default_project_id) => {
    return iif(
        isLogin,
        from(fetchUserProjectList()).pipe(
            mergeMap((res) => {
                if (res?.code === 10000) {
                    return from(updateLocalProjectList(uuid, res.data)).pipe(
                        mergeMap(() => getUserLocalProjectList(uuid))
                    );
                }
                return getUserLocalProjectList(uuid);
            }),
            catchError(() => getUserLocalProjectList(uuid))
        ),
        of('').pipe(
            concatMap(() => getUserLocalProjectList(uuid)),
            concatMap((projectList) => {
                if (projectList.length === 0) {
                    const defaultOfflineList = [getDefaultOfflineProject(uuid, default_project_id)];
                    return from(updateLocalProjectList(uuid, defaultOfflineList)).pipe(
                        map(() => defaultOfflineList)
                    );
                }
                return of(projectList);
            })
        )
    );
};

// 更新本地环境信息
const updateLocalEnvList = async (project_id, envList) => {
    const newEnvList = Array.isArray(envList) ? envList : [];

    const envDatas = {};
    newEnvList.forEach((item) => {
        envDatas[item.env_id] = true;
    });
    if (isUndefined(envDatas?.['-1'])) {
        newEnvList.splice(0, 0, {
            env_id: '-1',
            id: `${project_id}/-1`,
            list: {},
            name: '默认环境',
            pre_url: '',
            project_id,
            version: 1,
        });
    }
    if (isUndefined(envDatas?.['-2'])) {
        newEnvList.splice(0, 0, {
            env_id: '-2',
            id: `${project_id}/-2`,
            list: {},
            name: 'Mock环境',
            pre_url: '',
            project_id,
            version: 1,
        });
    }

    for (const serverItem of newEnvList) {
        const serverData = {
            ...serverItem,
            project_id,
            id: `${project_id}/${serverItem.env_id}`,
        };
        // await Envs.put(serverData, serverData.id);
    }
};

// export const getProjectDetails = (uuid: string, project_id: string) => {
//   return iif(
//     isLogin,
//     initProjectDetailsRequest({ project_id }).pipe(
//       concatMap((resp) => {
//         if (resp?.code === 10000) {
//           const serverEnvList = resp?.data?.details?.envListVars;
//           return of(serverEnvList).pipe(
//             concatMap(updateLocalEnvList.bind(null, project_id, serverEnvList))
//           );
//         }
//         return of('').pipe(concatMap(updateLocalEnvList.bind(null, project_id, [])));
//       }),
//       catchError(() => {
//         return of('').pipe(concatMap(updateLocalEnvList.bind(null, project_id, [])));
//       })
//     ),
//     of('').pipe(concatMap(updateLocalEnvList.bind(null, project_id, [])))
//   );
// };

// 更新本地项目全局参数,状态，参数描述看信息,环境变量信息
const updateLocalProjectInfo = async (uuid, projectInfo) => {
    const project_id = projectInfo.project_id;
    const userProjectId = `${project_id}/${uuid}`;
    const { envList, ...restDetails } = projectInfo?.details || {};
    // 项目被删除或没有了权限
    if (projectInfo?.status !== 1) {
        // await UserProjects.update(userProjectId, {
        //     details: {},
        //     status: projectInfo?.status,
        // });
        await updateLocalEnvList(project_id, []);
    } else {
        // await UserProjects.update(userProjectId, {
        //     details: restDetails,
        //     status: 1,
        // });
        await updateLocalEnvList(project_id, envList);
    }
};

// 拉取云端最新项目详细信息
export const getMultiProjectDetails$ = (uuid, project_ids) => {
    return iif(
        isLogin,
        getMultiProjectDetailsRequest({ project_ids }).pipe(
            concatMap((resp) => {
                if (resp?.code === 10000) {
                    return of(...resp.data).pipe(
                        mergeMap((projectInfo) => updateLocalProjectInfo(uuid, projectInfo)),
                        reduce((a, b) => a + 1, 0),
                        tap(console.log.bind(null, '项目详情加载完成，加载数量：'))
                    );
                }
                return of('');
            }),
            catchError(() => {
                return of('');
            })
        ),
        of('').pipe(
            tap(() => {
                // 未登陆初始化环境列表
                if (isArray(project_ids)) {
                    project_ids.forEach((project_id) => {
                        updateLocalEnvList(project_id, []);
                    });
                }
            })
        )
    );
};

// 更新本地项目信息
export const updateLocalProjectId = async (project_id) => {
    const uuid = localStorage.getItem('uuid') || '-1';
    // const currentProject = await UserProjects.get(`${project_id}/${uuid}`);
    // const userConfig = await User.get(uuid);
    if (!isUndefined(currentProject) && !isUndefined(userConfig)) {
        await User.update(uuid, {
            'workspace.CURRENT_PROJECT_ID': project_id,
            'workspace.CURRENT_TEAM_ID': currentProject?.team_id,
        });
    }
};

// 切换项目
export const switchProject$ = (project_id) => {
    return switchProjectRequest({ project_id }).pipe(
        concatMap(() => updateLocalProjectId(project_id)),
        catchError((err, scop$) => {
            return of('').pipe(concatMap(() => updateLocalProjectId(project_id)));
        })
    );
};

// 获取云端最新简要团队和项目列表
const getServerTeamProjectList$ = () => {
    return fetchSimpleTeamProjectListRequest().pipe(
        concatMap((resp) => {
            const serverTeams = {};
            const serverProjects = {};
            if (resp.code === 10000) {
                (isArray(resp.data) ? resp.data : []).forEach((teamItem) => {
                    serverTeams[teamItem.team_id] = teamItem;
                    teamItem.project.forEach((pItem) => {
                        serverProjects[pItem.project_id] = {
                            ...pItem,
                            team_id: teamItem.team_id,
                        };
                    });
                });
                return of({
                    serverTeams,
                    serverProjects,
                });
            }
            return throwError(() => new Error(`请求失败`));
        })
    );
};

// 比较云端和本地数据，获取被删除团队key列表，被新邀请团队列表，被删除项目key列表，被新邀请项目列表
const getDiffDataList = (serverData, localData, uuid) => {
    const delTeamIds = [];
    const addedTeamList = [];
    const delProjectIds = [];
    const addedProjectList = [];

    // 已被移除的团队Ids
    localData.teamList.forEach((item) => {
        if (isUndefined(serverData.serverTeams[item.team_id])) {
            delTeamIds.push(item.team_id);
        }
    });

    // 被新邀请加入的团队信息列表
    Object.entries(serverData.serverTeams).forEach(([serverTeamId, serverTeamData]) => {
        const index = localData.teamList.findIndex((data) => data.team_id === serverTeamId);
        if (index === -1) {
            const teamInfo = {
                name: serverTeamData.name,
                team_id: serverTeamData.team_id,
                uuid,
                id: `${serverTeamData.team_id}/${uuid}`,
            };
            addedTeamList.push(teamInfo);
        }
    });

    // 已被移除的项目信息列表
    localData.projectList.forEach((item) => {
        if (isUndefined(serverData.serverProjects[item.project_id])) {
            delProjectIds.push(item.project_id);
        }
    });

    // 被新邀请加入的项目信息列表
    Object.entries(serverData.serverProjects).forEach(([serverProjectId, serverProjectData]) => {
        const index = localData.projectList.findIndex((data) => data.project_id === serverProjectId);
        if (index === -1) {
            const projectInfo = {
                name: serverProjectData.name,
                project_id: serverProjectData.project_id,
                team_id: serverProjectData.team_id,
                uuid,
                is_push: 1,
                id: `${serverProjectData.project_id}/${uuid}`,
            };
            addedProjectList.push(projectInfo);
        }
    });

    return {
        delTeamIds,
        addedTeamList,
        delProjectIds,
        addedProjectList,
    };
};

// 获取本地团队项目列表
export const getLocalDataList$ = (uuid) => {
    return zip(getUserLocalTeamList(uuid), getUserLocalProjectList(uuid)).pipe(
        map(([teamList, projectList]) => ({
            teamList: isArray(teamList) ? teamList : [],
            projectList: isArray(projectList) ? projectList : [],
        })),
        tap((data) => {
        })
    );
};

export const getLatestTeamProjectList$ = (uuid) => {
    // 获取云端简要团队项目列表
    const getServerDataList$ = zip(getServerTeamProjectList$(), getLocalDataList$(uuid)).pipe(
        map(([serverData, localData]) => {
            return getDiffDataList(serverData, localData, uuid);
        }),
        mergeMap((diffData) => {
            return of('').pipe(
                // 删除团队
                mergeMap(() =>
                    of(...diffData.delTeamIds).pipe(
                        mergeMap((delId) => UserTeams.where({ uuid, team_id: delId }).delete()),
                        reduce((a, b) => a + 1, 0),
                        tap((res) => {

                        })
                    )
                ),
                mergeMap(() =>
                    from(UserTeams.bulkPut(diffData.addedTeamList)).pipe(
                        tap((res) => {
                        })
                    )
                ),
                mergeMap(() =>
                    of(...diffData.delProjectIds).pipe(
                        // mergeMap((delId) => UserProjects.where({ uuid, project_id: delId }).delete()),
                        reduce((a, b) => a + 1, 0),
                        tap((res) => {
                        })
                    )
                ),
                // mergeMap(() =>
                //     // from(UserProjects.bulkPut(diffData.addedProjectList)).pipe(
                //     //     tap((res) => {
                //     //     })
                //     // )
                // )
            );
        }),
        mergeMap(() => getLocalDataList$(uuid)),
        catchError((err) => {
            return getLocalDataList$(uuid);
        })
    );

    return iif(isLogin, getServerDataList$, getLocalDataList$(uuid));
};
