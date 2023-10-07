import { Checkbox, Input } from '@arco-design/web-react';
import React from 'react'
import SettingsAndAsserts from '../SettingsAndAsserts';

const OpenPage = (props) => {
  const { data, onChange } = props;
  const open_page = data?.action_detail?.open_page || {};

  return (
    <>
      <div className='runnerGo-card-special'>
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>输入URL</label>
          <div className="content">
            <Input value={open_page?.url || ''} onChange={(val) => {
              open_page.url = val;
              onChange({ ...data, action_detail: { open_page } })
            }} style={{ width: '100%', height: 40 }} placeholder={'请输入URL'} />
          </div>
        </div>
        <Checkbox onChange={(val)=>{
        open_page.is_new_page = val
        onChange({ ...data, action_detail: { open_page } })
        }} checked={open_page?.is_new_page}>追加页面（勾选后则在新的页面打开URL，不勾选覆盖当前URL）</Checkbox>
      </div>
      <SettingsAndAsserts data={data} onChange={onChange}/>
    </>
  )
}
export default OpenPage;