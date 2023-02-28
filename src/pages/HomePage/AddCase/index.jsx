import React, { useState, useEffect } from "react";
import './index.less';
import 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const AddCase = (props) => {
    const { case_manage } = props;

    const { t } = useTranslation();

    const [xData, setXData] = useState([]);
    const [caseAdd, setCaseAdd] = useState([]);

    const theme = useSelector((store) => store.user.theme);

    useEffect(() => {
        if (Object.entries(case_manage || {}).length > 0) {
            setXData(Object.keys(case_manage));
            setCaseAdd(Object.values(case_manage));
        }
    }, [case_manage]);

    const getOption = () => {
        return {
            xAxis: {
                type: 'category',
                data: xData,
                axisLabel: {
                    rotate: 30,
                    color: theme === 'dark' ? '#666' : '#999'
                },
                axisLine: {
                    lineStyle: {
                        color: theme === 'dark' ? '#26263C' : '#E9E9E9'
                    }
                },
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        color: theme === 'dark' ? '#26263C' : '#E9E9E9'
                    }
                }
            },
            grid: { 
                bottom: 20,
                containLabel: true
            },
            series: [
                {
                    data: caseAdd,
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: "#4052EC",
                            label: {
                                show: true,
                                color: theme === 'dark' ? '#F3F3F3' : '#333333',
                                position: 'top',
                            }
                        },
                    }
                }
            ]
        };
    }

    return (
        <div className="add-case">
            <p className="title">{ t('home.lastSevenAddCase') }</p>

            <ReactEcharts className='echart' option={getOption()} />
        </div>
    )
};

export default AddCase;