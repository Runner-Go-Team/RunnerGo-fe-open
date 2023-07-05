import React, { useState, useEffect } from "react";
import './index.less';
import { Button } from 'adesign-react';
import SvgLogo1 from '@assets/logo/runner_dark';
import SvgLogo2 from '@assets/logo/runner_white';
import { useSelector } from 'react-redux';
import { fetchGetInvitate, fetchAcceptInvitate } from '@services/user';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs';
import { getUserConfig$ } from '@rxUtils/user';
import { tap } from "rxjs";
import { useTranslation } from 'react-i18next';
import { getCookie } from '@utils';

import { global$ } from '@hooks/useGlobal/global';

const InvitatePage = () => {
    const theme = useSelector((store) => store.user.theme);
    const { search } = useLocation();
    const { invite_verify_code } = qs.parse(search.slice(1));
    const [name, setName] = useState('');
    const [team, setTeam] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();
    useEffect(() => {
        const params = {
            invite_verify_code,
        };
        fetchGetInvitate(params).subscribe({
            next: (res) => {
                const { code, data } = res;
                if (code === 0) {
                    const { invite_user_name, team_name } = data;
                    setName(invite_user_name);
                    setTeam(team_name);
                }
            }
        })
    }, [invite_verify_code]);

    const acceptInvitate = () => {
        const token = getCookie('token');
        const expire_time_sec = localStorage.getItem('expire_time_sec');
        const isExpire = new Date().getTime() > parseInt(expire_time_sec || 0);
        if (token && !isExpire) {
            const params = {
                invite_verify_code
            };
            fetchAcceptInvitate(params).subscribe({
                next: (res) => {
                    const { code } = res;
                    if (code === 0) {
                        getUserConfig$().subscribe({
                            next: (res) => {
                                navigate('/index');
                                global$.next({
                                    action: 'INIT_APPLICATION',
                                });
                            }
                        })
                    }
                }
            })
        } else {
            navigate(`/login?invite_verify_code=${invite_verify_code}`);
        }
    };


    return (
        <div className="invitate-page">
            {theme === 'dark' ? <SvgLogo1 className="logo" /> : <SvgLogo2 className="logo" />}
            <p className="title">{ t('sign.title') }</p>
            <p className="slogn">{ t('sign.slogn') }</p>
            <div className="email-body">
                <p className="p1">【{name}】{ t('sign.invitateContent1') }【{team}】{ t('sign.invitateContent2') }</p>
                <p className="p2">{ t('sign.clickBottomTeam') }</p>
                <Button onClick={() => acceptInvitate()}>{ t('sign.acceptInvitate') }</Button>
            </div>
        </div>
    )
};

export default InvitatePage;