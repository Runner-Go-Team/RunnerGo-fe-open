import React from "react";
import './index.less';
import TestPlanList from "./planList";
import TestPlanDetail from "./planDetail";
import { Routes, Route, Navigate } from 'react-router-dom';

const TestPlan = () => {

    return (
        <>
            <Routes>
                <Route path='list' element={<TestPlanList />}></Route>
                <Route path='detail/:id' element={<TestPlanDetail />}> </Route>
                <Route path='/*' element={<Navigate to="/Tplan/list" />}></Route>
            </Routes>
        </>
    )
};

export default TestPlan;