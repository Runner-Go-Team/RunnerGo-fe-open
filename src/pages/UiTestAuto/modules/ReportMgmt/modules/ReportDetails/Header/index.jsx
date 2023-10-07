import { Button, Input, Message } from '@arco-design/web-react';
import { IconCaretRight, IconEmail, IconLeft, IconRecordStop } from '@arco-design/web-react/icon';
import { FotmatTimeStamp } from '@utils';
import { ServicUpdateReport,ServicStopReport, ServicRunReport } from '@services/UiTestAuto/report';
import { ServicRunPlan } from '@services/UiTestAuto/plan';
import Bus from '@utils/eventBus';
import cn from 'classnames';
import { debounce, isString } from 'lodash';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { lastValueFrom } from 'rxjs';

export default function index(props) {
  const { value, setValue, initReportDetails } = props;
  const navigate = useNavigate();

  const updateReportData = debounce(async (report_id, data) => {
    const resp = await lastValueFrom(ServicUpdateReport({
      team_id: sessionStorage.getItem('team_id'),
      report_id,
      ...data
    }))
    if (resp?.code == 0) {
      // Message.success('修改报告信息成功')
    }
  }, 300)

  const runReport = debounce(async (report_id) => {
    const resp = await lastValueFrom(ServicRunReport({
      team_id: sessionStorage.getItem('team_id'),
      report_id
    }))
    if (resp?.code == 0) {
      navigate('/uiTestAuto/report')
      // 刷新报告列表
      // Bus.$emit('planList/debounceGetReportList')
    }
  }, 100);

  const stopPlan = async(report_id)=>{
    const resp = await lastValueFrom(ServicStopReport({
      team_id: sessionStorage.getItem('team_id'),
      report_id
    }))
    if (resp?.code == 0) {
      Message.success('停止成功')
      // 刷新报告信息
      initReportDetails(report_id);
      // Bus.$emit('planList/debounceGetReportList')
    }
  }

  return (
    <div className="detatils-header">
      <div className="left">
        <div className="top">
          <div className="back-plan-list" onClick={() => {
            navigate('/uiTestAuto/report');
          }}><IconLeft /></div>
          <Input 
           onBlur={(e) => {
            if (isString(e?.target?.value)) {
              updateReportData(value.report_id, { report_name: e.target.value })
            }
          }}
          placeholder='输入报告名称' value={value?.report_name || ''} onChange={(val) => {
            setValue({ ...value, report_name: val });
          }} />
          <div className={cn('running-state', {
            "running-state-over": value?.status != 1,
            "running-state-running": value?.status == 1
          })}>{value?.status == 1 ? '运行中' : '已完成'}</div>
        </div>
        <div className="bottom">
          <label>执行者:</label>
          <div className='user-info'>{value?.user_avatar && <img src={value.user_avatar} />} {value?.run_user_name || ''}</div>
          <label>计划名称:</label>
          <div>{value?.plan_name || ''}</div>
          <label>开始时间:</label>
          <div>{FotmatTimeStamp(value?.created_time_sec || 0, 'YYYY-MM-DD HH:mm:ss')}</div>
          <label>结束时间:</label>
          <div>{FotmatTimeStamp(value?.end_time_sec || 0, 'YYYY-MM-DD HH:mm:ss')}</div>
          <label>场景执行顺序:</label>
          <div>{value?.scene_run_order == 1 ? '顺序执行' : '同时执行'}</div>
        </div>
      </div>
      <div className="right">

        <Button onClick={() => {
          // 通知
          Bus.$emit('openModal', 'Notice', { event_id: 106, report_id: value?.report_id, options: { report_ids: [value?.report_id] } })
        }} className='notice'><IconEmail />通知</Button>
       < Button className={cn('report-debug-btn', {
          "report-debug-btn-run": value?.status == 1
        })} onClick={() => {
          if (value?.status == 1) {
            stopPlan(value?.report_id);
          } else {
            runReport(value?.report_id)
          }
        }}> {value?.status == 1 ? <IconRecordStop fontSize={14} /> : <IconCaretRight fontSize={14} />}{value?.status == 1 ? '终止任务' : '重新运行'} </Button>
      </div>
    </div>
  )
}
