import React, { useEffect, useState } from "react";
import './index.less';
import { Button } from 'adesign-react';
import { Left as SvgLeft } from 'adesign-react/icons';
import avatar from '@assets/logo/avatar.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SvgSendEmail from '@assets/icons/SendEmail';
import InputText from "@components/InputText";
import { fetchUpdateName } from '@services/auto_report';
import { useParams } from 'react-router-dom';
import Bus from "@utils/eventBus";

const TReportDetailHeader = (props) => {
    const { header } = props;
    const navigate = useNavigate();
    const { id } = useParams();
    const { t } = useTranslation();
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
                    <p className="name">
                        <InputText
                            maxLength={61}
                            value={header ? header.report_name : ''}
                            placeholder={t('placeholder.reportName')}
                            onChange={(e) => {
                                if (e.trim().length > 0) {
                                    const params = {
                                        report_id: id,
                                        report_name: e.trim()
                                    };

                                    fetchUpdateName(params).subscribe();
                                }
                            }}
                        />
                    </p>
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
            <div className="right">
                <Button className='notice' preFix={<SvgSendEmail width="16" height="16" />} onClick={() => Bus.$emit('openModal','Notice',{event_id:104 ,options:{report_ids:[id]}})}>{t('btn.notif')}</Button>
            </div>

        </div>
    )
};

export default TReportDetailHeader;