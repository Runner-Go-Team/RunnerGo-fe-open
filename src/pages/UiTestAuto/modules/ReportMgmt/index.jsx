import React, { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ReportList from './modules/ReportList';
import ReportDetails from './modules/ReportDetails';
import './index.less';
import Bus from '@utils/eventBus';
import { useSelector } from 'react-redux';
import { lastValueFrom } from 'rxjs';

const ReportMgmt = () => {
  const location = useLocation();
  
  const menuContent = (<Routes>
    <Route path="details/:id" element={<ReportDetails />}></Route>
    <Route path="/" element={<ReportList />}></Route>
    {/* <Route path="/*" element={<Navigate to={`report`} />} /> */}
  </Routes>)

  return (
    <div className='runnerGo-ui-test-auto-report'>{menuContent || null}</div>
  )
}

export default ReportMgmt