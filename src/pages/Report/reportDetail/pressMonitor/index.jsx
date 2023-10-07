import React, { useEffect, useState } from 'react';
import './index.less';
import 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import { useParams, useLocation } from 'react-router-dom';
import { fetchMachine } from '@services/report';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import qs from 'qs';
import Bus from '@utils/eventBus';
import { useTranslation } from 'react-i18next';
import { Explain as SvgExplain } from 'adesign-react/icons';

let press_monitor_t = null;

const PressMonitor = (props) => {
    const { status, tab } = props;
    console.log(status, tab);

    let base = +new Date(1988, 9, 3);
    let oneDay = 24 * 3600 * 1000;
    let _data = [[base, Math.random() * 300]];
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [metrics, setMetrics] = useState([]);
    // const { id: report_id } = useParams();
    const { search } = useLocation();
    const { id: report_id, contrast } = qs.parse(search.slice(1));
    const { t } = useTranslation();

    const theme = useSelector((store) => store.user.theme);
    const select_plan = useSelector((store) => (store.plan.select_plan));
    const monitor_list = useSelector((store) => store.report.monitor_list);

    useEffect(() => {
        let setIntervalList = window.setIntervalList;

        if (report_id) {
            getMonitorData();

            if (status === 2) {
                if (setIntervalList) {
                    let _index = setIntervalList.findIndex(item => item === press_monitor_t);
                    setIntervalList.splice(_index, 1);
                    window.setIntervalList = setIntervalList;
                }

                clearInterval(press_monitor_t);
            } else {
                press_monitor_t = setInterval(getMonitorData, 3000);

                if (setIntervalList) {
                    setIntervalList.push(press_monitor_t);
                } else {
                    setIntervalList = [press_monitor_t];
                }
                window.setIntervalList = setIntervalList;
            }
        }

        return () => {
            if (setIntervalList) {
                let _index = setIntervalList.findIndex(item => item === press_monitor_t);
                setIntervalList.splice(_index, 1);
                window.setIntervalList = setIntervalList;
            }

            clearInterval(press_monitor_t);

        }
    }, [status, tab]);

    useEffect(() => {
        if (!report_id) {
            getMonitorData();
        }
    }, [select_plan]);

    useEffect(() => {
        if (monitor_list) {
            const { start_time_sec, end_time_sec, metrics } = monitor_list;
            setStartTime(start_time_sec);
            setEndTime(end_time_sec);
            setMetrics(metrics ? metrics : []);
        }
    }, [monitor_list]);

    const getMonitorData = () => {
        const query = {
            team_id: sessionStorage.getItem('team_id'),
            report_id: report_id ? report_id : JSON.parse(contrast)[select_plan].report_id,
        };
        
        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "stress_report_machine_monitor",
            param: JSON.stringify(query)
        }))
    }


    let getOption = (name, data) => {
        // let x_data = [];
        // let y_data = [];
        let percentArr = ['cpu', 'disk_io', 'mem'];
        data.forEach(item => {
            if (`${item[0]}`.length === 10) {
                item[0] = item[0] * 1000;
            }
        })
        let option = {
            title: {
                text: percentArr.includes(name) ? `${name}（%）` : `${name}（kb）`,
                left: 'center',
                textStyle: {
                    color: theme === 'dark' ? '#fff' : '#000',
                    fontSize: 14
                },
            },
            tooltip: {
                trigger: 'axis',
                appendToBody: true,
                confine: true,
                position: function (pt) {
                    return [pt[0], '10%'];
                },
                // formatter: (value, index) => {
                //     if (percentArr.includes(name)) {
                //         return `${value[0].value[1]}%`;
                //     } else {
                //         return value[0].value[1];
                //     }
                    
                // }
            },
            xAxis: {
                type: 'time',
                boundaryGap: false,
                axisLabel: {
                    color: theme === 'dark' ? '#fff' : '#000',
                },
                axisLabel: {
                    formatter: function (val) {
                        return dayjs(val).format('HH:mm')
                    },
                    rotate: 30
                }
                // axisTick: {
                //     length: 1,
                //     lineStyle: {
                //       type: 'dashed'
                //       // ...
                //     }
                // },
                // axisLabel: {
                //     //  X 坐标轴标签相关设置，写在xAxis里面
                //     interval: 0,//全部标签显示
                //     rotate: '45'//标签倾斜度数
                //   }
                // data: x_data,
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                axisLabel: {
                    color: theme === 'dark' ? '#fff' : '#000',
                    formatter: function (value, index) {
                        if (`${value}`.length > 4) {
                            return `${value}`.substr(0, 3) + '...'
                        } else {
                            return value
                        }
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: theme === 'dark' ? '#39393D' : '#E9E9E9'
                    }
                }
            },
            // dataZoom: [
            //     {
            //         type: 'inside',
            //         start: 0,
            //         end: 20
            //     },
            //     {
            //         start: 0,
            //         end: 20
            //     }
            // ],
            series: name === 'net_io' ? 
            [
                {
                    name: "net_out",
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    areaStyle: {},
                    data: data.map(item => {
                        return [item[0], item[2]]
                    }),
                },
                {
                    name: "net_in",
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    areaStyle: {},
                    data: data.map(item => {
                        return [item[0], item[3]]
                    }),
                }
            ] : 
            [
                {
                    name,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    areaStyle: {},
                    data,
                }
            ]
        };

        return option;
    }

    return (
        <div className='press-monitor'>
            <div className='monitor-tips'>
                <SvgExplain />
                <p>{t('report.pressMonitorTips')}</p>
            </div>
            {
                metrics.map(item => (
                    <div className='machine-info'>
                        <p className='info-title'>
                            <p className='machine-name'>{ item.machine_name }</p>
                            <p className='concurrency'>{ `${t('report.concurrency')}: ${item.concurrency}`}</p>
                        </p>
                        <p className='info-content'>
                            <p className='region'>{ item.region }</p>
                            <p className='ip'>IP: { item.ip }</p>
                        </p>
                        <div className='monitor-list'>
                            <ReactEcharts className='echarts-monitor' option={getOption('cpu', item.cpu)} />
                            <ReactEcharts className='echarts-monitor' option={getOption('disk_io', item.disk_io)} />
                            <ReactEcharts className='echarts-monitor' option={getOption('mem', item.mem)} />
                            <ReactEcharts className='echarts-monitor' option={getOption('net_io', item.net_io)} />
                        </div>
                    </div>
                ))
            }
        </div>
    )
};

export default PressMonitor;