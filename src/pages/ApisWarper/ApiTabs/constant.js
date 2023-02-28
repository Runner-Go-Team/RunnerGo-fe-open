import {
    Apis as SvgApis,
    Doc as SvgDoc,
    Project as SvgProject,
    WS as SvgSocket,
    Copy as SvgCopy,
    Code as SvgCode,
} from 'adesign-react/icons';
import GrpcSvg from '@assets/grpc/grpc.svg';

export const TABITEMMENULIST = [
    {
        title: '新建接口',
        type: 'api',
        icon: SvgApis,
        action: 'addOpenItem',
    },
    // {
    //     title: '新建文本',
    //     type: 'doc',
    //     icon: SvgDoc,
    //     action: 'addOpenItem',
    // },
    // {
    //     title: '新建WebSocket',
    //     type: 'websocket',
    //     icon: SvgSocket,
    //     action: 'addOpenItem',
    // },
    // {
    //     title: '新建Grpc',
    //     type: 'grpc',
    //     icon: GrpcSvg,
    //     action: 'addOpenItem',
    // },
    // {
    //     title: '粘贴接口/文本',
    //     type: 'newapi',
    //     icon: SvgCopy,
    //     action: 'pasteApiOrDoc',
    // },
    // {
    //     title: '从cURL导入',
    //     type: 'newapi',
    //     icon: SvgCode,
    //     action: 'importCURL',
    // },
    // {
    //     title: '导入项目',
    //     type: 'newapi',
    //     icon: SvgProject,
    //     action: 'importProject',
    // },
];
export const TABMOREMENULIST = [
    {
        type: 'closeAllTarget',
        title: '关闭所有标签',
        action: 'closeAllTarget',
    },
    {
        type: 'focreCloseAllTarget',
        title: '强制关闭所有标签',
        action: 'focreCloseAllTarget',
    },
    {
        type: 'closeOtherTargetById',
        title: '关闭其他标签',
        action: 'closeOtherTargetById',
    },
    {
        type: 'focreCloseOtherTargetById',
        title: '强制关闭其他标签',
        action: 'focreCloseOtherTargetById',
    },
    {
        type: 'saveAllTarget',
        title: '保存所有标签',
        tips: `Ctrl + shift + S`,
        action: 'saveAllTarget',
    },
];
