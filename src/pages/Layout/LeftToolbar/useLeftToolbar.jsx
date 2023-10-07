
import React, { useState, useEffect, useRef } from 'react'; import {
    Lately as SvgLately,
    Apis as SvgApis,
    Answer as SvgDesign,
    ShareDoc as SvgShare,
    Project as SvgProject,
    Doc as SvgDoc,
    Delete as RecycleIcon,
    Environment as SvgEnv,
    Mock as SvgMock
} from 'adesign-react/icons';
import SvgTest from '@assets/icons/left-test';
import SvgPer from '@assets/icons/left-performance';
import SvgHome from '@assets/icons/Home';
import SvgScene from '@assets/icons/Scene1';
import SvgPlan from '@assets/icons/Plan1';
import SvgReport from '@assets/icons/Report1';
import SvgElementMgmt from '@assets/icons/element_management';
import SvgPlanMgmt from '@assets/icons/plan_management';
import SvgReportMgmt from '@assets/icons/report_management';
import SvgSceneMgmt from '@assets/icons/scene_management';
import SvgMachine from '@assets/icons/Machine';
import { useTranslation } from 'react-i18next';
//  import SvgGroup from '@assets/icons/H';



const useLeftToolbar = () => {
    const { t } = useTranslation();
    const leftBarItems = [
        {
            type: 'MenuItem',
            title: t('leftBar.index'),
            icon: <SvgHome className="arco-icon arco-icon-robot" />,
            link: '/index',
        },
        {
            type: 'MenuItem',
            title: t('leftBar.apis'),
            icon: <SvgApis className="arco-icon arco-icon-robot" />,
            link: '/apis',
        },
        {
            type: 'MenuItem',
            title: t('leftBar.scene'),
            icon: <SvgScene className="arco-icon arco-icon-robot" />,
            link: '/scene',
        },
        {
            type: 'SubMenu',
            key: 'SubMenu-1',
            title: <div className="sub-menu-title">
                <SvgPer className="arco-icon arco-icon-robot" />{t('leftBar.performance')}
            </div>,
            menuItems: [
                {
                    type: 'MenuItem',
                    title: t('leftBar.plan'),
                    icon: null,
                    link: '/plan',
                },
                {
                    type: 'MenuItem',
                    title: t('leftBar.report'),
                    icon: null,
                    link: '/report',
                },
                {
                    type: 'MenuItem',
                    title: t('leftBar.preset'),
                    icon: null,
                    link: '/preset',
                }
            ]
        },
        {
            type: 'SubMenu',
            key: 'SubMenu-2',
            title: <div className="sub-menu-title">
                <SvgTest className="arco-icon arco-icon-robot" />{t('leftBar.test')}
            </div>,
            menuItems: [
                {
                    type: 'MenuItem',
                    title: t('leftBar.plan'),
                    icon: null,
                    link: '/Tplan',
                },
                {
                    type: 'MenuItem',
                    title: t('leftBar.report'),
                    icon: null,
                    link: '/Treport',
                }
            ]
        },
        {
            type: 'MenuItem',
            title: t('leftBar.env'),
            icon: <SvgEnv className="arco-icon arco-icon-robot" />,
            link: '/env',
        },
        {
            type: 'MenuItem',
            title: t('leftBar.machine'),
            icon: <SvgMachine className="arco-icon arco-icon-robot" />,
            link: '/machine',
        },
        {
            type: 'MenuItem',
            title: t('leftBar.mockservice'),
            icon: <SvgMock className="arco-icon arco-icon-robot" />,
            link: '/mockservice',
        },
        {
            type: 'MenuItem.click',
            title: t('leftBar.docs'),
            icon: <SvgDoc className="arco-icon arco-icon-robot" />,
            link: '/doc',
            onClick: () => window.open('https://wiki.runnergo.cn/docs/', '_blank')
        },
    ];
    const uiTestAutoBarItems = [
        {
            type: 'MenuItem',
            title: t('leftBar.mgmt.element'),
            icon: <SvgElementMgmt className="arco-icon arco-icon-robot" />,
            link: '/uiTestAuto/element',
        }, {
            type: 'MenuItem',
            title: t('leftBar.mgmt.scene'),
            icon: <SvgSceneMgmt className="arco-icon arco-icon-robot" />,
            link: '/uiTestAuto/scene',
        }, {
            type: 'MenuItem',
            title: t('leftBar.mgmt.plan'),
            icon: <SvgPlanMgmt className="arco-icon arco-icon-robot" />,
            link: '/uiTestAuto/plan',
        }, {
            type: 'MenuItem',
            title: t('leftBar.mgmt.report'),
            icon: <SvgReportMgmt className="arco-icon arco-icon-robot" />,
            link: '/uiTestAuto/report',
        },
    ]
    return {
        leftBarItems,
        uiTestAutoBarItems
    };
};

export default useLeftToolbar;


