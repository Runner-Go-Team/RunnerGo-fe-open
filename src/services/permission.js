import ajax from './ajax';

// 获取用户的全部角色对应的mark
export const getUserAllPermissionMarks = (
    params
) => ajax('post', '/management/api/permission/user_get_marks', 'json', false, params);

