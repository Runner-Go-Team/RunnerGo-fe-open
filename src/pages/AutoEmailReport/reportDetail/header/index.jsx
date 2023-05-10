import React from "react";
import './index.less';
import { Button } from 'adesign-react';
import { Left as SvgLeft } from 'adesign-react/icons';
import avatar from '@assets/logo/avatar.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import LogoRight from '@assets/logo/info_right';
import SvgLogo1 from '@assets/logo/runner_dark';
import SvgLogo2 from '@assets/logo/runner_white';
import SvgRight from '@assets/logo/right';

const TReportDetailHeader = (props) => {
    const { header } = props;
    const navigate = useNavigate();
    const { t } = useTranslation();
    const statusList = {
        '1': t('report.statusList.1'),
        '2': t('report.statusList.2'),
    };
    const theme = useSelector((store) => store.user.theme);
    return (
        <div className="tReport-email-detail-header">
            <LogoRight className='logo-right' />
            <div className="title">
                {theme === 'dark' ? <SvgLogo1 /> : <SvgLogo2 />}
                <SvgRight className='svg-right' />
                <p>{t('report.title')}</p>
            </div>
            <div className="left">
                <div className="left-top">
                    <p className="name">{header ? header.report_name : ''}</p>
                    <p className="status">{header ? statusList[header.report_status] : ''}</p>
                </div>
                <div className="left-bottom">
                    <div className="performer">
                        <p>{t('autoReport.performer')}：</p>
                        <div className="performer-info">
                            <img className="avatar" src={header ? header.avatar : avatar} />
                            <p>{header ? header.nickname : ''}</p>
                        </div>
                    </div>
                    <p className="desc">
                        {t('autoReport.planDesc')}：{header ? header.remark : ''}
                    </p>
                </div>
            </div>
        </div>
    )
};

export default TReportDetailHeader;