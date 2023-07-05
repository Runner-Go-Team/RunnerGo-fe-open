import { Settings } from '@constants/user';
import { getCookie } from '@utils';

const NAMESPACE = 'user';

const initialState = {
    // 用户配置信息
    config: Settings,
    // 当前用户信息
    userInfo: {
        email: '',
        nickname: '',
        avatar: '',
        user_id: null,
        role_id: null,
        mobile: '',
        account: '',
        role_name: ''
    },
    team_id: null,
    theme: getCookie('theme') || 'dark',
    language: getCookie('i18nextLng') || 'cn',
    pre_mock_url: '',
};

// action名称
const actionTypes = {
    updateConfig: 'updateConfig',
    updateUserInfo: 'updateUserInfo',
    updateTeamId: 'updateTeamId',
    updateMockUrl: 'updateMockUrl',
    updateTheme: 'updateTheme',
    updateLanGuaGe: 'updateLanGuaGe',
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case `${NAMESPACE}/${actionTypes.updateConfig}`:
            return { ...state, config: action.payload };
        case `${NAMESPACE}/${actionTypes.updateUserInfo}`:
            return { ...state, userInfo: action.payload };
        case `${NAMESPACE}/${actionTypes.updateTeamId}`:
            return { ...state, team_id: action.payload };
        case `${NAMESPACE}/${actionTypes.updateMockUrl}`:
            return { ...state, pre_mock_url: action.payload };
        case `${NAMESPACE}/${actionTypes.updateTheme}`:
            return {
                ...state,
                theme: action.payload
            }
        case `${NAMESPACE}/${actionTypes.updateLanGuaGe}`:
            return {
                ...state,
                language: action.payload
            }
        default:
            return state;
    }
};

export default userReducer;