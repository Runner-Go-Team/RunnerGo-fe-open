import { Checkbox, Input, InputNumber, Select } from '@arco-design/web-react';
import React from 'react'
import { Scene_Element } from '@constants/sceneStep';
import SettingsAndAsserts from '../SettingsAndAsserts';
import SelectElements from '../../SelectElements';

const Option = Select.Option
const MouseScrolling = (props) => {
  const { data, onChange } = props;
  const types = [
    { key: 'scroll_mouse', name: '鼠标滚动' },
    { key: 'scroll_mouse_element_appears', name: '鼠标滚动到元素出现' },
  ]
  const directions = {
    upAndDown: '上下',
    leftAndRight: '左右'
  }
  const mouse_scrolling = data?.action_detail?.mouse_scrolling || {};
  return (
    <>
      <div className='runnerGo-card-special'>
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>操作方式</label>
          <div className="content">
            <Select
              placeholder='Please select'
              style={{ width: '100%' }}
              onChange={(val) => {
                mouse_scrolling.type = val
                onChange({ ...data, action_detail: { mouse_scrolling } })
              }}
              value={mouse_scrolling?.type || 'scroll_mouse'}
            >
              {types.map(item => (<Option key={item.key} value={item.key}>
                {item.name}
              </Option>))}
            </Select>
          </div>
        </div>
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>滚动方向</label>
          <div className="content">
            <Select
              placeholder='选择滚动方向'
              style={{ width: '100%' }}
              onChange={(val) => {
                mouse_scrolling.direction = val
                onChange({ ...data, action_detail: { mouse_scrolling } })
              }}
              value={mouse_scrolling?.direction || 'upAndDown'}
            >
              {Object.keys(directions).map(key => (
                <Option key={key} value={key}>
                  {directions[key]}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        {mouse_scrolling?.type == 'scroll_mouse' && (
          <>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>滚动距离 </label>
              <div className="content">
                <InputNumber
                  placeholder='请输入滚动距离'
                  min={0}
                  max={9999}
                  style={{ width: '100%', height: 40 }}
                  value={mouse_scrolling?.scroll_distance || 0}
                  onChange={(val) => {
                    mouse_scrolling.scroll_distance = val
                    onChange({ ...data, action_detail: { mouse_scrolling } })
                  }}
                />
              </div>
            </div>
            <div className="tips">选择元素后则在指定元素上滚动</div>
          </>
        )}

        {mouse_scrolling?.type == 'scroll_mouse_element_appears' && (
          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>单次滚动距离 </label>
            <div className="content">
              <InputNumber
                placeholder='请输入单次滚动距离'
                min={1}
                max={9999}
                style={{ width: '100%', height: 40 }}
                value={mouse_scrolling?.single_scroll_distance || 1}
                onChange={(val) => {
                  mouse_scrolling.single_scroll_distance = val
                  onChange({ ...data, action_detail: { mouse_scrolling } })
                }}
              />
            </div>
          </div>
        )}
        <SelectElements value={mouse_scrolling?.element || {...Scene_Element}} onChange={(val) => {
          mouse_scrolling.element = val;
          onChange({ ...data, action_detail: { mouse_scrolling } })
        }} />
      </div>
      <SettingsAndAsserts data={data} onChange={onChange} />
    </>
  )
}
export default MouseScrolling;