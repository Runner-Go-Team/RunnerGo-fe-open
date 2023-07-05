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
import { useDispatch, useSelector } from 'react-redux';
import { RD_ADMIN_URL } from '@config';
import { getCookie } from '@utils';

import { ConfigProvider } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';
import cnUS from '@arco-design/web-react/es/locale/zh-CN';
import GlobalModal from '@modals/GlobalModal';
import { fetchUpdateConfig, fetchUserConfig } from '@services/user';
import { global$ } from '@hooks/useGlobal/global';

const App = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const { search, pathname } = location;
    const { team_id } = qs.parse(search.slice(1));
    const { i18n } = useTranslation();
    const dispatch = useDispatch();
    const isPreLoader = useSelector((store)=>store?.global?.isPreLoader);
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
        if (!token) {
            window.location.href = RD_ADMIN_URL;
        }

    }, [location.pathname]);

    (!['/email/report', '/email/autoReport'].includes(location.pathname)) && useGlobal(null);

    // if () {
    //     ;
    //     useAsyncTask(); // 使用异步任务
    //     useApt();
    // }
    const _ignorePage = ['/login', '/register', '/find', '/userhome', '/reset', '/emailReport', '/email', '/invitateExpire', '/invitatePage', '/404', '/', '/renew', '/pay', '/linkoverstep', '/wx'];
    return (
        <>
            <GlobalModal />
            {(!Boolean(isPreLoader) || ['/email/report', '/email/autoReport'].includes(location.pathname)) && (<ConfigProvider locale={i18n.language === 'en' ? enUS : cnUS}>
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
                                        <Route path='/' element={<Navigate to="index" />} />
                                    </Routes>
                                </div>
                            </div></>
                        : <>
                            <div className='section-page'>
                                <Routes>
                                    {RoutePages.map((d) => (
                                        <Route key={d.name} path={d.path} element={<d.element />}></Route>
                                    ))}
                                    <Route path='/' element={<Navigate to="index" />} />
                                </Routes>
                            </div></>
                }
            </ConfigProvider>)}
        </>
    )
};

export default App;