import { Input, ResizeBox, Tooltip } from '@arco-design/web-react';
import React, { useEffect, useRef, useState } from 'react'
import ElementTree from './ElementTree';
import ElementContent from './ElementContent';
import ElementMgmtContext from './context';
import './index.less';
import Bus from '@utils/eventBus';
import { DEFABLR_SEARCH } from '@constants/element';

const ElementMgmt = () => {
  const [selectKey, setSelectKey] = useState('0');
  const [searchOptions, setSearchOptions] = useState(['name', 'locator_value']);
  const [selectElementIds,setSelectElementIds]=useState([]);
  const [search, setSearch] = useState(DEFABLR_SEARCH);
  const { Provider } = ElementMgmtContext;
  useEffect(() => {
    // 初始化元素目录列表
    Bus.$emit('element/getElementFolderList')
  }, [])
  return (
    <Provider value={{
      selectKey,
      setSelectKey,
      searchOptions,
      setSearchOptions,
      search,
      setSearch,
      selectElementIds,
      setSelectElementIds
    }}>
      <div className='runnerGo-element-mgmt'>
        <ResizeBox
          directions={['right']}
          className='runnerGo-element-mgmt-left'
          resizeTriggers={{
            right: <div className='resizebox-ustom-trigger-vertical'></div>,
          }}
        >
          <ElementTree selectKey={selectKey} setSelectKey={setSelectKey} />
        </ResizeBox>
        <div className="right">
          <ElementContent />
        </div>
      </div>
    </Provider>
  )
}
export default ElementMgmt;