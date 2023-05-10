import React, { useState, useEffect, useRef } from 'react';
import { Radio, Switch, Table, Button, Message, Dropdown } from 'adesign-react';
import { Save as SvgSave, Import as SvgImport, Right as SvgRight, Left as SvgLeft } from 'adesign-react/icons';
import { fetchPreConfig } from '@services/plan';
import { useSelector, useDispatch } from 'react-redux';
import './index.less';
import { cloneDeep, round } from 'lodash';
// import { fetchPlanDetail } from '@services/plan';
import { fetchPlanDetail, fetchSavePlan, fetchGetTask } from '@services/plan';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import cn from 'classnames';
import { DatePicker, Tooltip, Input, Select } from '@arco-design/web-react';
import SvgExplain from '@assets/icons/Explain';
import dayjs from 'dayjs';
import PreviewPreset from '@modals/PreviewPreset';
import { fetchTeamPackage } from '@services/pay';
const { RangePicker } = DatePicker;
const { Group } = Radio;

const { Option } = Select;



const TaskConfig = (props) => {
    const { from, onChange, planDetail: { status, task_type: taskType } } = props;
    const { t } = useTranslation();

    const [initData, setInitData] = useState({});
    const dispatch = useDispatch();
    const [planDetail, setPlanDetail] = useState({});
    const task_config = useSelector((store) => store.plan.task_config);
    const open_scene = useSelector((store) => store.plan.open_plan_scene);
    const open_scene_name = useSelector((store) => store.plan.open_scene_name);
    const language = useSelector((store) => store.user.language);
    const hide_config = useSelector((store) => store.plan.hide_config);
    const { id: plan_id } = useParams();

    const taskList = {
        '0': '-',
        '1': t('plan.taskList.commonTask'),
        '2': t('plan.taskList.cronTask'),
        '3': t('plan.taskList.mixTask')
    };

    useEffect(() => {
        if (open_scene && taskType) {
            const query = {
                team_id: localStorage.getItem('team_id'),
                plan_id,
                scene_id: open_scene.scene_id ? open_scene.scene_id : open_scene.target_id,
                task_type: taskType
            };
            fetchGetTask(query).subscribe({
                next: (res) => {
                    const { data: { plan_task } } = res;
                    if (from === 'default') {
                        if (plan_task) {
                            const {
                                mode,
                                cron_expr,
                                mode_conf,
                                task_type,
                                control_mode,
                                timed_task_conf,
                                debug_mode
                            } = plan_task;
                            setMode(mode);
                            setControlMode(control_mode);
                            setCronExpr(cron_expr);
                            const { concurrency, duration, max_concurrency, round_num, start_concurrency, step, step_run_time } = mode_conf;
                            setConcurrency(concurrency);
                            setDuration(duration);
                            setMaxConcurrency(max_concurrency);
                            setRoundNum(round_num);
                            setStartConcurrency(start_concurrency);
                            setStep(step);
                            setStepRunTime(step_run_time);
                            setModeConf(mode_conf);
                            setTaskType(task_type);
                            setDebugMode(debug_mode ? debug_mode : 'stop');

                            if (timed_task_conf) {

                                const { frequency, task_exec_time, task_close_time } = timed_task_conf;

                                setFrequency(frequency);
                                setTaskExecTime(task_exec_time);
                                setTaskCloseTime(task_close_time);

                            }

                            if (mode_conf.round_num !== 0) {
                                setDefaultMode('round_num');
                            } else {
                                setDefaultMode('duration');
                            }
                            dispatch({
                                type: 'plan/updateTaskConfig',
                                payload: {
                                    mode,
                                    cron_expr,
                                    task_type,
                                    control_mode,
                                    debug_mode: debug_mode ? debug_mode : 'stop',
                                    mode_conf: mode_conf ? mode_conf : {},
                                    timed_task_conf: timed_task_conf ? timed_task_conf : {}
                                },
                            })
                        } else {
                            setModeConf({
                                concurrency: 0,
                                duration: 0,
                                max_concurrency: 0,
                                round_num: 0,
                                start_concurrency: 0,
                                step: 0,
                                step_run_time: 0,
                                threshold_value: 0,
                            })
                        }
                    }
                    setPlanDetail(plan_task);
                }
            })
        }
    }, [open_scene, taskType]);

    const init = (preinstall = initData) => {
        const {
            task_mode,
            cron_expr,
            mode_conf,
            timed_task_conf,
            task_type,
            control_mode,
            debug_mode
        } = preinstall;
        const { concurrency, duration, max_concurrency, round_num, start_concurrency, step, step_run_time } = mode_conf;
        setMode(task_mode);
        setControlMode(control_mode);
        setCronExpr(cron_expr);
        setModeConf(mode_conf);
        setConcurrency(concurrency);
        setDuration(duration);
        setMaxConcurrency(max_concurrency);
        setRoundNum(round_num);
        setStartConcurrency(start_concurrency);
        setStep(step);
        setStepRunTime(step_run_time);
        setTaskType(task_type);
        setDebugMode(debug_mode ? debug_mode : "stop");


        if (round_num > 0 && (!duration > 0)) {
            setDefaultMode('round_num');
        } else if (duration > 0 && (!round_num > 0)) {
            setDefaultMode('duration');
        }

        const { frequency, task_exec_time, task_close_time } = timed_task_conf;

        frequency && setFrequency(frequency);
        task_exec_time && setTaskExecTime(task_exec_time);
        task_close_time && setTaskCloseTime(task_close_time);

        let _task_config = cloneDeep(task_config);
        _task_config = {
            mode: task_mode,
            cron_expr,
            control_mode,
            mode_conf: mode_conf ? mode_conf : {},
            timed_task_conf: timed_task_conf ? timed_task_conf : {},
            task_type,
            debug_mode: debug_mode ? debug_mode : 'stop'
        }


        dispatch({
            type: 'plan/updateTaskConfig',
            payload: _task_config,
        })
    }


    const modeList = [t('plan.modeList.1'), t('plan.modeList.2'), t('plan.modeList.3'), t('plan.modeList.4'), t('plan.modeList.5')];
    const controlModeList = [t('plan.controlModeList.0'), t('plan.controlModeList.1')];

    const controlExplain = {
        0: t('plan.controlExplain.0'),
        1: t('plan.controlExplain.1')
    }
    // 模式
    const [mode, setMode] = useState(1);
    // 控制模式
    const [control_mode, setControlMode] = useState(0);
    // 普通任务1 定时任务2
    const [task_type, setTaskType] = useState(1);

    // 持续时长
    const [duration, setDuration] = useState('');
    // 轮次
    const [round_num, setRoundNum] = useState('');
    // 并发数
    const [concurrency, setConcurrency] = useState('');
    // 起始并发数
    const [start_concurrency, setStartConcurrency] = useState('');
    // 并发数步长
    const [step, setStep] = useState('');
    // 步长执行时间
    const [step_run_time, setStepRunTime] = useState('');
    // 最大并发数
    const [max_concurrency, setMaxConcurrency] = useState('');

    const [mode_conf, setModeConf] = useState({});

    const [default_mode, setDefaultMode] = useState('duration');

    // cron表达式
    const [cron_expr, setCronExpr] = useState('');

    const updateTaskConfig = (type, value) => {
        const _task_config = cloneDeep(task_config);
        const arr = ['duration', 'round_num', 'concurrency', 'start_concurrency', 'step', 'step_run_time', 'max_concurrency'];

        if (type === 'task_type') {
            _task_config['task_type'] = value;
        } else if (type === 'cron_expr') {
            _task_config['cron_expr'] = value;
        } else if (type === 'mode') {
            _task_config['mode'] = value;
        } else if (type === 'control_mode') {
            _task_config['control_mode'] = value;
        } else if (type === 'debug_mode') {
            _task_config['debug_mode'] = value;
        } else if (arr.includes(type)) {
            _task_config['task_type'] = task_type;
            if (task_type === 2) {
                _task_config['cron_expr'] = cron_expr;
            }
            _task_config['mode'] = mode;
            _task_config['mode_conf'] = mode_conf;
            _task_config['mode_conf'][type] = value;
        } else {
            if (task_type === 2) {
                _task_config['timed_task_conf'][type] = value;

                if (type === 'frequency') {
                    _task_config['timed_task_conf']['task_exec_time'] = 0;
                    _task_config['timed_task_conf']['task_close_time'] = 0;
                }
            }
        }

        dispatch({
            type: 'plan/updateTaskConfig',
            payload: _task_config,
        })
    }


    // 并发模式 60 82
    const taskConfig = () => {
        return (
            <div className="task-config-detail" style={{}}>
                <div className="left">
                    <div className="left-container">

                    </div>
                </div>
                <div className="right">
                    {
                        mode === 1 ? <div className="right-container-first">

                            <div className='config-set-select-item'>
                                <Select getPopupContainer={(triggerNode) => triggerNode.parentNode} disabled={status === 2} value={default_mode} onChange={(e) => {
                                    setDefaultMode(e);
                                    const _mode_conf = cloneDeep(mode_conf);
                                    if (e === 'duration') {
                                        _mode_conf.round_num = '';
                                        setModeConf(_mode_conf);
                                        updateTaskConfig('round_num', '');
                                    } else if (e === 'round_num') {
                                        _mode_conf.duration = '';
                                        setModeConf(_mode_conf);
                                        updateTaskConfig('duration', '');
                                    }
                                }}>
                                    <Option value="duration">{t('plan.duration')}</Option>
                                    <Option value="round_num">{t('plan.roundNum')}</Option>
                                </Select>

                                <Input
                                    value={default_mode === 'duration' ? mode_conf.duration : mode_conf.round_num}
                                    placeholder={default_mode === 'duration' ? t('placeholder.unitS') : t('placeholder.unitR')}
                                    onChange={(e) => {
                                        if (default_mode === 'duration') {
                                            if (parseInt(e) > 0) {
                                                const _mode_conf = cloneDeep(mode_conf);
                                                _mode_conf.duration = parseInt(e);
                                                // setDuration(parseInt(e.target.value));
                                                setModeConf(_mode_conf);
                                                // from === 'preset' && onChange('duration', parseInt(e.target.value));
                                                // from === 'default' && 
                                                setDuration(parseInt(e));
                                                updateTaskConfig('duration', parseInt(e));
                                            } else {
                                                const _mode_conf = cloneDeep(mode_conf);
                                                _mode_conf.duration = '';
                                                // setDuration(parseInt(e.target.value));
                                                setModeConf(_mode_conf);
                                                // from === 'preset' && onChange('duration', parseInt(e.target.value));
                                                // from === 'default' && 
                                                setDuration('');
                                                updateTaskConfig('duration', '');
                                            }
                                        } else if (default_mode === 'round_num') {
                                            if (parseInt(e) > 0) {
                                                const _mode_conf = cloneDeep(mode_conf);
                                                _mode_conf.round_num = parseInt(e);
                                                // setRoundNum(_mode_conf);
                                                setModeConf(_mode_conf);
                                                setRoundNum(parseInt(e));
                                                // from === 'preset' && onChange('round_num', parseInt(e.target.value));
                                                // from === 'default' && 
                                                updateTaskConfig('round_num', parseInt(e));
                                            } else {
                                                const _mode_conf = cloneDeep(mode_conf);
                                                _mode_conf.round_num = '';
                                                // setRoundNum(_mode_conf);
                                                setModeConf(_mode_conf);
                                                setRoundNum('');
                                                // from === 'preset' && onChange('round_num', parseInt(e.target.value));
                                                // from === 'default' && 
                                                updateTaskConfig('round_num', '');
                                            }
                                        }
                                    }} />
                                {/* <Group disabled={status === 2} className='radio-group' value={default_mode} onChange={(e) => {
                                    setDefaultMode(e);
                                    const _mode_conf = cloneDeep(mode_conf);
                                    if (e === 'duration') {
                                        _mode_conf.round_num = '';
                                        setModeConf(_mode_conf);
                                        updateTaskConfig('round_num', '');
                                    } else if (e === 'round_num') {
                                        _mode_conf.duration = '';
                                        setModeConf(_mode_conf);
                                        updateTaskConfig('duration', '');
                                    }
                                }}>
                                    <Radio disabled={status === 2} className='radio-group-item' value="duration">
                                        <span style={{ marginTop: '5px' }}>{t('plan.duration')}： </span>
                                        <Input value={mode_conf.duration} placeholder={t('placeholder.unitS')} onChange={(e) => {
                                            if (parseInt(e) > 0) {
                                                const _mode_conf = cloneDeep(mode_conf);
                                                _mode_conf.duration = parseInt(e);
                                                // setDuration(parseInt(e.target.value));
                                                setModeConf(_mode_conf);
                                                // from === 'preset' && onChange('duration', parseInt(e.target.value));
                                                // from === 'default' && 
                                                setDuration(parseInt(e));
                                                updateTaskConfig('duration', parseInt(e));
                                            } else {
                                                const _mode_conf = cloneDeep(mode_conf);
                                                _mode_conf.duration = '';
                                                // setDuration(parseInt(e.target.value));
                                                setModeConf(_mode_conf);
                                                // from === 'preset' && onChange('duration', parseInt(e.target.value));
                                                // from === 'default' && 
                                                setDuration('');
                                                updateTaskConfig('duration', '');
                                            }
                                        }} disabled={default_mode === 'round_num'} />
                                    </Radio>
                                    <Radio disabled={status === 2} className='radio-group-item' value="round_num" style={{ marginRight: 0 }}>
                                        <span style={{ marginTop: '5px' }}>{t('plan.roundNum')}： </span>
                                        <Input value={mode_conf.round_num} placeholder={t('placeholder.unitR')} onChange={(e) => {
                                            if (parseInt(e) > 0) {
                                                const _mode_conf = cloneDeep(mode_conf);
                                                _mode_conf.round_num = parseInt(e);
                                                // setRoundNum(_mode_conf);
                                                setModeConf(_mode_conf);
                                                setRoundNum(parseInt(e));
                                                // from === 'preset' && onChange('round_num', parseInt(e.target.value));
                                                // from === 'default' && 
                                                updateTaskConfig('round_num', parseInt(e));
                                            } else {
                                                const _mode_conf = cloneDeep(mode_conf);
                                                _mode_conf.round_num = '';
                                                // setRoundNum(_mode_conf);
                                                setModeConf(_mode_conf);
                                                setRoundNum('');
                                                // from === 'preset' && onChange('round_num', parseInt(e.target.value));
                                                // from === 'default' && 
                                                updateTaskConfig('round_num', '');
                                            }
                                        }} disabled={default_mode === 'duration'} />
                                    </Radio>
                                </Group> */}
                            </div>
                            <div className="right-item">
                                <span style={{ minWidth: '90px' }}><span className='must-input'>*&nbsp;</span>{t('plan.concurrency')}: </span>
                                <Input disabled={status === 2} value={mode_conf.concurrency} placeholder={t('placeholder.unitR')} onChange={(e) => {
                                    if (parseInt(e) > 0) {
                                        const _mode_conf = cloneDeep(mode_conf);
                                        _mode_conf.concurrency = parseInt(e);
                                        setConcurrency(parseInt(e));
                                        setModeConf(_mode_conf);

                                        updateTaskConfig('concurrency', parseInt(e));
                                    } else {
                                        const _mode_conf = cloneDeep(mode_conf);
                                        _mode_conf.concurrency = '';
                                        setConcurrency('');
                                        setModeConf(_mode_conf);

                                        updateTaskConfig('concurrency', '');
                                    }
                                }} />
                            </div>
                        </div>
                            : <div className="right-container">
                                <div className="right-item">
                                    <span><span className='must-input'>*&nbsp;</span> {t('plan.startConcurrency')}：</span>
                                    <Input disabled={status === 2} value={mode_conf.start_concurrency} placeholder={t('placeholder.unitR')} onChange={(e) => {
                                        if (parseInt(e) > 0) {
                                            const _mode_conf = cloneDeep(mode_conf);
                                            _mode_conf.start_concurrency = parseInt(e);
                                            setStartConcurrency(parseInt(e));
                                            setModeConf(_mode_conf);
                                            // from === 'preset' && onChange('start_concurrency', parseInt(e.target.value));
                                            // from === 'default' && 
                                            updateTaskConfig('start_concurrency', parseInt(e));
                                        } else {
                                            const _mode_conf = cloneDeep(mode_conf);
                                            _mode_conf.start_concurrency = '';
                                            setStartConcurrency('');
                                            setModeConf(_mode_conf);
                                            // from === 'preset' && onChange('start_concurrency', parseInt(e.target.value));
                                            // from === 'default' && 
                                            updateTaskConfig('start_concurrency', '');
                                        }
                                    }} />
                                </div>
                                <div className="right-item">
                                    <span><span className='must-input'>*&nbsp;</span>{t('plan.step')}：</span>
                                    <Input disabled={status === 2} value={mode_conf.step} placeholder={t('placeholder.unitR')} onChange={(e) => {
                                        if (parseInt(e) > 0) {
                                            const _mode_conf = cloneDeep(mode_conf);
                                            _mode_conf.step = parseInt(e);
                                            setStep(parseInt(e));
                                            setModeConf(_mode_conf);
                                            // from === 'preset' && onChange('step', parseInt(e.target.value));
                                            // from === 'default' && 
                                            updateTaskConfig('step', parseInt(e));
                                        } else {
                                            const _mode_conf = cloneDeep(mode_conf);
                                            _mode_conf.step = '';
                                            setStep('');
                                            setModeConf(_mode_conf);
                                            // from === 'preset' && onChange('step', parseInt(e.target.value));
                                            // from === 'default' && 
                                            updateTaskConfig('step', '');
                                        }
                                    }} />
                                </div>
                                <div className="right-item">
                                    <span><span className='must-input'>*&nbsp;</span>{t('plan.stepRunTime')}：</span>
                                    <Input disabled={status === 2} value={mode_conf.step_run_time} placeholder={t('placeholder.unitS')} onChange={(e) => {
                                        if (parseInt(e) > 0) {
                                            const _mode_conf = cloneDeep(mode_conf);
                                            _mode_conf.step_run_time = parseInt(e);
                                            setStepRunTime(parseInt(e));
                                            setModeConf(_mode_conf);
                                            // from === 'preset' && onChange('step_run_time', parseInt(e.target.value));
                                            // from === 'default' && 
                                            updateTaskConfig('step_run_time', parseInt(e));
                                        } else {
                                            const _mode_conf = cloneDeep(mode_conf);
                                            _mode_conf.step_run_time = '';
                                            setStepRunTime('');
                                            setModeConf(_mode_conf);
                                            // from === 'preset' && onChange('step_run_time', parseInt(e.target.value));
                                            // from === 'default' && 
                                            updateTaskConfig('step_run_time', '');
                                        }
                                    }} />
                                </div>
                                <div className="right-item">
                                    <span><span className='must-input'>*&nbsp;</span>{t('plan.maxConcurrency')}： </span>
                                    <Input disabled={status === 2} value={mode_conf.max_concurrency} placeholder={t('placeholder.unitR')} onChange={(e) => {
                                        if (parseInt(e) > 0) {
                                            const _mode_conf = cloneDeep(mode_conf);
                                            _mode_conf.max_concurrency = parseInt(e);
                                            setMaxConcurrency(parseInt(e));
                                            setModeConf(_mode_conf);
                                            // from === 'preset' && onChange('max_concurrency', parseInt(e.target.value));
                                            // from === 'default' && 
                                            updateTaskConfig('max_concurrency', parseInt(e));
                                        } else {
                                            const _mode_conf = cloneDeep(mode_conf);
                                            _mode_conf.max_concurrency = '';
                                            setMaxConcurrency('');
                                            setModeConf(_mode_conf);
                                            // from === 'preset' && onChange('max_concurrency', parseInt(e.target.value));
                                            // from === 'default' && 
                                            updateTaskConfig('max_concurrency', '');
                                        }
                                    }} />
                                </div>
                                <div className="right-item" style={{ marginBottom: 0 }}>
                                    <span><span className='must-input'>*&nbsp;</span>{t('plan.duration')}：</span>
                                    <Input disabled={status === 2} value={mode_conf.duration} placeholder={t('placeholder.unitS')} onChange={(e) => {
                                        if (parseInt(e) > 0) {
                                            const _mode_conf = cloneDeep(mode_conf);
                                            _mode_conf.duration = parseInt(e);
                                            setDuration(parseInt(e));
                                            setModeConf(_mode_conf);
                                            // from === 'preset' && onChange('duration', parseInt(e.target.value));
                                            // from === 'default' && 
                                            updateTaskConfig('duration', parseInt(e));
                                        } else {
                                            const _mode_conf = cloneDeep(mode_conf);
                                            _mode_conf.duration = '';
                                            setDuration('');
                                            setModeConf(_mode_conf);
                                            // from === 'preset' && onChange('duration', parseInt(e.target.value));
                                            // from === 'default' && 
                                            updateTaskConfig('duration', '');
                                        }
                                    }} />
                                </div>
                            </div>
                    }
                </div>
            </div>
        )
    }

    const savePlan = () => {
        if (mode === 1) {
            if (task_type === 2) {
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

            const { duration, round_num, concurrency } = mode_conf;

            if (!duration && !round_num) {

                Message('error', t('message.taskConfigEmpty'));
                return;
            } else if (!concurrency) {

                Message('error', t('message.taskConfigEmpty'));
                return;
            }

        } else {
            const { start_concurrency, step, step_run_time, max_concurrency, duration } = mode_conf;

            if (!start_concurrency || !step || !step_run_time || !max_concurrency || !duration) {

                Message('error', t('message.taskConfigEmpty'));
                return;
            }

            if (max_concurrency < start_concurrency) {
                Message('error', t('message.maxConcurrencyLessStart'));
                return;
            }
        }

        for (let i in task_config.mode_conf) {
            if (task_config.mode_conf[i] === '') {
                task_config.mode_conf[i] = 0;
            }
        }
        const params = {
            plan_id,
            name: open_scene_name,
            team_id: localStorage.getItem('team_id'),
            scene_id: open_scene.scene_id ? open_scene.scene_id : open_scene.target_id,
            ...task_config,
        };

        fetchSavePlan(params).subscribe({
            next: (res) => {
                const { code } = res;

                if (code === 0) {
                    Message('success', t('message.saveSuccess'));
                }
            }
        })
    };

    const theme = useSelector((store) => store.user.theme);

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
                },
            },
            yAxis: {
                type: 'value',
                scale: true,
                axisLabel: {
                    color: theme === 'dark' ? '#fff' : '#000',
                },
                splitLine: {
                    lineStyle: {
                        color: theme === 'dark' ? '#39393D' : '#E9E9E9'
                    }
                },
                name: t('plan.yUnit'),
                nameTextStyle: {
                    color: theme === 'dark' ? '#fff' : '#000',
                }
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

    const [x_echart, setXEchart] = useState([]);
    const [y_echart, setYEchart] = useState([]);

    useEffect(() => {
        let result = [];

        if (mode === 1) {
            if (default_mode === 'duration') {
                setXEchart([0, duration]);
                setYEchart([concurrency, concurrency]);
            } else if (default_mode === 'round_num') {
                setXEchart([0, round_num]);
                setYEchart([concurrency, concurrency]);
            }
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
    }, [start_concurrency, step, step_run_time, max_concurrency, duration, round_num, concurrency, default_mode]);



    // 频次: 0-一次，1-每天，2-每周，3-每月
    const [frequency, setFrequency] = useState(0);
    // 任务执行时间
    const [taskExecTime, setTaskExecTime] = useState(0);
    // 任务结束时间
    const [taskCloseTime, setTaskCloseTime] = useState(0);
    const [timeText, setTimeText] = useState('');

    // debug模式
    const [debugMode, setDebugMode] = useState("stop");

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

    const onTimeStart = (dateString, date) => {
        let start_time = new Date(dateString).getTime();

        if ((taskExecTime && taskCloseTime) && (taskCloseTime - (start_time / 1000) > 365 * 24 * 60 * 60)) {
            Message('error', t('message.dateRangeError'));
        } else if ((taskExecTime && taskCloseTime) && (taskCloseTime < (start_time / 1000))) {
        } else {
            setTaskExecTime(start_time / 1000);
            updateTaskConfig('task_exec_time', start_time / 1000)
        }

    }

    const onTimeEnd = (dateString, date) => {
        let end_time = new Date(dateString).getTime();

        if ((taskExecTime && taskCloseTime) && ((end_time / 1000) - taskExecTime > 365 * 24 * 60 * 60)) {
            Message('error', t('message.dateRangeError'));
        } else if ((taskExecTime && taskCloseTime) && ((end_time / 1000) < taskExecTime)) {

        } else {
            setTaskCloseTime(end_time / 1000);
            updateTaskConfig('task_close_time', end_time / 1000);
        }
    }


    const [showImport, setShowImport] = useState(false);
    const [preset, setPreset] = useState({});

    useEffect(() => {
        if (Object.entries(preset).length > 0) {
            init(preset);
        }
    }, [preset]);

    const [showTask, setShowTask] = useState(false);

    useEffect(() => {
        const mask = document.querySelector('.task-config');

        const showMaskFn = () => {
            if (status === 2) {
                setShowTask(true);
            }
        }

        const hideMaskFn = () => {
            if (status === 2) {
                setShowTask(false);
            }
        }

        mask.addEventListener('mouseenter', showMaskFn);
        mask.addEventListener('mouseleave', hideMaskFn);

        return () => {
            mask.removeEventListener('mouseenter', showMaskFn);
            mask.removeEventListener('mouseleave', hideMaskFn);
        }
    }, [status, theme]);


    return (
        <>
            {
                !hide_config && <div className='plan-task-config-body'>
                    <div className='plan-task-config-hide' onClick={() => {
                        dispatch({
                            type: 'plan/updateHideConfig',
                            payload: true
                        })
                    }}>
                        <SvgRight />
                    </div>
                    <div className='task-config'>

                        {
                            showTask && <div className='task-config-mask' style={{ backgroundColor: theme === 'dark' ? 'rgba(47,47,47, .5)' : 'rgba(222,222,222, .5)' }}>
                                <div className='text'>{t('plan.showMask')}</div>
                            </div>
                        }
                        {
                            from !== 'preset' && <div className='task-config-header'>
                                <p>{t('plan.taskConfig')}</p>
                                <div className='btn'>
                                    <Button className='save' onClick={() => savePlan()} preFix={<SvgSave width="16" height="16" />}>{t('btn.save')}</Button>
                                    <Button className='pre-btn' onClick={() => setShowImport(true)}>{t('plan.importPre')}</Button>
                                </div>
                            </div>
                        }
                        <div className='task-config-container'>
                            <div className='item' style={{ marginBottom: '30px' }}>
                                <p style={{ marginTop: '2px' }}>{t('plan.taskType')}： </p>
                                <p style={{ marginLeft: '16px' }}>{taskList[task_type]}</p>
                            </div>
                            <div className='item' style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <p>{t('plan.debugMode')}: </p>
                                <Select style={{ width: '300px', height: '32px', marginLeft: '14px' }} value={debugMode} onChange={(e) => {
                                    setDebugMode(e);
                                    updateTaskConfig('debug_mode', e);
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
                                        <Select value={control_mode} style={{ width: '270px', height: '32px', marginLeft: '14px' }} onChange={(e) => {
                                            setControlMode(e);
                                            updateTaskConfig('control_mode', e);
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
                                task_type === 2 ? <div className='item' style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                    <p>{t('plan.frequency')}: </p>
                                    <Select style={{ width: '224px', height: '32px', marginLeft: '14px' }} value={frequency} onChange={(e) => {
                                        setFrequency(e);
                                        updateTaskConfig('frequency', e);
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
                                    <div className='select-date'>
                                        <p className='label'>{t('plan.time')}:</p>
                                        <div className='select-date-detail'>
                                            <DatePicker
                                                value={taskExecTime * 1000}
                                                placeholder={t('placeholder.startTime')}
                                                style={{ marginTop: '10px' }}
                                                showTime
                                                format='YYYY-MM-DD HH:mm'
                                                onChange={onTimeStart}
                                                disabledDate={(current) => current.isBefore(new Date().getTime() - 86400000)}
                                            />
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
                                        <p className='time-explain'>{timeText}</p>

                                    </div> : <></>
                            }
                            <div className='item' style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <p >{t('plan.mode')}:</p>
                                <Select value={mode} style={{ width: '300px', height: '32px', marginLeft: '14px' }} onChange={(e) => {
                                    if (e === 1) {
                                        setDuration(0);
                                        updateTaskConfig('duration', 0);
                                        setRoundNum(0);
                                        updateTaskConfig('round_num', 0);
                                        setConcurrency(0);
                                        updateTaskConfig('concurrency', 0);
                                    } else {
                                        setStartConcurrency(0);
                                        updateTaskConfig('start_concurrency', 0);
                                        setStep(0);
                                        updateTaskConfig('step', 0);
                                        setStepRunTime(0);
                                        updateTaskConfig('step_run_time', 0);
                                        setMaxConcurrency(0);
                                        updateTaskConfig('max_concurrency', 0);
                                        setDuration(0);
                                        updateTaskConfig('duration', 0);
                                    }
                                    setMode(e);
                                    setXEchart([]);
                                    setYEchart([]);
                                    updateTaskConfig('mode', parseInt(e));
                                }}>
                                    {
                                        modeList.map((item, index) => (
                                            <Option key={index} value={index + 1}>{item}</Option>
                                        ))
                                    }
                                </Select>
                                {/* <Radio.Group value={mode} onChange={(e) => {
        setMode(e);
        // from === 'preset' && onChange('mode', e);
        // from === 'default' && 
        updateTaskConfig('mode', parseInt(e));
    }} >
        {modeList.map((item, index) => (<Radio value={index + 1} style={{ marginBottom: '16px' }}>{item}</Radio>))}
    </Radio.Group> */}
                            </div>
                            <div className='other-config'>
                                {
                                    taskConfig()
                                }
                            </div>
                            {
                                ((x_echart[0] || x_echart[1]) && (y_echart[0] || y_echart[1])) ?
                                    <>
                                        <ReactEcharts style={{ marginTop: '10px' }} className='echarts' option={getOption(t('plan.configEchart'), x_echart, y_echart)} />
                                        <p>{t('plan.xUnit')}</p>
                                    </> : ''
                            }
                        </div>
                        {
                            showImport && <PreviewPreset taskType={taskType} onCancel={(e) => {
                                if (e) {
                                    setPreset(e);
                                }
                                setShowImport(false);
                            }} />
                        }
                    </div>
                </div>
            }

        </>

    )
};

export default TaskConfig;