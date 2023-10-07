import { Message, Modal, Table, Tooltip } from '@arco-design/web-react';
import { IconCopy, IconDelete, IconEye, IconPlayArrow, IconRecordStop } from '@arco-design/web-react/icon';
import ElementMgmtContext from '../context';
import cn from 'classnames';
import { FotmatTimeStamp } from '@utils';
import { ServiceGetPlanList, ServicDeletePlan, ServicCopyPlan, ServicRunPlan } from '@services/UiTestAuto/plan';
import { ServicDeleteReport, ServicStopReport, ServicRunReport } from '@services/UiTestAuto/report';
import { useNavigate } from 'react-router-dom';
import './index.less';
import React, { useContext, useEffect, useState } from 'react'
import { debounce, isArray, isNumber, isString } from 'lodash';
import { lastValueFrom } from 'rxjs';
import Bus, { useEventBus } from '@utils/eventBus';

const DataList = () => {
  const { reportList, pagination, setPagination, checkPlanIds, setCheckPlanIds } = useContext(ElementMgmtContext)

  const navigate = useNavigate();
  const deletePlan = (item) => {
    Modal.confirm({
      title: '删除',
      content: item?.status == 1 ? '此报告正在运行中，是否终止并删除该报告？' : `确认删除${item?.report_name || '该'}报告？`,
      icon: null,
      closable: true,
      onOk: () => {
        return new Promise((resolve, reject) => {
          lastValueFrom(ServicDeleteReport({ team_id: sessionStorage.getItem('team_id'), report_ids: [item.report_id] })).then(res => {
            if (res?.code == 0) {
              Message.success('删除报告成功');
              Bus.$emit('planList/debounceGetReportList')
              resolve();
            }
            reject();
          })
        }).catch((e) => {
          throw e;
        })
      }
    });
  }

  const runReport = debounce(async (item) => {
    const { report_id } = item || {};
    const resp = await lastValueFrom(ServicRunReport({
      team_id: sessionStorage.getItem('team_id'),
      report_id
    }))
    if (resp?.code == 0 && isString(resp?.data?.report_id)) {
      if (item?.task_type == 1) {
        navigate(`/uiTestAuto/report/details/${resp.data.report_id}`)
      } else {
        // 刷新报告列表
        Bus.$emit('planList/debounceGetReportList')
      }
    }
  }, 100);

  const stopReport = async (item) => {
    const { report_id } = item || {};
    const resp = await lastValueFrom(ServicStopReport({
      team_id: sessionStorage.getItem('team_id'),
      report_id
    }))
    if (resp?.code == 0) {
      Message.success('停止成功')
      // 刷新报告列表
      Bus.$emit('planList/debounceGetReportList')
    }
  }

  const columns = [
    {
      title: '报告名称',
      dataIndex: 'report_name',
      render: (col) => (
        <Tooltip position='top' trigger='hover' content={col}>
          <span>{col}</span>
        </Tooltip>
      )
    },
    {
      title: '计划名称',
      dataIndex: 'plan_name',
      render: (col) => (
        <Tooltip position='top' trigger='hover' content={col}>
          <span>{col}</span>
        </Tooltip>
      )
    },
    {
      title: '任务类型',
      dataIndex: 'task_type',
      render: (col, item) => {
        return (
          <span>
            {col == 1 ? '普通任务' : '定时任务'}
          </span>
        )
      }
    },
    {
      title: '场景执行顺序',
      dataIndex: 'scene_run_order',
      render: (col, item) => {
        return (
          <span>
            {col == 1 ? '顺序执行' : '同时执行'}
          </span>
        )
      }
    },
    {
      title: '开始时间',
      dataIndex: 'run_time_sec',
      render: (col, item) => (
        <span>{FotmatTimeStamp(col, 'YYYY-MM-DD HH:mm')}</span>
      )
    },
    {
      title: '结束时间',
      dataIndex: 'last_time_sec',
      render: (col, item) => (
        <span>{FotmatTimeStamp(col, 'YYYY-MM-DD HH:mm')}</span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (col, item) => {
        return (
          <span className={cn({
            "status-runing": item?.status == 1
          })}>
            {col == 1 ? '进行中' : '已完成'}
          </span>
        )
      }
    },
    {
      title: '执行者',
      dataIndex: 'run_user_name',
    },
    {
      title: '操作',
      dataIndex: '',
      width: 156,
      render: (col, item) => (
        <span className='operation'>
          <div className={cn("run", {
            'run-stop': item?.status == 1
          })} onClick={() => {
            if (item?.status == 1) {
              stopReport(item);
            } else {
              runReport(item)
            }

          }}>{item?.status == 1 ? <IconRecordStop /> : <IconPlayArrow />} {item?.status == 1 ? '停止' : '开始'}</div>
          <IconEye onClick={() => navigate(`/uiTestAuto/report/details/${item?.report_id}`)} fontSize={16} />
          <IconDelete onClick={() => deletePlan(item)} fontSize={16} />
        </span>
      )
    },
  ];
  return (
    <Table
      className='runnerGo-report-list-table'
      scroll={{
        y: '69vh',
      }}
      rowKey='report_id'
      rowHeight={34}
      ellipsis={true}
      borderCell={true}
      columns={columns}
      pagination={{
        ...pagination, onChange: (current, pageSize) => {
          setPagination({ ...pagination, ...{ current, pageSize } })
        },
        // onPageSizeChange: (pageSize, current) => {
        //   setPagination({ ...pagination, ...{ current, pageSize } })
        // }
      }}
      data={reportList}
      rowSelection={{
        type: "checkbox",
        selectedRowKeys: checkPlanIds,
        onChange: (selectedRowKeys, selectedRows) => {
          setCheckPlanIds(selectedRowKeys);
        },
        onSelect: (selected, record, selectedRows) => {
          setCheckPlanIds(selected);
          console.log('onSelect:', selected, record, selectedRows);
        },
        checkboxProps: (record) => {
          return {
            disabled: record.status == 1,
          };
        },
      }}
      onRow={(record, index) => {
        return {
          onDoubleClick: (event) => {
            const { report_id } = record;
            navigate(`/uiTestAuto/report/details/${report_id}`)
          },
        };
      }}
    />
  )
}
export default DataList;
