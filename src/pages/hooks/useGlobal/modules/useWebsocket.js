/* eslint-disable no-await-in-loop */
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cloneDeep, findIndex, isObject } from 'lodash';
import * as jsondiffpatch from 'jsondiffpatch';
import { lastValueFrom } from 'rxjs';
import { fetchCollectionDetailRequest } from '@services/apis';
import {
    switchProjectRequest,
    getMultiProcessTestList,
    getMultiProcessTestReportList,
} from '@services/projects';
// import { UserProjects, Envs } from '@indexedDB/project';
// import {
//     CombinedProcessTest,
//     SingleProcessTest,
//     TestReports,
//     CombinedOpens,
//     SingleOpens,
// } from '@indexedDB/runner';
import { getLocalTargets } from '@busLogics/projects';
import { getLocalEnvsDatas } from '@rxUtils/env';
import Bus from '@utils/eventBus';
import { isLogin, onlineStatus } from '@utils/common';

const wokerList = ['api', 'doc', 'folder', 'websocket', 'grpc'];

const useWebsocket = () => {
    const dispatch = useDispatch();
    // 获取当前项目id
    const { CURRENT_PROJECT_ID } = useSelector((store) => store?.workspace);
    const { open_apis } = useSelector((store) => store?.opens);

    // 处理协作推送的消息
    const handleWebSocket = async (data) => {
        const uuidSelf = localStorage.getItem('uuid');
        const currentClientid = sessionStorage?.clientId;

        if (data?.message === undefined) return;

        // 保存协作操作日志 operator操作人 operatingTarget操作目标 operationTime操作时间（秒时间戳）
        const saveInviteDaily = (obj, type = '') => {
            const temp_obj = {
                message: obj,
                created_at: obj.subject.modify_time,
                nick_name: obj.subject.modify_user,
                portrait: obj.subject.modify_portrait,
            };
            // TODO 更新本地协作日志
            // dispatch({
            //   type: '',
            //   item: ,
            // });
            if (obj?.client_id !== uuidSelf) {
                // TODO 新增协作日志展示小红点
                // dispatch({
                //   type: '',
                //   payload: ,
                // });
            }
        };

        // 归档管理推送处理
        const archiveWorker = async (data) => {
            const action = data?.responseData?.action;
            const target_id = data?.responseData?.primary_key;
            const project_id = data?.responseData?.subject?.project_id;

            if (action === 'delete') {
                Bus.$emit('updateOpensById', { id: target_id, data: { is_example: 0 } });
                Bus.$emit('updateCollectionById', { id: target_id, data: { is_example: 0 } });

                const apiDatas = await getLocalTargets(project_id);
                dispatch({
                    type: 'apis/updateApiDatas',
                    payload: apiDatas,
                });
            }
        };

        // api,doc,websocket,grpc curd
        const apiWorker = async (data) => {
            // const { project, api, apis } = store.getState();
            // const { current, open_apis } = api;
            const action = data?.responseData?.action;
            const target_id = data?.responseData?.primary_key;
            const target_type = data?.responseData?.primary_type;
            const project_id = data?.responseData?.subject?.project_id;

            const updateTreeData = async () => {
                const apiDatas = await getLocalTargets(project_id);
                dispatch({
                    type: 'apis/updateApiDatas',
                    payload: apiDatas,
                });
            };

            switch (action) {
                case 'delete': // 删除
                    Bus.$emit('deleteCollectionById', target_id);
                    updateTreeData();
                    break;
                case 'lock': // 锁定
                    // 更新本地数据
                    Bus.$emit('updateOpensById', { id: target_id, data: { is_locked: 1 } });

                    Bus.$emit('updateCollectionById', { id: target_id, data: { is_locked: 1 } });
                    break;
                case 'unlock': // 解锁
                    // 更新本地数据
                    Bus.$emit('updateOpensById', { id: target_id, data: { is_locked: -1 } });

                    Bus.$emit('updateCollectionById', { id: target_id, data: { is_locked: -1 } });
                    break;
                case 'sort': // 排序
                    const targetInfo = data?.responseData.subject.effects;
                    for (let i = 0; i < targetInfo.length; i++) {
                        const ite = targetInfo[i];
                        // 更新本地数据
                        Bus.$emit('updateOpensById', {
                            id: ite.target_id,
                            data: { parent_id: ite.parent_id, sort: ite.sort },
                        });

                        Bus.$emit('updateCollectionById', {
                            id: ite.target_id,
                            data: { parent_id: ite.parent_id, sort: ite.sort },
                        });
                    }
                    updateTreeData();
                    break;
                case 'add': // 增加
                    fetchCollectionDetailRequest({ project_id, target_ids: [target_id] }).subscribe({
                        next: async (resp) => {
                            if (resp?.code === 10000) {
                                const newTarget = resp.data[0];
                                Bus.$emit('updateCollectionById', {
                                    id: target_id,
                                    data: newTarget,
                                    notFindIdNew: true,
                                });
                                const apiDatas = await getLocalTargets(project_id);
                                dispatch({
                                    type: 'apis/updateApiDatas',
                                    payload: apiDatas,
                                });
                                updateTreeData();
                            }
                        },
                    });
                    break;
                case 'update': // 更新
                    // 打开 并且修改过，直接跳过
                    if (open_apis && open_apis[target_id] && open_apis[target_id]?.is_changed > 0) {
                        return;
                    }
                    fetchCollectionDetailRequest({ project_id, target_ids: [target_id] }).subscribe({
                        next: (resp) => {
                            if (resp?.code === 10000) {
                                const newTarget = resp.data[0];
                                Bus.$emit('updateOpensById', {
                                    id: target_id,
                                    data: newTarget,
                                });
                                Bus.$emit('updateCollectionById', {
                                    id: target_id,
                                    data: newTarget,
                                    notFindIdNew: true,
                                });
                            }
                        },
                    });
                    break;
                case 'restore': // 恢复
                    fetchCollectionDetailRequest({ project_id, target_ids: [target_id] }).subscribe({
                        next: (resp) => {
                            if (resp?.code === 10000) {
                                const newTarget = resp.data[0];
                                Bus.$emit('updateCollectionById', {
                                    id: target_id,
                                    data: newTarget,
                                    notFindIdNew: true,
                                });
                                updateTreeData();
                            }
                        },
                    });
                    break;
                case 'remove': // 彻底删除
                    Bus.$emit('updateCollectionById', {
                        id: target_id,
                        data: { status: -99 },
                    });
                    break;
                case 'share_update': // 分享文档更新
                    break;
                default:
                    break;
            }
        };
        // 全局参数
        const requestWorker = async (data) => {
            const cur_project_id = data.responseData.primary_key;
            let request = data.responseData.subject.request;
            const project = await UserProjects.get(`${cur_project_id}/${uuidSelf}`);

            if (project) {
                if (typeof project?.details?.request === 'object') {
                    // 开始比对
                    const _delta_diffs = jsondiffpatch
                        .create({
                            objectHash(obj) {
                                return obj._key || obj.key;
                            },
                            propertyFilter(name, context) {
                                // 排除 value
                                return name !== 'value';
                            },
                        })
                        .diff(project?.details?.request, request);

                    if (_delta_diffs) {
                        jsondiffpatch.patch(project?.details?.request, _delta_diffs); // 修复更新
                    }
                }
                request = project?.details?.request
                    ? cloneDeep(project?.details?.request)
                    : {
                        header: [],
                        query: [],
                        cookie: [],
                        body: [],
                    };
                UserProjects.update(`${cur_project_id}/${uuidSelf}`, {
                    details: {
                        ...project.details,
                        request,
                        script: request.script,
                    },
                });
            }
        };

        // 参数描述库
        const descriptionWorker = async (data) => {
            const cur_project_id = data.responseData.primary_key;
            const description = data.responseData.subject.list;
            // const project = UserProjects.get(`${desc_project_id}/${uuidSelf}`);

            UserProjects.update(`${cur_project_id}/${uuidSelf}`, {
                'details.globalDescriptionVars': description,
            });
        };

        const envWorker = async (data) => {
            const cur_project_id = data.responseData.primary_key;
            const temp_env = cloneDeep(data.responseData.subject.envVars);
            if (data.responseData.action === 'delete') {
                await Envs.delete(`${cur_project_id}/${temp_env.env_id}`);
            } else {
                const id = `${cur_project_id}/${temp_env.env_id}`;
                // 客户端
                await Envs.put(
                    {
                        ...temp_env,
                        id,
                        project_id: cur_project_id,
                    },
                    id
                );
            }
            const envDatas = await getLocalEnvsDatas(cur_project_id);
            dispatch({
                type: 'envs/setEnvDatas',
                payload: envDatas,
            });
        };

        const markWorker = async (data) => {
            const action = data?.responseData?.action;
            const cur_project_id = data?.responseData?.subject?.project_id || CURRENT_PROJECT_ID;
            const uuid = localStorage.getItem('uuid') || '-1';
            const currentProjectInfo = await UserProjects.get(`${cur_project_id}/${uuid}`);
            const markList = currentProjectInfo?.details?.markList || [];
            const changeIndex = findIndex(markList, { key: data?.responseData?.primary_key });
            const { key = '', name = '', color = '' } = data?.responseData?.subject.mark || {};
            switch (action) {
                case 'delete':
                    if (changeIndex !== -1) markList.splice(changeIndex, 1);
                    break;
                case 'add':
                    markList.push({ key, name, color });
                    break;
                case 'update':
                    if (changeIndex !== -1) markList[changeIndex] = { key, name, color };
                    break;
                default:
                    break;
            }
            UserProjects.update(`${cur_project_id}/${uuid}`, {
                'details.markList': markList,
            });
        };

        const singleWorker = async (data) => {
            const test_id = data?.responseData?.primary_key;
            // delete | save | add | update
            const action = data?.responseData?.action;
            const project_id = data?.responseData?.subject?.project_id;
            if (test_id) {
                const openObj = await SingleOpens.get(test_id);
                if (action === 'add' || action === 'update') {
                    const resp = await lastValueFrom(
                        getMultiProcessTestList({
                            project_id,
                            process_test_type: 'single',
                            test_ids: [test_id],
                        })
                    );
                    if (resp?.code === 10000) {
                        const testInfo = resp?.data?.[0];
                        if (isObject(testInfo)) {
                            await SingleProcessTest.put(testInfo, test_id);
                            if (isObject(openObj) && !(openObj?.is_changed === 1)) {
                                await SingleOpens.update(test_id, testInfo);
                            }
                        }
                    }
                }
                if (action === 'delete') {
                    await SingleProcessTest.delete(test_id);
                    await SingleOpens.delete(test_id);
                }
                if (action === 'sort') {
                    const targetInfo = data?.responseData.subject.effects;
                    for (let i = 0; i < targetInfo.length; i++) {
                        const ite = targetInfo[i];
                        // 更新本地数据
                        await SingleProcessTest.update(ite.test_id, {
                            parent_id: ite.parent_id,
                            sort: ite.sort,
                        });
                        if (isObject(openObj)) {
                            await SingleOpens.update(test_id, { parent_id: ite.parent_id, sort: ite.sort });
                        }
                    }
                }
                Bus.$emit('singleTestInit');
            }
        };

        const combinedWorker = async (data) => {
            const combined_id = data?.responseData?.primary_key;
            // delete | save | add | update
            const action = data?.responseData?.action; // delete
            const project_id = data?.responseData?.subject?.project_id;
            if (combined_id) {
                const openObj = await CombinedOpens.get(combined_id);

                if (action === 'add' || action === 'update') {
                    const resp = await lastValueFrom(
                        getMultiProcessTestList({
                            project_id,
                            process_test_type: 'combined',
                            test_ids: [combined_id],
                        })
                    );
                    if (resp?.code === 10000) {
                        const testInfo = resp?.data?.[0];
                        if (isObject(testInfo)) {
                            await CombinedProcessTest.put(testInfo, combined_id);
                            if (isObject(openObj) && !(openObj?.is_changed === 1)) {
                                await CombinedOpens.update(combined_id, testInfo);
                            }
                        }
                    }
                }
                if (action === 'delete') {
                    await CombinedProcessTest.delete(combined_id);
                    await CombinedOpens.delete(combined_id);
                }
                if (action === 'sort') {
                    const targetInfo = data?.responseData.subject.effects;
                    for (let i = 0; i < targetInfo.length; i++) {
                        const ite = targetInfo[i];
                        // 更新本地数据
                        await CombinedProcessTest.update(ite.combined_id, {
                            parent_id: ite.parent_id,
                            sort: ite.sort,
                        });
                        if (isObject(openObj)) {
                            await CombinedOpens.update(combined_id, { parent_id: ite.parent_id, sort: ite.sort });
                        }
                    }
                }
                Bus.$emit('combinedTestInit');
            }
        };

        const testReportWorker = async (data) => {
            const report_id = data?.responseData?.primary_key;
            // delete | save | add | update
            const action = data?.responseData?.action;
            const project_id = data?.responseData?.subject?.project_id;

            if (report_id) {
                if (action === 'save') {
                    getMultiProcessTestReportList({
                        project_id,
                        report_ids: [report_id],
                    }).subscribe({
                        next(resp) {
                            if (resp?.code === 10000) {
                                const testInfo = resp?.data?.[0];
                                if (isObject(testInfo)) {
                                    TestReports.put(testInfo, report_id);
                                }
                            }
                        },
                    });
                }
                if (action === 'delete') {
                    TestReports.delete(report_id);
                }
            }
        };

        // 增删改操作
        const handleCURD = (data) => {
            const primary_type = data.responseData.primary_type;
            if (wokerList.includes(primary_type)) apiWorker(data);
            if (primary_type === 'project-request') requestWorker(data);
            if (primary_type === 'project-description') descriptionWorker(data);
            if (primary_type === 'project-env') envWorker(data);
            if (primary_type === 'mark') markWorker(data);
            if (primary_type === 'single') singleWorker(data);
            if (primary_type === 'combined') combinedWorker(data);
            if (primary_type === 'test_reports') testReportWorker(data);
            if (primary_type === 'archive') archiveWorker(data);
        };
        switch (data?.messageType) {
            // 初次链接websocket
            case 'helloType':
                window.sessionStorage.setItem('clientId', data.responseData.client_id);
                if (isLogin() && onlineStatus()) {
                    // 是否需要切换当前项目client_id
                    switchProjectRequest({ project_id: CURRENT_PROJECT_ID }).subscribe();
                }
                break;
            // 失败
            case 'failedType':
                break;
            // 增删改操作
            case 'pullType':
                // 添加协作记录
                saveInviteDaily(data?.responseData);
                // 当前窗口接受推送不做修改
                if (data.responseData.client_id === currentClientid) return;
                handleCURD(data);
                break;
            case 'userList':
                // 在线用户列表
                // 死循环
                if (data?.responseData) {
                    dispatch({
                        type: 'projects/setUserOnlineList',
                        payload: data?.responseData,
                    });
                }
                break;
            default:
                break;
        }
        return '';
    };
    useEffect(() => {
        Bus.$on('websocket_worker', handleWebSocket);
        return () => {
            Bus.$off('websocket_worker');
        };
    }, [CURRENT_PROJECT_ID, open_apis]);
};

export default useWebsocket;
