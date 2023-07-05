const NAMESPACE = 'permission';

const initialState = {
    companyPermissions: [],
    teamPermissions:{},
};

const permissionReducer = (state = initialState, action) => {
    switch (action.type) {
        case `${NAMESPACE}/updatePermission`:
            return {
                ...state,
                ...action.payload,
            };
            break;
        default:
            return state;
            break;
    }
}

export default permissionReducer;
