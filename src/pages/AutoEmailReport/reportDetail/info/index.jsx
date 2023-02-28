import React, { useState, useEffect } from "react";
import './index.less';
import SvgScene from '@assets/treport/scene';
import SvgCase from '@assets/treport/case';
import SvgApi from '@assets/treport/api';
import SvgAssert from '@assets/treport/assert';
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';

const TReportDetailInfo = (props) => {
    const {
        info
    } = props;

    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [runTime, setRunTime] = useState(0);
    const [taskMode, setTaskMode] = useState(1);
    const [testOrder, setTestOrder] = useState(1);
    const [sceneOrder, setSceneOrder] = useState(1);
    const [sceneInfo, setSceneInfo] = useState(null);
    const [caseInfo, setCaseInfo] = useState(null);
    const [apiInfo, setApiInfo] = useState(null);
    const [assertInfo, setAssertInfo] = useState(null);

    useEffect(() => {
        if (Object.entries(info || {}).length > 0) {
            const {
                report_start_time,
                report_end_time,
                report_run_time,
                task_mode,
                test_case_run_order,
                scene_run_order,
                scene_base_info,
                case_base_info,
                api_base_info,
                assertion_base_info
            } = info;

            setStartTime(report_start_time);
            setEndTime(report_end_time);
            setRunTime(report_run_time);
            setTaskMode(task_mode);
            setTestOrder(test_case_run_order);
            setSceneOrder(scene_run_order);
            setSceneInfo(scene_base_info);
            setCaseInfo(case_base_info);
            setApiInfo(api_base_info);
            setAssertInfo(assertion_base_info);
        }
    }, [info]);

    const { t } = useTranslation();
    const taskModeList = {
        1: t('autoReport.taskMode.1')
    };
    const testCaseRunList = {
        1: t('autoReport.testCaseRunOrder.1'),
        2: t('autoReport.testCaseRunOrder.2'),
    };
    const sceneRunOrder = {
        1: t('autoReport.testCaseRunOrder.1'),
        2: t('autoReport.testCaseRunOrder.2'),
    }
    return (
        <div className="tReport-email-detail-info">
            <div className="info-box">
                <div className="info-box-left">
                    <p>{t('autoReport.startTime')}：{dayjs(startTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>
                    <p>{t('autoReport.endTime')}：{dayjs(endTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>
                    <p>{t('autoReport.runTime')}：{runTime}s</p>
                </div>
                <p className="line"></p>
            </div>
            <div className="info-box">
                <div className="info-box-left">
                    <p>{t('autoReport.runMode')}：{taskModeList[taskMode]}</p>
                    <p>{t('autoReport.case')}：{testCaseRunList[testOrder]}</p>
                    <p>{t('autoReport.scene')}：{sceneRunOrder[sceneOrder]}</p>
                </div>
                <p className="line"></p>
            </div>
            <div className="info-box">
                <div className="info-box-left num-show">
                    <p className="num" style={{ marginBottom: '32px' }}>{sceneInfo ? sceneInfo.scene_total_num : 0}</p>

                    <p className="label">{t('autoReport.sceneTotal')}</p>
                </div>
                <p className="line"></p>
            </div>
            <div className="info-box">
                <div className="info-box-left num-show">
                    <p className="num">{caseInfo ? caseInfo.case_total_num : 0}</p>
                    <div className="num-list">
                        <p className="success"><p></p>{caseInfo ? caseInfo.succeed_num : 0}</p>
                        <p className="fail"><p></p>{caseInfo ? caseInfo.fail_num : 0}</p>
                    </div>
                    <p className="label">{t('autoReport.caseTotal')}</p>
                </div>
                <p className="line"></p>
            </div>

            <div className="info-box">
                <p className="info-box-left num-show">
                    <p className="num">{apiInfo ? apiInfo.api_total_num : 0}</p>
                    <div className="num-list">
                        <p className="success"><p></p>{apiInfo ? apiInfo.succeed_num : 0}</p>
                        <p className="fail" style={{ marginRight: '15px' }}><p></p>{apiInfo ? apiInfo.fail_num : 0}</p>
                        <p className="not-run"><p></p>{apiInfo ? apiInfo.not_test_num : 0}</p>
                    </div>
                    <p className="label">{t('autoReport.apiTotal')}</p>
                </p>
                <p className="line"></p>
            </div>

            <div className="info-box">
                <div className="info-box-left num-show">
                    <p className="num">{assertInfo ? assertInfo.assertion_total_num : 0}</p>
                    <div className="num-list">
                        <p className="success"><p></p>{assertInfo ? assertInfo.succeed_num : 0}</p>
                        <p className="fail"><p></p>{assertInfo ? assertInfo.fail_num : 0}</p>
                    </div>
                    <p className="label">{t('autoReport.assertTotal')}</p>
                </div>
            </div>
        </div>
    )
};

export default TReportDetailInfo;