import React, { useEffect, useRef, useState } from 'react';
import { Button, Dropdown } from 'adesign-react';
import { Tooltip } from '@arco-design/web-react';
import { Apis as SvgApis } from 'adesign-react/icons';
import './index.less';
import TeamProject from './teamProject';
// import GlobalConfig from './globalConfig';
// import RunningShow from './runningShow';
// import ImportApi from '@modals/ImportApi';
import { useTranslation } from 'react-i18next';
import { fetchTeamList } from '@services/user';
import { tap } from 'rxjs';
import { useDispatch, useSelector } from 'react-redux';
import { isArray } from 'lodash';
import SvgLogo1 from '@assets/logo/runner_dark';
import SvgLogo2 from '@assets/logo/runner_white';
import Bus from '@utils/eventBus';
import { RD_ADMIN_URL } from '@config';

const HeaderLeft = () => {
    const refDropdown = useRef();
    const [importApi, setImportApi] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchTeamList()
            .pipe(
                tap((res) => {
                    const { code, data } = res;
                    if (code === 0) {
                        const { teams } = data;

                        if (isArray(teams)) {
                            const teamData = {};
                            teams.forEach((data) => {
                                teamData[data.team_id] = data;
                            });
                            dispatch({
                                type: 'teams/updateTeamData',
                                payload: teamData,
                            });
                        }
                    }
                })
            )
            .subscribe();
    }, []);

    const theme = useSelector((store) => store.user.theme);

    const toAdmin = () => {
        window.open(RD_ADMIN_URL);
    }


    return (
        <div className='header-left'>
            <Tooltip content={t('tooltip.company_admin')}>
            {theme === 'dark' ? <SvgLogo1 className="logo" onClick={toAdmin} /> : <SvgLogo2 className="logo" onClick={toAdmin} />}
            </Tooltip>
            <TeamProject />

        </div>
    )
};

export default HeaderLeft;