import React, { useEffect, useState } from 'react';
import { Tabs as TabComponent } from 'adesign-react';
import { useSelector } from 'react-redux';
import SingleApi from '@components/TestEvents/execute/singleApi';
import { isArray, isString, isUndefined } from 'lodash';
import { getEventListFromMultiTestId } from '@rxUtils/runner/singleTest';
import ListAll from './listAll';

const { Tabs, TabPan } = TabComponent;

const SingleTest = (props) => {
  const { testPlanList, currentInfo, logList, activeTestId, setActiveTestId } = props;
  const testList = useSelector((store) => store?.runner?.currentTest?.testList);

  const [currentEventId, setCurrentEventId] = useState(null);
  const [activeTabId, setActiveTabId] = useState('all');

  const [projectEvents, setProjectEvents] = useState([]);

  useEffect(() => {
    let enableRender = true;
    if (isArray(testList) && testList.length > 0) {
      const test_ids = testList.map((item) => item.test_id);
      getEventListFromMultiTestId(test_ids).then((eventList) => {
        if (enableRender) {
          setProjectEvents(eventList);
        }
      });
    }

    return () => {
      enableRender = false;
    };
  }, [testList]);

  const statusList = !isUndefined(testPlanList)
    ? testPlanList.find((item) => item.test_id === activeTestId)?.event_status
    : {};

  const handleEventItemClick = (event) => {
    const status = statusList?.[event?.event_id];
    if (!isString(status)) {
      return;
    }

    setCurrentEventId(event.event_id);
    setActiveTabId(status);
  };

  const handleTabChange = (activeId) => {
    setActiveTabId(activeId);
    setCurrentEventId(null);
  };

  return (
    <>
      <div className="api-list-panel">
        <Tabs activeId={activeTabId} onChange={handleTabChange}>
          <TabPan id="all" title="全部">
            <ListAll
              {...{
                activeTestId,
                setActiveTestId,
                testPlanList,
                projectEvents,
                currentInfo,
                statusList,
                handleEventItemClick,
              }}
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
