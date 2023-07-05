import React, { useEffect, useState } from 'react';
import './index.less';
import ReportHeader from '../reportHeader';
import ReportExecutor from '../reportExecutor';
import ReportDetail from '../reportDetail';
import { Tabs as TabList } from 'adesign-react';
import { TabStyle } from './style';
import { fetchReportInfo } from '@services/report';
import { useParams, useMatch, useLocation } from 'react-router-dom';
import qs from 'qs';
import Bus from '@utils/eventBus';
import { useSelector, useDispatch } from 'react-redux';

const { Tabs, TabPan } = TabList;

let report_info_t = null;

const ReportContent = () => {
    // const { id: report_id } = useParams();
    const { search } = useLocation();
    const { id: report_id, contrast } = qs.parse(search.slice(1));
    const dispatch = useDispatch();
    // 计划名称
    const [headerData, setHeaderData] = useState({});
    // 头像 昵称 创建时间
    const [infoData, setInfoData] = useState({});
    const [createTime, setCreateTime] = useState(0);
    // 任务类型 模式 config
    const [configData, setConfigData] = useState({});
    const [stopDebug, setStopDebug] = useState('stop');
    const [reportStatus, setReportStatus] = useState(1);
    const [runTime, setRunTime] = useState(0);
    const [planId, setPlanId] = useState('');
    const select_plan = useSelector((store) => (store.plan.select_plan));
    const report_info = useSelector((store) => store.report.report_info);


    useEffect(() => {
        if (report_id) {
            getReportInfo();
            report_info_t = setInterval(getReportInfo, 3000);

            let setIntervalList = window.setIntervalList;
            if (setIntervalList) {
                setIntervalList.push(report_info_t);
            } else {
                setIntervalList = [report_info_t];
            }
            window.setIntervalList = setIntervalList;

        }

        return () => {
            dispatch({
                type: 'report/updateDebugList',
                payload: null
            })
            dispatch({
                type: 'report/updateMonitorList',
                payload: null
            })
            dispatch({
                type: 'report/updateReportDetail',
                payload: null
            })
            dispatch({
                type: 'report/updateReportInfo',
                payload: null
            })
            let setIntervalList = window.setIntervalList;
            if (setIntervalList) {
                let _index = setIntervalList.findIndex(item => item === report_info_t);
                setIntervalList.splice(_index, 1);
                window.setIntervalList = setIntervalList;
            }

            clearInterval(report_info_t);
        }
    }, []);

    useEffect(() => {
        if (!report_id) {
            getReportInfo();
        }
    }, [select_plan]);

    useEffect(() => {
        if (report_info) {
            const { report: { plan_name, report_name, plan_id, task_mode, control_mode, task_type, mode_conf, user_name, user_avatar, created_time_sec, task_status, scene_name, change_take_conf, is_open_distributed, machine_allot_type } } = report_info;
            setPlanId(plan_id);
            setCreateTime(created_time_sec);
            setHeaderData({
                plan_name,
                scene_name,
                report_name
            })
            setInfoData({
                user_avatar,
                user_name,
                created_time_sec,
            });
            setConfigData({
                task_mode,
                task_type,
                mode_conf,
                plan_id,
                control_mode,
                change_take_conf,
                is_open_distributed,
                machine_allot_type
            });
            setReportStatus(task_status);
            if (task_status === 2) {
                let setIntervalList = window.setIntervalList;
                if (setIntervalList) {
                    let _index = setIntervalList.findIndex(item => item === report_info_t);
                    setIntervalList.splice(_index, 1);
                    window.setIntervalList = setIntervalList;
                }

                clearInterval(report_info_t);
            }
        }
    }, [report_info]);

    const getReportInfo = () => {
        const query = {
            report_id: report_id ? report_id : JSON.parse(contrast)[select_plan].report_id,
            team_id: localStorage.getItem('team_id'),
        };
        
        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "stress_report_task_detail",
            param: JSON.stringify(query)
        }))
    }


    const defaultList1 = contrast ? JSON.parse(contrast).map((item, index) => {
        return {
            id: index,
            title: `${item.plan_name}/${item.scene_name}`,
            content: ''
        }
    }) : '';

    return (
        <div className='report-detail'>
            {
                report_id ?
                    <>
                        <ReportHeader data={headerData} status={reportStatus} plan_id={planId} />
                        <ReportExecutor data={infoData} status={reportStatus} runTime={runTime} plan_id={planId} onStop={(e) => setStopDebug(e)} />

                        <ReportDetail onRunTime={(e) => setRunTime(e)} data={configData} stopDebug={stopDebug} status={reportStatus} plan_id={planId} create_time={createTime} />
                    </>
                    : <Tabs defaultActiveId={0} onChange={(e) => dispatch({
                        type: 'plan/updateSelectPlan',
                        payload: e
                    })}>
                        {defaultList1.map((d) => (
                            <TabPan key={d.id} id={d.id} title={d.title} >
                                {/* {d.content} */}
                                <ReportHeader data={headerData} status={reportStatus} />
                                <ReportExecutor data={infoData} status={reportStatus} runTime={runTime} plan_id={planId} onStop={(e) => setStopDebug(e)} />

                                <ReportDetail onRunTime={(e) => setRunTime(e)} data={configData} stopDebug={stopDebug} status={reportStatus} plan_id={planId} />
                            </TabPan>
                        ))}
                    </Tabs>
            }

        </div>
    )
};

export default ReportContent;