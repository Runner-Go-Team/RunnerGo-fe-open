import { Button, Input, InputNumber, Message, Select, Tooltip } from '@arco-design/web-react';
import { IconCaretRight, IconEmail, IconLeft, IconRecordStop, IconSettings } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import PlanDetailContenxt from '../context';
import React, { useContext } from 'react'
import { useSelector } from 'react-redux';
import { BROWSER_TYPES } from '@constants/sceneStep';
import { ServicRunPlan, ServicStopPlan } from '@services/UiTestAuto/plan';
import Bus from '@utils/eventBus';
import { FotmatTimeStamp } from '@utils';
import { debounce, isArray, isObject, isString } from 'lodash';
import { lastValueFrom } from 'rxjs';

const Option = Select.Option
const PlanDetails = (props) => {
  const strategyOptions = {
    1: '计划执行前重启浏览器',
    2: '场景执行前重启浏览器',
    3: '无初始化',
  }
  const { planData, updatePlanData, setPlanData, getPlanDetails } = useContext(PlanDetailContenxt);
  const teamMember = useSelector((store) => store?.teams?.teamMember);
  const navigate = useNavigate();
  const browser = isObject(planData?.browsers?.[0]) ? planData?.browsers?.[0] : {};

  const runPlan = debounce(async () => {
    const resp = await lastValueFrom(ServicRunPlan({
      team_id: sessionStorage.getItem('team_id'),
      plan_id: planData?.plan_id
    }))
    if (resp?.code == 0 && isString(resp?.data?.report_id)) {
      if (planData?.task_type == 1) {
        navigate(`/uiTestAuto/report/details/${resp.data.report_id}`)
      } else {
        //刷新当前计划状态
        getPlanDetails();
      }
    }
  }, 100);

  const stopPlan = debounce(async () => {
    const resp = await lastValueFrom(ServicStopPlan({
      team_id: sessionStorage.getItem('team_id'),
      plan_id: planData?.plan_id
    }))
    if (resp?.code == 0) {
      Message.success('停止成功!')
        //刷新当前计划状态
        getPlanDetails();
    }
  }, 100);

  const renderRunBtn = () => {
    // 普通任务
    if (planData?.task_type == 1) {
      return <Button className='plan-debug-btn' onClick={runPlan}><IconCaretRight fontSize={14} />开始运行</Button>
    } else if (planData?.task_type == 2) {
      switch (planData?.timed_status) {
        case 0: // 未启动
          return <Button className='plan-debug-btn' onClick={runPlan}><IconCaretRight fontSize={14} />开始运行</Button>
          break;
        case 1: // 运行中
          return <Button className='plan-debug-btn' onClick={stopPlan}><IconRecordStop fontSize={14} />停止运行</Button>
          break;
        case 2: // 已过期
          return <Tooltip position='top' trigger='hover' content={'该计划已过期'}>
            <Button disabled className='plan-debug-btn' ><IconCaretRight fontSize={14} />开始运行</Button>
          </Tooltip>
          break;
        default:
          break;
      }
    }
  }

  return (
    <div className='runngerGo-plan-detatils-header'>
      <div className="detatils-name">
        <div className="back-plan-list" onClick={() => {
          navigate('/uiTestAuto/plan');
        }}><IconLeft /></div>
        <Input
          onBlur={(e) => {
            if (isString(e?.target?.value)) {
              updatePlanData('name', e.target.value);
            }
          }}
          placeholder='输入计划名称' value={planData?.name || ''} onChange={(val) => {
            setPlanData('name', val)
          }} />
      </div>
      <div className="detatils-info">
        <div className="info-left">
          <div className="top">
            <label>创建人:</label>
            <div className='user-info'>{planData?.created_user_avatar && <img src={planData.created_user_avatar} />} {planData?.created_user_name || ''}</div>
            <label>创建时间:</label>
            <div>{FotmatTimeStamp(planData?.created_time_sec || 0, 'YYYY-MM-DD HH:mm:ss')}</div>
            <label>最后修改时间:</label>
            <div>{FotmatTimeStamp(planData?.updated_time_sec || 0, 'YYYY-MM-DD HH:mm:ss')}</div>
          </div>
          <div className="bottom">
          <label>计划描述:</label>
            <Input maxLength={50} placeholder='输入计划描述' value={planData?.description || ''} onChange={(val) => {
              updatePlanData('description', val);
            }} />
          </div>
        </div>
        <div className="info-right">
         
        <Button onClick={() => Bus.$emit('openModal', 'CreateUiPlan',{plan:planData})}>计划配置</Button>
        <Button onClick={() => Bus.$emit('openModal', 'UiPlanTask', { plan_id: planData?.plan_id })}>任务配置</Button>
          <Button onClick={() => {
            // 通知
            Bus.$emit('openModal', 'Notice', { event_id: 105, batch: true, plan_id: planData?.plan_id, options: { plan_ids: [planData?.plan_id] } })
          }} className='notice'><IconEmail />通知</Button>
          {renderRunBtn()}
        </div>
      </div>

    </div>
  )
}
export default PlanDetails;
