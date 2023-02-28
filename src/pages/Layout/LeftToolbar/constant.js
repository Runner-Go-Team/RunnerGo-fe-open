import { 
    Lately as SvgLately, 
    Apis as SvgApis, 
    Answer as SvgDesign, 
    ShareDoc as SvgShare, 
    Processtest as SvgTest, 
    Project as SvgProject, 
    Doc as SvgDoc, 
    Delete as RecycleIcon
 } from 'adesign-react/icons';
 import SvgHome from '@assets/icons/Home';
 import SvgScene from '@assets/icons/Scene1';
 import SvgPlan from '@assets/icons/Plan1';
 import SvgReport from '@assets/icons/Report1';
 import SvgMachine from '@assets/icons/Machine';
//  import SvgGroup from '@assets/icons/H';

export const leftBarItems = [
    {
        type: 'index',
        title: '首页',
        icon: SvgHome,
        link: '/index',
    },
    {
        type: 'apis',
        title: '接口管理',
        icon: SvgApis,
        link: '/apis',
    },
    {
        type: 'scene',
        title: '场景管理',
        icon: SvgScene,
        link: '/scene',
    },
    {
        type: 'plan',
        title: '计划管理',
        icon: SvgPlan,
        link: '/plan',
    },
    {
        type: 'report',
        title: '报告管理',
        icon: SvgReport,
        link: '/report',
    },
    {
        type: 'machine',
        title: '机器管理',
        icon: SvgMachine,
        link: '/machine',
    },
    {
        type: 'doc',
        title: '使用文档',
        icon: SvgDoc,
        link: '/doc',
    },
];

