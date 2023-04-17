import React, { useState, useRef, useEffect } from "react";
import cn from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import './index.less';
import { Button } from 'adesign-react';
import {
    Lately as SvgLately,
    Apis as SvgApis,
    Answer as SvgDesign,
    ShareDoc as SvgShare,
    // Processtest as SvgTest,
    Project as SvgProject,
    Doc as SvgDoc,
    Delete as RecycleIcon,
    Setting1 as SvgSetting,
    Right as SvgRight,
    LogoutRight as SvgLogout,
    Down as SvgDown,
    Left as SvgLeft
} from 'adesign-react/icons';
import SvgHome from '@assets/icons/Home';
import SvgScene from '@assets/icons/Scene1';
import SvgPlan from '@assets/icons/Plan1';
import SvgReport from '@assets/icons/Report1';
import SvgMachine from '@assets/icons/Machine';
import SvgTest from '@assets/icons/left-test';
import SvgPer from '@assets/icons/left-performance';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Dropdown } from '@arco-design/web-react';
import { IconMenuFold, IconMenuUnfold } from '@arco-design/web-react/icon';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;


const LeftToolbar = () => {
    // let [currentPath, setCurrentPath] = useState(`/${location.hash.split('/')[1]}`);
    const { t, i18n } = useTranslation();
    const refMenu = useRef();
    // 切换语言
    const [showLge, setShowLge] = useState(false);
    // 切换主题
    const [showTheme, setShowTheme] = useState(false);
    const dispatch = useDispatch();
    const theme = useSelector((store) => store.user.theme);
    const [visible, setVisible] = useState(false);
    const [selectKey, setSelectKey] = useState([]);
    const [openKeys, setOpenKeys] = useState([]);
    const location = useLocation();

    useEffect(() => {
        let leftBarOpen = sessionStorage.getItem('leftBarOpen');
        if (leftBarOpen) {
            setOpenKeys(JSON.parse(leftBarOpen));
        }
    }, []);

    useEffect(() => {
        const { pathname } = location;
        setSelectKey([`/${pathname.split('/')[1]}`])
    }, [location]);

    const changeTheme = (color) => {
        const url = `/skins/${color}.css`;
        document.querySelector(`link[name="apt-template-link"]`).setAttribute('href', url);
        localStorage.setItem('theme_color', color);
        dispatch({
            type: 'user/updateTheme',
            payload: color
        });
        if (color === 'dark') {
            document.body.setAttribute('arco-theme', 'dark');
        } else {
            document.body.removeAttribute('arco-theme');
        }
        setVisible(false);
    }

    const [collapseStatus, setCollapseStatus] = useState(true);

    const dropList = (
        <Menu className='settings-drop-list'>
            <SubMenu key={1} title={t('leftBar.language')}>
                <MenuItem key="1-1" onClick={() => {
                    i18n.changeLanguage('cn');
                    dispatch({
                        type: 'user/updateLanGuaGe',
                        payload: 'cn'
                    })
                    setVisible(false);
                }}>简体中文</MenuItem>
                <MenuItem key="1-2" onClick={() => {
                    i18n.changeLanguage('en');
                    dispatch({
                        type: 'user/updateLanGuaGe',
                        payload: 'en'
                    })
                    setVisible(false);
                }}>English</MenuItem>
            </SubMenu>
            <SubMenu key={2} title={t('leftBar.theme')}>
                <MenuItem key="2-1" onClick={() => changeTheme('dark')}>{t('leftBar.darkMode')}</MenuItem>
                <MenuItem key="2-2" onClick={() => changeTheme('white')}>{t('leftBar.whiteMode')}</MenuItem>
            </SubMenu>
        </Menu>
    );

    return (
        <>
            <div className="left-toolbars">
                <Menu
                    style={{ width: '120px' }}
                    selectedKeys={selectKey}
                    openKeys={openKeys}
                    defaultOpenKeys={openKeys}
                    collapse={!collapseStatus}
                    onClickMenuItem={(k, e, kp) => {
                        setSelectKey([k]);

                    }}
                    onClickSubMenu={(k, ok, kp) => {
                        setOpenKeys(ok);
                        sessionStorage.setItem('leftBarOpen', JSON.stringify(ok));

                    }}
                    onCollapseChange={(e) => {
                    }}
                >
                    <Link to="/index">
                        <MenuItem key='/index'><SvgHome className="arco-icon arco-icon-robot" />{t('leftBar.index')}</MenuItem>
                    </Link>
                    <Link to="/apis">
                        <MenuItem key='/apis'><SvgApis className="arco-icon arco-icon-robot" />{t('leftBar.apis')}</MenuItem>
                    </Link>
                    <Link to="/scene">
                        <MenuItem key='/scene'><SvgScene className="arco-icon arco-icon-robot" />{t('leftBar.scene')}</MenuItem>
                    </Link>
                    <SubMenu
                        key='1'
                        selectable
                        title={
                            <div className="sub-menu-title">
                                <SvgPer className="arco-icon arco-icon-robot" />{t('leftBar.performance')}
                            </div>
                        }
                    >

                        <Link to="/plan">
                            <MenuItem className="sub-item" key='/plan'>{t('leftBar.plan')}</MenuItem>
                        </Link>
                        <Link to="/report">
                            <MenuItem className="sub-item" key='/report'>{t('leftBar.report')}</MenuItem>
                        </Link>
                        <Link to="/preset">
                            <MenuItem className="sub-item" key='/preset'>{t('leftBar.preset')}</MenuItem>
                        </Link>
                    </SubMenu>
                    <SubMenu
                        key='2'
                        selectable
                        title={
                            <div className="sub-menu-title">
                                <SvgTest className="arco-icon arco-icon-robot" />{t('leftBar.test')}
                            </div>
                        }
                    >
                        <Link to="/Tplan">
                            <MenuItem className="sub-item" key='/Tplan'>{t('leftBar.plan')}</MenuItem>
                        </Link>
                        <Link to="/Treport">
                            <MenuItem className="sub-item" key='/Treport'>{t('leftBar.report')}</MenuItem>
                        </Link>
                    </SubMenu>

                    <Link to="/machine">
                        <MenuItem key='/machine'><SvgMachine className="arco-icon arco-icon-robot" />{t('leftBar.machine')}</MenuItem>
                    </Link>
                    <MenuItem onClick={() => {
                        window.open('https://rhl469webu.feishu.cn/docx/Rr0cdBuVUoskdkxE5t6cUo9vnOe', '_blank');
                    }} key='/doc'><SvgDoc className="arco-icon arco-icon-robot" />{t('leftBar.docs')}</MenuItem>

                </Menu>

                <div className="settings">
                    {
                        collapseStatus ? <Dropdown trigger="click" droplist={dropList} position="bl">
                            <Button preFix={<SvgSetting />}>{t('header.menu')} <SvgDown className='down-svg' /></Button>
                        </Dropdown> : <Dropdown trigger="click" droplist={dropList} position="bl">
                            <SvgSetting className='hide-setting-svg' />
                        </Dropdown>
                    }

                </div>

                {
                    collapseStatus ? <IconMenuFold onClick={() => setCollapseStatus(!collapseStatus)} className="open-icon" /> : <IconMenuUnfold onClick={() => setCollapseStatus(!collapseStatus)} className="open-icon" />
                }
            </div>
        </>
    )
};

export default LeftToolbar;