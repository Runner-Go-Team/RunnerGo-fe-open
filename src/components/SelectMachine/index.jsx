import React, { useEffect, useState } from 'react'
import './index.less';
import { Input, Checkbox } from '@arco-design/web-react';
import { ServiceGetUiMachineList } from '@services/machine';
import { IconSearch } from '@arco-design/web-react/icon';
import MachineSvg from '@assets/img/machine.svg';
import { lastValueFrom } from 'rxjs';
import { isArray } from 'lodash';

const SelectMachine = (props) => {
  const { maxHeight,selectKey,setSelectKey } = props;
  const [keyword, setKeyword] = useState('');
  const [machineList, setMachineList] = useState([]);

  const getMachineList = async () => {
    const resp = await lastValueFrom(ServiceGetUiMachineList({ keyword }))
    if (resp?.code == 0 && isArray(resp?.data?.list)) {
      setMachineList(resp.data.list);
    }
  }

  useEffect(() => {
    getMachineList();
  }, [keyword])
  console.log(machineList, "machineList");
  return (
    <div className='runnergo-ui-select-machine'>
      <div className="search-header">
        <Input prefix={<IconSearch />} value={keyword} onChange={(val) => setKeyword(val)} style={{ width: '100%', height: 40 }} placeholder={'请输入机器名称'} />
      </div>
      <div style={{ maxHeight: maxHeight || '' }} className="select-machine-list">
        {machineList.length > 0 && machineList.map(item => (<div key={item?.key} className='select-machine-item'>
          <div className="header"><div className="name">{item?.system_info?.hostname || '未命名机器'}</div><Checkbox onChange={(val)=>{
            setSelectKey(item?.key)
          }} checked={selectKey == item?.key} /></div>
          <div className="content">
            <div className="left"><MachineSvg /></div>
            <div className="right">
              <div className="ip right-item text-ellipsis"><label>IP：</label><span className="text text-ellipsis">{item?.ip || ''}</span></div>
              <div className="system right-item text-ellipsis"><label>操作系统：</label><span className="text text-ellipsis">{item?.system_info?.system_basic || ''}</span></div>
              <div className="arch right-item text-ellipsis"><label>架构：</label><span className="text text-ellipsis">{item?.system_info?.machine || ''}</span></div>
              <div className="processor right-item text-ellipsis"><label>处理器：</label><span className="text text-ellipsis">{item?.system_info?.processor || ''}</span></div>
              <div className="task-number right-item text-ellipsis"><label>当前任务数：</label><span className="text text-ellipsis">{item?.current_task || 0}</span></div>
            </div>
          </div>
        </div>))}
      </div>
    </div>
  )
}
export default SelectMachine