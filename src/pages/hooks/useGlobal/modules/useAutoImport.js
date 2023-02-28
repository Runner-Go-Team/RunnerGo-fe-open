/* eslint-disable no-lonely-if */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react';
// import { Collection, SourceAutoImport } from '@indexedDB/project';
import Bus from '@utils/eventBus';
import { Message } from 'adesign-react';
import { isObject, isUndefined, cloneDeep, isEmpty, isArray } from 'lodash';
import Swagger2Apipost from 'swagger2apipost';
import Module2ApiPostFull from 'module2apipostfull';
import { array2NamePathObj, findSon } from '@utils';
import ImportInterval from '@utils/importInterval';
import { getSyncProjectAllApi } from '@services/projects';

const useAutoImport = () => {
    const autoImportByObj = async (data) => {
        // data_source_url: '', // 数据源地址
        // folder_id: '0', // 导入目标目录的id
        //   cover_modal: 'urlAndFolder', // 导入接口的覆盖模式 url(同url覆盖)，urlAndFolder(同url同目录覆盖)uniqueUrl(同url不覆盖)，bothUrl（同url保留二者）
        //     is_base_path: -1, // 接口路径是否拼接basePath
        let { data_source_url } = data;
        const { folder_id, is_base_path, cover_modal, project_id, callback } = data;

        if (!data_source_url || data_source_url === '') {
            Message('error', '请输入您需要导入的地址');
            callback && callback();
            return;
        }

        if (
            data_source_url.substr(0, 7).toLowerCase() !== 'http://' &&
            data_source_url.substr(0, 8).toLowerCase() !== 'https://'
        ) {
            data_source_url = `http://${data_source_url}`;
        }

        const converter = new Swagger2Apipost();
        const convertResult = await converter.convert(data_source_url, {
            basePath: is_base_path > 0,
        });
        if (convertResult?.status === 'error') {
            if (convertResult?.message) {
                Message('error', convertResult?.message);
            }
            callback && callback();
            return;
        }
        try {
            if (convertResult?.data && convertResult?.data !== '') {
                const fullJson = Module2ApiPostFull(convertResult?.data);
                const { apis } = fullJson;

                if (isArray(apis) && apis.length > 0) {
                    let localArr = await Collection.where('project_id').anyOf(project_id).toArray();
                    if (!folder_id || folder_id == '0') {
                        const newLocalArr = [];
                        findSon(newLocalArr, localArr, folder_id);
                        localArr = newLocalArr;
                    }
                    const newApis = apis.map((item) => {
                        item.project_id = project_id;
                        return item;
                    });
                    const importPathObj = array2NamePathObj(apis, newApis, 'target_id', 'parent_id');

                    const localPathObj = array2NamePathObj(localArr, [], 'target_id', 'parent_id');

                    // 同url覆盖   同url不覆盖 同url保留二者
                    if (
                        cover_modal === 'url' ||
                        cover_modal === 'uniqueUrl' ||
                        cover_modal === 'bothUrl' ||
                        cover_modal === 'urlAndFolder'
                    ) {
                        const localDataObj = {};
                        const localObj = {};
                        const newApisDataObj = {};
                        localArr.forEach((item) => {
                            if (item?.target_type !== 'folder') {
                                if (!localObj.hasOwnProperty(`${item?.url}.${item?.method}`)) {
                                    localObj[item?.name || '新建'] = [];
                                }
                                localObj[item.name].push(item.target_id);
                            }
                            localDataObj[item?.target_id] = item;
                        });
                        newApis.forEach((element) => {
                            newApisDataObj[element?.target_id] = element;
                        });
                        newApis.forEach((item) => {
                            const tempArr = [];
                            if (item?.target_type === 'folder') {
                                if (!localPathObj.hasOwnProperty(item?.path)) {
                                    // 本地路径不存在 判断上级节点存不存在
                                    const parent = newApisDataObj[item?.parent_id];
                                    if (parent && localPathObj.hasOwnProperty(parent?.path))
                                        item.parent_id = localPathObj[parent?.path].target_id; // 存在把 父id改掉
                                    tempArr.push(item);
                                }
                            } else {
                                // 遇到同url的情况 直接覆盖
                                if (localObj.hasOwnProperty(`${item?.url}.${item?.method}.${item?.target_type}`)) {
                                    const localObjItem =
                                        localObj[`${item?.url}.${item?.method}.${item?.target_type}`];
                                    if (cover_modal === 'url') {
                                        const { url, method, name, mark, mock, mock_url, request, response } = item;
                                        tempArr.push({
                                            ...localObjItem,
                                            url,
                                            method,
                                            name,
                                            mark,
                                            mock,
                                            mock_url,
                                            request,
                                            response,
                                        });
                                    } else if (cover_modal === 'uniqueUrl') {
                                        // 不覆盖，直接跳过
                                    } else if (cover_modal === 'bothUrl') {
                                        // 保留二者
                                        tempArr.push({
                                            ...item,
                                            parent_id: localObjItem?.parent_id || '0',
                                        });
                                    } else if (cover_modal === 'urlAndFolder') {
                                        // 同url同目录
                                        if (localPathObj.hasOwnProperty(item?.path)) {
                                            const localPathObjIds = localPathObj[item?.path];
                                            if (isArray(localPathObjIds) && localPathObjIds.length > 0) {
                                                localPathObjIds.forEach((id) => {
                                                    if (localDataObj.hasOwnProperty(id)) {
                                                        const { url, method, name, mark, mock, mock_url, request, response } =
                                                            item;
                                                        tempArr.push({
                                                            ...localDataObj.id,
                                                            url,
                                                            method,
                                                            name,
                                                            mark,
                                                            mock,
                                                            mock_url,
                                                            request,
                                                            response,
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                } else {
                                    // 直接新增
                                    // 本地路径不存在 判断上级节点存不存在
                                    const parent = newApisDataObj[item?.parent_id];
                                    if (parent && localPathObj.hasOwnProperty(parent?.path))
                                        item.parent_id = localPathObj[parent?.path].target_id; // 存在把 父id改掉
                                    tempArr.push(item);
                                }
                            }

                            if (tempArr.length > 0) {
                                tempArr.forEach((item) => {
                                    Bus.$emit('saveTargetByObj', { Obj: item });
                                });
                            }
                        });
                    }
                }
                Message('success', '导入成功');
                callback && callback();
            }
        } catch (error) {
            Message('success', `转换出错${error}`);
            callback && callback();
        }
    };

    const openAutoImport = async () => {
        // const resp = await getSyncProjectAllApi().toPromise();
        // if (resp && resp.code === 10000) {
            // await SourceAutoImport.where('uuid')
            //     .anyOf([localStorage.getItem('uuid')])
            //     .delete();
            // if (Array.isArray(resp?.data) || resp?.data?.length > 0) {
                // const newarr = resp?.data?.map((it) => ({ ...it, uuid: localStorage.getItem('uuid') }));
                // await SourceAutoImport.bulkPut(newarr);
            // }
        // }
        // await SourceAutoImport.where('uuid')
        //     .anyOf([localStorage.getItem('uuid')])
        //     .toArray()
        //     .then((val) => {
        //         if (val && val?.length > 0) {
        //             val.forEach((item) => {
        //                 if (item?.is_open === 1 && item?.import_interval !== 0) {
        //                     ImportInterval.addTimer(
        //                         item?.auto_import_id,
        //                         async (auto_import_id) => {
        //                             // 本地获取最新的值 判断是否继续执行
        //                             const autoImportObj = await SourceAutoImport.get(auto_import_id);
        //                             if (item?.is_open === 1 && item?.import_interval !== 0) {
        //                                 autoImportByObj(autoImportObj);
        //                             } else {
        //                                 throw new Error('不用继续执行');
        //                             }
        //                         },
        //                         1000 * 60 * 60 * (item?.import_interval || 3)
        //                     );
        //                 }
        //             });
        //         }
        //     });
    };
    useEffect(() => {
        openAutoImport();

        Bus.$on('autoImport', autoImportByObj);

        return () => {
            // 销毁订阅
            Bus.$off('autoImport');
        };
    }, []);
};

export default useAutoImport;
