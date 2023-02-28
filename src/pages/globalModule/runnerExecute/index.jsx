import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Drawer } from 'adesign-react';
import { Close as CloseSvg, Down as SvgDown } from 'adesign-react/icons';
import { isArray, isFunction, isObject, isString } from 'lodash';
import { singleTest } from '@rxUtils/runner';
import produce from 'immer';
import TestResult from '@components/TestResult';
import { saveProcessReports } from '@services/test';
import { pushTask } from '@asyncTasks/index';

import MiniTest from './miniMode';
import './index.less';
import SingleTest from './singleTest';
import CombinedTest from './combinedTest';

const ExecuteInfo = () => {
  const { desktop_proxy } = useSelector((store) => store?.desktopProxy);
  const project_id = useSelector((store) => store?.workspace?.CURRENT_PROJECT_ID);

  // 当前正在运行中的测试信息
  const currentTest = useSelector((store) => store?.runner?.currentTest);

  const dispatch = useDispatch();

  const [activeTestId, setActiveTestId] = useState(null);
  const [miniMode, setMiniMode] = useState(false); // 是否迷你模式
  const [eventList, setEventList] = useState(null);
  const [activeTabId, setActiveTabId] = useState('all');
  const [currentInfo, setCurrentInfo] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [completeInfo, setCompleteInfo] = useState(null);
  const [logList, setLogList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [testPlanList, setTestPlanList] = useState([]);

  useEffect(() => {
    setMiniMode(false);
    setEventList([]);
    setCurrentInfo(null);
    setCurrentProgress(0);
    setCompleteInfo(null);
    setLogList([]);
    setStatusList([]);
    setCurrentEventId(null);
    setTestPlanList([]);
    setActiveTestId(null);
    if (isString(currentTest.run_id)) {
      singleTest.getLocalTestDataInfo(currentTest.run_id).then((dataInfo) => {
        const listData = dataInfo?.event_list;
        if (isArray(listData)) {
          const sortedList = listData.sort((a, b) => a.sort - b.sort);
          setEventList(sortedList);
        }
      });
    }
  }, [currentTest]);

  useEffect(() => {
    const listener = (resp) => {
      if (resp.data.action === 'progress') {
        setCurrentProgress(resp.data.progress);
        setActiveTestId(resp.data.test_id);
      } else if (resp.data.action === 'current_event_id') {
        setCurrentInfo(resp.data);
        setLogList(
          produce((draft) => {
            if (isObject(resp?.data?.test_log)) {
              draft.push(resp.data.test_log);
            }
          })
        );
      } else if (resp.data.action === 'complate' && isObject(resp?.data?.test_report)) {
        const reportInfo = resp?.data?.test_report;
        setStatusList(reportInfo.event_status);
        setTestPlanList(isArray(reportInfo.children) ? reportInfo.children : []);

        const allLogList = produce(logList, (draft) => {
          if (isArray(resp?.data?.ignore_events)) {
            resp?.data?.ignore_events.forEach((item) => {
              draft.push(item);
            });
          }
        });
        setLogList(allLogList);
        // TestReports.put({
        //   ...reportInfo,
        //   project_id,
        //   logList: allLogList,
        // });
        saveProcessReports({
          ...reportInfo,
          project_id,
          logList: allLogList,
          is_socket: 1,
        }).subscribe({
          next(resp) {
            if (resp?.code === 10000) {
            }
          },
          error(err) {
            pushTask({
              task_id: `${project_id}/${reportInfo.report_id}`,
              action: 'SAVE',
              model: 'TEST_REPORT',
              payload: reportInfo.report_id,
              project_id,
            });
          },
        });
        setCompleteInfo(resp.data);
        setCurrentInfo(null);
      }
    };

    if (isFunction(desktop_proxy?.on)) {
      desktop_proxy.on('runtime_response', listener);
    }
    return () => {
      if (isFunction(desktop_proxy?.off)) {
        desktop_proxy.off('runtime_response', listener);
      }
    };
  }, [desktop_proxy, logList]);

  const handleStopRun = () => {
    // 如果还未结束，则停止测试
    if (currentProgress !== 1) {
      desktop_proxy.emit('stop');
    }

    dispatch({
      type: 'global/updateModuleType',
      payload: null,
    });
    setCurrentProgress(0);
    dispatch({
      type: 'runner/setCurrentTest',
      payload: null,
    });
  };

  // 查看更多
  const handleEventItemClickMore = (event) => {
    const status = statusList?.[event?.event_id];
    if (!isString(status)) {
      return;
    }
    setCurrentEventId(event.event_id);
    setActiveTabId(status);
  };

  const handleTabChange = (activeid) => {
    setActiveTabId(activeid);
    setCurrentEventId(null);
  };

  return (
    <>
      {miniMode === true && currentTest !== null && (
        <MiniTest
          currentProgress={currentProgress}
          onRestore={setMiniMode.bind(null, false)}
          title={currentTest?.name}
          onStop={handleStopRun}
        />
      )}
      {miniMode === false && (
        <Drawer
          onCancel={setMiniMode.bind(null, true)}
          visible
          placement="bottom"
          height="80vh"
          title={null}
          footer={null}
          closable={false}
        >
          <div className="test-warpper">
            <div className="test-header">
              <div className="header-title">测试结果</div>
              <div className="right-btns">
                <Button
                  onClick={handleStopRun}
                  type="error"
                  className="btn-stop"
                  preFix={
                    currentProgress === 1 ? (
                      <CloseSvg width={16} style={{ fill: 'var(--base-color-brand)' }}></CloseSvg>
                    ) : (
                      <div className="stop-fix"></div>
                    )
                  }
                >
                  {currentProgress === 1 ? '关闭窗口' : '停止测试'}
                </Button>
                <Button className="btn-hide" onClick={setMiniMode.bind(null, true)}>
                  <SvgDown />
                </Button>
              </div>
            </div>
            <div className="test-process">
              <div className="process-title">
                执行进度:{`${(currentProgress * 100).toFixed(2)}%`}
              </div>
              <div className="process-bar">
                <div className="bar" style={{ width: `${currentProgress * 100}%` }}></div>
              </div>
            </div>

            <TestResult {...completeInfo?.test_report} />

            <div className="api-title">接口详情</div>
            {currentTest?.test_type === 'singleTest' && (
              <SingleTest
                {...{
                  activeTabId,
                  handleTabChange,
                  handleEventItemClickMore,
                  eventList,
                  currentInfo,
                  statusList,
                  currentEventId,
                  logList,
                }}
              />
            )}
            {currentTest?.test_type === 'combinedTest' && (
              <CombinedTest
                {...{
                  testPlanList,
                  activeTabId,
                  handleTabChange,
                  handleEventItemClickMore,
                  eventList,
                  currentInfo,
                  statusList,
                  currentEventId,
                  logList,
                  activeTestId,
                  setActiveTestId,
                }}
              />
            )}
          </div>
        </Drawer>
      )}
    </>
  );
};

export default ExecuteInfo;
