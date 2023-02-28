import React from 'react';
import './index.less';
import ReportContent from './reportContent';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import qs from 'qs';


const EmailReport = () => {
    const { search } = useLocation();
    const { team_id } = qs.parse(search.slice(1));
    sessionStorage.setItem('team_id', team_id);

    const ContentRender = () => {
        return (
            <Routes>
                <Route path='detail' element={<ReportContent />}></Route>
                <Route path='/*' element={<Navigate to="/report/detail?id=1288&team_id=9" />}></Route>
            </Routes>
        )
    }

    return (
        <>
            <ReportContent />
        </>
    )
};

export default EmailReport;