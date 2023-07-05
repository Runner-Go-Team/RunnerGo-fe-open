import React, { useEffect, useState } from 'react';
import { Collapse as CollapseComponent, Message, Modal, Dropdown, Button } from 'adesign-react';
import { Team as SvgTeam } from 'adesign-react/icons';
import { isArray } from 'lodash';
import { getLatestTeamProjectList$, getLocalDataList$ } from '@rxUtils/project';
import { TeamHeader } from './style';
import ProjectList from './projectList';
import { fetchTeamList, fetchUpdateConfig } from '@services/user';
import { tap } from 'rxjs';
import { useDispatch, useSelector } from 'react-redux';
// import SvgTeam from '@assets/icons/team';
import './index.less';

import { global$ } from '@hooks/useGlobal/global';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@arco-design/web-react';
import cn from 'classnames';
import Bus from '@utils/eventBus';
import { getCookie } from '@utils';
const { Collapse, CollapseItem } = CollapseComponent;

const TeamList = (props) => {
  const { filterValue, currentTeamId, handleSwitchProject, dropRef } = props;

  const [teamList, setTeamList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [teamId, setTeamId] = useState(null);

  const refresh = useSelector((store) => store.dashboard.refresh);
  // const teamList = useSelector((store) => store.teams.teamData);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const uuid = localStorage.getItem('uuid');

  useEffect(() => {
    setTeamId(parseInt(localStorage.getItem('team_id') || 0))
  }, []);

  useEffect(() => {
    fetchTeamList()
      .pipe(
        tap((res) => {
          const { code, data } = res;
          if (code === 0) {
            const { teams } = data;

            if (isArray(teams)) {
              setTeamList(teams);
            }
          }
        })
      )
      .subscribe();
  }, []);


  const filterdProjectList = projectList?.filter(
    (pro) =>
      // filterValue === '' ||
      // `${pro.name}`.toLowerCase().indexOf(`${filterValue}`.toLowerCase()) !== -1
      pro
  );


  const filterdTeamList = Object.values(teamList || '{}').filter(
    (team) =>
      filterValue === '' ||
      `${team.name}`.toLowerCase().indexOf(`${filterValue}`.toLowerCase()) !== -1
    //  || filterdProjectList.map((d) => d.team_id).includes(team.team_id)
  );

  const changeTeam = (team_id) => {
    // 1. 进行config接口的update操作
    // 3. 进行项目初始化
    navigate('/index');
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.settings.current_team_id = team_id;
    fetchUpdateConfig(settings).subscribe({
      next: (res) => {
        const { code } = res;
        if (code === 0) {
          dropRef?.current?.setPopupVisible(false)
          localStorage.setItem('team_id', team_id);
          localStorage.removeItem('open_scene');
          dispatch({
            type: 'opens/coverOpenApis',
            payload: {},
          })
          dispatch({
            type: 'scene/updateOpenScene',
            payload: null,
          })
          dispatch({
            type: 'user/updateTeamId',
            payload: team_id
          });
          global$.next({
            action: 'INIT_APPLICATION',
          });

          dispatch({
            type:'mock/coverOpenMockApis',
            payload:{}
          });

          dispatch({
            type:'mock/recoverMockApis',
          });

          dispatch({
            type: 'dashboard/updateRefresh',
            payload: !refresh
          })

          // 告知websocket服务, 切换团队了
          const params = {
            team_id,
            token: getCookie('token')
          }

          Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "user_switch_team",
            param: JSON.stringify(params)
          }))

        } else if (code === 20032) {
          Modal.confirm({
            title: t('modal.teamValid'),
            content:
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p>
                  {t('modal.teamValidContent1-1')}
                  <Dropdown
                    trigger='hover'
                    className="check-team-valid-modal"
                    content={
                      <div>
                        <img style={{ width: '150px', height: '150px' }} src="https://apipost.oss-cn-beijing.aliyuncs.com/kunpeng/qrcode/tuanduiguoqi.png" />
                      </div>
                    }
                  >
                    <span style={{ color: 'var(--theme-color)' }}>{t('modal.contactMe')}</span>
                  </Dropdown>
                  {t('modal.teamValidContent1-2')}
                </p>
              </div>,
            cancelText: t('btn.know'),
            okText: t('btn.toPay'),
            onOk: () => {
              navigate('/renew?create=2');
            }
          })
        }
      },
      err: (err) => {

      }
    })
  };

  return (
    <div className='team_content'>
      {filterdTeamList.map((team) => (
        <div className={cn('team_content_item', {
          team_item_select: teamId === team.team_id
        })} onClick={() => changeTeam(team.team_id)}>
          <TeamHeader>
            <SvgTeam className='t-icon' />
            <span className='t-title'>{team.name}</span>
            <Tooltip content={t('header.teamNum')}>
              <span className='counts'>{team.cnt}</span>
            </Tooltip>
          </TeamHeader>
        </div>
      ))}
    </div>
  );
};

export default TeamList;
