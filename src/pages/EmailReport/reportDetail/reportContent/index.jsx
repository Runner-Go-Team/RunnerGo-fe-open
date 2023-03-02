import React, { useEffect, useState } from 'react';
import './index.less';
// import {  } from 'adesign-react';
import 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Table, Tooltip } from '@arco-design/web-react';


const ReportContent = (props) => {
    const { data: datas, config: { task_mode, task_type, mode_conf, change_take_conf }, status, plan_id, analysis, description } = props;
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

    useEffect(() => {
        if (mode_conf) {
            const {
                concurrency,
                duration,
                max_concurrency,
                reheat_time,
                round_num,
                start_concurrency,
                step,
                step_run_time,
                threshold_value
            } = mode_conf;
            setConfigData([{ concurrency, duration, max_concurrency, reheat_time, round_num, start_concurrency, step, step_run_time }]);
            let _columns = [];
            if (task_mode === 1) {
                _columns = [
                    duration ?
                        {
                            title: t('plan.duration'),
                            dataIndex: 'duration',
                        } :
                        {
                            title: t('plan.roundNum'),
                            dataIndex: 'round_num',
                        },
                    {
                        title: t('plan.concurrency'),
                        dataIndex: 'concurrency',
                    },
                ];
            } else {
                _columns = [
                    {
                        title: t('plan.startConcurrency'),
                        dataIndex: 'start_concurrency',
                    },
                    {
                        title: t('plan.step'),
                        dataIndex: 'step',
                    },
                    {
                        title: t('plan.stepRunTime'),
                        dataIndex: 'step_run_time',
                    },
                    {
                        title: t('plan.maxConcurrency'),
                        dataIndex: 'max_concurrency',
                    },
                    {
                        title: t('plan.duration'),
                        dataIndex: 'duration'
                    }
                ];
            };
            setConfigColumn(_columns);
        }

    }, [mode_conf]);

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

    return (
        <div className='report-content'>
            <div className='report-content-top'>
                <div className='top-type'>
                    <span>{t('report.taskType')}: {task_type === 1 ? t('plan.taskList.commonTask') : t('plan.taskList.cronTask')}</span>
                    {/* <span>分布式: 是</span> */}
                </div>
                <div className='top-mode'>
                    <span>{t('report.mode')}: {modeList[task_mode]}</span>
                </div>
            </div>
            <Table
                style={{ width: '100%', marginTop: '32px' }}
                border={{
                    wrapper: true,
                    cell: true,
                }}
                pagination={false}
                columns={configColumn}
                data={configData}
            />
            <Table
                style={{ marginTop: '32px' }}
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