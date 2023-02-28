import merge from 'lodash/merge';
import { USER_CONFIG } from '../constants/userConfig';

// 获取用户配置信息
export const getUserConfig = async (uuid) => {
  const userConfig = await User.get(uuid);
  return userConfig;
};

// 更新默认配置信息
export const updateUserDefaultConfig = async (
  uuid,
  default_team_id,
  default_project_id,
  current_team_id,
  current_project_id
) => {
  const userConfig = {
    uuid,
    hideMenus: [],
    workspace: {
      DEFAULT_TEAM_ID: default_team_id,
      DEFAULT_PROJECT_ID: default_project_id,
      CURRENT_TEAM_ID: current_team_id,
      CURRENT_PROJECT_ID: current_project_id,
    },
    config: USER_CONFIG,
  };

  const localConfig = await getUserConfig(uuid);
  if (localConfig === undefined) {
    await User.put(userConfig, userConfig.uuid);
    return userConfig;
  }
  const newConfig = merge(localConfig, userConfig);

  await User.update(uuid, newConfig);

  return userConfig;
};
