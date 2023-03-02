import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { RoutePages } from './routes';
import Header from './Layout/Header';
import LeftToolbar from './Layout/LeftToolbar';

import useGlobal from './hooks/useGlobal';
import useAsyncTask from './hooks/useAsyncTask';
import '@utils/apconfigstore';
import useApt from './hooks/useApt';
import { useNavigate } from 'react-router-dom'
import qs from 'qs';
import { useTranslation } from 'react-i18next';

import { ConfigProvider } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';
import cnUS from '@arco-design/web-react/es/locale/zh-CN';

const App = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const { search, pathname } = location;
    const { invite_verify_code } = qs.parse(search.slice(1));
    const { i18n } = useTranslation();

    const ignorePage = ['/login', '/register', '/find', '/reset', '/linkoverstep', '/wx'];
    const commonPage = ['/linkoverstep', '/invitatePage', '/invitateExpire', '/404', '/email/report', '/email/autoReport'];
    // 邀请链接进入, 忽略一些不要重定向的路由
    const redirectIgnore = ['/find', '/invitatePage'];


    useEffect(() => {

        if (commonPage.includes(location.pathname)) {
            return;
        }

        if (invite_verify_code) {
            localStorage.removeItem('runnergo-token');
            localStorage.removeItem('expire_time_sec');
            localStorage.removeItem('team_id');
            localStorage.removeItem('settings');
            localStorage.removeItem('open_apis');
            localStorage.removeItem('open_scene');
            localStorage.removeItem('open_plan');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('package_info');

            if (!redirectIgnore.includes(pathname)) {
                navigate(`/login?invite_verify_code=${invite_verify_code}`);

            }

        }

        const expire_time_sec = localStorage.getItem('expire_time_sec');
        const isExpire = new Date().getTime() > parseInt(expire_time_sec || 0);
        if (!ignorePage.includes(location.pathname)) {
            if (isExpire) {
                navigate('/login');
            }
        } else if (!isExpire) {
            navigate('/index');
        }

    }, [location.pathname]);


    useGlobal(null);
    useAsyncTask(); // 使用异步任务
    useApt();

    const _ignorePage = ['/login', '/register', '/find', '/userhome', '/reset', '/emailReport', '/email', '/invitateExpire', '/invitatePage', '/404', '/', '/renew', '/pay', '/linkoverstep', '/wx'];
    return (
        <>
            <ConfigProvider locale={i18n.language === 'en' ? enUS : cnUS}>
                {
                    !_ignorePage.includes(`/${location.pathname.split('/')[1]}`)
                        ? <> <Header />
                            <div className='section-page'>
                                <LeftToolbar />
                                <div className='main-page'>
                                    <Routes>
                                        {RoutePages.map((d) => (
                                            <Route key={d.name} path={d.path} element={<d.element />}></Route>
                                        ))}
                                        <Route path='/' element={<Navigate to="login" />} />
                                    </Routes>
                                </div>
                            </div></>
                        : <>
                            <div className='section-page'>
                                <Routes>
                                    {RoutePages.map((d) => (
                                        <Route key={d.name} path={d.path} element={<d.element />}></Route>
                                    ))}
                                    <Route path='/' element={<Navigate to="login" />} />
                                </Routes>
                            </div></>
                }
            </ConfigProvider>
        </>
    )
};

export default App;