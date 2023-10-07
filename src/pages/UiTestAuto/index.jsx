import React, { useEffect } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ElementMgmt from './modules/ElementMgmt';
import SceneMgmt from './modules/SceneMgmt';
import PlanMgmt from './modules/PlanMgmt';
import PlanDetails from './modules/PlanMgmt/PlanDetails';
import ReportMgmt from './modules/ReportMgmt';
import './index.less';
import Bus from '@utils/eventBus';
import { useSelector } from 'react-redux';

const UiTestAuto = () => {
  const location = useLocation();
  const sceneTreeData = useSelector((store) => store?.uitest_auto?.sceneDatas);
  useEffect(()=>{
    if(location?.pathname != '/uiTestAuto/element'){
      // 初始化元素目录列表
      Bus.$emit('element/getElementFolderList')
    }
  },[location])
  const menuContent = (<Routes>
    <Route path="element" element={<ElementMgmt />}></Route>
    <Route path="scene" element={<SceneMgmt treeData={sceneTreeData}/>}></Route>
    <Route path="scene/:id" element={<SceneMgmt treeData={sceneTreeData}/>}></Route>
    <Route path="plan" element={<PlanMgmt />}></Route>
    <Route path="plan/details/:id" element={<PlanDetails />}></Route>
    <Route path="/report/*" element={<ReportMgmt />}></Route>
    <Route path="/*" element={<Navigate to={`element`} />} />
  </Routes>)

  return (
    <div className='runnerGo-ui-test-auto'>{menuContent || null}</div>
  )
}

export default UiTestAuto