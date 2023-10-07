// import { UserTeams } from '@indexedDB/team';
// import { UserProjects } from '@indexedDB/project';
import { Message } from 'adesign-react';
import { onlineStatus } from '@utils/common';
import { fetchUserConfigRequest } from '@services/user';
import { fetchUserTeamList, fetchUserProjectList } from '@services/projects';
// import { Task, Await_Task } from '@indexedDB/asyn_task';
import { createDefaultProject, handlePullProjectList } from '@busLogics/projects';
import { getUserConfig, updateUserDefaultConfig } from '@busLogics/user';
import { createDefaultTeam } from '@busLogics/team';

const handleCreateUserConfig = async (uuid) => {
    // 1.如果没有本地项目列表,则新建一条团队信息
    let defaultTeamId = '-1';
    const localTeamCounts = await UserProjects.where({ uuid }).count();
    if (localTeamCounts === 0) {
        const teamInfo = await createDefaultTeam(uuid);
        defaultTeamId = teamInfo.team_id;
    }
    // 2.如果没有本地项目列表，则新建一条本地项目
    const localProjectCounts = await UserProjects.where({ uuid }).count();
    let defaultProjectId = '-1';
    if (localProjectCounts === 0) {
        // 添加默认项目
        const projectInfo = await createDefaultProject(defaultTeamId, uuid);


        defaultProjectId = projectInfo.project_id;
    } else {
        const projectInfo = await UserProjects.where({ uuid }).limit(1).toArray();
        defaultTeamId = projectInfo?.[0]?.team_id;
        defaultProjectId = projectInfo?.[0]?.project_id;
    }

    // 3.更新本地配置信息
    const userConfig = await updateUserDefaultConfig(
        uuid,
        defaultTeamId,
        defaultProjectId,
        defaultTeamId,
        defaultProjectId
    );
    return userConfig;
};

// 加载团队列表信息
const handlePullTeamList = (uuid) => {
    return new Promise((resove, reject) => {
        fetchUserTeamList()
            .then((resp) => {
                if (resp?.code === 10000) {
                    const teamList = resp.data?.map((teamInfo) => ({
                        ...teamInfo,
                        uuid,
                        is_push: 1,
                        id: `${teamInfo.team_id}/${uuid}`,
                    }));
                    // 删除原有数据
                    UserTeams.where({ uuid })
                        .filter((data) => data.is_push === 1)
                        .delete(); //
                    // 插入现有数据
                    UserTeams.bulkPut(teamList);
                    resove(resp);
                } else {
                    Message('error', resp.message);
                    reject();
                }
            })
            .catch(() => {
                reject();
            });
    });
};

// 已登录用户初始化
export const handleLoginedUserInit = async (uuid) => {
    // 1.获取云端配置项信息并更新到本地
    if (onlineStatus()) {
        // 1.调取接口获取用户配置信息
        const serverConfigResp = await fetchUserConfigRequest();
        if (serverConfigResp?.code !== 10000) {
            Message('error', serverConfigResp?.msg || '网络异常');
            return;
        }
        const { DEFAULT_TEAM_ID, DEFAULT_PROJECT_ID, CURRENT_TEAM_ID, CURRENT_PROJECT_ID } =
            serverConfigResp?.data || {};

        // 2.修改本地is_push=-1的项目uuid，项目所属team_id
        const localProjects = await UserProjects.filter((data) => data.is_push === -1).toArray();
        localProjects?.forEach((projectInfo) => {
            UserProjects.update(projectInfo.id, {
                ...projectInfo,
                id: `${projectInfo.project_id}/${uuid}`,
                uuid,
                team_id: DEFAULT_TEAM_ID,
            });
        });

        // 拉取团队列表
        await handlePullTeamList(uuid);

        // 拉取项目列表
        const serverProjectList = await handlePullProjectList(uuid);

        // 当前项目ID是否存在
        const isHasProject = serverProjectList?.some((item) => item.project_id === CURRENT_PROJECT_ID);

        const currentTeamId = isHasProject ? CURRENT_TEAM_ID : DEFAULT_TEAM_ID;
        const currentProjectId = isHasProject ? CURRENT_PROJECT_ID : DEFAULT_PROJECT_ID;
        // 如果当前项目已被删除，则把被删除的project异步任务队列清空
        // todo

        await updateUserDefaultConfig(
            uuid,
            DEFAULT_TEAM_ID,
            DEFAULT_PROJECT_ID,
            currentTeamId,
            currentProjectId
        );
      
    }
    // 已登录离线
    const userConfig = await getUserConfig(uuid);
    return userConfig;
};

// 未登录用户初始化
export const handleUnLoginUserInit = async (uuid) => {
    // 1.获取本地配置项
    const userConfig = await handleCreateUserConfig(uuid);

    return userConfig;
};
