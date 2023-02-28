import { from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import { UserTeams } from '@indexedDB/team';
import { Message } from 'adesign-react';
// import { ITeam } from '@models/team';
import Dayjs from 'dayjs';

// 获取本地indexDB团队信息
export const getLocalTeamInfo = (team_id) => {
  // // const userTeam$ = from(UserTeams.get({ team_id }));
  // return userTeam$.pipe(
  //   map((teamInfo) => {
  //     if (teamInfo === undefined) {
  //       throw new Error('本地团队信息不存在');
  //     }
  //     return teamInfo;
  //   }),
  //   catchError((error) => {
  //     Message('error', error.message);
  //     return userTeam$;
  //   })
  // );
  return {};
};

// 创建默认团队
export const createDefaultTeam = async (uuid) => {
  const team_id = '-1';
  const defaultTeam = {
    create_dtime: Dayjs().unix(),
    fee_expire_dtime: '',
    id: `${team_id}/${uuid}`,
    is_admin: 1,
    is_default: 1,
    is_readonly: -1,
    name: '离线团队',
    team_id,
    uuid,
  };
  await UserTeams.put(defaultTeam);
  return defaultTeam;
};
