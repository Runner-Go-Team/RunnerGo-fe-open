import React, { useState, useEffect } from "react";
import './index.less';
import { Modal, Button, Radio, Message } from 'adesign-react';
import { useTranslation } from 'react-i18next';
import SvgClose from '@assets/logo/close';
import { useSelector } from 'react-redux';
import { DatePicker, Tooltip, Select } from '@arco-design/web-react';
import dayjs from "dayjs";
const { Group } = Radio;
const { Option } = Select;
import 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import { fetchSavePreset } from '@services/preset';
import SvgExplain from '@assets/icons/Explain';
import { Input } from '@arco-design/web-react';
import { isString } from "lodash";
import { fetchTeamPackage } from '@services/pay';

const CreatePreset = (props) => {
    const { onCancel, configDetail } = props;

    const { t } = useTranslation();
    const language = useSelector((store) => store.user.language);
    const [conf_name, setConfName] = useState('');
    const [task_type, setTaskType] = useState(1);
    const [task_mode, setMode] = useState(1);
    const [control_mode, setControlMode] = useState(0);
    const [duration, setDuration] = useState(null);
    const [round_num, setRoundNum] = useState(null);
    const [concurrency, setConcurrency] = useState(null);
    const [start_concurrency, setStartConcurrency] = useState(null);
    const [step, setStep] = useState(null);
    const [step_run_time, setStepRunTime] = useState(null);
    const [max_concurrency, setMaxConcurrency] = useState(null);
    const [default_mode, setDefaultMode] = useState('duration');
    const [id, setId] = useState(null);

    const modeList = [t('plan.modeList.1'), t('plan.modeList.2'), t('plan.modeList.3'), t('plan.modeList.4'), t('plan.modeList.5')];
    const controlModeList = [t('plan.controlModeList.0'), t('plan.controlModeList.1')];
    const controlExplain = {
        0: t('plan.controlExplain.0'),
        1: t('plan.controlExplain.1')
    }
    const theme = useSelector((store) => store.user.theme);

    //禁止滚动

    const stopScroll = () => {

        var mo = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        document.body.style.overflow = 'hidden';

        document.addEventListener("touchmove", mo, false);//禁止页面滑动

    }

    /***允许滚动***/

    const canScroll = () => {

        var mo = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        document.body.style.overflow = '';//出现滚动条

        document.removeEventListener("touchmove", mo, false);
    }

    useEffect(() => {
        stopScroll();

        return () => {
            canScroll();
        }
    }, []);


    useEffect(() => {
        if (configDetail && Object.entries(configDetail).length > 0) {
            const {
                id,
                conf_name,
                mode_conf: {
                    concurrency,
                    duration,
                    max_concurrency,
                    round_num,
                    start_concurrency,
                    step,
                    step_run_time
                },
                task_mode,
                task_type,
                control_mode,
                timed_task_conf: {
                    frequency,
                    task_close_time,
                    task_exec_time
                },
                debug_mode
            } = configDetail;

            setId(id);
            setConfName(conf_name);
            setConcurrency(concurrency);
            setDuration(duration);
            setMaxConcurrency(max_concurrency);
            setRoundNum(round_num);
            setStartConcurrency(start_concurrency);
            setStep(step);
            setStepRunTime(step_run_time);
            setTaskType(task_type);
            setMode(task_mode);
            setFrequency(frequency);
            setTaskExecTime(task_exec_time);
            setTaskCloseTime(task_close_time);
            setControlMode(control_mode);
            setDebugMode(debug_mode ? debug_mode : "stop");

            if (round_num > 0) {
                setDefaultMode('round_num');
            } else {
                setDefaultMode('duration');
            }
        }
    }, [configDetail]);

    // marginLeft: language === 'cn' ? '60px' : '82px'
    const taskConfig = () => {
        return (
            <div className="task-config-detail" style={{}}>
                <div className="left">
                    <div className="left-container">
                    </div>
                </div>
                <div className="right">
                    {
                        task_mode === 1 ? <div className="right-container-first">

                            <div style={{ display: 'flex', marginLeft: '6px' }}>
                                <span className="must-input" style={{ marginTop: '4px', marginRight: 0 }}>*</span>
                                <Group className='radio-group' value={default_mode} onChange={(e) => {
                                    setDefaultMode(e);
                                    if (e === 'duration') {
                                        setRoundNum(0);
                                    } else if (e === 'round_num') {
                                        setDuration(0);
                                    }
                                }}>
                                    <Radio className='radio-group-item' value="duration">
                                        <span style={{ marginTop: '5px' }}>{t('plan.duration')}： </span>
                                        <Input value={duration} placeholder={t('placeholder.unitS')} onChange={(e) => {
                                            if (!e) {
                                                setDuration('');
                                                return;
                                            }
                                            if (parseInt(e) > 0) {
                                                setDuration(parseInt(e));
                                            } else if (`${parseInt(e)}` === `NaN`) {
                                                setDuration(0);
                                            }
                                        }} disabled={default_mode === 'round_num'} />
                                    </Radio>
                                    <Radio className='radio-group-item' value="round_num">
                                        <span style={{ marginTop: '5px' }}>{t('plan.roundNum')}： </span>
                                        <Input value={round_num} placeholder={t('placeholder.unitR')} onChange={(e) => {
                                            if (!e || `${parseInt(e)}` === 'NaN') {
                                                setRoundNum('');
                                            } else {
                                                setRoundNum(parseInt(e))
                                            }
                                        }} disabled={default_mode === 'duration'} />
                                    </Radio>
                                </Group>
                            </div>
                            <div className="right-item">

                                <span style={{ width: '90px', minWidth: 'auto' }}><span className="must-input">*</span>{t('plan.concurrency')}: </span>
                                <Input value={concurrency} placeholder={t('placeholder.unitR')} onChange={(e) => {
                                    if (!e) {
                                        setConcurrency('');
                                        return;
                                    }
                                    if (parseInt(e) > 0) {
                                        setConcurrency(parseInt(e));
                                    } else if (`${parseInt(e)}` === `NaN`) {
                                        setConcurrency(0);
                                    }
                                }} />
                            </div>
                        </div>
                            : <div className="right-container">
                                <div className="right-item">
                                    <span><span className="must-input">*</span>{t('plan.startConcurrency')}：</span>
                                    <Input value={start_concurrency} placeholder={t('placeholder.unitR')} onChange={(e) => {
                                        if (!e) {
                                            setStartConcurrency('');
                                            return;
                                        }
                                        if (parseInt(e) > 0) {
                                            setStartConcurrency(parseInt(e));
                                        } else if (`${parseInt(e)}` === `NaN`) {
                                            setStartConcurrency(0);
                                        }
                                    }} />
                                </div>
                                <div className="right-item">
                                    <span><span className="must-input">*</span>{t('plan.step')}：</span>
                                    <Input value={step} placeholder={t('placeholder.unitR')} onChange={(e) => {
                                        if (!e) {
                                            setStep('');
                                            return;
                                        }
                                        if (parseInt(e) > 0) {
                                            setStep(parseInt(e));
                                        } else if (`${parseInt(e)}` === `NaN`) {
                                            setStep(0);
                                        }
                                    }} />
                                </div>
                                <div className="right-item">
                                    <span><span className="must-input">*</span>{t('plan.stepRunTime')}：</span>
                                    <Input value={step_run_time} placeholder={t('placeholder.unitS')} onChange={(e) => {
                                        if (!e) {
                                            setStepRunTime('');
                                            return;
                                        }
                                        if (parseInt(e) > 0) {
                                            setStepRunTime(parseInt(e));
                                        } else if (`${parseInt(e)}` === `NaN`) {
                                            setStepRunTime(0);
                                        }
                                    }} />
                                </div>
                                <div className="right-item">
                                    <span><span className="must-input">*</span>{t('plan.maxConcurrency')}： </span>
                                    <Input value={max_concurrency} placeholder={t('placeholder.unitR')} onChange={(e) => {
                                        if (!e) {
                                            setMaxConcurrency('');
                                            return;
                                        }
                                        if (parseInt(e) > 0) {
                                            setMaxConcurrency(parseInt(e));
                                        } else if (`${parseInt(e)}` === `NaN`) {
                                            setMaxConcurrency(0);
                                        }
                                    }} />
                                </div>
                                <div className="right-item" style={{ marginBottom: 0 }}>
                                    <span><span className="must-input">*</span>{t('plan.duration')}：</span>
                                    <Input value={duration} placeholder={t('placeholder.unitS')} onChange={(e) => {
                                        if (!e) {
                                            setDuration('');
                                            return;
                                        }
                                        if (parseInt(e) > 0) {
                                            setDuration(parseInt(e));
                                        } else if (`${parseInt(e)}` === `NaN`) {
                                            setDuration(0);
                                        }
                                    }} />
                                </div>
                            </div>
                    }
                </div>
            </div>
        )
    }

    const [frequency, setFrequency] = useState(0);
    const [task_exec_time, setTaskExecTime] = useState(0);
    const [task_close_time, setTaskCloseTime] = useState(0);
    const [x_echart, setXEchart] = useState([]);
    const [y_echart, setYEchart] = useState([]);
    const [timeText, setTimeText] = useState('');
    const [debug_mode, setDebugMode] = useState("stop");

    useEffect(() => {
        let start = dayjs(task_exec_time * 1000).format('YYYY-MM-DD HH:mm');
        let start_time = dayjs(task_exec_time * 1000).format('HH:mm');
        let end = dayjs(task_close_time * 1000).format('YYYY-MM-DD HH:mm');
        if (frequency === 1) {
            setTimeText(`自${start}起, 每天的${start_time}该场景将自动执行一次, 直至${end}结束`);
        } else if (frequency === 2) {
            let week = new Date(task_exec_time).getDay();
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
            let day = new Date(task_exec_time).getDate();
            setTimeText(`自${start}起, 每月${day}日的的${start_time}该场景将自动执行一次, 直至${end}结束`);
        } else {
            setTimeText('');
        }
        if (!task_exec_time || !task_close_time) {
            setTimeText('');
        }
    }, [task_exec_time, task_close_time, frequency]);

    const onTimeStart = (dateString, date) => {
        let start_time = new Date(dateString).getTime();

        if ((start_time && task_close_time) && ((task_close_time - (start_time / 1000)) > 365 * 24 * 60 * 60)) {
            Message('error', t('message.dateRangeError'));
        } else if ((start_time && task_close_time) && (task_close_time < (start_time / 1000))) {

        } else {
            setTaskExecTime(start_time / 1000);
        }

    }

    const onTimeEnd = (dateString, date) => {
        let end_time = new Date(dateString).getTime();


        if ((task_exec_time && end_time) && (((end_time / 1000) - task_exec_time) > 365 * 24 * 60 * 60)) {
            Message('error', t('message.dateRangeError'));
        } else if ((task_exec_time && end_time) && ((end_time / 1000) < task_exec_time)) {

        } else {
            setTaskCloseTime(end_time / 1000);
        }
    }

    const getOption = (name, x, y) => {
        let option = {
            title: {
                text: name,
                left: 'center',
                textStyle: {
                    color: theme === 'dark' ? '#fff' : '#000',
                    fontSize: 14
                },
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: x.length > 0 ? x : [],
                axisLabel: {
                    color: theme === 'dark' ? '#fff' : '#000',
                    formatter: function (value, index) {
                        if (`${value}`.length > 3) {
                            return `${value}`.substr(0, 3) + '...'
                        } else {
                            return value
                        }
                    }
                },
            },
            yAxis: {
                type: 'value',
                scale: true,
                axisLabel: {
                    color: theme === 'dark' ? '#fff' : '#000'
                },
                splitLine: {
                    lineStyle: {
                        color: theme === 'dark' ? '#39393D' : '#E9E9E9'
                    }
                },
                name: t('plan.yUnit'),
                nameTextStyle: {
                    color: theme === 'dark' ? '#fff' : '#000',
                    align: 'left'
                },
            },
            series: [
                {
                    data: y.length > 0 ? y : [],
                    type: 'line',
                    step: 'end'
                }
            ]
        }
        return option;
    };

    useEffect(() => {
        let result = [];
        if (task_mode === 1) {
            setXEchart([0, duration]);
            setYEchart([concurrency, concurrency]);
        } else {
            if (start_concurrency > 0 && step > 0 && step_run_time > 0 && max_concurrency > 0 && duration > 0) {
                result.push([0]);
                result.push([start_concurrency]);
                while (true) {
                    if (result[1][result[1].length - 1] >= max_concurrency) {
                        result[1][result[1].length - 1] = max_concurrency;

                        result[0].push(result[0][result[0].length - 1] + duration);
                        result[1].push(result[1][result[1].length - 1]);

                        setXEchart(result[0]);
                        setYEchart(result[1]);
                        return;
                    }
                    result[0].push(result[0][result[0].length - 1] + step_run_time);
                    result[1].push(result[1][result[1].length - 1] + step)
                }
            }
        }
    }, [start_concurrency, step, step_run_time, max_concurrency, duration, round_num, concurrency]);

    const saveConfig = () => {
        if (!conf_name.trim()) {
            Message('error', t('message.configNameEmpty'));
            return;
        }

        if (task_mode === 1) {
            if (task_type === 2) {
                if (frequency === 0 && task_exec_time === 0) {
                    Message('error', t('message.taskConfigEmpty'));
                    return;
                } else if (frequency !== 0 && (task_exec_time === 0 || task_close_time === 0)) {
                    Message('error', t('message.taskConfigEmpty'));
                    return;
                }

                if (frequency !== 0 && task_close_time <= task_exec_time) {
                    Message('error', t('message.endGTstart'));
                    return;
                }
            }
            if (!duration && !round_num) {
                Message('error', t('message.taskConfigEmpty'));
                return;
            } else if (!concurrency) {
                Message('error', t('message.taskConfigEmpty'));
                return;
            }
        } else {
            if (!start_concurrency || !step || !step_run_time || !max_concurrency || !duration) {
                Message('error', t('message.taskConfigEmpty'));
                return;
            }
        }
        let params = {};
        if (id) {
            params = {
                id,
                team_id: localStorage.getItem('team_id'),
                conf_name,
                task_type,
                task_mode,
                debug_mode,
                mode_conf: {
                    concurrency: isString(concurrency) ? 0 : concurrency,
                    duration: isString(duration) ? 0 : duration,
                    max_concurrency: isString(max_concurrency) ? 0 : max_concurrency,
                    round_num: isString(round_num) ? 0 : round_num,
                    start_concurrency: isString(start_concurrency) ? 0 : start_concurrency,
                    step: isString(step) ? 0 : step,
                    step_run_time: isString(step_run_time) ? 0 : step_run_time,
                    threshold_value: 0
                },
                timed_task_conf: {
                    frequency,
                    task_exec_time,
                    task_close_time
                },
                control_mode,
            };
        } else {
            params = {
                team_id: localStorage.getItem('team_id'),
                conf_name,
                task_type,
                task_mode,
                debug_mode,
                mode_conf: {
                    concurrency,
                    duration,
                    max_concurrency,
                    round_num,
                    start_concurrency,
                    step,
                    step_run_time,
                    threshold_value: 0
                },
                timed_task_conf: {
                    frequency,
                    task_exec_time,
                    task_close_time
                },
                control_mode
            };
        }

        fetchSavePreset(params).subscribe({
            next: (res) => {
                const { code } = res;

                if (code === 0) {
                    Message('success', t('message.saveSuccess'));
                    onCancel(true);
                }
            }
        })
    }

    return (
        <div>
            <Modal
                className="create-preset"
                visible
                title={null}
                okText={t('btn.save')}
                cancelText={t('btn.close')}
                onOk={() => saveConfig()}
                onCancel={onCancel}
            >
                <div className="top">
                    <p className="top-left">{t('leftBar.preset')}</p>
                    <Button className='top-right' onClick={onCancel}><SvgClose /></Button>
                </div>
                <div className="config-name item">
                    <p><span className="must-input">*</span><span>{t('column.preset.name')}：</span></p>
                    <Input value={conf_name} placeholder={t('placeholder.configName')} onChange={(e) => setConfName(e)} />
                </div>

                <div className='task-config-container'>
                    <div className="task-config-container-left">
                        <div className='item' style={{ marginBottom: '30px' }}>
                            <p style={{ marginTop: '2px' }}>{t('plan.taskType')}： </p>
                            <Radio.Group style={{ marginLeft: '14px' }} value={task_type} onChange={(e) => setTaskType(e)}>
                                <Radio value={1}>{t('plan.taskList.commonTask')}</Radio>
                                <Radio value={2}>{t('plan.taskList.cronTask')}</Radio>
                            </Radio.Group>
                        </div>
                        <div className='item' style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <p>{t('plan.debugMode')}: </p>
                            <Select style={{ width: '300px', height: '32px', marginLeft: '14px' }} value={debug_mode} onChange={(e) => {
                                setDebugMode(e);
                            }}>
                                <Option value="stop">{t('plan.debugMode-0')}</Option>
                                <Option value="all">{t('plan.debugMode-1')}</Option>
                                <Option value="only_success">{t('plan.debugMode-2')}</Option>
                                <Option value="only_error">{t('plan.debugMode-3')}</Option>
                            </Select>
                        </div>
                        <div className='item' style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <p>{t('plan.controlMode')}:</p>
                            <Tooltip content={controlExplain[control_mode]}>
                                <div>
                                    <Select value={control_mode} style={{ width: '300px', height: '32px', marginLeft: '14px' }} onChange={(e) => {
                                        setControlMode(e);
                                    }}>
                                        {
                                            controlModeList.map((item, index) => (
                                                <Option key={index} value={index}>{item}</Option>
                                            ))
                                        }
                                    </Select>
                                </div>
                            </Tooltip>
                        </div>
                        {
                            task_type === 2 ? <div className="item" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <p>{t('plan.frequency')}</p>
                                <Select style={{ width: '300px', height: '32px', marginLeft: '14px' }} value={frequency} onChange={(e) => {
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
                            </div> : <></>
                        }
                        {
                            task_type === 2 ?
                                <div className="select-date">
                                    <p className="label">{t('plan.time')}:</p>
                                    <div className='select-date-detail'>
                                        <DatePicker
                                            value={task_exec_time * 1000}
                                            placeholder={t('placeholder.startTime')}
                                            style={{ marginTop: '10px' }}
                                            showTime
                                            format='YYYY-MM-DD HH:mm'
                                            onChange={onTimeStart}
                                            disabledDate={(current) => current.isBefore(new Date().getTime() - 86400000)}
                                        />
                                        <DatePicker
                                            value={task_close_time * 1000}
                                            disabled={frequency === 0}
                                            placeholder={t('placeholder.endTime')}
                                            style={{ marginTop: '10px' }}
                                            showTime
                                            format='YYYY-MM-DD HH:mm'
                                            onChange={onTimeEnd}
                                            disabledDate={(current) => current.isBefore(dayjs(task_exec_time * 1000).format('YYYY-MM-DD HH:mm:ss'))}
                                        />
                                    </div>
                                    <p className='time-explain'>{timeText}</p>
                                </div> : <></>
                        }

                        <div className='item' style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <p >{t('plan.mode')}:</p>
                            <Select value={task_mode} style={{ width: '300px', height: '32px', marginLeft: '14px' }} onChange={(e) => {
                                setDuration(0);
                                setRoundNum(0);
                                setConcurrency(0);
                                setStartConcurrency(0);
                                setStep(0);
                                setStepRunTime(0);
                                setMaxConcurrency(0);
                                setDuration(0);

                                setMode(e);
                                setXEchart([]);
                                setYEchart([]);
                            }}>
                                {
                                    modeList.map((item, index) => (
                                        <Option key={index} value={index + 1}>{item}</Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className='other-config'>
                            {
                                // <TaskConfig />
                                taskConfig()
                            }
                        </div>
                    </div>
                    <div className="task-config-container-right">
                        {
                            ((x_echart[0] || x_echart[1]) && (y_echart[0] || y_echart[1])) ?
                                <>
                                    <ReactEcharts className='echarts' option={getOption(t('plan.configEchart'), x_echart, y_echart)} />
                                    <p style={{ marginLeft: '20px' }}>{t('plan.xUnit')}</p>
                                </>
                                : ''
                        }
                    </div>
                </div>
            </Modal>
        </div>
    )
};

export default CreatePreset;