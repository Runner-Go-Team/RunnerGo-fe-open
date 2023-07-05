const NAMESPACE = 'global';

const initialState = {
  isDownloading: -1, // 数据是否正在下载中
  isUploading: -1, // 数据是否正在上传中
  isOnLine: 1, // 网络是否在线
  clientAddress: '127.0.0.1', // 当前机器mock地址
  moduleType: null, // 当前渲染全局模块名称
  isPreLoader: true, // 是否在进行预加载
};

export const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${NAMESPACE}/setDownloadStatus`:
      return { ...state, isDownloading: action.payload };
    case `${NAMESPACE}/setUploadStatus`:
      return { ...state, isUploading: action.payload };
    case `${NAMESPACE}/updateOnLineStatus`:
      return { ...state, isOnLine: action.payload };
    case `${NAMESPACE}/updateModuleType`:
      return { ...state, moduleType: action.payload };
    case `${NAMESPACE}/updatePreLoader`:
      return { ...state, isPreLoader: action.payload };
    default:
      return state;
  }
};

export default globalReducer;
