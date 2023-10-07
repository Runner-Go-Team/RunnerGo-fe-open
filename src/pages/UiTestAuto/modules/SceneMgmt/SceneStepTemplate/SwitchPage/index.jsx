import { Checkbox, Input, InputNumber, Select } from '@arco-design/web-react';
import React from 'react'
import { Scene_Element } from '@constants/sceneStep';
import SettingsAndAsserts from '../SettingsAndAsserts';
import SelectElements from '../../SelectElements';

const Option = Select.Option
const SwitchPage = (props) => {
  const { data, onChange } = props;

  const toggle_window_types = [
    { key: 'switch_page', name: '切换到指定窗口' },
    { key: 'exit_frame', name: '退出当前 frame(回到主页面)' },
    { key: 'switch_frame_by_index', name: '根据 frame 索引号切换' },
    { key: 'switch_to_parent_frame', name: '切换到上一层父级frame' },
    { key: 'switch_frame_by_locator', name: '根据定位方式切换 frame' },
  ]
  const window_actions = [
    { key: 'first', name: '第一个' },
    { key: 'previous', name: '上一个' },
    { key: 'next', name: '下一个' },
    { key: 'last', name: '最后一个' },
    { key: 'custom_index', name: '自定义索引' },
    { key: 'custom_handle_id', name: '自定义句柄ID' },
  ]
  console.log(data, "OpenPagepropsdata");
  const toggle_window = data?.action_detail?.toggle_window || {};

  const renderContent = {
    switch_page: (<>
      <div className='runnerGo-card-special-item'>
        <label><span className='required'>*</span>选择跳转目标</label>
        <div className="content">
          <Select
            placeholder='Please select'
            style={{ width: '100%' }}
            onChange={(val) => {
              toggle_window.switch_page.window_action = val
              onChange({ ...data, action_detail: { toggle_window } })
            }}
            value={toggle_window?.switch_page?.window_action || 'first'}
          >
            {window_actions.map(item => (<Option key={item.key} value={item.key}>
              {item.name}
            </Option>))}
          </Select>
        </div>
      </div>
      {(toggle_window?.switch_page?.window_action == 'custom_index' || toggle_window?.switch_page?.window_action == 'custom_handle_id') && (
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>输入内容</label>
          <div className="content">
            <Input value={toggle_window?.switch_page?.input_content || ''} onChange={(val) => {
              toggle_window.switch_page.input_content = val
              onChange({ ...data, action_detail: { toggle_window } })
            }} style={{ width: '100%', height: 40 }} placeholder={'填写网页索引号（数字）/ 句柄ID'} />
          </div>
        </div>
      )}
      {toggle_window?.switch_page?.window_action == 'custom_index' && (<div className='tips'>例: 比如索引值输入 2，那么效果会切换到已经打开过的第 2 个窗口(索引值从 1 开始计算)</div>)}
    </>),
    switch_frame_by_index: (<>
      <div className='runnerGo-card-special-item'>
        <label><span className='required'>*</span>frame 索引</label>
        <div className="content">
          <InputNumber
            placeholder='填写frame 索引'
            min={0}
            max={9999}
            style={{ width: '100%', height: 40 }}
            value={toggle_window?.switch_frame_by_index?.frame_index || 0}
            onChange={(val) => {
              toggle_window.switch_frame_by_index.frame_index = val
              onChange({ ...data, action_detail: { toggle_window } })
            }}
          />
        </div>
      </div>
    </>),
    switch_frame_by_locator: (<>
      <SelectElements value={toggle_window?.switch_frame_by_locator?.element || {...Scene_Element}} onChange={(val) => {
        toggle_window.switch_frame_by_locator.element = val;
        onChange({ ...data, action_detail: { toggle_window } })
      }} />
    </>)
  }

  return (
    <>
      <div className='runnerGo-card-special'>
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>跳转方式</label>
          <div className="content">
            <Select
              placeholder='Please select'
              style={{ width: '100%' }}
              onChange={(val) => {
                toggle_window.type = val
                onChange({ ...data, action_detail: { toggle_window } })
              }}
              value={toggle_window?.type || 'switch_page'}
            >
              {toggle_window_types.map(item => (<Option key={item.key} value={item.key}>
                {item.name}
              </Option>))}
            </Select>
          </div>
        </div>
        {renderContent?.[toggle_window?.type] || null}
      </div>
      <SettingsAndAsserts data={data} onChange={onChange} />
    </>
  )
}
export default SwitchPage;