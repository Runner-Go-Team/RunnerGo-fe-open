import React from 'react';
import './index.less';
import PlanList from './planList';
import PlanDetail from './planDetail';
import { Routes, Route, Navigate } from 'react-router-dom';

const Plan = () => {

    const ContentRender = () => {
        return (
            <Routes>
                <Route path='list' element={<PlanList />}></Route>
                <Route path='detail/:id' element={<PlanDetail />}> </Route>
                <Route path='/*' element={<Navigate to="/plan/list" />}></Route>
            </Routes>
        )
    }

    return (
        <>
        { <ContentRender /> }
        </>
    )
};

export default Plan;