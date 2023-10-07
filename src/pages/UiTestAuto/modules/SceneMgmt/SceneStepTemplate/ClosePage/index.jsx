import { Checkbox, Input, InputNumber, Select } from '@arco-design/web-react';
import React from 'react'
import SettingsAndAsserts from '../SettingsAndAsserts';

const Option = Select.Option;
const ClosePage = (props) => {
  const { data, onChange } = props;
  const window_actions = [
    { key: 'first', name: '第一个' },
    { key: 'previous', name: '上一个' },
    { key: 'next', name: '下一个' },
    { key: 'last', name: '最后一个' },
    { key: 'custom_index', name: '自定义索引' },
    { key: 'custom_handle_id', name: '自定义句柄ID' },
    { key: 'all', name: '全部关闭' },
  ]
  // "first","previous","next","last","custom_index","custom_handle_id"
  console.log(data, "OpenPagepropsdata");
  const close_page = data?.action_detail?.close_page || {};
  return (
    <>
      <div className='runnerGo-card-special'>
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>关闭窗口</label>
          <div className="content">
            <Select
              placeholder='Please select'
              style={{ width: '100%' }}
              onChange={(val) => {
                close_page.window_action = val
                onChange({ ...data, action_detail: { close_page } })
              }}
              value={close_page?.window_action || 'first'}
            >
              {window_actions.map(item => (<Option key={item.key} value={item.key}>
                {item.name}
              </Option>))}
            </Select>
          </div>
        </div>
        {(close_page?.window_action == 'custom_handle_id') && (<div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>句柄ID</label>
          <div className="content">
            <Input value={close_page?.input_content || ''} onChange={(val) => {
              close_page.input_content = val
              onChange({ ...data, action_detail: { close_page } })
            }} style={{ width: '100%', height: 40 }} placeholder={'填写句柄ID'} />
          </div>
        </div>)}
        {close_page?.window_action == 'custom_index' && (
          <>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>索引号</label>
              <div className="content">
                <InputNumber
                  placeholder='填写网页索引号（数字）'
                  min={0}
                  max={9999}
                  style={{ width: '100%', height: 40 }}
                  value={close_page?.custom_index || 0}
                  onChange={(val) => {
                    close_page.custom_index = val
                    onChange({ ...data, action_detail: { close_page } })
                  }}
                />
              </div>
            </div>
            <div className="tips">
              例: 比如索引值输入 2，那么效果会切换到已经打开过的第 2 个窗口(索引值从 1 开始计算)
            </div>
          </>
        )}
      </div>
      <SettingsAndAsserts data={data} onChange={onChange} />
    </>
  )
}
export default ClosePage;