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
import InvitationModal from '@modals/ProjectInvitation';
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

    const [showInvitate, setShowInvitate] = useState(false);

    const [addLength, setAddLength] = useState(0);
    const [unRegister, setUnRegister] = useState(0);
    const [unEmail, setUnEmail] = useState(0);

    const teamMember = useSelector((store) => store.teams.teamMember);
    const navigate = useNavigate();
    const refDropdown = useRef();
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
                ref={refDropdown}
                position="br"
                trigger="click"
                droplist={
                    <div className='user-home'>
                        <p className='name'>{userInfo.nickname}</p>
                        <p className='email'>{userInfo.email}</p>
                        <Button className='person-page' preFix={<SvgUserhome />} onClick={() => {
                            // refDropdown.current.setPopupVisible(false);
                            setShowInfo(true);
                        }}>{t('header.myInfo')}</Button>
                        <div className='line'></div>
                        <div className='person-drop'>
                            <div className='person-drop-item' onClick={() => {
                                window.open('https://rhl469webu.feishu.cn/docx/Rr0cdBuVUoskdkxE5t6cUo9vnOe', '_blank');
                                refDropdown.current.setPopupVisible(false);
                            }}>
                                <SvgDocs />
                                <span>{t('header.doc')}</span>
                            </div>
                            <div onClick={() => {
                                refDropdown.current.setPopupVisible(false);
                            }}>
                                <Tooltip content={<img style={{ width: '200px', height: '200px' }} src="https://apipost.oss-cn-beijing.aliyuncs.com/kunpeng/qrcode/qiyezhuanshukefu.png" />}>
                                    <div className='person-drop-item'>
                                        <SvgCustomer />
                                        <span>{t('header.customer')}</span>
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                }
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
        localStorage.removeItem('kunpeng-token');
        localStorage.removeItem('expire_time_sec');
        localStorage.removeItem('team_id');
        localStorage.removeItem('settings');
        localStorage.removeItem('open_apis');
        localStorage.removeItem('open_scene');
        localStorage.removeItem('open_plan');
        localStorage.removeItem("package_info");
        // localStorage.clear();
        navigate('/login');
        Message('success', t('message.quitSuccess'));
    };

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
                <Button className='handle-log' preFix={<SvgLogout />} onClick={() => loginOut()}>{t('header.signOut')}</Button>
            </div>
            {showModal && <InvitationModal onCancel={({ addLength, unRegister, unEmail }) => {
                setShowModal(false);
                setAddLength(0);
                setUnRegister(0);
                setUnEmail(0);
                addLength && setAddLength(addLength);
                unRegister && setUnRegister(unRegister);
                unEmail && setUnEmail(unEmail);
                if (addLength || unRegister || unEmail) {
                    setShowInvitate(true);
                }
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
            {
                showInvitate && <InvitateSuccess addLength={addLength} unRegister={unRegister} unEmail={unEmail} onCancel={() => setShowInvitate(false)} />
            }
        </div>
    )
};

export default HeaderRight;