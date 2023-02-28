// import { fetchUserProjectList } from '@services/projects';
// import { UserProjects } from '@indexedDB/project';
import { from } from 'rxjs';

const pullProjectList = () => {
    const uuid = localStorage.getItem('uuid');
    if (uuid === null) {
        return Promise.reject();
    }

    return new Promise((resove, reject) => {
        from(fetchUserProjectList()).subscribe({
            next(resp) {
                if (resp?.code === 10000) {
                    const projectList = resp.data?.map((projectInfo) => ({
                        ...projectInfo,
                        uuid,
                        id: `${projectInfo.project_id}/${uuid}`,
                    }));
                    // 删除原有数据
                    UserProjects.where('uuid').equals(uuid).delete();
                    // 插入现有数据
                    UserProjects.bulkPut(projectList);
                    resove(resp);
                } else {
                    reject();
                }
            },
            error() {
                reject();
            },
        });
    });
};

export default {
    PULL: pullProjectList,
};
