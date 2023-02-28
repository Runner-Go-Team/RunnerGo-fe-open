// import { Collection } from '@indexedDB/project';
// import { IBaseCollection } from '@models/collection';
import { Subject, tap } from 'rxjs';
import { filter, concatMap, map, delay } from 'rxjs/operators';
import { fetchCollectionDetailRequest } from '@services/apis';
// import { ITreeMenuItem } from '@dto/apis';
import { isUndefined } from 'lodash';

// 单次任务下载接口数量
const SINGLE_TASK_DOWNLOAD_COUNT = 100;

const DOWNLOAD_THROTTLE_TIME = 10; // 下载时间间隔

// 获取本地接口/目录列表
const getLocalCollectionList = async (project_id) => {
  // const collectionList = await Collection.where({ project_id }).toArray();
  // return collectionList;
  return [];
};

// 获取下载targetId信息
export const getTargetIdBuffers = (unLoads) => {
  const targetIdList = unLoads.map((d) => d?.target_id);
  const tasks = Math.ceil(targetIdList?.length / SINGLE_TASK_DOWNLOAD_COUNT);
  const targetBuffers = [];
  for (let i = 0; i < tasks; i++) {
    const targetIds = targetIdList.slice(
      i * SINGLE_TASK_DOWNLOAD_COUNT,
      (i + 1) * SINGLE_TASK_DOWNLOAD_COUNT
    );
    targetBuffers.push(targetIds);
  }
  return targetBuffers;
};

// 获取本地接口/目录数据
export const getLocalCollectionData = async (project_id) => {
  const userCollections = await getLocalCollectionList(project_id);
  const apiData = {};
  userCollections.forEach((item) => {
    apiData[`${item.target_id}`] = item;
  });
  return apiData;
};

// 获取未下载的接口/目录信息列表
export const getUnDownloadList = async (project_id, serverList) => {
  // 需要下载的项目
  const needLoadItems = [];

  // 本地数据
  const localData = await getLocalCollectionData(project_id);

  // 物理删除的数据
  const physicsDeleteItems = [];
  for (let i = 0; i < serverList?.length; i++) {
    const serverItem = serverList[i];
    const localItem = localData[serverItem.target_id];
    const dataItem = {
      project_id,
      target_id: serverItem.target_id,
      task_id: `pullcollection/${serverItem.target_id}`,
      count: 0,
      name: serverItem.name,
      sortIndex: Math.round(new Date().getTime() / 2000),
    };

    if (serverItem.status === 1 || serverItem.status === -1) {
      if (isUndefined(localItem) || serverItem.version !== localItem.version) {
        needLoadItems.push(dataItem);
      }
    } else {
      physicsDeleteItems.push(dataItem);
    }
  }

  if (physicsDeleteItems.length > 0) {
    await Collection.bulkDelete(physicsDeleteItems.map((d) => d.target_id));
  }
  //  await Asyn_Load_Target_Ids.bulkPut(needLoadItems);

  // // 如果已经物理删除，则删除任务队列和Collection中的数据
  // if (physicsDeleteItems.length === 0) {
  //   downloadTask$.next('complete');
  // } else {
  //   await Asyn_Load_Target_Ids.bulkDelete(physicsDeleteItems.map((d) => d.task_id));
  //   await Collection.bulkDelete(physicsDeleteItems.map((d) => d.target_id));
  // }
  // await Asyn_Load_Target_Ids.bulkPut(needLoadItems);

  return needLoadItems;
};

// 批量下载左侧api/目录详情
export const multiDownloadCollection = ({ project_id, target_ids }) => {
  return fetchCollectionDetailRequest({
    project_id,
    target_ids,
  }).pipe(
    filter((resp) => resp?.code === 10000),
    map((resp) => resp?.data),
    concatMap((dataList) => Collection.bulkPut(dataList)),
    delay(DOWNLOAD_THROTTLE_TIME)
  );
};
