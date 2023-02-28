import React, { useState, useEffect } from "react";
import './index.less';
import 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const TeamView = (props) => {
    const { team_list } = props;

    const { t } = useTranslation();

    const [xData, setXData] = useState([]);
    // 自动化执行过的计划
    const [data1, setData1] = useState([]);
    // 自动化总计划
    const [data2, setData2] = useState([]);
    // 性能执行过的计划
    const [data3, setData3] = useState([]);
    // 性能总计划
    const [data4, setData4] = useState([]);


    useEffect(() => {
        if (team_list.length > 0) {
            let xData = [];
            let arr1 = [];
            let arr2 = [];
            let arr3 = [];
            let arr4 = [];
            let _team_list = [];
            _team_list = team_list.filter(item => item.auto_plan_exec_num || item.auto_plan_total_num || item.stress_plan_exec_num || item.stress_plan_total_num);

            _team_list.forEach(item => {
                const { auto_plan_exec_num, auto_plan_total_num, stress_plan_exec_num, stress_plan_total_num, team_name } = item;
                arr1.push(auto_plan_exec_num);
                arr2.push(auto_plan_total_num - auto_plan_exec_num);
                arr3.push(stress_plan_exec_num);
                arr4.push(stress_plan_total_num - stress_plan_exec_num);
                xData.push(team_name);
            })

            setXData(xData);
            setData1(arr1);
            setData2(arr2);
            setData3(arr3);
            setData4(arr4);
        }
    }, [team_list]);


    const theme = useSelector((store) => store.user.theme);

    var emphasisStyle = {
        itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
        }
    };

    const getOption = () => {
        return {
            legend: {
                data: [t('home.autoRun'), t('home.autoNotRun'), t('home.stressRun'), t('home.stressNotRun')],
                left: '10%',
                textStyle: {
                    color: theme === 'dark' ? '#F3F3F3' : '#333333'
                }
            },
            tooltip: {
                appendToBody: true,
                backgroundColor: theme === 'dark' ? '#1F2023' : '#F8F8F8',
                textStyle: {
                    color: theme === 'dark' ? '#F3F3F3' : '#333333'
                },
                borderColor: theme === 'dark' ? '#27272B' : '#F2F2F2'
            },
            grid: { 
                bottom: 20,
                containLabel: true
            },
            xAxis: {
                data: xData,
                // name: 'XAxis',
                axisLine: { onZero: true },
                splitLine: { show: false },
                splitArea: { show: false },
                axisLabel: {
                    // rotate: 30,
                    formatter: function (value, index) {
                        if (`${value}`.length > 6) {
                            return `${value}`.substr(0, 6) + '...'
                        } else {
                            return value
                        }
                    },
                    color: theme === 'dark' ? '#666' : '#999'
                },
                axisLine: {
                    lineStyle: {
                        color: theme === 'dark' ? '#26263C' : '#E9E9E9'
                    }
                },
            },
            yAxis: {
                splitLine: {
                    lineStyle: {
                        color: theme === 'dark' ? '#26263C' : '#E9E9E9'
                    }
                }
            },
            series: [
                {
                    name: t('home.autoRun'),
                    type: 'bar',
                    stack: 'one',
                    emphasis: emphasisStyle,
                    data: data1,
                    color: '#86B4FF',
                },
                {
                    name: t('home.autoNotRun'),
                    type: 'bar',
                    stack: 'one',
                    emphasis: emphasisStyle,
                    data: data2,
                    color: '#034FC9'
                },
                {
                    name: t('home.stressRun'),
                    type: 'bar',
                    stack: 'two',
                    emphasis: emphasisStyle,
                    data: data3,
                    color: '#FFBDA8'
                },
                {
                    name: t('home.stressNotRun'),
                    type: 'bar',
                    stack: 'two',
                    emphasis: emphasisStyle,
                    data: data4,
                    color: '#EC663C'
                }
            ],
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 40
                }
            ]
        };
    }
return (
    <div className="team-view">
        <p className="title">{t('home.teamView')}</p>
        <ReactEcharts className='echart' option={getOption()} />
    </div>
)
};

export default TeamView;