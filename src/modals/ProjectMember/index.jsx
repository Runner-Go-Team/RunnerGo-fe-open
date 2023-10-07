import React, { useState, useEffect } from 'react';
import { Modal, Button, Message } from 'adesign-react';
import cn from 'classnames';
import { ProjectMemberModal, HeaderLeftModal } from './style';
import avatar from '@assets/logo/avatar.png';
import { InviteMembers as SvgInvite } from 'adesign-react/icons';
import { fetchTeamMemberList, fetchRemoveMember, fetchQuitTeam, fetchUpdateConfig, fetchUpdateRole } from '@services/user';
import { tap } from 'rxjs';
import dayjs from 'dayjs';
import Bus from '@utils/eventBus';
import { useSelector, useDispatch } from 'react-redux';
import { IconSearch } from '@arco-design/web-react/icon';
import { fetchDashBoardInfo } from '@services/dashboard';

import { global$ } from '@hooks/useGlobal/global';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AddInternalMember from '../AddInternalMember';
import { Input } from '@arco-design/web-react';
import { Pagination, Select, Table } from '@arco-design/web-react';
import { debounce, isNumber } from 'lodash';

const { Option } = Select;

const ProjectMember = (props) => {
    const { onCancel } = props;
    const [data, setData] = useState([]);
    const [showInvite, setShowInvite] = useState(false);
    const user_id = useSelector((store) => store?.user?.userInfo?.user_id);
    const [searchValue, setSearchValue] = useState(null);
    const [pageSize, setPageSize] = useState(20);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(10);
    const userInfo = useSelector((store) => store.user.userInfo);
    const teamList = useSelector((store) => store.teams.teamData);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const removeMember = (member_id, role_id, nickname) => {
        // // 当前用户是普通成员, 没有移除任何人的权限
        // if (roleId === 2) {
        //     Message('error', '您没有权限移除成员!');
        //     return;
        // }
        // // 当前用户是管理员, 想移除管理员或者超级管理员
        // if (roleId === 3 && (role_id === 1 || role_id === 3)) {
        //     Message('error', '您没有权限移除该成员!');
        // }
        Modal.confirm({
            title: t('modal.delMem'),
            content: `${t('modal.confirmDelMem')}${nickname}?`,
            cancelText: t('btn.cancel'),
            okText: t('btn.okDelMum'),
            onOk: () => {
                const params = {
                    team_id: sessionStorage.getItem('team_id'),
                    member_id,
                }
                fetchRemoveMember(params)
                    .pipe(
                        tap((res) => {
                            const { data, code } = res;

                            if (code === 0) {
                                Message('success', t('message.removeMemSuccess'));
                                getUserInfo().pipe(tap(fetchData)).subscribe();
                                Bus.$emit('getTeamMemberList');
                            } else {
                                Message('error', t('message.removeMemError'));
                            }
                        })
                    )
                    .subscribe()
            }
        })
    };

    const getUserInfo = () => {
        return fetchDashBoardInfo({
            team_id: sessionStorage.getItem('team_id')
        }).pipe((res) => {
            return res;
        });
    }

    // 移除成员:
    // 1. 超级管理员可以移除管理员和普通成员
    // 2. 管理员可以移除普通成员, 不能移除管理员和超级管理员
    // 3. 普通成员没有任何移除的权限


    // 退出团队:
    // 1. 不能退出自己的私有团队
    // 2. 退出当前非私有团队后, 切换到自己的私有团队

    // role_id:
    // 1: 创始人
    // 2: 成员
    // 3: 管理员

    const outTeam = (userId) => {
        // 判断当前团队是否是该用户的私有团队
        const team_id = sessionStorage.getItem('team_id');
        const team_item = teamList[team_id];

        // // 当前团队是私有团队, 并且团队的创建者是自己
        // if (team_item.type === 1 && team_item.created_user_id === userId) {
        //     Message('error', '您无法退出自己的私有团队!');
        //     return;
        // }
        const params = {
            team_id,
        };
        fetchQuitTeam(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    Message('success', t('message.quitSuccess'));
                    const _teamList = Object.values(teamList);
                    const myTeam = _teamList.find(item => item.type === 1 && item.created_user_id === userId);
                    const settings = JSON.parse(localStorage.getItem('settings'));
                    settings.settings.current_team_id = myTeam.team_id;
                    sessionStorage.setItem('team_id', myTeam.team_id);
                    dispatch({
                        type: 'opens/coverOpenApis',
                        payload: {},
                    })
                    dispatch({
                        type: 'scene/updateOpenScene',
                        payload: null,
                    })
                    global$.next({
                        action: 'INIT_APPLICATION',
                    });
                    Bus.$emit('getTeamList');

                    onCancel();
                    navigate('/index');
                }
            }
        })
    };

    const setRole = (role_id, user_id) => {
        // 判断当前用户的更改权限
        // 成员: 无任何更改权限
        // 管理员: 成员 => 管理员 true 管理员 => 成员 false
        // 超级管理员: 成员 => 管理员 true 管理员 => 成员 true
        // all： xxx => 超级管理员 false 超级管理员 => xxx false 

        const params = {
            team_id: sessionStorage.getItem('team_id'),
            user_id,
            role_id: parseInt(role_id),
        };
        fetchUpdateRole(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    Message('success', t('message.handleSuccess'));
                    getUserInfo().pipe(tap(fetchData)).subscribe();
                } else {
                    Message('error', t('message.handleError'));
                }
            }
        })
    }

    const roleList = {
        1: t('modal.roleList.2'),
        2: t('modal.roleList.0'),
        3: t('modal.roleList.1')
    }

    const fetchData = () => {
        const query = {
            team_id: sessionStorage.getItem('team_id'),
            keyword: searchValue || '', page, size: pageSize
        }
        fetchTeamMemberList(query)
            .pipe(
                tap((res) => {
                    const { code, data: { members } } = res;
                    if (code === 0) {
                        let dataList = [];

                        dataList = members.map((item, index) => {
                            const { avatar, email, account , nickname, join_time_sec, invite_user_name, team_role_name,company_role_level } = item;
                            const userInfo = {
                                avatar,
                                email,
                                nickname,
                                account
                            }
                            return {
                                member: <MemberInfo userInfo={userInfo} me={item.user_id === user_id} />,
                                join_time_sec: dayjs(join_time_sec * 1000).format('YYYY-MM-DD HH:mm:ss'),
                                invite_user_name,
                                team_role_name:company_role_level == 1 ? '超管' : team_role_name,
                            }
                        });
                        setData(dataList);
                        if (isNumber(res?.data?.total)) {
                            setTotal(res.data.total);
                        }
                    }
                })
            )
            .subscribe();
    }
    const debounceFetchData = debounce(() => {
        fetchData();
    }, 200)
    useEffect(() => {
        // getUserInfo().pipe(tap(fetchData)).subscribe();
        fetchData();
    }, [])
    useEffect(() => {
        fetchData();
    }, [page, pageSize]);

    useEffect(() => {
        if (searchValue != null) {
            if (page != 1) {
                // 回到第一页
                setPage(1);
            } else {
                debounceFetchData();
            }
        }
    }, [searchValue])
    const columns = [
        {
            title: t('column.teamMember.member'),
            dataIndex: 'member',
            width: 220,
        },
        {
            title: t('column.teamMember.joinTime'),
            dataIndex: 'join_time_sec',
            width: 220,
        },
        {
            title: t('column.teamMember.inviteBy'),
            dataIndex: 'invite_user_name',
        },
        {
            title: t('column.teamMember.power'),
            dataIndex: 'team_role_name',
        },
    ];

    const MemberInfo = (props) => {
        const { userInfo: { nickname, avatar: avatarUrl, email, account }, me } = props;
        return (
            <div className='member-info'>
                <img className='avatar' src={avatarUrl || avatar} />
                <div className='detail'>
                    <p class='name'><p className='common' style={{ maxWidth: me ? '110px' : '175px' }}>{nickname} </p><p>{me ? `(${t('modal.me')})` : ''}</p></p>
                    <p className='email'>{account || '-'}</p>
                </div>
            </div>
        )
    }

    const HeaderLeft = () => {
        return (
            <div className={HeaderLeftModal}>
                <div className='member-header-left'>
                    <p className='title'>{t('modal.teamMemTitle')}</p>
                    {/* <Button className='invite-btn' preFix={<SvgInvite />} onClick={() => setShowInvite(true)}>{t('btn.invitation')}</Button> */}
                </div>
            </div>
        )
    }

    return (
        <div>
            {showInvite && <AddInternalMember onCancel={() => {
                setShowInvite(false);
            }} />}

            <Modal className={ProjectMemberModal} visible={true} title={<HeaderLeft />} footer={<>
                <Pagination pageSize={pageSize} onPageSizeChange={(val) => {
                    setPageSize(val);
                }} size='default' current={page} onChange={(val) => {
                    setPage(val);
                }} total={total} showTotal showJumper sizeCanChange sizeOptions={[20, 30, 40, 50, 80, 100]} />
            </>} onCancel={onCancel}>
                <div className="search-input">
                    <Input value={searchValue || ''} onChange={setSearchValue} style={{ width: 238, height: 28 }} prefix={<IconSearch />} placeholder={t('placeholder.searchNickNameAccount')} />
                </div>
                <Table scroll={{y:true}} ellipsis={true} pagination={false} columns={columns} data={data} />
            </Modal>
        </div>
    )
};

export default ProjectMember;