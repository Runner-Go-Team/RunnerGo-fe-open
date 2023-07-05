import React, { useState, useEffect, useRef } from 'react';
import './index.less';
import { Button, Message } from 'adesign-react';
import {
    LogoutRight as SvgLogout,
    InviteMembers as SvgInvite,
    Userhome as SvgUserhome,
    Docs as SvgDocs,
    Customer as SvgCustomer,
    Setting1 as SvgSetting,
    Right as SvgRight,
    Down as SvgDown
} from 'adesign-react/icons';
import avatar from '@assets/logo/avatar.png'
import ProjectMember from '@modals/ProjectMember';
import TeamworkLogs from '@modals/TeamworkLogs';
import InfoManage from '@modals/InfoManage';
import SingleUser from './SingleUser';
import { fetchTeamMemberList } from '@services/user';
import { tap } from 'rxjs';
import { useSelector, useDispatch } from 'react-redux';
import { global$ } from '@hooks/useGlobal/global';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InvitateSuccess from '@modals/InvitateSuccess';
import RunningShow from './runningShow';
import GlobalConfig from './globalConfig';
import { Dropdown, Tooltip } from '@arco-design/web-react';
import { IconSunFill, IconMoonFill } from '@arco-design/web-react/icon';
import Bus from '@utils/eventBus';
import { RD_ADMIN_URL } from '@config';
import { setCookie } from '@utils';
import AddInternalMember from '@modals/AddInternalMember';
import UserCard from '@components/UserCard';
import cn from 'classnames';

const HeaderRight = () => {
    const [showModal, setShowModal] = useState(false);
    const [showMember, setMemberModal] = useState(false);
    const [showLog, setShowLog] = useState(false);
    // 个人资料
    const [showInfo, setShowInfo] = useState(false);
    // 切换语言
    const [showLge, setShowLge] = useState(false);
    // 切换主题
    const [showTheme, setShowTheme] = useState(false);
    const [memberList, setMemberList] = useState([]);

    const [outsideClose, setOutsideClose] = useState(true);


    const teamMember = useSelector((store) => store.teams.teamMember);
    const navigate = useNavigate();
    const refMenu = useRef();
    const dispatch = useDispatch();
    const theme = useSelector((store) => store.user.theme);
    const userInfo = useSelector((store) => store.user.userInfo);

    let { i18n, t } = useTranslation();
    useEffect(() => {
        const query = {
            team_id: localStorage.getItem('team_id'),
        }
        fetchTeamMemberList(query)
            .pipe(
                tap((res) => {
                    const { code, data: { members } } = res;

                    if (code === 0) {
                        dispatch({
                            type: 'teams/updateTeamMember',
                            payload: members
                        })
                    }
                })
            )
            .subscribe();
    }, []);

    const RenderMemberList = () => {
        return (
            <Dropdown
                position="bl"
                trigger="click"
                droplist={<UserCard setShowInfo={setShowInfo}/>}
            >
                <div>
                    <div className='person-avatar'>
                        <img className='avatar' src={userInfo.avatar || avatar} alt="" />
                    </div>
                </div>
            </Dropdown>
        )
    };

    const loginOut = () => {
        Bus.$emit('closeWs');
        localStorage.removeItem('runnergo-token');
        localStorage.removeItem('expire_time_sec');
        localStorage.removeItem('team_id');
        localStorage.removeItem('settings');
        localStorage.removeItem('open_apis');
        localStorage.removeItem('open_scene');
        localStorage.removeItem('open_plan');
        localStorage.removeItem("package_info");
        // localStorage.clear();
        setCookie('token', '');
        window.location.href = `${RD_ADMIN_URL}/#/login`;
        Message('success', t('message.quitSuccess'));
    };

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
    }

    return (
        <div className='header-right'>
            <RunningShow />
            <GlobalConfig />
            <div className='team-person'>
                <RenderMemberList />
                <div className='person-number' onClick={() => setMemberModal(true)}>
                    <p>{teamMember.length}</p>
                </div>
            </div>
            <Button className='invite' preFix={<SvgInvite />} onClick={() => setShowModal(true)}>{t('header.invitation')}</Button>
            <div className='more-btn'>
                <Button className='handle-log' onClick={() => setShowLog(true)}>{t('header.handleLog')}</Button>
                {/* <Button className='handle-log' preFix={<SvgLogout />} onClick={() => loginOut()}>{t('header.signOut')}</Button> */}
            </div>
            <div className="theme">
                <span onClick={() => changeTheme('white')} className={cn({
                    active: theme == 'white'
                })}>
                    <IconSunFill style={{ 'color': 'var(--icon-sun-color)' }} />
                </span>
                <span onClick={() => changeTheme('dark')} className={cn({
                    active: theme == 'dark'
                })} >
                    <IconMoonFill style={{ 'color': 'var(--icon-moon-color)' }} />
                </span>
            </div>

            {showModal && <AddInternalMember onCancel={() => {
                setShowModal(false);
            }} />}
            {showMember && <ProjectMember onCancel={() => {
                setMemberModal(false);
            }} />}
            {showLog && <TeamworkLogs onCancel={() => {
                setShowLog(false);
            }} />}
            {
                showInfo && <InfoManage onCancel={() => {
                    setShowInfo(false);
                }} />
            }
        </div>
    )
};

export default HeaderRight;