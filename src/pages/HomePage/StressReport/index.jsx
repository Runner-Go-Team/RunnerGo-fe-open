import React, { useState, useEffect } from "react";
import './index.less';
import 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import { useSelector } from 'react-redux';
import { Tooltip } from 'adesign-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const StressReport = (props) => {
    const { data } = props;

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [planNum, setPlanNum] = useState(0);
    const [reportNum, setReportNum] = useState(0);
    const [apiNum, setApiNum] = useState(0);
    const [sceneNum, setSceneNum] = useState(0);
    const [citeApi, setCiteApi] = useState(0);
    const [citeScene, setCiteScene] = useState(0);
    const [normalPlan, setNormalPlan] = useState(0);
    const [timedPlan, setTimedPlan] = useState(0);
    const [apiTotal, setApiTotal] = useState(0);
    const [sceneTotal, setSceneTotal] = useState(0);
    const [reportList, setReportList] = useState([]);

    useEffect(() => {
        if (Object.entries(data || {}).length > 0) {
            const {
                plan_num,
                report_num,
                api_num,
                scene_num,

                cite_api_num,
                cite_scene_num,

                lately_report_list,
                normal_plan_num,
                timed_plan_num,

                total_api_num,
                total_scene_num
            } = data;

            setPlanNum(plan_num);
            setReportNum(report_num);
            setApiNum(api_num);
            setSceneNum(scene_num);
            setCiteApi(cite_api_num);
            setCiteScene(cite_scene_num);
            setReportList(lately_report_list);
            setNormalPlan(normal_plan_num);
            setTimedPlan(timed_plan_num);
            setApiTotal(total_api_num);
            setSceneTotal(total_scene_num);
        }
    }, [data]);

    const theme = useSelector((store) => store.user.theme);
    const stressData = [
        {
            number: 20,
            text: '计划数',
            color: '#00ACD7'
        },
        {
            number: 61,
            text: '报告数',
            color: '#35CAAF'
        },
        {
            number: 80,
            text: '接口数',
            color: '#FF7043'
        },
        {
            number: 39,
            text: '场景数',
            color: '#FFB443'
        }
    ]

    const getOption = (color, citeNum, totalNum) => {
        return {
            angleAxis: {
                max: 100,
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false
                },
            },
            radiusAxis: {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            },
            polar: {},
            series: [
                {
                    type: 'bar',
                    data: [0, 100],
                    coordinateSystem: 'polar',
                    itemStyle: {
                        color: color[0]
                    }
                },
                {
                    type: 'bar',
                    data: [(citeNum / totalNum) * 100, 0],
                    coordinateSystem: 'polar',
                    name: 'Without Round Cap',
                    itemStyle: {
                        color: color[1]
                    }
                },
            ],
        };
    }

    const getOption1 = () => {
        return {
            tooltip: {
                trigger: 'item',
                backgroundColor: theme === 'dark' ? '#1F2023' : '#F8F8F8',
                textStyle: {
                    color: theme === 'dark' ? '#F3F3F3' : '#333333'
                },
                borderColor: theme === 'dark' ? '#27272B' : '#F2F2F2',
                // formatter: (value, index) => {
                //     return `${value.value}%`;
                // }
            },
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { value: normalPlan, name: t('home.normalPlan') },
                        { value: timedPlan, name: t('home.timedPlan') },
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: theme === 'dark' ? '#F3F3F3' : '#333333'
                            }
                        }
                    }
                }
            ]
        };
    };

    const taskList = {
        '0': '-',
        '1': t('plan.taskList.commonTask'),
        '2': t('plan.taskList.cronTask'),
        '3': t('plan.taskList.mixTask')
    };

    const statusList = {
        '1': t('report.statusList.1'),
        '2': t('report.statusList.2'),
    };

    const toReportDetail = (info) => {
        const { report_id } = info;
        navigate(`/report/detail?id=${report_id}`);
    }

    return (
        <div className="stress-report">
            <p className="title">{t('home.stressTest')}</p>

            <div className="overview">
                <div className="overview-left">
                    <div className="data-list">
                        <div className="data-item" style={{ color: "#00ACD7" }}>
                            <p>{planNum}</p>
                            <p>{t('home.planNum')}</p>
                        </div>
                        <div className="data-item" style={{ color: "#35CAAF" }}>
                            <p>{reportNum}</p>
                            <p>{t('home.reportNum')}</p>
                        </div>
                        <div className="data-item" style={{ color: "#FF7043" }}>
                            <p>{apiNum}</p>
                            <p>{t('home.apiNum')}</p>
                        </div>
                        <div className="data-item" style={{ color: "#FFB443", marginRight: '60px' }}>
                            <p>{sceneNum}</p>
                            <p>{t('home.sceneNum')}</p>
                        </div>
                    </div>

                    <div className="echart-list">
                        <div className="echart-list-item">
                            <ReactEcharts className='echart' option={getOption(["#FF6F07", "#35AEF2"], citeApi, apiTotal)} />
                            <div className="label">
                                <p>{t('home.citeApiNum')}</p>
                                <p>{citeApi} / {apiTotal}</p>
                            </div>
                        </div>
                        <div className="echart-list-item">
                            <ReactEcharts className='echart' option={getOption(["#3907FF", "#21B3D3"], citeScene, sceneTotal)} />
                            <div className="label">
                                <p>{t('home.citeSceneNum')}</p>
                                <p>{citeScene} / {sceneTotal}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overview-right">
                    <ReactEcharts className='echart' option={getOption1()} />
                </div>
            </div>

            <div className="list">
                <p className="title">{t('home.lastReport')}</p>

                <div className="list-content">
                    {
                        reportList.map(item => (
                            <div className="list-item" onDoubleClick={() => toReportDetail(item)}>
                                <div className="item-content">
                                    <p>{t('home.rankId')}</p>
                                    <p>{item.rank_id}</p>
                                </div>
                                <div className="item-content">
                                    <p>{t('home.planName')}</p>
                                    <Tooltip content={item.plan_name}>
                                        <p className="hide-text">{item.plan_name}</p>
                                    </Tooltip>
                                </div>
                                <div className="item-content">
                                    <p>{t('home.taskMode')}</p>
                                    <p>{taskList[item.task_type]}</p>
                                </div>
                                <div className="item-content">
                                    <p>{t('home.runUser')}</p>
                                    <Tooltip content={item.run_user_name}>
                                        <p className="hide-text">{item.run_user_name}</p>
                                    </Tooltip>
                                </div>
                                <div className="item-content">
                                    <p>{t('home.status')}</p>
                                    <p className={ item.status === 1 ? 'status' : '' }>{statusList[item.status]}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
};

export default StressReport;