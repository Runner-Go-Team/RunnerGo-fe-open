import React from 'react';
import './index.less';
import ReportList from './reportList';
import ReportContent from './reportContent';
import { Routes, Route, Navigate } from 'react-router-dom';


const Report = () => {

    const ContentRender = () => {
        return (
            <Routes>
                <Route path='list' element={<ReportList />}></Route>
                <Route path='detail' element={<ReportContent />}></Route>
                <Route path='/*' element={<Navigate to="/report/list" />}></Route>
            </Routes>
        )
    }

    return (
        <>
            <ContentRender />
        </>
    )
};

export default Report;