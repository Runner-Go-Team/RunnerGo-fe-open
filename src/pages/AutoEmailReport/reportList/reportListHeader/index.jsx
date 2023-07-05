import React, { useState, useEffect } from 'react';
import './index.less';
import { Input, Button, Tooltip, Message, Modal } from 'adesign-react';
import {
    Search as SvgSearch,
    Add as SvgAdd
} from 'adesign-react/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDeleteReport } from '@services/auto_report';
import SvgSendEmail from '@assets/icons/SendEmail';
import { isArray } from 'lodash';
import enUS from '@arco-design/web-react/es/locale/en-US';
import cnUS from '@arco-design/web-react/es/locale/zh-CN';

import { DatePicker, ConfigProvider } from '@arco-design/web-react';
import Bus from '@utils/eventBus';
const { RangePicker } = DatePicker;

const TReportListHeader = (props) => {
    const { onChange, onDateChange, selectReport } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState('');

    const theme = useSelector((store) => store.user.theme);
    const language = useSelector((store) => store.user.language);
    const refreshList = useSelector((store) => store.auto_report.refreshList);

    const DateChange = (dateString, date) => {
        if (isArray(dateString)) {
            const [start, end] = dateString;

            onDateChange(new Date(start).getTime() / 1000, new Date(end).getTime() / 1000);
        } else {
            onDateChange('', '');
        }
    }

    useEffect(() => {
        if (theme === 'dark') {
            document.body.setAttribute('arco-theme', 'dark');
        } else {
            document.body.removeAttribute('arco-theme');
        }
    }, [theme]);

    const [canDelete, setCanDelete] = useState(true);
    useEffect(() => {
        if (selectReport.length > 0) {
            let index = selectReport.findIndex(item => item.canDelete === false);
            if (index !== -1) {
                setCanDelete(false);
            } else {
                setCanDelete(true);
            }
        }
    }, [selectReport]);

    const toDelete = () => {
        Modal.confirm({
            title: t('modal.look'),
            content: t('modal.deleteReport'),
            okText: t('btn.ok'),
            cancelText: t('btn.cancel'),
            onOk: () => {
                const params = {
                    team_id: localStorage.getItem('team_id'),
                    report_ids: selectReport.map(item => item.report_id)
                };
                fetchDeleteReport(params).subscribe({
                    next: (res) => {
                        const { code } = res;
                        if (code === 0) {
                            Message('success', t('message.deleteSuccess'));
                            dispatch({
                                type: 'auto_report/updateRefreshList',
                                payload: !refreshList
                            })
                        }
                    }
                })
            }
        })
    }
    return (
        <div className='report-header-list'>
            <div className='report-header-list-left'>
                <Input
                    value={keyword}
                    className="textBox"
                    beforeFix={<SvgSearch />}
                    placeholder={t('placeholder.searchPlan')}
                    onChange={(e) => {
                        setKeyword(e);
                        onChange(e);
                    }}
                />


                <RangePicker
                    mode="date"
                    onChange={DateChange}
                    showTime="true"
                />

                {
                    selectReport.length > 0 && (
                        <>
                            <Button className='notice' preFix={<SvgSendEmail width="16" height="16" />} onClick={() => Bus.$emit('openModal', 'Notice', { event_id: 102, options: { report_ids: selectReport.map(item => item.report_id) } })}>{t('btn.notif')}</Button>
                            {!canDelete ?
                                <Tooltip
                                    bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'}
                                    className='tooltip-diy'
                                    content={!canDelete ? t('plan.cantDelete') : ''}
                                >
                                    <Button
                                        className='delete-btn'
                                        style={{ backgroundColor: !canDelete ? 'var(--bg-4)' : '', color: !canDelete ? 'var(--font-1)' : '' }}
                                        disabled={!canDelete}
                                        onClick={() => toDelete()}
                                    >
                                        {t('btn.delete')}
                                    </Button>
                                </Tooltip>
                                :
                                <Button
                                    className='delete-btn'
                                    disabled={!canDelete}
                                    onClick={() => toDelete()}
                                >
                                    {t('btn.delete')}
                                </Button>}
                        </>
                    )
                }
            </div>
            {/* <div className='report-header-right'>
                <Button className='createBtn' preFix={<SvgAdd />} onClick={() => navigate('/plan/detail')}>新建计划</Button>
            </div> */}
        </div>
    )
};

export default TReportListHeader