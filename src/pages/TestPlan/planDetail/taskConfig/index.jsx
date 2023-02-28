import React, { useState, useEffect } from "react";
import { Radio, Switch, Table, Input, Button, Message, Select, Dropdown, Tooltip } from 'adesign-react';
import './index.less';
import { Right as SvgRight, Save as SvgSave } from 'adesign-react/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { DatePicker } from '@arco-design/web-react';
import SvgExplain from '@assets/icons/Explain';
const { Group } = Radio;


const TPlanConfig = () => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const [taskType, setTaskType] = useState(1);
    const [taskMode, setTaskMode] = useState(1);
    const [frequency, setFrequency] = useState(0);
    const [taskExecTime, setTaskExecTime] = useState(0);
    const [taskCloseTime, setTaskCloseTime] = useState(0);
    const [timeText, setTimeText] = useState('');

    const onTimeStart = (dateString, date) => {
        let start_time = new Date(dateString).getTime()
        setTaskExecTime(start_time / 1000);
    }

    const onTimeEnd = (dateString, date) => {
        let end_time = new Date(dateString).getTime()
        setTaskCloseTime(end_time / 1000);
    }

    useEffect(() => {
        let start = dayjs(taskExecTime * 1000).format('YYYY-MM-DD HH:mm');
        let start_time = dayjs(taskExecTime * 1000).format('HH:mm');
        let end = dayjs(taskCloseTime * 1000).format('YYYY-MM-DD HH:mm');
        if (frequency === 1) {
            setTimeText(`自${start}起, 每天的${start_time}该场景将自动执行一次, 直至${end}结束`);
        } else if (frequency === 2) {
            let week = new Date(taskExecTime * 1000).getDay();
            let weekList = {
                0: '周日',
                1: '周一',
                2: '周二',
                3: '周三',
                4: '周四',
                5: '周五',
                6: '周六'
            };
            setTimeText(`自${start}起, 每${weekList[week]}的${start_time}该场景将自动执行一次, 直至${end}结束`);
        } else if (frequency === 3) {
            let day = new Date(taskExecTime).getDate();
            setTimeText(`自${start}起, 每月${day}日的的${start_time}该场景将自动执行一次, 直至${end}结束`);
        } else {
            setTimeText('');
        }
        if (!taskExecTime || !taskCloseTime) {
            setTimeText('');
        }
    }, [taskExecTime, taskCloseTime, frequency]);


    return (
        <div className="tPlan-config">
            {
                open ?
                    <div className="tPlan-config-box">
                        <div className="header">
                            <p>任务配置</p>
                            <div className="header-right">
                                <Button className='save' preFix={<SvgSave width="16" height="16" />}>{t('btn.save')}</Button>
                                <SvgRight onClick={() => setOpen(false)} />
                            </div>
                        </div>
                        <div className="container">
                            <div className="item">
                                <p className="label">任务类型：</p>
                                <Group value={taskType} onChange={(e) => setTaskType(e)}>
                                    <Radio value={1}>普通任务</Radio>
                                    <Radio value={2}>定时任务</Radio>
                                </Group>
                            </div>
                            {
                                taskType === 2 ? <div className='item time-select' style={{ marginBottom: '30px' }}>
                                    <div className='explain'>
                                        <div className='explain-left'>
                                            <p>{t('btn.add')}</p>
                                            <Tooltip content={<div>{t('plan.explain')}</div>}>
                                                <div>
                                                    <SvgExplain />
                                                </div>
                                            </Tooltip>
                                        </div>
                                        <div className='explain-right'>
                                            <p>{t('plan.frequency')}</p>
                                            <Select value={frequency} onChange={(e) => {
                                                setFrequency(e);
                                                if (e === 0) {
                                                    setTaskCloseTime(0);
                                                }
                                            }}>
                                                <Option value={0}>{t('plan.frequencyList.0')}</Option>
                                                <Option value={1}>{t('plan.frequencyList.1')}</Option>
                                                <Option value={2}>{t('plan.frequencyList.2')}</Option>
                                                <Option value={3}>{t('plan.frequencyList.3')}</Option>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className='select-date'>
                                        <div className='select-date-right'>
                                            <div className='time-item'>
                                                <p className='label'>{t('index.startTime')}:</p>
                                                <DatePicker
                                                    value={taskExecTime * 1000}
                                                    placeholder={t('placeholder.startTime')}
                                                    style={{ marginTop: '10px', marginRight: '6px' }}
                                                    showTime
                                                    format='YYYY-MM-DD HH:mm'
                                                    onChange={onTimeStart}
                                                    disabledDate={(current) => current.isBefore(new Date().getTime() - 86400000)}
                                                />
                                            </div>
                                            <div className='time-item'>
                                                <p className='label'>{t('index.endTime')}:</p>
                                                <DatePicker
                                                    value={taskCloseTime * 1000}
                                                    disabled={frequency === 0}
                                                    placeholder={t('placeholder.endTime')}
                                                    style={{ marginTop: '10px' }}
                                                    showTime
                                                    format='YYYY-MM-DD HH:mm'
                                                    onChange={onTimeEnd}
                                                    disabledDate={(current) => current.isBefore(dayjs(taskExecTime * 1000).format('YYYY-MM-DD HH:mm:ss'))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className='time-explain'>{timeText}</p>
                                </div> : <></>
                            }
                            <div className="item">
                                <p className="label">运行模式：</p>
                                <Group className="flex-column" value={taskMode} onChange={(e) => setTaskMode(e)}>
                                    <Radio value={1}>按照用例执行</Radio>
                                    <Radio value={2}>按照测试数据执行</Radio>
                                </Group>
                            </div>
                            <div className="item">
                                <p className="label">执行次序：</p>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Group>
                                        <Radio>场景同时执行</Radio>
                                        <Radio>场景按顺序执行</Radio>
                                    </Group>
                                    <Group style={{ marginTop: '8px' }}>
                                        <Radio>用例同时执行</Radio>
                                        <Radio>用例顺序执行</Radio>
                                    </Group>
                                </div>
                            </div>
                        </div>
                    </div>
                    : <div className="tPlan-config-default" onClick={() => setOpen(true)}>
                        <p>任务配置</p>
                        <SvgRight />
                    </div>
            }
        </div>
    )
};

export default TPlanConfig;