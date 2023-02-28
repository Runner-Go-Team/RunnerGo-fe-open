import React from "react";
import './index.less';
import TestReportList from "./reportList";
import TestReportDetail from "./reportDetail";
import { Routes, Route, Navigate } from 'react-router-dom';

const TestReport = () => {
    return (
        <>
            <Routes>
                <Route path='list' element={<TestReportList />}></Route>
                <Route path='detail/:id' element={<TestReportDetail />}> </Route>
                <Route path='/*' element={<Navigate to="/Treport/list" />}></Route>
            </Routes>
        </>
    )
};

export default TestReport;