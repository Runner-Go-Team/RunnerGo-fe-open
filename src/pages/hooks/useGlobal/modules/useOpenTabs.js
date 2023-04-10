/* eslint-disable no-await-in-loop */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/rules-of-hooks */
import { useDispatch, useSelector } from 'react-redux';
// import { Opens } from '@indexedDB/project';
import { Message } from 'adesign-react';
import { asyncModalConfirm } from '@modals/asyncModalConfirm';
import Bus, { useEventBus } from '@utils/eventBus';
import { isArray, isPlainObject } from 'lodash';
import i18next, { t } from 'i18next';

// 新建接口
const useOpenTabs = () => {
    const dispatch = useDispatch();
    const opens = useSelector((store) => store?.opens);
    const workspace = useSelector((store) => store?.workspace);
    const { open_apis, open_api_now } = opens;
    const { CURRENT_PROJECT_ID } = workspace;

    // 关闭所有标签
    const closeAllTarget = async () => {
        // const open_navs =
        //     apGlobalConfigStore.get(`project_current:${CURRENT_PROJECT_ID}`)?.open_navs || [];

        if (Object.entries(open_apis).length > 0) {
            for (let id in open_apis) {
                const target = open_apis[id];
                if (target.hasOwnProperty('is_changed') && (target.is_changed > 0)) {
                    const res = await asyncModalConfirm({
                        title: i18next.t('modal.tips'),
                        content: `${i18next.t('modal.now')}${target?.name || i18next.t('modal.tag')
                            }${i18next.t('modal.notSave')}`,
                        cancelText: i18next.t('btn.cancel'),
                        diyText: i18next.t('apis.saveAndClose'),
                        okText: i18next.t('apis.notSave'),
                    });
                    if (res === undefined) {
                        // 保存并关闭
                        Bus.$emit('saveTargetById', {
                            id,
                            callback: (code, id) => {
                                Bus.$emit('removeOpenItem', id, id);
                            },
                        });
                    } else if (res) {
                        // 不保存
                        Bus.$emit('removeOpenItem', id);
                    } else {
                        // 取消
                        dispatch({
                            type: 'opens/updateOpenApiNow',
                            payload: `${Number(id)}` !== 'NaN' ? Number(id) : id
                        })
                    }
                } else {
                    Bus.$emit('removeOpenItem', id);
                }
            }
        }

        // if (isArray(open_navs) && open_navs.length > 0) {
        //     for (const id of open_navs) {
        //         const target = open_apis[id];
        //         if (target.hasOwnProperty('is_changed') && target.is_changed > 0) {
        //             const res = await asyncModalConfirm({
        //                 title: '提示',
        //                 content: `当前${target?.name || '标签'
        //                     }未保存是否确认关闭？如果您选择关闭它，这些更改将丢失`,
        //                 cancelText: '取消',
        //                 diyText: '保存并关闭',
        //                 okText: '不保存',
        //             });
        //             if (res === undefined) {
        //                 // 保存并关闭
        //                 Bus.$emit('saveTargetById', {
        //                     id,
        //                     callback: () => {
        //                         Bus.$emit('removeOpenItem', id);
        //                     },
        //                 });
        //             } else if (res) {
        //                 // 不保存
        //                 Bus.$emit('removeOpenItem', id);
        //             } else {
        //                 // 取消
        //                 return;
        //             }
        //         } else {
        //             Bus.$emit('removeOpenItem', id);
        //         }
        //     }
        // }
    };
    // 强制关闭所有标签
    const focreCloseAllTarget = async () => {
        // const open_navs =
        //     apGlobalConfigStore.get(`project_current:${CURRENT_PROJECT_ID}`)?.open_navs || [];
        if (Object.entries(open_apis).length > 0) {
            const res = await asyncModalConfirm({
                title: `${i18next.t('modal.forceClose')}？`,
                content: `${i18next.t('modal.closeNow')}${Object.entries(open_apis).length}${i18next.t('modal.closeNowLast')}`,
                cancelText: i18next.t('btn.cancel'),
                okText: i18next.t('modal.forceClose'),
            });
            if (res) {
                dispatch({
                    type: 'opens/coverOpenApis',
                    payload: {},
                })
            }
        }

        // if (isArray(open_navs) && open_navs.length > 0) {
        //     const res = await asyncModalConfirm({
        //         title: '强制关闭？',
        //         content: `确定关闭当前${open_navs.length}个标签吗。如果有未保存的更改，这些更改将丢失`,
        //         cancelText: '取消',
        //         okText: '强制关闭',
        //     });
        //     if (res) {
        //         const targets = await Opens.bulkGet(open_navs);
        //         if (isArray(targets)) {
        //             targets.forEach((target) => {
        //                 if (target?.target_type === 'websocket') {
        //                     // 关闭socket连接
        //                     if (desktop_proxy && desktop_proxy?.connected) {
        //                         desktop_proxy.emit('websocket', {
        //                             action: 'disconnect',
        //                             target,
        //                         });
        //                     }
        //                 }
        //             });
        //         }
        //         Opens.bulkDelete(open_navs).then(() => {
        //             dispatch({
        //                 type: 'opens/coverOpenApis',
        //                 payload: {},
        //             });
        //             dispatch({
        //                 type: 'opens/coverWebsockets',
        //                 payload: {},
        //             });
        //             apGlobalConfigStore.set(`project_current:${CURRENT_PROJECT_ID}`, { open_navs: [] });
        //         });
        //     }
        // }
    };
    // 关闭其他标签
    const closeOtherTargetById = async (apis, current_id) => {
        // const open_navs =
        //     apGlobalConfigStore.get(`project_current:${CURRENT_PROJECT_ID}`)?.open_navs || [];
        if (Object.entries(open_apis).length > 1) {
            for (const id in open_apis) {
                if (`${current_id}` === `${id}`) {
                    continue;
                }
                const target = open_apis[id];
                if (target.hasOwnProperty('is_changed') && target.is_changed > 0) {
                    const res = await asyncModalConfirm({
                        title: i18next.t('modal.tips'),
                        content: `${i18next.t('modal.now')}${target?.name || i18next.t('modal.tag')
                            }${i18next.t('modal.notSave')}`,
                        cancelText: i18next.t('btn.cancel'),
                        diyText: i18next.t('apis.saveAndClose'),
                        okText: i18next.t('apis.notSave'),
                    });
                    if (res === undefined) {
                        // 保存并关闭
                        Bus.$emit('saveTargetById', {
                            id,
                            callback: (code, id) => {
                                Bus.$emit('removeOpenItem', id, id);
                            },
                        });
                    } else if (res) {
                        // 不保存
                        Bus.$emit('removeOpenItem', id);
                    } else {
                        // 取消
                        return;
                    }
                } else {
                    Bus.$emit('removeOpenItem', id);
                }
            }
        }
    };
    // 强制关闭其他标签
    const focreCloseOtherTargetById = async (apis, current_id) => {

        // const open_navs =
        //     apGlobalConfigStore.get(`project_current:${CURRENT_PROJECT_ID}`)?.open_navs || [];
        if (Object.entries(open_apis).length > 1) {
            const res = await asyncModalConfirm({
                title: `${i18next.t('modal.forceClose')}？`,
                content: `${i18next.t('modal.closeOther')}${Object.entries(open_apis).length - 1}${i18next.t('modal.closeNowLast')}`,
                cancelText: i18next.t('btn.cancel'),
                okText: i18next.t('modal.forceClose'),
            });
            if (res) {
                for (const id in open_apis) {
                    if (`${current_id}` !== `${id}`) {
                        Bus.$emit('removeOpenItem', id);
                    }
                }
            }
        }
        // if (isArray(open_navs) && open_navs.length > 1) {
        //     const res = await asyncModalConfirm({
        //         title: '强制关闭？',
        //         content: `确定关闭其他${open_navs.length - 1}个标签吗。如果有未保存的更改，这些更改将丢失`,
        //         cancelText: '取消',
        //         okText: '强制关闭',
        //     });
        //     if (res) {
        //         for (const id of open_navs) {
        //             if (current_id !== id) {
        //                 Bus.$emit('removeOpenItem', id);
        //             }
        //         }
        //     }
        // }
    };
    // 保存所有标签
    const saveAllTarget = async () => {
        if (Object.entries(open_apis).length > 0) {
            for (const key in open_apis) {
                if (open_apis[key].is_changed > 0) {
                    await Bus.$asyncEmit('saveTargetById', { id: key });
                    // await Bus.$emit('saveTargetId', { id: key });
                    dispatch({
                        type: 'opens/updateSaveAll',
                    })
                }
            }
            Message('success', i18next.t('message.saveTagSuccess'));
        }
    };
    // 关闭所有标签
    useEventBus('closeAllTarget', closeAllTarget, [open_apis, open_api_now]);

    // 强制关闭所有标签
    useEventBus('focreCloseAllTarget', focreCloseAllTarget, [open_apis, open_api_now]);

    // 关闭其他标签
    useEventBus('closeOtherTargetById', closeOtherTargetById, [open_apis, open_api_now]);

    // 强制关闭其他标签
    useEventBus('focreCloseOtherTargetById', focreCloseOtherTargetById, [
        open_apis,
        open_api_now,
    ]);

    // 关闭其他标签
    useEventBus('saveAllTarget', saveAllTarget, [open_apis]);
};

export default useOpenTabs;
