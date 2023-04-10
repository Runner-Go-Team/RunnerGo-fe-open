import React, { useState, useEffect } from 'react';
import { Tabs as TabComponent } from 'adesign-react';
import { TabStyle } from './style';
import ReportContent from './reportContent';
import DebugLog from './debugLog';
import PressMonitor from './pressMonitor';
import { useParams, useLocation } from 'react-router-dom';
import { fetchReportDetail } from '@services/report';
import { useTranslation } from 'react-i18next';
import qs from 'qs';
import Bus from '@utils/eventBus';
import { useSelector } from 'react-redux';

const { Tabs, TabPan } = TabComponent;

let report_detail_t = null;

const ReportDetail = (props) => {
	const { data: configData, stopDebug, onStatus, status, onRunTime, plan_id, create_time } = props;
	const { t } = useTranslation();

	const [data, setData] = useState([]);
	// const { id: report_id } = useParams();
	const { search } = useLocation();
	const { id: report_id, contrast } = qs.parse(search.slice(1));
	const [end, setEnd] = useState(false);
	const [analysis, setAnalysis] = useState({});
	const [description, setDescription] = useState('');
	const [tab, setTab] = useState('1');
	// const [runTime, setRunTime] = useState(0);
	const select_plan = useSelector((store) => (store.plan.select_plan));
	const report_detail = useSelector((store) => store.report.report_detail);

	useEffect(() => {
		if (report_id && plan_id) {
			getReportDetail(plan_id);
			report_detail_t = setInterval(() => {
				getReportDetail(plan_id);
			}, 3000);

			let setIntervalList = window.setIntervalList;
			if (setIntervalList) {
				setIntervalList.push(report_detail_t);
			} else {
				setIntervalList = [report_detail_t];
			}
			window.setIntervalList = setIntervalList;

		}

		return () => {
			let setIntervalList = window.setIntervalList;
			if (setIntervalList) {
				let _index = setIntervalList.findIndex(item => item === report_detail_t);
				setIntervalList.splice(_index, 1);
				window.setIntervalList = setIntervalList;
			}

			clearInterval(report_detail_t);
		}
	}, [plan_id]);

	useEffect(() => {
		if (!report_id && plan_id) {
			getReportDetail(plan_id);
		}
	}, [select_plan, plan_id]);


	useEffect(() => {
		if (report_detail) {
			const { results, end, analysis, description } = report_detail;
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
			setData(dataList.map(item => {
				const { tps, stps } = item;
				return {
					...item,
					tps: tps ? tps : 0,
					stps: stps ? stps : 0
				}
			}));

			const item = dataList.length > 0 ? dataList[0].rps_list : [];
			const time = item.length > 1 ? item[item.length - 1].time_stamp - item[0].time_stamp : 0;
			onRunTime(time > 0 ? time : 1);
			if (end) {
				let setIntervalList = window.setIntervalList;
				if (setIntervalList) {
					let _index = setIntervalList.findIndex(item => item === report_detail_t);
					setIntervalList.splice(_index, 1);
					window.setIntervalList = setIntervalList;
				}

				clearInterval(report_detail_t);
				setEnd(true);
			}
		}
	}, [report_detail]);

	const getReportDetail = (plan_id) => {
		const query = {
			report_id: report_id ? report_id : JSON.parse(contrast)[select_plan].report_id,
			plan_id,
			team_id: localStorage.getItem('team_id')
		};
		
		Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "stress_report_detail",
            param: JSON.stringify(query)
        }))
	}

	useEffect(() => {
		if (end) {
			getReportDetail(plan_id);
		}
	}, [plan_id, end]);


	const defaultList = [
		{
			id: '1', title: t('report.tabList.0'), content: <ReportContent tab={tab} data={data} status={status} config={configData} create_time={create_time} plan_id={plan_id} analysis={analysis} description={description} refreshData={(e) => {
				if (e) {
					getReportDetail(plan_id);
				}
			}} />
		},
		{ id: '2', title: t('report.tabList.1'), content: <DebugLog tab={tab} status={status} end={end} stopDebug={stopDebug} plan_id={plan_id} /> },
		{ id: '3', title: t('report.tabList.2'), content: <PressMonitor tab={tab} status={status} /> },
	];

	return (
		<div>
			<Tabs className={TabStyle} defaultActiveId="1" onChange={(e) => setTab(e)}>
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