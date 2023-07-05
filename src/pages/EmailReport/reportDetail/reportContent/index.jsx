import React, { useEffect, useState } from 'react';
import './index.less';
// import {  } from 'adesign-react';
import { Button, Input } from 'adesign-react';
import { Add as SvgAdd } from 'adesign-react/icons';
import 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import { cloneDeep, isArray } from 'lodash';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Table, Tooltip, Collapse } from '@arco-design/web-react';

const { Item: CollapseItem } = Collapse;


const ReportContent = (props) => {
    const { data: datas, config: { 
        task_mode,
        task_type,
        control_mode,
        is_open_distributed,
        mode_conf,
        change_take_conf,
        machine_allot_type
    }, status, plan_id, analysis, description 
    } = props;
    const { t } = useTranslation();
    const [tableData, setTableData] = useState([]);
    const [tableData1, setTableData1] = useState([]);
    // 每秒事务数
    const [tps, setTps] = useState([]);
    // 每秒请求数
    const [rps, setRps] = useState([]);
    // 并发数
    const [concurrency, setConcurrency] = useState([]);
    // 错误数
    const [errNum, setErrNum] = useState([]);
    const [rpsList, setRpsList] = useState([]);
    const [errList, setErrList] = useState([]);
    const [tpsList, setTpsList] = useState([]);
    const [concurrencyList, setConcurrencyList] = useState([]);
    const [avgList, setAvgList] = useState([]);
    const [fiftyList, setFiftyList] = useState([]);
    const [ninetyList, setNinetyList] = useState([]);
    const [ninetyFive, setNinetyFive] = useState([]);
    const [ninetyNine, setNinetyNine] = useState([]);

    const [configColumn, setConfigColumn] = useState([]);
    const [configData, setConfigData] = useState([]);
    const [activeCollapse, setActiveCollapse] = useState(0);
    const [config_list, setConfigList] = useState([]);

    const theme = useSelector((store) => store.user.theme);

    const colorList = [
        '#FF5959', '#FF9559', '#FFD159', '#8EFF59', '#59FFF5', '#59AFFF', '#5D59FF', '#8E59FF', '#CA59FF', '#FF59DB',
        '#B90000', '#B9A600', '#5CB900', '#00B9AE', '#0098B9', '#0029B9', '#7300B9', '#9F00B9', '#B9006F', '#B94E00',
    ];

    const modeList = {
        '1': t('plan.modeList.1'),
        '2': t('plan.modeList.2'),
        '3': t('plan.modeList.3'),
        '4': t('plan.modeList.4'),
        '5': t('plan.modeList.5'),
        '6': t('plan.modeList.6'),
    }

    useEffect(() => {
        setTableData1(datas);
        let tps = [];
        let rps = [];
        let concurrency = [];
        let errNum = [];
        let _total_request_num = 0;
        let _total_request_time = 0;
        let _max_request_time = 0;
        let _min_request_time = 0;
        let _ninety_request_time_line_value = 0;
        let _ninety_five_request_time_line_value = 0;
        let _ninety_nine_request_time_line_value = 0;
        let _rps = 0;
        let _error_num = 0;
        let _error_rate = 0;
        let _received_bytes = 0;
        let _send_bytes = 0;
        let _sprs = 0;
        let _tps = 0;
        let _stps = 0;


        let _rps_list = [];
        // let _err_list = [];
        let _qps_list = [];
        let _concurrency_list = [];
        let _avg_list = [];
        let _fifty = [];
        let _ninety = [];
        let _ninety_five = [];
        let _ninety_nine = [];
        let _tps_list = [];
        datas && datas.forEach(item => {
            const {
                total_request_num,
                total_request_time,
                max_request_time,
                min_request_time,
                ninety_request_time_line_value,
                ninety_five_request_time_line_value,
                ninety_nine_request_time_line_value,
                rps,
                error_num,
                error_rate,
                received_bytes,
                send_bytes,
                rps_list,
                // error_num_list,
                tps_list,
                api_name,
                concurrency_list,
                avg_list,
                fifty_list,
                ninety_list,
                ninety_five_list,
                ninety_nine_list,
                srps,
                tps,
                stps,
            } = item;
            item.total_request_time = total_request_time;
            item.error_rate = `${(error_rate * 100).toFixed(2)}%`
            // tps.push(qps);
            // rps.push();
            // concurrency.push(qps);
            // errNum.push(qps);
            _total_request_num += total_request_num;
            _total_request_time += total_request_time;
            _max_request_time += max_request_time;
            _min_request_time += min_request_time;
            _ninety_request_time_line_value += ninety_request_time_line_value;
            _ninety_five_request_time_line_value += ninety_five_request_time_line_value;
            _ninety_nine_request_time_line_value += ninety_nine_request_time_line_value;
            _rps += rps;
            _error_num += error_num;
            _error_rate += error_rate;
            _received_bytes += received_bytes;
            _send_bytes += send_bytes;
            _sprs += srps;
            _tps += tps;
            _stps += stps;


            _rps_list.push({
                api_name,
                x_data: rps_list ? rps_list.map(item => dayjs(item.time_stamp * 1000).format('HH:mm:ss')) : [],
                y_data: rps_list ? rps_list.map(item => item.value) : []
            });
            _tps_list.push({
                api_name,
                x_data: tps_list ? tps_list.map(item => dayjs(item.time_stamp * 1000).format('HH:mm:ss')) : [],
                y_data: tps_list ? tps_list.map(item => item.value) : [],
            });
            _concurrency_list.push({
                api_name,
                x_data: concurrency_list ? concurrency_list.map(item => dayjs(item.time_stamp * 1000).format('HH:mm:ss')) : [],
                y_data: concurrency_list ? concurrency_list.map(item => item.value) : [],
            });
            _avg_list.push({
                api_name,
                x_data: avg_list ? avg_list.map(item => dayjs(item.time_stamp * 1000).format('HH:mm:ss')) : [],
                y_data: avg_list ? avg_list.map(item => item.value) : []
            });
            _fifty.push({
                api_name,
                x_data: fifty_list ? fifty_list.map(item => dayjs(item.time_stamp * 1000).format('HH:mm:ss')) : [],
                y_data: fifty_list ? fifty_list.map(item => item.value) : []
            })
            _ninety.push({
                api_name,
                x_data: ninety_list ? ninety_list.map(item => dayjs(item.time_stamp * 1000).format('HH:mm:ss')) : [],
                y_data: ninety_list ? ninety_list.map(item => item.value) : []
            });
            _ninety_five.push({
                api_name,
                x_data: ninety_five_list ? ninety_five_list.map(item => dayjs(item.time_stamp * 1000).format('HH:mm:ss')) : [],
                y_data: ninety_five_list ? ninety_five_list.map(item => item.value) : []
            });
            _ninety_nine.push({
                api_name,
                x_data: ninety_nine_list ? ninety_nine_list.map(item => dayjs(item.time_stamp * 1000).format('HH:mm:ss')) : [],
                y_data: ninety_nine_list ? ninety_nine_list.map(item => item.value) : []
            });
        });
        setTps(tps);
        setRps(rps);
        setConcurrency(concurrency);
        setErrNum(errNum);
        setRpsList(_rps_list);
        setTpsList(_tps_list);
        setConcurrencyList(_concurrency_list);
        setAvgList(_avg_list);
        setFiftyList(_fifty);
        setNinetyList(_ninety);
        setNinetyFive(_ninety_five);
        setNinetyNine(_ninety_nine);
        let _datas = cloneDeep(datas);
        _datas.unshift({
            api_name: t('report.collect'),
            total_request_num: _total_request_num,
            total_request_time: _total_request_time.toFixed(2),
            max_request_time: '-',
            avg_request_time: '-',
            min_request_time: '-',
            ninety_request_time_line_value: '-',
            ninety_five_request_time_line_value: '-',
            ninety_nine_request_time_line_value: '-',
            srps: '-',
            qps: '-',
            error_num: _error_num,
            error_rate: '-',
            received_bytes: _received_bytes.toFixed(1),
            send_bytes: _send_bytes,
            tps: '-',
            stps: '-',

        });
        setTableData1(_datas);
    }, [datas]);

    const columns1 = [
        {
            title: t('report.apiName'),
            dataIndex: 'api_name',
            render: (col, item, index) => {

                return <Tooltip content={col}>
                    {col}
                </Tooltip>
            }
        },
        {
            title: t('report.totalReqNum'),
            dataIndex: 'total_request_num',
        },
        {
            title: t('report.totalResTime'),
            dataIndex: 'total_request_time',
            width: 150,
        },
        {
            title: 'Max(ms)',
            dataIndex: 'max_request_time',
        },
        {
            title: 'Min(ms)',
            dataIndex: 'min_request_time',
        },
        {
            title: 'Avg(ms)',
            dataIndex: 'avg_request_time',
        },
        {
            title: '90%',
            dataIndex: 'ninety_request_time_line_value',
        },
        {
            title: '95%',
            dataIndex: 'ninety_five_request_time_line_value',
        },
        {
            title: '99%',
            dataIndex: 'ninety_nine_request_time_line_value',
        },
        {
            title: t('report.qps'),
            dataIndex: 'rps',
        },
        {
            title: t('report.srps'),
            dataIndex: 'srps',
        },
        {
            title: t('report._tps'),
            dataIndex: 'tps'
        },
        {
            title: t('report.stps'),
            dataIndex: 'stps'
        },
        {
            title: t('report.errRate'),
            dataIndex: 'error_rate',
        },
    ];

    const getOption = (name, data, unit) => {
        let temp = 0;
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
                data: data[0] ? data[0].x_data : [],
                axisLabel: {
                    color: theme === 'dark' ? '#fff' : '#000',
                    rotate: 30
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: theme === 'dark' ? '#fff' : '#000',
                    formatter: function (value, index) {
                        if (`${value}`.length > 4) {
                            return `${value}`.substr(0, 4) + '...'
                        } else {
                            return value
                        }
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: theme === 'dark' ? '#39393D' : '#E9E9E9'
                    }
                },
                name: unit,
            },
            dataZoom: { // 放大和缩放
                type: 'inside',
                // show: true,
                // start: 0,
                // end: 50
            },
            series: data.length > 0 ? data.map((item, index) => {
                if (index >= (20 + temp * 20)) {
                    temp++;
                }
                return {
                    name: item.api_name,
                    type: 'line',
                    color: colorList[index - temp * 20],
                    // stack: 'Total',
                    data: item.y_data,
                    showSymbol: false,
                }
            }) : []
        }
        return option;
    };

    const explainList = ["Max(ms): 最大响应时间", "Min(ms): 最小响应时间", "Avg(ms): 平均响应时长", "90%: 响应时间90%线", "95%: 响应时间95%线", "99%: 响应时间99%线", "RPS: 每秒应答数", "SRPS: 每秒应答成功数", "TPS: 每秒事务数", "STPS: 每秒成功事务数"];

    const senior_config_column = [
        {
            title: t('plan.machineName'),
            dataIndex: 'machine_name',
            width: 100,
        },
        {
            title: t('plan.region'),
            dataIndex: 'region',
            width: 60,
        },
        {
            title: t('plan.ip'),
            dataIndex: 'ip',
            width: 100,
        },
    ];

    const updateChange = (list, p_index, p_field, index, field, value) => {
        let _data = cloneDeep(list);

        if (`${parseInt(value)}` === `${NaN}`) {
            if (index !== null && field !== null) {
                _data[p_index][p_field][index][field] = null;
            } else {
                _data[p_index][p_field] = null;
            }
            setConfigList(_data);
        } else {
            if (index !== null && field !== null) {
                _data[p_index][p_field][index][field] = parseInt(value);
            } else {
                _data[p_index][p_field] = parseInt(value);
            }
            setConfigList(_data);
        }
    }

    const updateBlur = (list, p_index, p_field, index, field, value) => {
        if (value === null) {
            let _data = cloneDeep(list);
            if (index !== null && field !== null) {
                _data[p_index][p_field][index][field] = 0;
            } else {
                _data[p_index][p_field] = 0;
            }
            setUsableMachineList(_data);
        }
    }

    const getMachineColumn = (p_index, created_time_sec) => {
        if (is_open_distributed === 1) {
            if (machine_allot_type === 0) {
                return [
                    ...senior_config_column,
                    {
                        title: t('plan.weight'),
                        dataIndex: 'weight',
                        width: 120,
                        render: (col, item, index) => (
                            <Input
                                value={col}
                                disabled={item.machine_status === 2 || created_time_sec > 0}
                                onChange={(e) => {
                                    if (parseInt(e) > 100) {
                                        updateChange(config_list, p_index, 'usable_machine_list', index, 'weight', 100);
                                    } else {
                                        updateChange(config_list, p_index, 'usable_machine_list', index, 'weight', e);
                                    }
                                }}
                                onBlur={(e) => updateBlur(config_list, p_index, 'usable_machine_list', index, 'weight', e.target.value)}
                            />
                        )
                    }
                ]
            } else if (machine_allot_type === 1) {
                if (task_mode === 1 || task_mode === 6) {
                    return [
                        ...senior_config_column,
                        {
                            title: t('plan.concurrency'),
                            dataIndex: 'concurrency',
                            width: 120,
                            render: (col, item, index) => (
                                <Input
                                    value={col}
                                    disabled={item.machine_status === 2 || created_time_sec > 0}
                                    onChange={(e) => updateChange(config_list, p_index, 'usable_machine_list', index, 'concurrency', e)}
                                    onBlur={(e) => updateBlur(config_list, p_index, 'usable_machine_list', index, 'concurrency', e.target.value)}
                                />
                            )
                        },
                        task_mode === 1 ? {
                            title: t('plan.duration'),
                            dataIndex: 'duration',
                            width: 120,
                            render: (col, item, index) => (
                                <Input
                                    value={col}
                                    disabled={item.machine_status === 2 || !item.duration || created_time_sec > 0}
                                    onChange={(e) => updateChange(config_list, p_index, 'usable_machine_list', index, 'duration', e)}
                                    onBlur={(e) => updateBlur(config_list, p_index, 'usable_machine_list', index, 'duration', e.target.value)}
                                />
                            )
                        } :
                            {
                                title: t('plan.roundNum'),
                                dataIndex: 'round_num',
                                width: 120,
                                render: (col, item, index) => (
                                    <Input
                                        value={col}
                                        disabled={item.machine_status === 2 || !item.round_num || created_time_sec > 0}
                                        onChange={(e) => updateChange(config_list, p_index, 'usable_machine_list', index, 'round_num', e)}
                                        onBlur={(e) => updateBlur(config_list, p_index, 'usable_machine_list', index, 'round_num', e.target.value)}
                                    />
                                )
                            },
                    ];
                } else {
                    return [
                        ...senior_config_column,
                        {
                            title: t('plan.startConcurrency'),
                            dataIndex: 'start_concurrency',
                            width: 120,
                            render: (col, item, index) => (
                                <Input
                                    value={col}
                                    disabled={item.machine_status === 2 || created_time_sec > 0}
                                    onChange={(e) => updateChange(config_list, p_index, 'usable_machine_list', index, 'start_concurrency', e)}
                                    onBlur={(e) => updateBlur(config_list, p_index, 'usable_machine_list', index, 'start_concurrency', e.target.value)}
                                />
                            )
                        },
                        {
                            title: t('plan.step'),
                            dataIndex: 'step',
                            width: 120,
                            render: (col, item, index) => (
                                <Input
                                    value={col}
                                    disabled={item.machine_status === 2 || created_time_sec > 0}
                                    onChange={(e) => updateChange(config_list, p_index, 'usable_machine_list', index, 'step', e)}
                                    onBlur={(e) => updateBlur(config_list, p_index, 'usable_machine_list', index, 'step', e.target.value)}
                                />
                            )
                        },
                        {
                            title: t('plan.stepRunTime'),
                            dataIndex: 'step_run_time',
                            width: 120,
                            render: (col, item, index) => (
                                <Input
                                    value={col}
                                    disabled={item.machine_status === 2 || created_time_sec > 0}
                                    onChange={(e) => updateChange(config_list, p_index, 'usable_machine_list', index, 'step_run_time', e)}
                                    onBlur={(e) => updateBlur(config_list, p_index, 'usable_machine_list', index, 'step_run_time', e.target.value)}
                                />
                            )
                        },
                        {
                            title: t('plan.maxConcurrency'),
                            dataIndex: 'max_concurrency',
                            width: 120,
                            render: (col, item, index) => (
                                <Input
                                    value={col}
                                    disabled={item.machine_status === 2 || created_time_sec > 0}
                                    onChange={(e) => updateChange(config_list, p_index, 'usable_machine_list', index, 'max_concurrency', e)}
                                    onBlur={(e) => updateBlur(config_list, p_index, 'usable_machine_list', index, 'max_concurrency', e.target.value)}
                                />
                            )
                        },
                        {
                            title: t('plan.duration'),
                            dataIndex: 'duration',
                            width: 120,
                            render: (col, item, index) => (
                                <Input
                                    value={col}
                                    disabled={item.machine_status === 2 || created_time_sec > 0}
                                    onChange={(e) => updateChange(config_list, p_index, 'usable_machine_list', index, 'duration', e)}
                                    onBlur={(e) => updateBlur(config_list, p_index, 'usable_machine_list', index, 'duration', e.target.value)}
                                />
                            )
                        },
                    ];
                }
            }
        }
    }

    
    const editConfig = () => {
        let _config_list = cloneDeep(config_list);
        let latest_data = _config_list[_config_list.length - 1];
        _config_list.push({ ...latest_data, created_time_sec: 0 });
        setConfigList(_config_list);
        setActiveCollapse(_config_list.length - 1);
    }

    
    useEffect(() => {
        if (isArray(change_take_conf)) {
            setConfigList(change_take_conf);
            setActiveCollapse(change_take_conf.length - 1);
        }
    }, [change_take_conf, config_list]);


    return (
        <div className='report-content'>
            <div className='report-content-top'>
                <p className='top-mode'>
                    {t('report.taskType')}: {task_type === 1 ? t('report.taskList.1') : t('report.taskList.2')}
                </p>
                <p className='top-mode'>
                    {t('report.mode')}: {modeList[task_mode]}
                </p>
                <p className='top-mode'>
                    {t('plan.controlMode')}: {control_mode === 0 ? t('plan.controlModeList.0') : t('plan.controlModeList.1')}
                </p>
                <p className='top-mode'>
                    {t('report.dcs')}: {is_open_distributed === 0 ? t('report.no') : t('report.yes')}
                </p>
            </div>
            <div className='report-task-config'>
                <Collapse activeKey={activeCollapse} onChange={(e) => {
                    setActiveCollapse(e === activeCollapse ? '' : e);
                }}>
                    {
                        config_list && config_list.map((item, index) => (
                            <CollapseItem name={index} key={index} header={<div className='config-header' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <p>{`${t('report.config')}${index + 1}`}</p>
                                {
                                    item.created_time_sec > 0 ?
                                        <p>{t('scene.runTime')}: {dayjs(item.created_time_sec * 1000).format('YYYY-MM-DD HH:mm:ss')}</p> :
                                        <Button onClick={updateConfig}>{t('report.configRun')}</Button>
                                }
                            </div>}>
                                {
                                    machine_allot_type !== 1 ? <div className='base-config'>
                                        {
                                            (task_mode === 1 || task_mode === 6) ? <>
                                                {
                                                    config_list[0].duration ? <div className='base-item'>
                                                        <p>{t('plan.duration')}</p>
                                                        <Input
                                                            disabled={item.created_time_sec > 0}
                                                            value={item.duration}
                                                            onChange={(e) => updateChange(config_list, index, 'duration', null, null, e)}
                                                            onBlur={(e) => updateBlur(config_list, index, 'duration', null, null, e.target.value)}
                                                        />
                                                    </div> : <div className='base-item'>
                                                        <p>{t('plan.roundNum')}</p>
                                                        <Input
                                                            disabled={item.created_time_sec > 0}
                                                            value={item.round_num}
                                                            onChange={(e) => updateChange(config_list, index, 'round_num', null, null, e)}
                                                            onBlur={(e) => updateBlur(config_list, index, 'round_num', null, null, e.target.value)}
                                                        />
                                                    </div>
                                                }
                                                <div className='base-item'>
                                                    <p>{t('plan.concurrency')}</p>
                                                    <Input
                                                        disabled={item.created_time_sec > 0}
                                                        value={item.concurrency}
                                                        onChange={(e) => updateChange(config_list, index, 'concurrency', null, null, e)}
                                                        onBlur={(e) => updateBlur(config_list, index, 'concurrency', null, null, e.target.value)}
                                                    />
                                                </div>
                                            </> :
                                                <>
                                                    <div className='base-item'>
                                                        <p>{t('plan.startConcurrency')}</p>
                                                        <Input
                                                            disabled={item.created_time_sec > 0}
                                                            value={item.start_concurrency}
                                                            onChange={(e) => updateChange(config_list, index, 'start_concurrency', null, null, e)}
                                                            onBlur={(e) => updateBlur(config_list, index, 'start_concurrency', null, null, e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='base-item'>
                                                        <p>{t('plan.step')}</p>
                                                        <Input
                                                            disabled={item.created_time_sec > 0}
                                                            value={item.step}
                                                            onChange={(e) => updateChange(config_list, index, 'step', null, null, e)}
                                                            onBlur={(e) => updateBlur(config_list, index, 'step', null, null, e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='base-item'>
                                                        <p>{t('plan.stepRunTime')}</p>
                                                        <Input
                                                            disabled={item.created_time_sec > 0}
                                                            value={item.step_run_time}
                                                            onChange={(e) => updateChange(config_list, index, 'step_run_time', null, null, e)}
                                                            onBlur={(e) => updateBlur(config_list, index, 'step_run_time', null, null, e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='base-item'>
                                                        <p>{t('plan.maxConcurrency')}</p>
                                                        <Input
                                                            disabled={item.created_time_sec > 0}
                                                            value={item.max_concurrency}
                                                            onChange={(e) => updateChange(config_list, index, 'max_concurrency', null, null, e)}
                                                            onBlur={(e) => updateBlur(config_list, index, 'max_concurrency', null, null, e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='base-item'>
                                                        <p>{t('plan.duration')}</p>
                                                        <Input
                                                            disabled={item.created_time_sec > 0}
                                                            value={item.duration}
                                                            onChange={(e) => updateChange(config_list, index, 'duration', null, null, e)}
                                                            onBlur={(e) => updateBlur(config_list, index, 'duration', null, null, e.target.value)}
                                                        />
                                                    </div>
                                                </>
                                        }
                                    </div> : <></>
                                }
                                {
                                    is_open_distributed === 1 ? <div className='senior-config'>
                                        <Table
                                            border={{
                                                wrapper: true,
                                                cell: true,
                                            }}
                                            pagination={false}
                                            columns={getMachineColumn(index, item.created_time_sec)}
                                            data={item.usable_machine_list || []}
                                        />
                                    </div> : <></>
                                }
                            </CollapseItem>
                        ))
                    }
                </Collapse>
                {/* <Button className='update-config-btn' disabled={true} preFix={<SvgAdd />} onClick={editConfig}>{t('btn.updateConfig')}</Button> */}
            </div>
            <div className='report-detail-config'>
                <div className='table-explain'>
                    {
                        explainList.map(item => (
                            <p className='text'>
                                <p className='circle' style={{ marginLeft: 0 }}></p>
                                {item}
                            </p>
                        ))
                    }
                </div>
                <Table
                    style={{ maxWidth: 'calc(100vw - 48px)' }}
                    border={{
                        wrapper: true,
                        cell: true,
                    }}
                    scroll={{
                        x: 1737,
                    }}
                    pagination={false}
                    columns={columns1}
                    data={tableData1} />
            </div>
            <div className='echarts-list'>
                <ReactEcharts className='echarts' option={getOption(t('report.avgList'), avgList, t('report.unitMs'))} />
                <ReactEcharts className='echarts' option={getOption(t('report.qpsNum'), rpsList, t('report.unitNumber'))} />
                <ReactEcharts className='echarts' option={getOption(t('report.concurrency'), concurrencyList, t('report.unitNumber'))} />
                <ReactEcharts className='echarts' option={getOption(t('report.tps'), tpsList, t('report.unitNumber'))} />
                <ReactEcharts className='echarts' option={getOption(t('report.50%List'), fiftyList, t('report.unitMs'))} />
                <ReactEcharts className='echarts' option={getOption(t('report.90%List'), ninetyList, t('report.unitMs'))} />
                <ReactEcharts className='echarts' option={getOption(t('report.95%List'), ninetyFive, t('report.unitMs'))} />
                <ReactEcharts className='echarts' option={getOption(t('report.99%List'), ninetyNine, t('report.unitMs'))} />
            </div>
            <>
                <div className='report-result'>
                    <div className='title'>
                        <p className='line'></p>
                        <p className='label'>{t('report.reportResult')}</p>
                    </div>
                    <div className='content'>
                        {
                            analysis.length > 0 && analysis.map((item, index) => <p className='content-item' key={index}>{item}</p>)
                        }
                    </div>
                </div>
                <div className='report-desc'>
                    <div className='title'>
                        <p className='line'></p>
                        <p className='label'>{t('report.reportDesc')}</p>
                    </div>
                    <div className='content'>
                        <div className='desc'>
                            {description}
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
};

export default ReportContent;