import React from 'react';
import { Tabs as TabComponent } from 'adesign-react';

import EventPanel from '@components/TestEvents/execute';
import SingleApi from '@components/TestEvents/execute/singleApi';

const { Tabs, TabPan } = TabComponent;

const SingleTest = (props) => {
  const {
    activeTabId,
    handleTabChange,
    handleEventItemClickMore,
    eventList,
    currentInfo,
    statusList,
    currentEventId,
    logList,
  } = props;

  return (
    <>
      <div className="api-list-panel">
        <Tabs activeId={activeTabId} onChange={handleTabChange}>
          <TabPan id="all" title="全部">
            <EventPanel
              onClickMore={handleEventItemClickMore}
              eventList={eventList}
              currentEventInfo={currentInfo}
              statusList={statusList}
            />
          </TabPan>
          <TabPan id="passed" title="成功">
            <SingleApi
              type="success"
              currentEventId={currentEventId}
              dataList={logList.filter((item) => item?.http_error === -1)}
            />
          </TabPan>
          <TabPan id="failure" title="失败">
            <SingleApi
              type="failure"
              currentEventId={currentEventId}
              dataList={logList.filter((item) => item?.http_error === 1)}
            />
          </TabPan>
          <TabPan id="ignore" title="未测">
            <SingleApi
              type="ignore"
              currentEventId={currentEventId}
              dataList={logList.filter((item) => item?.http_error === -2)}
            />
          </TabPan>
        </Tabs>
      </div>
    </>
  );
};

export default SingleTest;
