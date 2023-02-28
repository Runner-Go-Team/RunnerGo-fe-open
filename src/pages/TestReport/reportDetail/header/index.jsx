import React, { useEffect, useState } from "react";
import './index.less';
import { Button } from 'adesign-react';
import { Left as SvgLeft } from 'adesign-react/icons';
import avatar from '@assets/logo/avatar.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SvgSendEmail from '@assets/icons/SendEmail';
import InvitationModal from '@modals/ProjectInvitation';

const TReportDetailHeader = (props) => {
    const { header } = props;
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [showEmail, setShowEmail] = useState(false);
    const statusList = {
        '1': t('report.statusList.1'),
        '2': t('report.statusList.2'),
    }
    return (
        <div className="tReport-detail-header">
            <div className="left">
                <div className="left-top">
                    <Button onClick={() => navigate('/Treport/list')}>
                        <SvgLeft />
                    </Button>
                    <p className="name">{ header ? header.plan_name : '' }</p>
                    <p className="status">{ header ?  statusList[header.report_status] : '' }</p>
                </div>
                <div className="left-bottom">
                    <div className="performer">
                        <p>{ t('autoReport.performer') }：</p>
                        <div className="performer-info">
                            <img className="avatar" src={header ? header.avatar : avatar} />
                            <p>{ header ? header.nickname : '' }</p>
                        </div>
                    </div>
                   <p className="desc">
                        { t('autoReport.planDesc') }：{ header ? header.remark : '' }
                   </p>
                </div>
            </div>
            <div className="right">
                <Button className='notice' preFix={<SvgSendEmail width="16" height="16" />} onClick={() => setShowEmail(true)}>{ t('autoReport.notifyEmail') }</Button>
            </div>
            {
                showEmail && <InvitationModal from="auto_report" email={true} onCancel={() => setShowEmail(false)} />
            }
        </div>
    )
};

export default TReportDetailHeader;