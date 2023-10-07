import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { RoutePages } from './routes';
import Header from './Layout/Header';
import LeftToolbar from './Layout/LeftToolbar';

import useGlobal from './hooks/useGlobal';
import '@utils/apconfigstore';
import qs from 'qs';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RD_ADMIN_URL } from '@config';
import { getCookie } from '@utils';

import { ConfigProvider } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';
import cnUS from '@arco-design/web-react/es/locale/zh-CN';
import GlobalModal from '@modals/GlobalModal';

const App = () => {
    const location = useLocation();
    const { search } = location;
    const { team_id } = qs.parse(search.slice(1));
    const { i18n } = useTranslation();
    const dispatch = useDispatch();
    const isPreLoader = useSelector((store) => store?.global?.isPreLoader);
    // const ignorePage = ['/login', '/register', '/find', '/reset', '/linkoverstep', '/wx'];
    // const commonPage = ['/linkoverstep', '/invitatePage', '/invitateExpire', '/404', '/email/report', '/email/autoReport'];
    // // 邀请链接进入, 忽略一些不要重定向的路由
    // const redirectIgnore = ['/find', '/invitatePage'];

    const ininTheme = () => {
        // 用户配置放入redux中
        let linkThemeName = '';
        // const theme_color = localStorage.getItem('theme_color');
        const theme_color = getCookie('theme') || 'dark';

        if (theme_color) {
            linkThemeName = theme_color;
            dispatch({
                type: 'user/updateTheme',
                payload: theme_color
            })
        } else {
            linkThemeName = 'dark'
        }


        if (theme_color === 'dark' || !theme_color) {
            document.body.setAttribute('arco-theme', 'dark');
        } else if (theme_color === 'white') {
            document.body.removeAttribute('arco-theme');
        }

        const url = `/skins/${linkThemeName}.css`;
        document.querySelector(`link[name="apt-template-link"]`).setAttribute('href', url);
    };


    useEffect(() => {

        ininTheme();
    }, [])


    useEffect(() => {

        const token = getCookie('token');
        if (!token && (!['/email/report', '/email/autoReport'].includes(location.pathname))) {
            window.location.href = RD_ADMIN_URL;
        }

    }, [location.pathname]);

    (!['/email/report', '/email/autoReport'].includes(location.pathname)) && useGlobal(null);


    const _ignorePage = ['/login', '/register', '/find', '/userhome', '/reset', '/emailReport', '/email', '/invitateExpire', '/invitatePage', '/404', '/', '/renew', '/pay', '/linkoverstep', '/wx', '/runnergo_local_svg'];
    const renderRoot = () => {
        const isPreLoaderEnabled = Boolean(isPreLoader);
        const shouldRender = !isPreLoaderEnabled || ['/email/report', '/email/autoReport'].includes(location.pathname);
        if (!shouldRender) {
            return null;
        }
        let renderMainName = 'other';
        if (location.pathname.split('/')[1] == 'uiTestAuto') {
            renderMainName = 'uiTestAuto'
        } else if (!_ignorePage.includes(`/${location.pathname.split('/')[1]}`)) {
            renderMainName = 'apiTest';
        }
        const routeDom = (<Routes>
            {RoutePages.map((d) => (
                <Route key={d.name} path={d.path} element={<d.element />}></Route>
            ))}
            <Route path='/' element={<Navigate to="index" />} />
        </Routes>)

        const renderMainDom = {
            uiTestAuto: <>
                <Header />
                <div className='section-page'>
                    <LeftToolbar type='uiTestAuto'/>
                    <div className='main-page'>
                        {routeDom}
                    </div>
                </div>
            </>,
            apiTest: <>
                <Header />
                <div className='section-page'>
                    <LeftToolbar />
                    <div className='main-page'>
                        {routeDom}
                    </div>
                </div>
            </>,
            other: <div className='section-page'>
                {routeDom}
            </div>
        };
        return (<ConfigProvider locale={i18n.language === 'en' ? enUS : cnUS}>
            {renderMainDom[renderMainName]}
        </ConfigProvider >)
    }
    return (
        <>
            <GlobalModal />
            {renderRoot()}
        </>
    )
};

export default App;