// import { fetchUserTeamList } from '@services/projects';
// import { UserTeams } from '@indexedDB/team';

const pullTeamList = () => {
    const uuid = localStorage.getItem('uuid');
    if (uuid === null) {
        return Promise.reject();
    }

    return new Promise((resove, reject) => {
        fetchUserTeamList()
            .then((resp) => {
                if (resp?.code === 10000) {
                    const teamList = resp.data?.map((teamInfo) => ({
                        ...teamInfo,
                        uuid,
                        id: `${teamInfo.team_id}/${uuid}`,
                    }));
                    // 删除原有数据
                    UserTeams.where('uuid').equals(uuid).delete();
                    // 插入现有数据
                    UserTeams.bulkPut(teamList);
                    resove(resp);
                } else {
                    reject();
                }
            })
            .catch(() => {
                reject();
            });
    });
};

export default {
    PULL: pullTeamList,
};
