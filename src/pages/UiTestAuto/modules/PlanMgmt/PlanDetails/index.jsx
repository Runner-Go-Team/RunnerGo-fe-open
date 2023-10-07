import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ServiceGetPlanDetail, ServiceUpdatePlan } from '@services/UiTestAuto/plan';
import Header from './Header';
import SceneMgmt from '../../SceneMgmt';
import PlanContext from './context';
import './index.less';
import { lastValueFrom } from 'rxjs';
import { debounce, isPlainObject } from 'lodash';
import { useSelector } from 'react-redux';
import ScenePicker from './scenePicker';
import Bus, { useEventBus } from '@utils/eventBus';

const PlanDetails = (props) => {
  const { id } = useParams();
  const [planData, setPlanData] = useState(null);
  const [showUiPlanScenePicker, setShowUiPlanScenePicker] = useState(false);
  const planSceneDatas = useSelector((store) => store?.uitest_auto?.planSceneDatas);
  const sceneDatas = useSelector((store) => store?.uitest_auto?.sceneDatas);

  const getPlanDetails = async () => {
    const resp = await lastValueFrom(ServiceGetPlanDetail({ team_id: sessionStorage.getItem('team_id'), plan_id: id }));
    if (resp?.code == 0 && isPlainObject(resp?.data?.plan)) {
      setPlanData(resp.data.plan);
    }
  }
  useEventBus("PlanDetails/getPlanDetails", getPlanDetails, [])
  useEffect(() => {
    // 获取场景列表
    Bus.$emit('element/getSceneList')
    getPlanDetails();
  }, [])

  const updatePlanData = (key, val) => {
    setPlanData({ ...planData, [key]: val })

    ServerUpdatePlanData({ ...planData, [key]: val });
  }

  const ServerUpdatePlanData = debounce(async (newData) => {
    const resp = await lastValueFrom(ServiceUpdatePlan(newData));
    if (resp?.code == 0) {

    }
  }, 500);
  useEventBus('ui_plan/showScenePicker', () => setShowUiPlanScenePicker(true), []);
  console.log(planData, "planData12312");
  const treeData = isPlainObject(planSceneDatas?.[planData?.plan_id]) ? planSceneDatas?.[planData?.plan_id] : {}
  return (
    <PlanContext.Provider value={{
      planData,
      updatePlanData,
      setPlanData,
      getPlanDetails
    }}>
      <div className='runngerGo-plan-detatils'>
        <Header />
        <SceneMgmt plan_id={id} treeData={treeData} />
      </div>
      {showUiPlanScenePicker && <ScenePicker plan_id={id} onCancel={() => {
        setShowUiPlanScenePicker(false)
      }} treeData={sceneDatas} />}
    </PlanContext.Provider>
  )
}
export default PlanDetails;
