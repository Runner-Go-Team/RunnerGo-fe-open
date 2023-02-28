import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Button, Input, Dropdown } from 'adesign-react';
import { useSelector } from 'react-redux';
import {
    Team as SvgTeam,
    Down as SvgDown,
    StartUpTeam as SvgStartupteam,
    Search as SvgSearch,
} from 'adesign-react/icons';
import { FE_BASEURL } from '@config/client';
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


    const currentTeamName = useMemo(() => {
        // let teamName = '离线团队';
        let team_id = localStorage.getItem('team_id');
        let teamName = userTeams[team_id] ? userTeams[team_id].name : '';
        let expiration_date = userTeams[team_id] ? userTeams[team_id].expiration_date : 0;
        setTeamExpirationDate(expiration_date > 0 ? dayjs(expiration_date * 1000).format('YYYY-MM-DD') : 0);
        // if (isString(currentTeamId) && isObject(userTeams) && currentTeamId !== '-1') {
        //     teamName = userTeams?.[currentTeamId]?.name;
        // }
        
        return teamName;
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

    const USER_PROJECT_URL = `${FE_BASEURL}/project/${CURRENT_PROJECT_ID}/lately`;

    return (
        <TeamProjectPanel>
            <Dropdown
                ref={refDropdown}
                content={
                    <DropdownContainer>
                        <div className="header">
                            <span>{t('modal.team')}</span>
                            <Button onClick={() => {
                                setTeamList(true);
                                refDropdown.current.setPopupVisible(false);
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