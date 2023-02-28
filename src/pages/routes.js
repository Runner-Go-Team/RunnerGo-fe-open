import Login from "./Login";
import LoginPro from "./Login/LoginPro";
import FindPassword from "./RetrievePassword";
import Apis from './ApisWarper';
import Scene from "./Scene";
import Plan from './Plan';
import Report from "./Report";
import Machine from "./Machine";
import HomePage from "./HomePage";

import EmailReport from "./EmailReport";
import AutoEmailReport from "./AutoEmailReport";

import InvitateExpire from "./InvitateExpire";
import ReportContrast from "./ReportContrast";
import PresetConfig from "./PresetConfig";
import Page404 from "./404";
import TestPlan from "./TestPlan";
import TestReport from "./TestReport";
import InvitatePage from "./InvitatePage";


import LinkMore from "./LinkMore";

const Route = [
    {
        name: 'login',
        path: '/login/*',
        element: () => <Login><LoginPro /></Login>,
    },
    {
        name: 'find',
        path: '/find',
        element: () => <Login><FindPassword /></Login>
    },
    {
        name: 'index',
        path: '/index',
        element: HomePage,
    },
    {
        name: 'apis',
        path: '/apis/*',
        element: Apis,
    },
    {
        name: 'scene',
        path: '/scene/*',
        element: Scene,
    },
    {
        name: 'plan',
        path: '/plan/*',
        element: Plan,
    },
    {
        name: 'report',
        path: '/report/*',
        element: Report,
    },
    {
        name: 'machine',
        path: '/machine/*',
        element: Machine,
    },
    {
        name: 'emailReport',
        path: '/email/report',
        element: EmailReport,
    },
    {
        name: 'autoEmailReport',
        path: '/email/autoReport',
        element: AutoEmailReport
    },
    {
        name: 'invitateExpire',
        path: '/invitateExpire',
        element: InvitateExpire
    },
    {
        name: 'reportContrast',
        path: '/reportContrast',
        element: ReportContrast
    },
    {
        name: 'preset',
        path: '/preset',
        element: PresetConfig
    },
    {
        name: '404',
        path: '/404',
        element: Page404
    },
    {
        name: 'Tplan',
        path: '/Tplan/*',
        element: TestPlan
    },
    {
        name: 'Treport',
        path: '/Treport/*',
        element: TestReport
    },
    {
        name: 'invitatePage',
        path: '/invitatePage',
        element: InvitatePage
    },
    {
        name: 'linkoverstep',
        path: '/linkoverstep',
        element: LinkMore
    }
];


export const RoutePages = Route;