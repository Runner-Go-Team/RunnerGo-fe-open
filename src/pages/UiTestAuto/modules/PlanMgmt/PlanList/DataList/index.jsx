import { Message, Modal, Table, Tooltip } from '@arco-design/web-react';
import { IconCopy, IconDelete, IconEye, IconPlayArrow, IconRecordStop } from '@arco-design/web-react/icon';
import ElementMgmtContext from '../../context';
import { FotmatTimeStamp } from '@utils';
import { ServiceGetPlanList, ServicDeletePlan, ServicCopyPlan, ServicRunPlan, ServicStopPlan } from '@services/UiTestAuto/plan';
import { useNavigate } from 'react-router-dom';
import './index.less';
import React, { useContext, useEffect, useState } from 'react'
import { debounce, isArray, isNumber, isString } from 'lodash';
import { lastValueFrom } from 'rxjs';
import Bus, { useEventBus } from '@utils/eventBus';
import { useSelector } from 'react-redux';

const DataList = () => {
  const { selectKey, checkPlanIds, setCheckPlanIds, search } = useContext(ElementMgmtContext)
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  const teamMember = useSelector((store) => store?.teams?.teamMember);
  const [pagination, setPagination] = useState({
    sizeCanChange: true,
    showTotal: true,
    total: 10,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
    showJumper: true
  });

  const getPlanList = async () => {
    const resp = await lastValueFrom(ServiceGetPlanList({
      team_id: sessionStorage.getItem('team_id'),
      page: pagination.current,
      size: pagination.pageSize,
      ...search
    }));
    if (resp?.code == 0) {
      isArray(resp?.data?.plans) && setData(resp.data.plans)
      isNumber(resp?.data?.total) && setPagination({ ...pagination, total: resp.data.total })
    }
  };
  const debounceGetPlanList = debounce(() => getPlanList(), 200)
  useEventBus('planList/debounceGetPlanList', debounceGetPlanList);
  useEffect(() => {
    getPlanList();
  }, [selectKey, pagination.current, pagination.pageSize])
  useEffect(() => {
    if (search != null) {
      if (pagination.current != 1) {
        // 回到第一页
        setPagination({ ...pagination, current: 1 });
      } else {
        debounceGetPlanList();
      }
    }
  }, [search]);
  const deletePlan = (item) => {
    Modal.confirm({
      title: '删除',
      content: `确认删除${item?.name || '该'}计划？`,
      icon: null,
      closable: true,
      onOk: () => {
        return new Promise((resolve, reject) => {
          lastValueFrom(ServicDeletePlan({ team_id: sessionStorage.getItem('team_id'), plan_ids: [item.plan_id] })).then(res => {
            if (res?.code == 0) {
              Message.success('删除计划成功');
              debounceGetPlanList();
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
  const copyPlan = debounce(async (item) => {
    const resp = await lastValueFrom(ServicCopyPlan({ team_id: sessionStorage.getItem('team_id'), plan_id: item.plan_id }));
    if (resp?.code == 0) {
      Message.success('复制计划成功');
      debounceGetPlanList();
    }
  }, 200);
  const runPlan = debounce(async (planData) => {
    const { plan_id } = planData;
    const resp = await lastValueFrom(ServicRunPlan({
      team_id: sessionStorage.getItem('team_id'),
      plan_id
    }))
    if (resp?.code == 0 && isString(resp?.data?.report_id)) {
      if (planData?.task_type == 1) {
        navigate(`/uiTestAuto/report/details/${resp.data.report_id}`)
      } else {
        //刷新计划状态
        getPlanList();
      }
    }
  }, 100);

  const stopPlan = debounce(async (planData) => {
    const resp = await lastValueFrom(ServicStopPlan({
      team_id: sessionStorage.getItem('team_id'),
      plan_id: planData?.plan_id
    }))
    if (resp?.code == 0) {
      Message.success('停止成功!')
      //刷新计划状态
      getPlanList();
    }
  }, 100);

  const renderRunBtn = (planData) => {
    // 普通任务
    if (planData?.task_type == 1) {
      return <div className="run" onClick={() => runPlan(planData)}><IconPlayArrow />开始</div>
    } else if (planData?.task_type == 2) {
      switch (planData?.timed_status) {
        case 0: // 未启动
          return <div className="run" onClick={() => runPlan(planData)}><IconPlayArrow />开始</div>
          break;
        case 1: // 运行中
          return <div className="run run-stop" onClick={() => stopPlan(planData)}><IconRecordStop />停止</div>
          break;
        case 2: // 已过期
          return <Tooltip position='top' trigger='hover' content={'该计划已过期'}>
            <div className="run run-diable"><IconPlayArrow />开始</div>
          </Tooltip>
          break;
        default:
          break;
      }
    }
  }

  const columns = [
    {
      title: '计划名称',
      dataIndex: 'name',
      render:(col)=>(
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
      title: '创建时间',
      dataIndex: 'created_time_sec',
      render: (col, item) => (
        <span>{FotmatTimeStamp(col, 'YYYY-MM-DD HH:mm')}</span>
      )
    },
    {
      title: '最后修改时间',
      dataIndex: 'updated_time_sec',
      render: (col, item) => (
        <span>{FotmatTimeStamp(col, 'YYYY-MM-DD HH:mm')}</span>
      )
    },
    {
      title: '负责人',
      dataIndex: 'head_user_ids',
      render: (col, item) => {
        let user_name = teamMember.find(i => i?.user_id == col)?.nickname || ''
        return <span>{user_name}</span>
      }
    },
    {
      title: '创建人',
      dataIndex: 'created_user_name',
    },
    {
      title: '操作',
      dataIndex: '',
      width: 196,
      render: (col, item) => (
        <span className='operation'>
          {renderRunBtn(item)}
          <IconEye onClick={() => navigate(`/uiTestAuto/plan/details/${item?.plan_id}`)} fontSize={16} />
          <IconCopy onClick={() => copyPlan(item)} fontSize={16} />
          <IconDelete onClick={() => deletePlan(item)} fontSize={16} />
        </span>
      )
    },
  ];
  return (
    <Table
      className='runnerGo-plan-list-table'
      scroll={{
        y: '69vh',
      }}
      rowKey='plan_id'
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
      data={data}
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
      }}
      onRow={(record, index) => {
        return {
          onDoubleClick: (event) => {
            const { plan_id } = record;
            navigate(`/uiTestAuto/plan/details/${plan_id}`)
          },
        };
      }}
    />
  )
}
export default DataList;
