import React, { useState, useEffect } from "react";
import './index.less';
import TReportDetailHeader from "./header";
import TReportDetailInfo from "./info";
import TReportDetailResult from "./result";
import { fetchEmailReportDetail } from '@services/auto_report';
import { useParams, useLocation } from 'react-router-dom';
import { Scale } from 'adesign-react';
import { useTranslation } from 'react-i18next';
import qs from 'qs';
const { ScalePanel, ScaleItem } = Scale;

const TestReportDetail = () => {
    const { id } = useParams();
    const { t } = useTranslation();

    const { search } = useLocation();
    const { report_id, team_id } = qs.parse(search.slice(1));

    const [header, setHeader] = useState(null);
    const [info, setInfo] = useState(null);
    const [result, setResult] = useState(null);

    const [hideTop, setHideTop] = useState(false);

    let test_report_t = null;

    useEffect(() => {
        getTestReport();
        test_report_t = setInterval(getTestReport, 3000);

        return () => {
            clearInterval(test_report_t);
        }
    }, []);

    const getTestReport = () => {
        const params = {
            team_id,
            report_id: report_id
        };
        fetchEmailReportDetail(params).subscribe({
            next: (res) => {
                const { data: {
                    plan_name,
                    avatar,
                    nickname,
                    remark,

                    report_start_time,
                    report_end_time,
                    report_run_time,
                    task_mode,
                    test_case_run_order,
                    scene_run_order,
                    scene_base_info,
                    case_base_info,
                    api_base_info,
                    assertion_base_info,

                    scene_result,
                    scene_id_case_result_map,

                    report_status,
                    report_name
                } } = res;
                setHeader({
                    plan_name,
                    avatar,
                    nickname,
                    remark,
                    report_status,
                    report_name
                })

                setInfo({
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
                })

                setResult({
                    scene_result,
                    scene_id_case_result_map
                })

                if (report_status === 2) {
                    clearInterval(test_report_t);
                }
            }
        })
    }

    const handleLayoutsChange = (layout) => {
        if (layout[0].height <= 80) {
            setHideTop(true);
        } else if (layout[0].height > 80) {
            setHideTop(false);
        }
    }



    return (
        <div className="tReport-email-detail">
            <TReportDetailHeader header={header} />
            <ScalePanel
                direction="vertical"
                className="flex-column"
                onLayoutsChange={handleLayoutsChange}
                defaultLayouts={{ 0: { height: 'auto' }, 1: { flex: 1 } }}
            >
                <ScaleItem minHeight={80}>
                    {
                        hideTop ? <div className="hide-top">⬇{ t('autoReport.reportTitle') }⬇</div>
                            : <TReportDetailInfo info={info} />
                    }
                </ScaleItem>
                <ScaleItem enableScale={false}>
                    <TReportDetailResult result={result} />
                </ScaleItem>
            </ScalePanel>


        </div>
    )
};

export default TestReportDetail;