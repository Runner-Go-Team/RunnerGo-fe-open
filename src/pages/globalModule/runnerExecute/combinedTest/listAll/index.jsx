import React from 'react';
import EventPanel from '@components/TestEvents/execute';
import { isArray, sortBy } from 'lodash';
import LeftItems from './leftItems';
import './index.less';
import { ListAllWrapper, TestEventsPanel } from './style';

const ListAllPanel = (props) => {
  const {
    testPlanList,
    handleEventItemClick,
    currentInfo,
    statusList,
    activeTestId,
    setActiveTestId,
    projectEvents,
  } = props;

  const testEventList = projectEvents.filter((item) => item.test_id === activeTestId);

  const sortedList = isArray(testEventList) ? sortBy(testEventList, ['sort']) : [];

  return (
    <ListAllWrapper>
      <LeftItems {...{ activeTestId, testPlanList, setActiveTestId }} />
      <TestEventsPanel>
        <EventPanel
          onClickMore={handleEventItemClick}
          eventList={sortedList}
          currentEventInfo={currentInfo}
          statusList={statusList}
        />
      </TestEventsPanel>
    </ListAllWrapper>
  );
};

export default ListAllPanel;
