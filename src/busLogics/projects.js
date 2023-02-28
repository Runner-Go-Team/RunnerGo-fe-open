import { async, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import { User } from '@indexedDB/user';
// import { UserProjects, Collection } from '@indexedDB/project';
import { Message } from 'adesign-react';
import { v4 as uuidV4 } from 'uuid';
import {
  fetchUserTeamList,
  fetchUserProjectList,
  updateCurrentProjectId,
} from '@services/projects';
// import { IProject } from '@dto/project';
import pick from 'lodash/pick';
import isUndefined from 'lodash/isUndefined';
import { isString } from 'lodash';
import { defaultParams } from '../constants/project';

// 获取云端用户团队列表信息
export const getRemoteUserTeamList = (token) => {
  const teamListObservable$ = fetchUserTeamList({}, { token });
  return teamListObservable$.pipe(
    map((resp) => {
      if (resp.code !== 10000) {
        throw new Error('本地项目信息不存在');
      }
      return resp.data;
    }),
    catchError((error) => {
      Message('error', error.message);
      return teamListObservable$;
    })
  );
};

// 获取本地indexDB信息
export const getLocalProjectInfo = (project_id) => {
  return {}
  // const projectList$ = from(UserProjects.get({ project_id }));
  // return projectList$.pipe(
  //   map((projectInfo) => {
  //     if (projectInfo === undefined) {
  //       throw new Error('本地项目信息不存在');
  //     }
  //     return projectInfo;
  //   }),
  //   catchError((error) => {
  //     Message('error', error.message);
  //     return projectList$;
  //   })
  // );
};

export const updateLocalProjectId = async (project_id) => {
  const uuid = localStorage.getItem('uuid') || '-1';
  // const currentProject = await UserProjects.get(`${project_id}/${uuid}`);
  // const userConfig = await User.get(uuid);
  // if (!isUndefined(currentProject) && !isUndefined(userConfig)) {
    // userConfig.workspace.CURRENT_PROJECT_ID = project_id;
    // userConfig.workspace.CURRENT_TEAM_ID = currentProject?.team_id;
    // await User.update(uuid, userConfig);
  // }
};

// export const updateLocalCurrentProject = async (dispatch, projectInfo) => {
//   dispatch({
//     type: 'projects/setCurrentProject',
//     payload: projectInfo,
//   });
//   const uuid = localStorage.getItem('uuid') || '-1';
//   let userConfig = await User.get(uuid);
//   if (isUndefined(userConfig)) {
//     userConfig = {
//       workspace: {
//         CURRENT_PROJECT_ID: projectInfo?.project_id,
//         CURRENT_TEAM_ID: projectInfo?.team_id,
//       },
//     };
//     User.put(userConfig, uuid);
//   } else {
//     userConfig.workspace.CURRENT_PROJECT_ID = projectInfo?.project_id;
//     userConfig.workspace.CURRENT_TEAM_ID = projectInfo?.team_id;
//     User.update(uuid, userConfig);
//   }
// };

// 创建默认项目信息 创建默认配置信息
export const createDefaultProject = async (team_id, uuid) => {
  // const project_id = uuidV4();
  // const defaultProject = {
  //   ...defaultParams,
  //   id: `${project_id}/${uuid}`,
  //   project_id,
  //   name: '离线项目',
  //   intro: '',
  //   is_default: 1,
  //   is_lock: -1,
  //   is_manager: 1,
  //   role: 2,
  //   team_id,
  //   uuid,
  //   is_push: -1,
  // };
  // await UserProjects.put(defaultProject);
  // return defaultProject;
  return {}
};

/*
拉取云端项目列表信息保存到indexDB
返回云端项目列表
*/
export const handlePullProjectList = (uuid) => {
  return {}
  // return new Promise((resove, reject) => {
  //   fetchUserProjectList()
  //     .then(async (resp) => {
  //       if (resp?.code === 10000) {
  //         const projectList = resp.data?.map((projectInfo) => ({
  //           ...projectInfo,
  //           uuid,
  //           id: `${projectInfo.project_id}/${uuid}`,
  //         }));
  //         // 删除已上传过的数据
  //         const pushedList = await UserProjects.where('uuid')
  //           .anyOf(uuid)
  //           .filter((data) => data?.is_push !== -1)
  //           .toArray();
  //         pushedList.forEach((dataItem) => {
  //           UserProjects.delete(dataItem.id);
  //         });

  //         // 插入现有数据
  //         UserProjects.bulkPut(projectList);
  //         if (Array.isArray(resp?.data)) {
  //           resove(resp.data);
  //         } else {
  //           resove([]);
  //         }
  //       } else {
  //         Message('error', resp.message);
  //         resove([]);
  //       }
  //     })
  //     .catch((err) => {
  //       resove([]);
  //     });
  // });
};

// 获取左侧目录菜单列表
export const getLocalTargets = async (project_id) => {
  // const localCollections = await Collection.where('project_id').equals(project_id).toArray();

  const apiData = {};
  // localCollections.forEach((item) => {
  //   if (item.hasOwnProperty('status') && item.status !== 1) {
  //     return;
  //   }
  //   if (isString(item?.request?.url)) {
  //     item.url = item?.request?.url;
  //   }

  //   apiData[`${item.target_id}`] = pick(item, [
  //     'target_type',
  //     'target_id',
  //     'name',
  //     'sort',
  //     'mark',
  //     'status',
  //     'method',
  //     'parent_id',
  //     'is_locked',
  //     'is_example',
  //     'url',
  //   ]);
  // });
  return apiData;
};
