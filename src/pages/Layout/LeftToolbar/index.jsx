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
    Left as SvgLeft,
    Environment as SvgEnv,
    Mock as SvgMock
} from 'adesign-react/icons';
import SvgHome from '@assets/icons/Home';
import SvgScene from '@assets/icons/Scene1';
import SvgPlan from '@assets/icons/Plan1';
import SvgReport from '@assets/icons/Report1';
import SvgMachine from '@assets/icons/Machine';
import SvgTest from '@assets/icons/left-test';
import SvgPer from '@assets/icons/left-performance';

import { useTranslation } from 'react-i18next';
import useLeftToolbar from './useLeftToolbar';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Dropdown } from '@arco-design/web-react';
import { IconMenuFold, IconMenuUnfold } from '@arco-design/web-react/icon';
import { setCookie } from '@utils';
import { isArray } from "lodash";

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;


const LeftToolbar = (props) => {
    const { type }=props;
    // let [currentPath, setCurrentPath] = useState(`/${location.hash.split('/')[1]}`);
    const { t, i18n } = useTranslation();
    const { leftBarItems, uiTestAutoBarItems } = useLeftToolbar();
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
        if(type == 'uiTestAuto'){
            if(pathname.startsWith('/uiTestAuto/plan')){
                setSelectKey(['/uiTestAuto/plan'])
            }else if(pathname.startsWith('/uiTestAuto/scene')){
                setSelectKey(['/uiTestAuto/scene'])
            }else if(pathname.startsWith('/uiTestAuto/report')){
                setSelectKey(['/uiTestAuto/report'])
            }else{
                setSelectKey([pathname])
            }
        }else{
        setSelectKey([`/${pathname.split('/')[1]}`])
        }
    }, [location]);

    const changeTheme = (color) => {
        const url = `/skins/${color}.css`;
        document.querySelector(`link[name="apt-template-link"]`).setAttribute('href', url);
        localStorage.setItem('theme_color', color);
        setCookie('theme', color);
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
                    setCookie('i18nextLng', 'cn');
                    setVisible(false);
                }}>简体中文</MenuItem>
                <MenuItem key="1-2" onClick={() => {
                    i18n.changeLanguage('en');
                    dispatch({
                        type: 'user/updateLanGuaGe',
                        payload: 'en'
                    })
                    setCookie('i18nextLng', 'en');
                    setVisible(false);
                }}>English</MenuItem>
            </SubMenu>
            <SubMenu key={2} title={t('leftBar.theme')}>
                <MenuItem key="2-1" onClick={() => changeTheme('dark')}>{t('leftBar.darkMode')}</MenuItem>
                <MenuItem key="2-2" onClick={() => changeTheme('white')}>{t('leftBar.whiteMode')}</MenuItem>
            </SubMenu>
        </Menu>
    );
    const renderMenuItemDom = (leftBarArr)=>{
        if(isArray(leftBarArr)){
            return leftBarArr.map(item => {
                if (item?.type == 'MenuItem') {
                    return <Link to={item.link}>
                        <MenuItem key={item.link}>{item.icon}{item.title}</MenuItem>
                    </Link>
                } else if (item?.type == 'SubMenu') {
                    return <SubMenu
                        key={item.key}
                        selectable
                        title={item.title}
                        onCollapseChange={()=>{}}
                    >
                        {isArray(item?.menuItems) && item.menuItems.map(i => <Link to={i.link}>
                            <MenuItem className="sub-item" key={i.link}>{i.icon}{i.title}</MenuItem>
                        </Link>)}
                    </SubMenu>
                } else if (item?.type == 'MenuItem.click') {
                    return <MenuItem onClick={() => {
                        item?.onClick && item.onClick();
                    }} key={item.link}>{item.icon}{item.title}</MenuItem>
                }
            })
        }
    }
    console.log(selectKey,"selectKey");
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
                        try {
                            if(k.split('-')[0] == 'SubMenu'){
                                return;
                            }
                            setSelectKey([k]);
                        } catch (error) {}
                    }}
                    onClickSubMenu={(k, ok, kp) => {
                        setOpenKeys(ok);
                        sessionStorage.setItem('leftBarOpen', JSON.stringify(ok));

                    }}
                    onCollapseChange={(e) => {
                    }}
                >
                    {renderMenuItemDom(type == 'uiTestAuto' ? uiTestAutoBarItems : leftBarItems)}
                </Menu>
                {/* 
                <div className="settings">
                    {
                        collapseStatus ? <Dropdown trigger="click" droplist={dropList} position="bl">
                            <Button preFix={<SvgSetting />}>{t('header.menu')} <SvgDown className='down-svg' /></Button>
                        </Dropdown> : <Dropdown trigger="click" droplist={dropList} position="bl">
                            <SvgSetting className='hide-setting-svg' />
                        </Dropdown>
                    }

                </div> */}

                {
                    collapseStatus ? <IconMenuFold onClick={() => setCollapseStatus(!collapseStatus)} className="open-icon" /> : <IconMenuUnfold onClick={() => setCollapseStatus(!collapseStatus)} className="open-icon" />
                }
            </div>
        </>
    )
};

export default LeftToolbar;