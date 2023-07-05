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
import SvgSendEmail from '@assets/icons/SendEmail';
import { fetchBatchDelete } from '@services/report';

import { isArray } from 'lodash';
import enUS from '@arco-design/web-react/es/locale/en-US';
import cnUS from '@arco-design/web-react/es/locale/zh-CN';

import { DatePicker, ConfigProvider } from '@arco-design/web-react';
import Bus from '@utils/eventBus';
const { RangePicker } = DatePicker;

const ReportListHeader = (props) => {
    const { onChange, onDateChange, selectReport } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState('');

    const theme = useSelector((store) => store.user.theme);
    const language = useSelector((store) => store.user.language);
    const refreshList = useSelector((store) => store.report.refreshList);

    const DateChange = (dateString, date) => {
        if (isArray(dateString)) {
            const [start, end] = dateString;

            onDateChange(new Date(start).getTime() / 1000, new Date(end).getTime() / 1000);
        } else {
            onDateChange(0, 0);
        }
    }

    useEffect(() => {
        if (theme === 'dark') {
            document.body.setAttribute('arco-theme', 'dark');
        } else {
            document.body.removeAttribute('arco-theme');
        }
    }, [theme]);

    const toContrast = () => {
        let task_mode = '';
        console.log(selectReport);
        if (selectReport.filter(item => item.status === 2).length !== selectReport.length) {
            Message('error', t('message.contrastRunning'));
            return;
        }
        for (let i = 0; i < selectReport.length; i++) {
            if (i === 0) {
                task_mode = selectReport[i].task_mode;
            } else {
                if (task_mode !== selectReport[i].task_mode) {
                    Message('error', t('message.contrastMode'))
                    return;
                }
            }
        }
        const _selectReport = selectReport.map((item, index) => {
            return {
                report_id: item.report_id,
                plan_name: item.plan_name,
                scene_name: item.scene_name,
            }
        });
        navigate(`/reportContrast?contrast=${JSON.stringify(_selectReport)}`)
    }

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
                fetchBatchDelete(params).subscribe({
                    next: (res) => {
                        const { code } = res;
                        if (code === 0) {
                            Message('success', t('message.deleteSuccess'));
                            dispatch({
                                type: 'report/updateRefreshList',
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
                    selectReport.length < 2 || selectReport.length > 4 ?
                        <Tooltip
                            bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'}
                            className='tooltip-diy'
                            content={selectReport.length < 2 || selectReport.length > 4 ? t('index.contrastText') : ''}
                        >
                            <Button
                                className='contrast-btn'
                                style={{ backgroundColor: selectReport.length < 2 || selectReport.length > 4 ? 'var(--bg-4)' : '', color: selectReport.length < 2 || selectReport.length > 4 ? 'var(--font-1)' : '' }}
                                disabled={selectReport.length < 2 || selectReport.length > 4}
                                onClick={() => toContrast()}
                            >
                                {t('btn.contrast')}
                            </Button>
                        </Tooltip>
                        : <Button
                            className='contrast-btn'
                            disabled={selectReport.length < 2 || selectReport.length > 4}
                            onClick={() => toContrast()}
                        >
                            {t('btn.contrast')}
                        </Button>
                }
                {
                    selectReport.length > 0 ? (
                        <>
                          <Button
                                className='notice'
                                type='primary'
                                onClick={() => Bus.$emit('openModal', 'Notice', { event_id: 102,batch:true ,options: { report_ids: selectReport.map(item => item.report_id) } })}
                                preFix={<SvgSendEmail width="16" height="16" />}
                            >
                                {t('btn.batch_notif')}
                            </Button>
                            <Button
                                className='delete-btn'
                                onClick={() => toDelete()}
                            >
                                {t('btn.delete')}
                            </Button>
                        </>
                    ) : null
                }

            </div>
            {/* <div className='report-header-right'>
                <Button className='createBtn' preFix={<SvgAdd />} onClick={() => navigate('/plan/detail')}>新建计划</Button>
            </div> */}
        </div>
    )
};

export default ReportListHeader