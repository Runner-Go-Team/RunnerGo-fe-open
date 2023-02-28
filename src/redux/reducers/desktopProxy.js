const NAMESPACE = 'desktopProxy';

const initialState = {
  desktop_proxy: {},
};

export const desktopProxyReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/updateDesktopProxy`:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default desktopProxyReducer;
