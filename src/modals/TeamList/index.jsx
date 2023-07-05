import React, { useState, useEffect } from 'react';
import { Modal, Button, Message, Select, Input, Dropdown } from 'adesign-react';
import cn from 'classnames';
import { ProjectMemberModal, HeaderLeftModal } from './style';
import avatar from '@assets/logo/avatar.png';
import { InviteMembers as SvgInvite, Team as SvgTeam, Edit as SvgEdit } from 'adesign-react/icons';
import { fetchTeamMemberList, fetchRemoveMember, fetchTeamList, fetchQuitTeam, fetchDissTeam, fetchUpdateConfig, fetchCreateTeam } from '@services/user';
import { tap } from 'rxjs';
import dayjs from 'dayjs';
import InvitationModal from '../Notice';
import Bus from '@utils/eventBus';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashBoardInfo } from '@services/dashboard';
import CreateTeam from '../CreateTeam';
import { useTranslation } from 'react-i18next';

import { global$ } from '@hooks/useGlobal/global';
import { useNavigate } from 'react-router-dom';
import { Table } from '@arco-design/web-react';
import './index.less';

const { Option } = Select;

const TeamList = (props) => {
    const { onCancel } = props;
    const [data, setData] = useState([]);
    const [showInvite, setShowInvite] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showQuit, setShowQuit] = useState(false);
    const [confirmTeam, setConfirmTeam] = useState({});
    const [userId, setUserId] = useState(null);
    const [roleId, setRoleId] = useState(null);
    const [showEditName, setEditName] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [nameError, setNameError] = useState(false);
    const [editTeamId, setEditTeamId] = useState(0);
    const navigate = useNavigate();

    const userInfo = useSelector((store) => store.user.userInfo);
    const teamList = useSelector((store) => store.teams.teamData);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const getUserInfo = () => {
        return fetchDashBoardInfo({
            team_id: localStorage.getItem('team_id')
        }).pipe((res) => {
            return res;
        });
    }

    const confirmQuit = (confirmTeam, userId) => {

        Modal.confirm({
            title: t('modal.quitTeam'),
            content: `${t('modal.confirmQuit')}${confirmTeam.name}?`,
            cancelText: t('btn.cancel'),
            okText: t('modal.quitTeam'),
            onOk: () => {
                outTeam(confirmTeam, userId);
            }
        })
        // setShowQuit(true);
    }

    const deleteTeam = (data, confirmTeam, userId) => {
        const myTeam = Object.values(teamList).find(item => item.type === 1 && item.created_user_id === userId);
        const team_id = localStorage.getItem('team_id');
        Modal.confirm({
            title: t('modal.dissmissTeam'),
            content:
                <div>
                    <p>{t('modal.dissmissContent1')}</p>
                    <p>{t('modal.dissmissContent2')}</p>
                    <p>
                        {t('modal.dissmissContent3-1')}
                        <Dropdown
                            trigger="hover"
                            placement='top-end'
                            className="dissmiss-modal-code"
                            content={
                                <div>
                                    <img src="https://apipost.oss-cn-beijing.aliyuncs.com/kunpeng/images/wx-customer-service.jpg" />
                                </div>
                            }
                        >
                            <span style={{ color: 'var(--theme-color)', cursor: 'pointer' }}>wxid_ejhnjqq2kq0022, </span>
                        </Dropdown>
                        {t('modal.dissmissContent3-2')}
                    </p>
                    <p style={{ marginTop: '20px' }}>{t('modal.dissmissContent4')}</p>
                </div>,
            cancelText: t('btn.cancel'),
            okText: t('btn.confirmDissmiss'),
            onOk: () => {
                const { team_id: delete_id } = confirmTeam;
                const params = {
                    team_id: delete_id,
                };
                fetchDissTeam(params).subscribe({
                    next: (res) => {

                        const { code, data } = res;
                        if (code === 0) {

                            // 将解散团队的消息通知给websocket服务端
                            const _params = {
                                team_id: delete_id,
                            }

                            Bus.$emit('sendWsMessage', JSON.stringify({
                                route_url: "disband_team_notice",
                                param: JSON.stringify(_params)
                            }))


                            if (delete_id === team_id) {
                                const settings = JSON.parse(localStorage.getItem('settings'));
                                settings.settings.current_team_id = data.team_id;
                                localStorage.setItem('team_id', data.team_id);
                                global$.next({
                                    action: 'INIT_APPLICATION',
                                });
                                dispatch({
                                    type: 'opens/coverOpenApis',
                                    payload: {},
                                })
                                dispatch({
                                    type: 'scene/updateOpenScene',
                                    payload: null,
                                })
                                onCancel();
                                navigate('/index');
                            } else {
                                getUserInfo().pipe(tap(fetchData)).subscribe();
                            }
                        }
                    }
                })
                // deleteReport(report_id);
            }
        })
    }
    const outTeam = (confirmTeam, userId) => {
        // return;
        const { team_id: quit_id } = confirmTeam;
        // 判断当前团队是否是该用户的私有团队
        const team_id = localStorage.getItem('team_id');
        // const team_item = data.find(item => item.team_id === confirmTeam.team_id);

        // // 当前团队是私有团队, 并且团队的创建者是自己
        // if (team_item.type === 1 && team_item.created_user_id === userId) {
        //     Message('error', '您无法退出自己的私有团队!');
        //     return;
        // }

        const _teamList = Object.values(teamList);

        const params = {
            team_id: quit_id,
        };
        fetchQuitTeam(params).subscribe({
            next: (res) => {
                const { code, data } = res;
                if (code === 0) {
                    Message('success', t('message.quitSuccess'));
                    const myTeam = _teamList.find(item => item.type === 1 && item.created_user_id === userId);
                    if (quit_id === team_id) {
                        const settings = JSON.parse(localStorage.getItem('settings'));
                        settings.settings.current_team_id = data.team_id;
                        localStorage.setItem('team_id', data.team_id);
                        global$.next({
                            action: 'INIT_APPLICATION',
                        });
                        dispatch({
                            type: 'opens/coverOpenApis',
                            payload: {},
                        })
                        dispatch({
                            type: 'scene/updateOpenScene',
                            payload: null,
                        })
                        onCancel();
                        navigate('/index');
                    } else {
                        getUserInfo().pipe(tap(fetchData)).subscribe();
                    }

                }
            }
        })
    };

    const fetchData = (res) => {
        const { data: { user: { user_id, role_id } } } = res;
        setUserId(user_id);
        setRoleId(role_id);

        fetchTeamList()
            .pipe(
                tap((res) => {
                    const { code, data: { teams } } = res;
                    if (code === 0) {
                        let dataList = [];
                        dataList = teams.map((item, index) => {
                            const { name, created_time_sec, team_id } = item;
                            return {
                                ...item,
                                name:
                                    <div className='team-name'>
                                        <span>{name}</span>
                                        <SvgEdit onClick={() => {
                                            setEditName(true);
                                            setTeamName(name);
                                            setEditTeamId(team_id);
                                        }} />
                                    </div>,
                                created_time_sec: dayjs(created_time_sec * 1000).format('YYYY-MM-DD HH:mm:ss'),
                                handle: item.type === 1 && item.created_user_id === user_id ? ''
                                    : <p style={{ cursor: 'pointer', color: '#f00' }} onClick={() => {
                                        if (item.created_user_id === user_id) {
                                            deleteTeam(teams, item, user_id);
                                        } else {
                                            setConfirmTeam(item);
                                            confirmQuit(item, user_id);
                                        }
                                    }}>
                                        {item.created_user_id === user_id ? t('column.teamManage.dissmissTeam') : t('column.teamManage.quitTeam')}
                                    </p>,
                            }
                        });
                        setData(dataList);
                        let teamData = {};
                        teams.length && teams.forEach((data) => {
                            teamData[data.team_id] = data;
                        });
                        dispatch({
                            type: 'teams/updateTeamData',
                            payload: teamData,
                        });
                    }
                })
            )
            .subscribe();
    }
    useEffect(() => {
        getUserInfo().pipe(tap(fetchData)).subscribe();
        // fetchData();
    }, [])
    const columns = [
        {
            title: t('column.teamManage.teamName'),
            dataIndex: 'name',
            width: 220,
        },
        {
            title: t('column.teamManage.createTime'),
            dataIndex: 'created_time_sec',
            width: 220,
        },
        {
            title: t('column.teamManage.creator'),
            dataIndex: 'created_user_name',
        },
        {
            title: t('column.teamManage.handle'),
            dataIndex: 'handle'
        }
    ];

    const HeaderLeft = () => {
        return (
            <div className={HeaderLeftModal}>
                <div className='member-header-left'>
                    <p className='title'>{t('modal.teamManage')}</p>
                    <Button className='create-team' preFix={<SvgTeam />} onClick={() => setShowCreate(true)}>{t('modal.createTeam')}</Button>
                </div>
            </div>
        )
    }


    return (
        <div>
            {showInvite && <InvitationModal onCancel={() => setShowInvite(false)} />}
            {showCreate && <CreateTeam onCancel={(e) => {
                setShowCreate(false);
                onCancel();
                if (e) {
                    getUserInfo().pipe(tap(fetchData)).subscribe();
                }
            }} />}

            {
                showEditName && <Modal
                    className='edit-team-name-modal'
                    visible
                    title={null}
                    okText={t('btn.ok')}
                    cancelText={t('btn.cancel')}
                    onCancel={() => setEditName(false)}
                    onOk={() => {
                        if (teamName.trim().length === 0 || teamName.trim().length > 25) {
                            setNameError(true);
                            return;
                        } else {
                            setNameError(false);
                        }
                        if (nameError) {
                            return;
                        }
                        const params = {
                            team_id: editTeamId,
                            name: teamName,
                        };
                        fetchCreateTeam(params).subscribe({
                            next: (res) => {
                                const { code } = res;
                                if (code === 0) {
                                    Message('success', t('message.updateSuccess'));
                                    setEditName(false);
                                    getUserInfo().pipe(tap(fetchData)).subscribe();
                                } else {
                                    Message('error', t('message.updateError'))
                                }
                            }
                        })
                    }}
                >
                    <p className='edit-name-title'>{t('modal.editTeamName')}</p>
                    <Input
                        className={nameError ? 'input-error' : ''}
                        placeholder={t('placeholder.teamName')}
                        value={teamName}
                        onChange={(e) => {
                            setTeamName(e);
                            if (e.trim().length === 0 || e.trim().length > 25) {
                                setNameError(true);
                            } else {
                                setNameError(false);
                            }
                        }}
                        onBlur={(e) => {
                            if (teamName.trim().length === 0 || teamName.trim().length > 25) {
                                setNameError(true);
                            } else {
                                setNameError(false);
                            }
                        }}
                    />
                    {nameError && <p className='input-error-text' style={{ color: 'var(--run-red)', marginRight: 'auto', marginLeft: '4px' }}>{t('sign.teamNameError')}</p>}
                </Modal>
            }

            <Modal
                className={ProjectMemberModal}
                visible={true}
                title={<HeaderLeft />}
                onCancel={onCancel}
                onOk={onCancel}
                cancelText={t('btn.cancel')}
                okText={t('btn.ok')}
            >
                <Table
                    pagination={false}
                    columns={columns}
                    data={data}
                // renderRow={renderRow} 
                />
            </Modal>
        </div>
    )
};

export default TeamList;
