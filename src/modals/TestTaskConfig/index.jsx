import React, { useEffect, useState } from "react";
import './index.less';
import { Modal, Button, Radio, Select, Tooltip, Message } from 'adesign-react';
import { useTranslation } from 'react-i18next';
import SvgClose from '@assets/logo/close';
import dayjs from "dayjs";
import SvgExplain from '@assets/icons/Explain';
import { DatePicker } from '@arco-design/web-react';
import { fetchGetConfig, fetchSaveConfig } from '@services/auto_plan';
import { useParams } from 'react-router-dom';
import { fetchTeamPackage } from '@services/pay';
const { Group } = Radio;
const { Option } = Select;

const TestTaskConfig = (props) => {
    const { onCancel, plan_id } = props;
    const { t } = useTranslation();
    const [taskType, setTaskType] = useState(1);
    const [taskMode, setTaskMode] = useState(1);
    const [sceneRunOrder, setSceneRunOrder] = useState(1);
    const [caseRunOrder, setCaseRunOrder] = useState(1);
    const [frequency, setFrequency] = useState(0);
    const [taskExecTime, setTaskExecTime] = useState(0);
    const [taskCloseTime, setTaskCloseTime] = useState(0);
    const [timeText, setTimeText] = useState('');

    const onTimeStart = (dateString, date) => {
        let start_time = new Date(dateString).getTime();

        if ((taskExecTime && taskCloseTime) && (taskCloseTime - (start_time / 1000) > 365 * 24 * 60 * 60)) {
            Message('error', t('message.dateRangeError'));
        } else if ((taskExecTime && taskCloseTime) && (taskCloseTime < (start_time / 1000))) {
        } else {
            setTaskExecTime(start_time / 1000);
        }
    }

    const onTimeEnd = (dateString, date) => {
        let end_time = new Date(dateString).getTime();

        if ((taskExecTime && taskCloseTime) && ((end_time / 1000) - taskExecTime > 365 * 24 * 60 * 60)) {
            Message('error', t('message.dateRangeError'));
        } else if ((taskExecTime && taskCloseTime) && ((end_time / 1000) < taskExecTime)) {

        } else {
            setTaskCloseTime(end_time / 1000);
        }
    }

    useEffect(() => {
        if (plan_id !== 0) {
            const params = {
                plan_id,
                team_id: localStorage.getItem('team_id'),
            };
            fetchGetConfig(params).subscribe({
                next: (res) => {
                    const { data, code } = res;

                    if (code === 0) {
                        const { frequency, scene_run_order, task_close_time, task_exec_time, task_mode, task_type, test_case_run_order } = data;
                        setFrequency(frequency);
                        setSceneRunOrder(scene_run_order);
                        setTaskCloseTime(task_close_time);
                        setTaskExecTime(task_exec_time);
                        setTaskMode(task_mode);
                        setTaskType(task_type);
                        setCaseRunOrder(test_case_run_order);
                    }
                }
            })
        }
    }, [plan_id]);

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

    const save = () => {
        if (taskType === 2) {
            if (frequency === 0 && taskExecTime === 0) {
                Message('error', t('message.taskConfigEmpty'));
                return;
            } else if (frequency !== 0 && (taskExecTime === 0 || taskCloseTime === 0)) {
                Message('error', t('message.taskConfigEmpty'));
                return;
            }

            if (frequency !== 0 && taskCloseTime <= taskExecTime) {
                Message('error', t('message.endGTstart'));
                return;
            }
        }
        const params = {
            plan_id,
            team_id: localStorage.getItem('team_id'),
            task_type: taskType,
            task_mode: taskMode,
            scene_run_order: sceneRunOrder,
            test_case_run_order: caseRunOrder,
            frequency: frequency,
            task_exec_time: taskExecTime,
            task_close_time: frequency === 0 ? taskExecTime + 120 : taskCloseTime
        };
        fetchSaveConfig(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    Message('success', t('message.saveSuccess'));
                    onCancel();
                }
            }
        })
    };

    return (
        <div>
            <Modal
                className="test-task-config"
                visible
                closable={false}
                title={null}
                okText={t('btn.save')}
                cancelText={t('btn.cancel')}
                onCancel={onCancel}
                onOk={() => save()}
            >
                <div className="top">
                    <p className="title">{t('plan.taskConfig')}</p>
                    <Button className='close-btn' onClick={onCancel}><SvgClose /></Button>
                </div>
                <div className="container">
                    <div className="item">
                        <p className="label">{t('report.taskType')}：</p>
                        <Group value={taskType} onChange={(e) => setTaskType(e)}>
                            <Radio value={1}>{t('plan.taskList.commonTask')}</Radio>
                            <Radio value={2}>{t('plan.taskList.cronTask')}</Radio>
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
                                        setTaskExecTime(0);
                                        setTaskCloseTime(0);
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
                        <p className="label">{t('autoReport.runMode')}：</p>
                        <Group className="flex-column" value={taskMode} onChange={(e) => setTaskMode(e)}>
                            <Radio value={1}>{t('autoReport.taskMode.1')}</Radio>
                        </Group>
                    </div>
                    <div className="item">
                        <p className="label">{t('autoReport.scene')}：</p>
                        <div>
                            <Group value={sceneRunOrder} onChange={(e) => setSceneRunOrder(e)}>
                                <Radio value={1}>{t('autoReport.testCaseRunOrder.1')}</Radio>
                                <Radio value={2}>{t('autoReport.testCaseRunOrder.2')}</Radio>
                            </Group>
                        </div>
                    </div>
                    <div className="item">
                        <p className="label">{t('autoReport.case')}：</p>
                        <div>
                            <Group value={caseRunOrder} onChange={(e) => setCaseRunOrder(e)}>
                                <Radio value={1}>{t('autoReport.sceneRunOrder.1')}</Radio>
                            </Group>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
};

export default TestTaskConfig;