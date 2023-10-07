import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Button, Input, Dropdown } from 'adesign-react';
import { useSelector } from 'react-redux';
import {
    Team as SvgTeam,
    Down as SvgDown,
    StartUpTeam as SvgStartupteam,
    Search as SvgSearch,
} from 'adesign-react/icons';
import { global$ } from '@hooks/useGlobal/global';
import { isObject, isString } from 'lodash';
import TeamList from './teamList';
import { TeamProjectPanel, DropdownContainer, TeamProjectWrapper } from './style';
import TeamLists from '@modals/TeamList';
import { fetchTeamList } from '@services/user';
import { useTranslation } from 'react-i18next';
import { tap } from 'rxjs';
import Bus, { useEventBus } from '@utils/eventBus';
import { isArray } from 'lodash';
import SvgPayTeam from '@assets/icons/pay-team';
import dayjs from 'dayjs';
import { RD_ADMIN_URL } from '@config';
import { useDispatch } from 'react-redux';

const TeamProject = () => {
    const [filterValue, setFilterValue] = useState('');
    const [showTeamList, setTeamList] = useState(false);
    const refDropdown = useRef(null);
    const currentTeamId = useSelector((store) => store.user.team_id);
    // const currentTeamId = useSelector((store) => store?.workspace?.CURRENT_TEAM_ID);
    const CURRENT_PROJECT_ID = useSelector((store) => store?.workspace?.CURRENT_PROJECT_ID);
    const userTeams = useSelector((store) => store.teams.teamData);
    const [teamExpirationDate, setTeamExpirationDate] = useState(0);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const currentTeamName = useMemo(() => {
        // let teamName = '离线团队';
        let team_id = sessionStorage.getItem('team_id');
        let team_name = '';
        // 1私有 2公开
        let team_type = 2;
        if (userTeams[team_id]) {
            let { name, type } = userTeams[team_id];
            team_name = name;
            team_type = type;
        }

        let expiration_date = userTeams[team_id] ? userTeams[team_id].expiration_date : 0;
        setTeamExpirationDate(expiration_date > 0 ? dayjs(expiration_date * 1000).format('YYYY-MM-DD') : 0);
        // if (isString(currentTeamId) && isObject(userTeams) && currentTeamId !== '-1') {
        //     teamName = userTeams?.[currentTeamId]?.name;
        // }
        if (team_name) {
            document.title = team_name;
            dispatch({
                type: 'user/updateTeamType',
                payload: team_type
            })
        }
        
        return team_name;
    }, [userTeams, currentTeamId]);

    // 用户手动切换项目
    const handleSwitchProject = (project_id) => {
        const uuid = localStorage.getItem('uuid');
        if (`${uuid}` === '' || project_id === '') {
            return;
        }
        //  从本地获取数据
        global$.next({
            action: 'SWITCH_PROJECT',
            payload: project_id,
        });
        refDropdown?.current?.setPopupVisible(false);
    };


    return (
        <TeamProjectPanel>
            <Dropdown
                ref={refDropdown}
                content={
                    <DropdownContainer>
                        <div className="header">
                            <span>{t('modal.team')}</span>
                            <Button onClick={() => {
                                window.open(RD_ADMIN_URL);
                            }}>{t('modal.teamManage')}</Button>
                        </div>
                        <Input
                            value={filterValue}
                            onChange={setFilterValue}
                            beforeFix={<SvgSearch width="16" height="16" className="perfix" />}
                            className="filter-box"
                            placeholder={t('placeholder.searchTeam')}
                        />
                        <TeamProjectWrapper>
                            <TeamList
                                dropRef={refDropdown}
                                filterValue={filterValue}
                                currentTeamId={currentTeamId}
                                handleSwitchProject={handleSwitchProject}
                            />
                        </TeamProjectWrapper>
                    </DropdownContainer>
                }
            >
                <Button
                    preFix={<SvgPayTeam style={{ marginRight: '6px' }} />}
                    afterFix={<SvgDown width="16" height="16" className="afterfix" />}
                >
                    {currentTeamName}
                </Button>
            </Dropdown>

            {showTeamList && <TeamLists onCancel={() => setTeamList(false)} />}
        </TeamProjectPanel>
    )
};

export default TeamProject;