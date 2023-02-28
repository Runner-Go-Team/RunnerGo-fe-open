import { from, iif, of, catchError, mergeMap, concatMap, map, tap } from 'rxjs';
import { fetchUserTeamList } from '@services/projects';
import { fetchTeamList } from '@services/user';
// import { UserTeams } from '@indexedDB/team';
import { isLogin } from '@utils/common';

// 获取用户本地团队列表
export const getUserLocalTeamList = async (uuid) => {
    // const userTeamList = await UserTeams.where({ uuid }).toArray();
    // return userTeamList;
    return {};
};

// 更新用户本地团队列表
const updateLocalTeamList = async (uuid, teamList) => {
    // await UserTeams.where({ uuid }).delete();
    // const userTeams = teamList?.map((teamInfo) => ({
    //     ...teamInfo,
    //     uuid,
    //     id: `${teamInfo.team_id}/${uuid}`,
    // }));
    // await UserTeams.bulkPut(userTeams);
};

// 创建用户本地默认团队
const getDefaultOfflineTeam = (uuid) => {
    return {
        create_dtime: 1551929293,
        fee_expire_dtime: 1646126131,
        id: `-1/${uuid}`,
        is_admin: 1,
        is_default: 1,
        is_readonly: -1,
        name: '离线团队',
        team_id: '-1',
        uuid,
    };
};

// 获取用户下团队列表
export const getUserTeamList$ = () => {
    return from(fetchTeamList());
    return iif(
        isLogin,
        fetchTeamList().pipe(
            tap((res) => {
                return res;
                // if (res.code === 0) {
                //     return from(updateLocalTeamList(uuid, res.data)).pipe(
                //         mergeMap(() => getUserLocalTeamList(uuid))
                //     );
                // }
                // return getUserLocalTeamList(uuid);
            }),
            catchError(() => {
                return getUserLocalTeamList(uuid);
            })
        ),
        of('').pipe(
            concatMap(() => getUserLocalTeamList(uuid)),
            concatMap((teamList) => {
                if (teamList.length === 0) {
                    const defaultOfflineList = [getDefaultOfflineTeam(uuid)];
                    return from(updateLocalTeamList(uuid, defaultOfflineList)).pipe(
                        map(() => defaultOfflineList)
                    );
                }
                return of(teamList);
            })
        )
    );
};
