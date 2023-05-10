import React, { useState, useEffect } from "react";
import './index.less';
import 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const DataView = (props) => {
    const { team_name, api_manage, scene_manage } = props;

    const { t } = useTranslation();

    // api总数
    const [apiTotal, setApiTotal] = useState(0);
    // api引用数
    const [apiCite, setApiCite] = useState(0);
    // 折线图x轴
    const [xData, setXData] = useState([]);
    // api新增数
    const [apiAdd, setApiAdd] = useState([]);
    // api调试数
    const [apiDebug, setApiDebug] = useState([]);

    // 场景总数
    const [sceneTotal, setSceneTotal] = useState(0);
    // 场景引用数
    const [sceneCite, setSceneCite] = useState(0);
    // 场景新增数
    const [sceneAdd, setSceneAdd] = useState([]);
    // 场景调试数
    const [sceneDebug, setSceneDebug] = useState([]);

    const [showText, setShowText] = useState(true);

    useEffect(() => {
        if (Object.entries(api_manage || {}).length > 0) {
            const { api_total_count, api_cite_count, api_add_count, api_debug } = api_manage;
            setApiTotal(api_total_count);
            setApiCite(api_cite_count);
            setXData(Object.keys(api_add_count));
            setApiAdd(Object.values(api_add_count));
            setApiDebug(Object.values(api_debug));
        }
    }, [api_manage]);

    useEffect(() => {
        if (Object.entries(scene_manage || {}).length > 0) {
            const { scene_add_count, scene_cite_count, scene_debug_count, scene_total_count } = scene_manage;
            setSceneAdd(Object.values(scene_add_count));
            setSceneDebug(Object.values(scene_debug_count));
            setSceneTotal(scene_total_count);
            setSceneCite(scene_cite_count);
        }
    }, [scene_manage]);

    useEffect(() => {
        if (document.body.clientWidth < 1920) {
            setShowText(false);
        } else {
            setShowText(true);
        }
        window.addEventListener('resize', () => {
            if (document.body.clientWidth < 1920) {
                setShowText(false);
            } else {
                setShowText(true);
            }
        });
    }, []);

    const theme = useSelector((store) => store.user.theme);


    const getOption = (type, number, showText) => {
        const text = type === 'api' ? t('home.totalApi') : t('home.totalScene');
        return {
            tooltip: {
                trigger: 'item',
                appendToBody: true,
                backgroundColor: theme === 'dark' ? '#1F2023' : '#F8F8F8',
                textStyle: {
                    color: theme === 'dark' ? '#F3F3F3' : '#333333'
                },
                borderColor: theme === 'dark' ? '#27272B' : '#F2F2F2'
            },
            graphic: [{
                type: 'text',
                // left: '35%',
                // top: '43%',
                left: showText ? '35%' : '47%',
                top: showText ? '43%' : '45%',
                style: {
                    text: showText ? `${text}\n${number}` : `${number}`,
                    textAlign: 'center',
                    fill: theme === 'dark' ? '#fff' : '#000',
                    fontSize: 12,
                }
            }],
            series: [
                {
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    labelLine: {
                        show: false
                    },
                    data: type === 'api' ? [
                        { value: apiCite, name: t('home.citeApi') },
                        { value: apiTotal - apiCite, name: t('home.notCiteApi') },
                    ] : [
                        { value: sceneCite, name: t('home.citeScene') },
                        { value: sceneTotal - sceneCite, name: t('home.notCiteScene') },
                    ]
                }
            ]
        };
    };

    const getOption1 = (data1, data2) => {
        return {
            title: {
                text: t('home.lastSeven'),
                textStyle: {
                    color: theme === 'dark' ? '#F3F3F3' : '#333333',
                    fontSize: 14,
                    lineHeight: 40
                }
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
                bottom: 0,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData,
                axisLabel: {
                    rotate: 30
                }
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        color: theme === 'dark' ? '#39393D' : '#E9E9E9'
                    }
                }
            },
            series: [
                {
                    name: t('home.addNum'),
                    type: 'line',
                    stack: 'Total',
                    data: data1,
                    color: '#4CCB7E'
                },
                {
                    name: t('home.debugNum'),
                    type: 'line',
                    stack: 'Total',
                    data: data2,
                    color: '#4052EC'
                },
            ]
        };
    }

    return (
        <div className="data-view">
            <p className="title">{team_name}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="data-view-left">
                    <div className="echart-item">
                        <p className="label">{ t('home.apiManage') }</p>
                        <ReactEcharts className='echart' option={getOption('api', apiTotal, showText)} />
                    </div>
                    <div className="echart-item">
                        <p className="label">{ t('home.sceneManage') }</p>
                        <ReactEcharts className='echart' option={getOption('scene', sceneTotal, showText)} />
                    </div>
                </div>
                <div className="data-view-right">
                    <ReactEcharts className='echart' option={getOption1(apiAdd, apiDebug)} />
                    <ReactEcharts className='echart' option={getOption1(sceneAdd, sceneDebug)} />
                </div>
            </div>
        </div>
    )
};

export default DataView;