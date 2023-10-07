import React, { useEffect, useState } from "react";
import PlanMgmtContext from './context';
import { DEFABLR_SEARCH } from '@constants/plan';
import PlanList from './PlanList';
import './index.less';

const PlanMgmt = () => {

  const { Provider } = PlanMgmtContext;
  const [checkPlanIds, setCheckPlanIds] = useState([]);
  const [search, setSearch] = useState(DEFABLR_SEARCH);

  return (
    <Provider value={{
      checkPlanIds,
      setCheckPlanIds,
      search,
      setSearch
    }}>
      <PlanList />
    </Provider>
  )
}

export default PlanMgmt;