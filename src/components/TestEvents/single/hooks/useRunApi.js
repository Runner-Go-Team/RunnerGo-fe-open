import React, { useCallback, useEffect, useState } from 'react';
import { isFunction, isObject, isString } from 'lodash';
import { useSelector } from 'react-redux';
import { getAllEffectCollections } from '@rxUtils/collection';
import { getLocalProjectParams } from '@rxUtils/project/userProject';

const useRunApi = (props) => {
  const { testInfo, eventInfo } = props;
  const { desktop_proxy } = useSelector((store) => store?.desktopProxy);
  const globalVars = useSelector((store) => store?.projects?.globalVars);
  const project_id = useSelector((store) => store.workspace.CURRENT_PROJECT_ID);
  const envDatas = useSelector((store) => store.envs.envDatas);

  const [showRequest, setShowRequest] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [reportInfo, setReportInfo] = useState(null);

  useEffect(() => {
    const listener = (resp) => {
      if (requesting === true && resp?.data?.action === 'current_event_id') {
        if (resp.data.current_event_id === eventInfo?.event_id) {
          setReportInfo(resp.data.test_log);
          setRequesting(false);
          setShowRequest(true);
        } else {
          setReportInfo(null);
          setRequesting(false);
        }
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
  }, [desktop_proxy, requesting]);

  const handleToggleShowRequest = () => {
    setShowRequest((pre) => {
      return !pre;
    });
  };

  const handleToRequest = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (requesting) {
      return;
    }

    const uuid = localStorage.getItem('uuid') || '-1';
    const projectParams = await getLocalProjectParams(project_id, uuid);
    const currentEnv = envDatas[testInfo.details?.env_id];

    // 环境变量信息
    const environmentData = {};
    if (isObject(currentEnv?.list)) {
      Object.entries(currentEnv.list).forEach(([key, envItem]) => {
        let envValue = '';
        if (isString(envItem?.current_value)) {
          envValue = envItem.current_value;
        }
        if (envValue === '' && isString(envItem?.value)) {
          envValue = envItem.value;
        }
        environmentData[key] = envValue;
      });
    }

    const runParams = {
      option: {
        project: projectParams,
        collection: await getAllEffectCollections(project_id, [eventInfo?.data?.target_id]),
        combined_id: '0',
        test_events: {
          test_id: testInfo.test_id,
          name: testInfo?.name,
        },
        default_report_name: `test`,
        user: {},
        env: {
          env_name: currentEnv?.name,
          env_pre_url: currentEnv?.pre_url,
        },
        environment: isObject(environmentData) ? environmentData : {}, // 当前环境变量
        globals: isObject(globalVars) ? globalVars : {}, // 当前公共变量
        iterationData: testInfo?.details?.iteration_data, // 当前迭代的excel导入数据
        iterationCount: testInfo?.details?.execute_count, // 当前迭代次数
        requester: {
          timeout: 2000,
        },
      },
      test_events: [eventInfo],
    };
    setRequesting(true);
    setReportInfo(null);
    desktop_proxy.emit('runner', runParams);
  };

  return {
    showRequest,
    requesting,
    handleToggleShowRequest,
    handleToRequest,
    reportInfo,
  };
};

export default useRunApi;
