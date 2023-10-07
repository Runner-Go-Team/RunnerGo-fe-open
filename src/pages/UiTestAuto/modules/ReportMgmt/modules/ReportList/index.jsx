import React, { useEffect, useState } from 'react'
import SearchHeader from './SearchHeader';
import DataList from './DataList';
import ReportListContext from './context';
import { lastValueFrom } from 'rxjs';
import { DEFABLR_SEARCH } from '@constants/report';
import { ServiceGetReportList } from '@services/UiTestAuto/report';
import { debounce, isArray, isNumber } from 'lodash';
import { useEventBus } from 'event-bus-hooks';

const ReportLis = () => {
  const [reportList, setReportList] = useState([]);
  const [checkPlanIds, setCheckPlanIds] = useState([]);
  const [search, setSearch] = useState(DEFABLR_SEARCH);
  const [pagination, setPagination] = useState({
    sizeCanChange: true,
    showTotal: true,
    total: 10,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
    showJumper: true
  });

  const initReportList = async () => {
    const resp = await lastValueFrom(ServiceGetReportList({
      page: pagination.current,
      size: pagination.pageSize,
      team_id: sessionStorage.getItem('team_id'),
      ...search,
    }))
    if (resp?.code == 0) {
      isArray(resp?.data?.reports) && setReportList(resp.data.reports)
      isNumber(resp?.data?.total) && setPagination({ ...pagination, total: resp.data.total })
    } else {
      setReportList([]);
    }
  }
  const debounceInitReportList = debounce(() => initReportList(), 200)
  useEventBus('planList/debounceGetReportList', debounceInitReportList);
  useEffect(() => {
    initReportList();
  }, [pagination.current, pagination.pageSize])
  useEffect(() => {
    if (search != null) {
      if (pagination.current != 1) {
        // 回到第一页
        setPagination({ ...pagination, current: 1 });
      } else {
        debounceInitReportList();
      }
    }
  }, [search]);

  return (
    <ReportListContext.Provider value={{
      reportList,
      checkPlanIds,
      setCheckPlanIds,
      search,
      setSearch,
      pagination,
      setPagination
    }}>
      <div className="runnerGo-ui-report-list">
        <SearchHeader />
        <DataList />
      </div>
    </ReportListContext.Provider>
  )
}
export default ReportLis;