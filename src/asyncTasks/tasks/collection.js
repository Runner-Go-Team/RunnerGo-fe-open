import { fetchTargetIdsRequest } from '@services/apis';
// import { Collection, Asyn_Load_Target_Ids } from '@indexedDB/project';
// import { IBaseCollection } from '@dto/collection';

// 添加目录下载异步任务
const addPullCollectionTask = async ({ serverList, localList, project_id }) => {
    const localDatas= {};
    localList.forEach((item) => {
        localDatas[item.target_id] = item;
    });

    // 需要下载的项目
    const needLoadItems = [];
    // 物理删除的数据
    const physicsDeleteItems = [];
    for (let i = 0; i < serverList.length; i++) {
        const serverItem = serverList[i];
        const localItem = localDatas[serverItem.target_id];
        const dataItem = {
            project_id,
            target_id: serverItem.target_id,
            task_id: `${serverItem.target_type}/${serverItem.target_id}`,
            count: 0,
            name: serverItem.name,
            sortIndex: Math.round(new Date().getTime() / 2000),
        };

        if (serverItem.status === 1 || serverItem.status === -1) {
            if (localItem === undefined || serverItem.version !== localItem.version) {
                needLoadItems.push(dataItem);
            }
        } else {
            physicsDeleteItems.push(dataItem);
        }
    }
    // 如果已经物理删除，则删除任务队列和Collection中的数据
    if (physicsDeleteItems.length > 0) {
        Asyn_Load_Target_Ids.bulkDelete(physicsDeleteItems.map((d) => d.task_id));
        Collection.bulkDelete(physicsDeleteItems.map((d) => d.target_id));
    }
    Asyn_Load_Target_Ids.bulkPut(needLoadItems);
};

const handlePullCollection = ({ project_id }) => {
    return new Promise(async (resove, reject) => {
        const resp = await fetchTargetIdsRequest({ project_id });
        if (resp?.code !== 10000) {
            reject();
            return;
        }
        const serverList = Array.isArray(resp?.data?.list) ? resp?.data?.list : [];
        const localList = await Collection.where('project_id').equals(project_id).toArray();
        await addPullCollectionTask({
            serverList,
            localList,
            project_id,
        });
        resove();
    });
};

export default {
    PULL: handlePullCollection,
};
