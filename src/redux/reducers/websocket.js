
const NAMESPACE = 'websocket';

const initialState = {
    // 实例化的websocket对象
    ws: null,
    // 是否已经建立连接
    is_open: false
};

// action名称
const actionTypes = {
    updateWs: 'updateWs',
    updateIsOpen: 'updateIsOpen'
};

export const webSocketReducer = (state = initialState, action) => {
    switch (action.type) {
        case `${NAMESPACE}/${actionTypes.updateWs}`:
            console.log(action.payload);
            return { ...state, ws: action.payload };
        case `${NAMESPACE}/${actionTypes.updateIsOpen}`:
            return { ...state, is_open: action.payload }
        default:
            return state;
    }
};

export default webSocketReducer;