import React, { useEffect, useState } from "react";
import './index.less';
import { useTranslation } from 'react-i18next';
import 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import { useSelector } from 'react-redux';
import dayjs from "dayjs";
import { Tooltip, Table } from '@arco-design/web-react';

const ContrastContent = (props) => {
    const { list1, list2, list3 } = props;

    const { t } = useTranslation();
    const colorList = ['#A84B1F', '#6155BC', '#32AF3F', '#3B7BC6']
    const [column1, setColumn1] = useState(
        [
            {
                title: t('index.sceneName'),
                dataIndex: 'name'
            },
            {
                title: t('index.performer'),
                dataIndex: 'performer'
            },
            {
                title: t('plan.startTaskTime'),
                dataIndex: 'created_time_sec'
            },
            {
                title: t('report.taskType'),
                dataIndex: 'task_type'
            },
            {
                title: t('report.mode'),
                dataIndex: 'mode'
            },
            {
                title: t('plan.startConcurrency'),
                dataIndex: 'start_concurrency'
            },
            {
                title: t('plan.step'),
                dataIndex: 'step'
            },
            {
                title: t('plan.stepRunTime'),
                dataIndex: 'step_run_time'
            },
            {
                title: t('plan.maxConcurrency'),
                dataIndex: 'max_concurrency'
            },
            {
                title: t('plan.duration'),
                dataIndex: 'duration'
            }
        ]
    );

    const [data1, setData1] = useState([]);

    const [avgList, setAvgList] = useState([])
    const [qpsList, setQpsList] = useState([]);
    const [concurrencyList, setConcurrencyList] = useState([]);
    const [errList, setErrList] = useState([]);
    const [fiftyList, setFiftyList] = useState([]);
    const [ninetyList, setNinetyList] = useState([]);
    const [ninetyFive, setNinetyFive] = useState([]);
    const [ninetyNine, setNinetyNine] = useState([]);

    const taskTypeList = {
        1: t('plan.taskList.commonTask'),
        2: t('plan.taskList.cronTask')
    };

    const taskModeList = {
        1: t('plan.modeList.1'),
        2: t('plan.modeList.2'),
        3: t('plan.modeList.3'),
        4: t('plan.modeList.4'),
        5: t('plan.modeList.5'),
        6: t('plan.modeList.6'),
        7: t('plan.modeList.7'),
    }

    useEffect(() => {
        if (list1 && list1.length > 0) {
            const { task_mode } = list1[0];
            let column = [];
            if (task_mode === 1 || task_mode === 6) {
                column = [
                    {
                        title: t('index.sceneName'),
                        dataIndex: 'name'
                    },
                    {
                        title: t('index.performer'),
                        dataIndex: 'performer'
                    },
                    {
                        title: t('plan.startTaskTime'),
                        dataIndex: 'created_time_sec'
                    },
                    {
                        title: t('report.taskType'),
                        dataIndex: 'task_type'
                    },
                    {
                        title: t('report.mode'),
                        dataIndex: 'task_mode'
                    },
                    
                    {
                        title: t('plan.concurrency'),
                        dataIndex: 'concurrency'
                    },
                    task_mode === 1 ? {
                        title: t('plan.duration'),
                        dataIndex: 'duration'
                    } : {
                        title: t('plan.roundNum'),
                        dataIndex: 'round_num'
                    },
                    {
                        title: t('plan.reheatTime'),
                        dataIndex: 'reheat_time'
                    }
                ]
            } else {
                column = [
                    {
                        title: t('index.sceneName'),
                        dataIndex: 'name'
                    },
                    {
                        title: t('index.performer'),
                        dataIndex: 'performer'
                    },
                    {
                        title: t('plan.startTaskTime'),
                        dataIndex: 'created_time_sec'
                    },
                    {
                        title: t('report.taskType'),
                        dataIndex: 'task_type'
                    },
                    {
                        title: t('report.mode'),
                        dataIndex: 'task_mode'
                    },
                    {
                        title: t('plan.startConcurrency'),
                        dataIndex: 'start_concurrency'
                    },
                    {
                        title: t('plan.step'),
                        dataIndex: 'step'
                    },
                    {
                        title: t('plan.stepRunTime'),
                        dataIndex: 'step_run_time'
                    },
                    {
                        title: t('plan.maxConcurrency'),
                        dataIndex: 'max_concurrency'
                    },
                    {
                        title: t('plan.duration'),
                        dataIndex: 'duration'
                    }
                ]
            }

            setColumn1(column);
            setData1(list1.map((item, index) => {
                return {
                    ...item,
                    name: <Tooltip content={item.name}><p style={{ color: colorList[index] }}>{item.name}</p></Tooltip>,
                    performer: <Tooltip content={item.performer}><p>{item.performer}</p></Tooltip>,
                    created_time_sec: <Tooltip content={item.created_time_sec}><p>{item.created_time_sec}</p></Tooltip>,
                    task_type: taskTypeList[item.task_type],
                    task_mode: taskModeList[item.task_mode]
                }
            }))
        }



    }, [list1]);

    useEffect(() => {
        if (list2 && list2.length) {
            setData2(list2);
        }
    }, [list2]);

    useEffect(() => {
        if (list3 && list3.length) {

            list3.forEach(item => {
                let avgList = [];
                let rpsList = [];
                let concurrencyList = [];
                let tpsList = [];
                let fiftyList = [];
                let ninetyList = [];
                let ninetyFive = [];
                let ninetyNine = [];

                Object.values(item.data).forEach(elem => {
                    const { api_name, avg_list, rps_list, tps_list, concurrency_list, error_num_list, fifty_list, ninety_list, ninety_five_list, ninety_nine_list } = elem;

                    avgList.push({
                        api_name,
                        x_data: avg_list ? avg_list.map(elem1 => dayjs(elem1.time_stamp * 1000).format('HH:mm:ss')) : [],
                        y_data: avg_list ? avg_list.map(elem1 => elem1.value) : []
                    })

                    rpsList.push({
                        api_name,
                        x_data: rps_list ? rps_list.map(elem1 => dayjs(elem1.time_stamp * 1000).format('HH:mm:ss')) : [],
                        y_data: rps_list ? rps_list.map(elem1 => elem1.value) : []
                    })

                    concurrencyList.push({
                        api_name,
                        x_data: concurrency_list ? concurrency_list.map(elem1 => dayjs(elem1.time_stamp * 1000).format('HH:mm:ss')) : [],
                        y_data: concurrency_list ? concurrency_list.map(elem1 => elem1.value) : []
                    })

                    tpsList.push({
                        api_name,
                        x_data: tps_list ? tps_list.map(elem1 => dayjs(elem1.time_stamp * 1000).format('HH:mm:ss')) : [],
                        y_data: tps_list ? tps_list.map(elem1 => elem1.value) : []
                    })


                    fiftyList.push({
                        api_name,
                        x_data: fifty_list ? fifty_list.map(elem1 => dayjs(elem1.time_stamp * 1000).format('HH:mm:ss')) : [],
                        y_data: fifty_list ? fifty_list.map(elem1 => elem1.value) : []
                    })

                    ninetyList.push({
                        api_name,
                        x_data: ninety_list ? ninety_list.map(elem1 => dayjs(elem1.time_stamp * 1000).format('HH:mm:ss')) : [],
                        y_data: ninety_list ? ninety_list.map(elem1 => elem1.value) : []
                    })

                    ninetyFive.push({
                        api_name,
                        x_data: ninety_five_list ? ninety_five_list.map(elem1 => dayjs(elem1.time_stamp * 1000).format('HH:mm:ss')) : [],
                        y_data: ninety_five_list ? ninety_five_list.map(elem1 => elem1.value) : []
                    })

                    ninetyNine.push({
                        api_name,
                        x_data: ninety_nine_list ? ninety_nine_list.map(elem1 => dayjs(elem1.time_stamp * 1000).format('HH:mm:ss')) : [],
                        y_data: ninety_nine_list ? ninety_nine_list.map(elem1 => elem1.value) : []
                    })
                })

                item.avg_list = avgList;
                item.rps_list = rpsList;
                item.concurrency_list = concurrencyList;
                item.tps_list = tpsList;
                item.fifty_list = fiftyList;
                item.ninety_list = ninetyList;
                item.ninety_five_list = ninetyFive;
                item.ninety_nine_list = ninetyNine;
            })
            setData3(list3);
        }
    }, [list3]);

    const [column2, setColumn2] = useState([
        {
            title: t('report.apiName'),
            dataIndex: 'api_name',
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
            title: t('report.errRate'),
            dataIndex: 'error_rate',
        },
        {
            title: t('report._tps'),
            dataIndex: 'tps',
        },
        {
            title: t('report.stps'),
            dataIndex: 'stps',
        },
    ]);

    const [data2, setData2] = useState([
        {
            api_name: '汇总',
            total_request_num: 200000,
            total_request_time: 1000,
            max_request_time: 50,
            min_request_time: 50,
            avg_request_time: 50,
            ninety_request_time_line_value: 600,
            ninety_five_request_time_line_value: 900,
            ninety_nine_request_time_line_value: 1200,
            qps: 1000,
            srps: 200,
            error_rate: 0.05,
            received_bytes: 91273,
            send_bytes: 10213
        },
        {
            api_name: '汇总',
            total_request_num: 200000,
            total_request_time: 1000,
            max_request_time: 50,
            min_request_time: 50,
            avg_request_time: 50,
            ninety_request_time_line_value: 600,
            ninety_five_request_time_line_value: 900,
            ninety_nine_request_time_line_value: 1200,
            qps: 1000,
            srps: 200,
            error_rate: 0.05,
            received_bytes: 91273,
            send_bytes: 10213
        }
    ])

    const [data3, setData3] = useState([]);

    useEffect(() => {

    }, []);

    const _colorList = [
        '#FF5959', '#FF9559', '#FFD159', '#8EFF59', '#59FFF5', '#59AFFF', '#5D59FF', '#8E59FF', '#CA59FF', '#FF59DB',
        '#B90000', '#B9A600', '#5CB900', '#00B9AE', '#0098B9', '#0029B9', '#7300B9', '#9F00B9', '#B9006F', '#B94E00',
    ]

    const theme = useSelector((store) => store.user.theme);

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
                trigger: 'axis',
                backgroundColor: theme === 'dark' ? '#1F2023' : '#F8F8F8',
                textStyle: {
                    color: theme === 'dark' ? '#F3F3F3' : '#333333'
                },
                borderColor: theme === 'dark' ? '#27272B' : '#F2F2F2'
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
                name: unit
            },
            dataZoom: { // 放大和缩放
                type: 'inside'
            },
            series: data.length > 0 ? data.map((item, index) => {
                if (index >= (20 + temp * 20)) {
                    temp++;
                }
                return {
                    name: item.api_name,
                    type: 'line',
                    color: _colorList[index - temp * 20],
                    // stack: 'Total',
                    data: item.y_data,
                    showSymbol: false,
                }
            }) : []
        }
        return option;
    };

    useEffect(() => {
        window.addEventListener('wheel', (e) => {
            const echart_title = document.getElementsByClassName('echart-title')[0];
            const echart_container = document.getElementsByClassName('echart-container')[0];
            if (echart_title.getBoundingClientRect().top === 50) {
                echart_title.style.position = 'fixed';
                echart_title.style.top = '50px';
            }
            if (echart_container.getBoundingClientRect().top > 100) {
                echart_title.style.position = 'relative';
                echart_title.style.top = '0';
            }
        })
    }, []);

    let list = [t('report.avgList'), t('report.qpsNum'), t('report.concurrency'), t('report.errNum'), t('report.50%List'), t('report.90%List'), t('report.95%List'), t('report.99%List')];


    const widthList = {
        2: '42vw',
        3: '27vw',
        4: '20vw'
    }

    return (
        <div className="contrast-content">
            <Table
                border={{
                    wrapper: true,
                    cell: true,
                }}
                pagination={false}
                columns={column1} 
                data={data1} 
            />

            {
                data2.map((item, index) => (
                    <div className="table-data">
                        <p className="title" style={{ color: colorList[index] }}>{item.name}</p>
                        <Table 
                            className={`color${index + 1}-${theme}`} 
                            border={{
                                wrapper: true,
                                cell: true,
                            }}
                            pagination={false}
                            columns={column2}
                            data={item.data} 
                        />
                    </div>
                ))
            }

            <div className="echart-list">
                <div className="echart-title">
                    {
                        data3.map((item, index) => (
                            <div className="echart-item" style={{ width: widthList[data3.length] }}>
                                <div className={`title-item item-${index + 1}-${theme}`}>
                                    <p>{item.name}</p>
                                    <p>{item.time}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="echart-container">
                    {
                        data3.map(item => (
                            <div className={`echart-container-${data3.length === 2 ? 'two' : 'item'}`} style={{ width: widthList[data3.length] }}>
                                <ReactEcharts className='echart e1' option={getOption(list[0], item.avg_list, t('report.unitMs'))} />
                                <ReactEcharts className='echart e1' option={getOption(list[1], item.rps_list, t('report.unitNumber'))} />
                                <ReactEcharts className='echart e1' option={getOption(list[2], item.concurrency_list, t('report.unitNumber'))} />
                                <ReactEcharts className='echart e1' option={getOption(list[3], item.tps_list, t('report.unitNumber'))} />
                                <ReactEcharts className='echart e1' option={getOption(list[4], item.fifty_list, t('report.unitMs'))} />
                                <ReactEcharts className='echart e1' option={getOption(list[5], item.ninety_list, t('report.unitMs'))} />
                                <ReactEcharts className='echart e1' option={getOption(list[6], item.ninety_five_list, t('report.unitMs'))} />
                                <ReactEcharts className='echart e1' option={getOption(list[7], item.ninety_nine_list, t('report.unitMs'))} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
};

export default ContrastContent;