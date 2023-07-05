import React, { useState, useEffect } from 'react';
import './index.less';
import { Input, Button, Modal, Message, Tooltip } from 'adesign-react';
import {
    Search as SvgSearch,
    Add as SvgAdd
} from 'adesign-react/icons';
import { useNavigate } from 'react-router-dom';
import CreatePlan from '@modals/CreatePlan';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { isArray } from 'lodash';
import enUS from '@arco-design/web-react/es/locale/en-US';
import cnUS from '@arco-design/web-react/es/locale/zh-CN';
import { fetchBatchDelete } from '@services/auto_plan';
import SvgSendEmail from '@assets/icons/SendEmail';

import { DatePicker, ConfigProvider } from '@arco-design/web-react';
import Bus from '@utils/eventBus';
const { RangePicker } = DatePicker;

const TPlanListHeader = (props) => {
    const { onChange, onDateChange, selectPlan } = props;
    const { t } = useTranslation();
    const [showPlan, setShowPlan] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const theme = useSelector((store) => store.user.theme);
    const language = useSelector((store) => store.user.language);
    const refreshList = useSelector((store) => store.plan.refreshList);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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


    const [canDelete, setCanDelete] = useState(true);
    useEffect(() => {
        if (selectPlan.length > 0) {
            let index = selectPlan.findIndex(item => item.canDelete === false);
            if (index !== -1) {
                setCanDelete(false);
            } else {
                setCanDelete(true);
            }
        }
    }, [selectPlan]);

    const toDelete = () => {
        Modal.confirm({
            title: t('modal.look'),
            content: t('modal.deletePlan'),
            okText: t('btn.ok'),
            cancelText: t('btn.cancel'),
            onOk: () => {
                const params = {
                    team_id: localStorage.getItem('team_id'),
                    plan_ids: selectPlan.map(item => item.plan_id)
                };
                fetchBatchDelete(params).subscribe({
                    next: (res) => {
                        const { code } = res;
                        if (code === 0) {
                            Message('success', t('message.deleteSuccess'));
                            dispatch({
                                type: 'auto_plan/updateRefreshList',
                                payload: !refreshList
                            })
                        }
                    }
                })
            }
        })
    }

    return (
        <div className='plan-header'>
            {
                showPlan && <CreatePlan from="auto_plan" onCancel={() => setShowPlan(false)} />
            }
            <div className='plan-header-left'>
                <Input
                    className="textBox"
                    value={keyword}
                    onChange={(e) => {
                        setKeyword(e);
                        onChange(e);
                    }}
                    beforeFix={<SvgSearch />}
                    placeholder={t('placeholder.searchPlan')}
                />
                <RangePicker
                    mode="date"
                    onChange={DateChange}
                    showTime="true"
                />
                {
                    selectPlan.length > 0 && (
                        <>
                        <Button
                                className='notice'
                                type='primary'
                                onClick={() => Bus.$emit('openModal','Notice',{event_id:103 ,batch:true ,options:{plan_ids:selectPlan.map(item => item.plan_id)}})}
                                preFix={<SvgSendEmail width="16" height="16" />}
                            >
                                {t('btn.batch_notif')}
                            </Button>
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
                {/* <Button className='searchBtn' onClick={() => onChange(keyword)}>搜索</Button> */}
            </div>
            <div className='plan-header-right'>
                <Button className='createBtn' preFix={<SvgAdd />} onClick={() => setShowPlan(true)}>{t('btn.createPlan')}</Button>
            </div>
        </div>
    )
};

export default TPlanListHeader;