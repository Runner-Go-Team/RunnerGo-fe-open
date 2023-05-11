import React, { useState, useEffect } from "react";
import './index.less';
import 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import { useSelector } from 'react-redux';
import { Tooltip } from 'adesign-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const AutoReport = (props) => {
    const { data } = props;

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [planNum, setPlanNum] = useState(0);
    const [reportNum, setReportNum] = useState(0);
    const [caseNum, setCaseNum] = useState(0);
    const [caseExecNum, setCaseExecNum] = useState(0);
    const [casePassNum, setCasePassNum] = useState(0);

    const [apiTotal, setApiTotal] = useState(0);
    const [sceneTotal, setSceneTotal] = useState(0);
    const [citeApi, setCiteApi] = useState(0);
    const [citeScene, setCiteScene] = useState(0);

    const [casePassPercent, setCasePassPercent] = useState(0);
    const [caseNotPassPercent, setCaseNotPassPercent] = useState(0);

    const [reportList, setReportList] = useState([]);


    useEffect(() => {
        if (Object.entries(data || {}).length > 0) {
            const {
                plan_num,
                report_num,
                case_total_num,
                case_exec_num,
                case_pass_num,

                total_api_num,
                total_scene_num,
                cite_api_num,
                cite_scene_num,

                case_pass_percent,
                case_not_test_and_pass_percent,
                lately_report_list
            } = data;
            setPlanNum(plan_num);
            setReportNum(report_num);
            setCaseNum(case_total_num);
            setCaseExecNum(case_exec_num);
            setCasePassNum(case_pass_num);

            setApiTotal(total_api_num);
            setSceneTotal(total_scene_num);
            setCiteApi(cite_api_num);
            setCiteScene(cite_scene_num);

            setCasePassPercent(case_pass_percent);
            setCaseNotPassPercent(case_not_test_and_pass_percent);

            setReportList(lately_report_list);
        }
    }, [data]);

    const theme = useSelector((store) => store.user.theme);

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
                borderColor: theme === 'dark' ? '#27272B' : '#F2F2F2'
            },
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { value: casePassPercent, name: t('home.passRate') },
                        { value: caseNotPassPercent, name: t('home.notPassRate') },
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
        navigate(`/Treport/detail/${report_id}`)
    };


    return (
        <div className="auto-report">
            <p className="title">{t('home.autoTest')}</p>

            <div className="overview">
                <div className="overview-left">
                    <div className="data-list">
                        {/* {
                            autoData.map((item, index) => (
                                <div className="data-item" style={{ color: item.color, marginRight: index === autoData.length - 1 ? '0' : '40px' }}>
                                    <p>{ item.number }</p>
                                    <p>{ item.text }</p>
                                </div>
                            ))
                        } */}
                        <div className="data-item" style={{ color: "#00ACD7" }}>
                            <p>{planNum}</p>
                            <p>{t('home.planNum')}</p>
                        </div>
                        <div className="data-item" style={{ color: "#35CAAF" }}>
                            <p>{reportNum}</p>
                            <p>{t('home.reportNum')}</p>
                        </div>
                        <div className="data-item" style={{ color: "#FF7043" }}>
                            <p>{caseNum}</p>
                            <p>{t('home.caseNum')}</p>
                        </div>
                        <div className="data-item" style={{ color: "#FFB443" }}>
                            <p>{caseExecNum}</p>
                            <p>{t('home.execCaseNum')}</p>
                        </div>
                        <div className="data-item" style={{ color: "#AC43FF", marginRight: "40px" }}>
                            <p>{casePassNum}</p>
                            <p>{t('home.passCase')}</p>
                        </div>
                    </div>

                    <div className="echart-list">
                        <div className="echart-list-item">
                            <ReactEcharts className='echart' option={getOption(["#FFC107", "#355EF2"], citeApi, apiTotal)} />
                            <div className="label">
                                <p>{t('home.citeApiNum')}</p>
                                <p>{citeApi}/{apiTotal}</p>
                            </div>
                        </div>
                        <div className="echart-list-item">
                            <ReactEcharts className='echart' option={getOption(["#9207FF", "#21D393"], citeScene, sceneTotal)} />
                            <div className="label">
                                <p>{t('home.citeSceneNum')}</p>
                                <p>{citeScene}/{sceneTotal}</p>
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

export default AutoReport;