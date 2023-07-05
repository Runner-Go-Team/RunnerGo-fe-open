import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Bus from '@utils/eventBus';

const UseglobalRef = () => {
  const CURRENT_MOCK_ID = useSelector((store) => store?.mock?.open_api_now);
  const openMockApis = useSelector((store) => store?.mock?.mock_apis_open);
  const mockApis = useSelector((store) => store?.mock?.mock_apis);
  const mockOpenRes = useSelector((store) => store?.mock?.open_res);
  const CURRENT_TEAM_ID = useSelector((store) => store?.user?.team_id);
  const pre_mock_url = useSelector((store) => store?.user?.pre_mock_url);
  
  const refGlobal = useRef({
    CURRENT_MOCK_ID,
    openMockApis,
    mockApis,
    CURRENT_TEAM_ID,
    pre_mock_url,
    mockOpenRes
  });
  // 防止数据被缓存
  useEffect(() => {
    refGlobal.current = {
      CURRENT_MOCK_ID,
      openMockApis,
      mockApis,
      CURRENT_TEAM_ID,
      pre_mock_url,
      mockOpenRes
    };
  }, [
    CURRENT_MOCK_ID,
    openMockApis,
    mockApis,
    CURRENT_TEAM_ID,
    pre_mock_url,
    mockOpenRes
  ]);
  return refGlobal;
};

export default UseglobalRef;
