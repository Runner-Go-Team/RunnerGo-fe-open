import React, { useState, useEffect } from 'react';
import { Tabs as TabComponent } from 'adesign-react';
import { TabStyle } from './style';
import ReportContent from './reportContent';
import DebugLog from './debugLog';
import PressMonitor from './pressMonitor';
import { useParams, useLocation } from 'react-router-dom';
import { fetchEmailReportDetail } from '@services/report';
import { useTranslation } from 'react-i18next';
import qs from 'qs';
import { useSelector } from 'react-redux';

const { Tabs, TabPan } = TabComponent;

let report_detail_t = null;

const ReportDetail = (props) => {
	const { data: configData, stopDebug, onStatus, status, onRunTime, plan_id } = props;
	const { t } = useTranslation();

    const [data, setData] = useState([]);
	// const { id: report_id } = useParams();
	const { search } = useLocation();
	const { report_id, contrast } = qs.parse(search.slice(1));
	const [end, setEnd] = useState(false);
	const [analysis, setAnalysis] = useState({});
	const [description, setDescription] = useState('');
	// const [runTime, setRunTime] = useState(0);
	const select_plan = useSelector((store) =>(store.plan.select_plan));
	

    useEffect(() => {
		if (report_id) {
			getReportDetail(plan_id);
			report_detail_t = setInterval(() => {
				getReportDetail(plan_id);
			}, 1000);
		}

		return () => {
			clearInterval(report_detail_t);
		}
    }, [plan_id]);

	const getReportDetail = (plan_id) => {

		if (plan_id !== 0) {
			const query = {
				report_id: report_id ? report_id : JSON.parse(contrast)[select_plan].report_id,
				plan_id,
				team_id: sessionStorage.getItem('team_id')
			};
			fetchEmailReportDetail(query).subscribe({
				next: (res) => {
					const { data: { results, end, analysis, description } } = res;
					const dataList = [];
					for (let i in results) {
						dataList.push(results[i]);
					}
					if (analysis && Object.entries(analysis).length > 0) {
						let _analysis = JSON.parse(analysis);
						let analysis_list = [];
						for (let i in _analysis) {
							analysis_list.push(`${i}: ${_analysis[i]}`)
						}
						analysis && setAnalysis(analysis_list);
					}
					setDescription(description);
					setData(dataList);
					const item = dataList.length > 0 ? dataList[0].rps_list : [];
					const time = item.length > 1 ? item[item.length - 1].time_stamp - item[0].time_stamp : 0;
					// setRunTime(time);
					onRunTime(time > 0 ? time : 1);
					if (end) {
						// onStatus('已完成')
						clearInterval(report_detail_t);
						setEnd(true);
					}
				}
			})
		}
	}


    const defaultList = [
        { id: '1', title: t('report.tabList.0'), content: <ReportContent data={data} config={configData} plan_id={plan_id} analysis={analysis} description={description}   />  },
        { id: '3', title: t('report.tabList.2'), content: <PressMonitor status={status} /> }
    ];

    return (
        <div>
            <Tabs className={TabStyle} defaultActiveId="1">
                {defaultList.map((d) => (
                    <TabPan key={d.id} id={d.id} title={d.title}>
                        {d.content}
                    </TabPan>
                ))}
            </Tabs>
        </div>
    )
};

export default ReportDetail;