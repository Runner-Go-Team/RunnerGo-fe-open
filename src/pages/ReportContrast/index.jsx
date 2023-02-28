import React, { useEffect, useState } from "react";
import './index.less';
import ContrastHeader from './contrastHeader';
import ContrastDetail from './contrastDetail';
import { fetchContrastReport } from '@services/report';
import { useLocation } from 'react-router-dom';
import qs from 'qs';

const ReportContrast = () => {

    const [result, setResult] = useState([]); 
    const { search } = useLocation();    
    const { contrast } = qs.parse(search.slice(1));

    const [nameList, setNameList] = useState([]);
    const [list1, setList1] = useState([]);
    const [list2, setList2] = useState([]);
    const [list3, setList3] = useState([]);
    const [list4, setList4] = useState([]);

    useEffect(() => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            report_ids: JSON.parse(contrast).map(item => item.report_id)
        };
        fetchContrastReport(params).subscribe({
            next: (res) => {
                const { data: { report_names_data, report_base_data, report_collect_data, report_detail_all_data } } = res;
                setNameList(report_names_data);
                setList1(report_base_data);
                setList2(report_collect_data);
                setList3(report_detail_all_data);   
            }
        })
    }, []);


    return (
        <div className="report-contrast">
            <ContrastHeader name={nameList} />
            <ContrastDetail list1={list1} list2={list2} list3={list3} list4={list4} />
        </div>
    )
};

export default ReportContrast;