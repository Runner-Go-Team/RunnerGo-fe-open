import { Checkbox, Input, InputNumber, Select } from '@arco-design/web-react';
import React from 'react'
import { Scene_Element } from '@constants/sceneStep';
import SettingsAndAsserts from '../SettingsAndAsserts';
import SelectElements from '../../SelectElements';

const Option = Select.Option
const MouseClicking = (props) => {
  const { data, onChange } = props;
  const types = [
    { key: 'single_click_left', name: '单击（左击）' },
    { key: 'single_click_right', name: '单击（右击）' },
    { key: 'double_click', name: '双击' },
    { key: 'long_press', name: '长按' },
  ]
  console.log(data, "OpenPagepropsdata");
  const mouse_clicking = data?.action_detail?.mouse_clicking || {};
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
                mouse_clicking.type = val
                onChange({ ...data, action_detail: { mouse_clicking } })
              }}
              value={mouse_clicking?.type || 'single_click_left'}
            >
              {types.map(item => (<Option key={item.key} value={item.key}>
                {item.name}
              </Option>))}
            </Select>
          </div>
        </div>
        <SelectElements value={mouse_clicking?.element || {...Scene_Element}} onChange={(val) => {
          mouse_clicking.element = val;
          onChange({ ...data, action_detail: { mouse_clicking } })
        }} />
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>点击位置 </label>
          <div className="content flex-gap-10">
            <InputNumber
              placeholder='输入 X'
              min={0}
              max={9999}
              style={{ width: '50%', height: '38px' }}
              value={mouse_clicking?.click_position?.x || 0}
              onChange={(val) => {
                mouse_clicking.click_position.x = val
                onChange({ ...data, action_detail: { mouse_clicking } })
              }}
            />
            <InputNumber
              placeholder='输入 Y'
              min={0}
              max={9999}
              style={{ width: '50%', height: '38px' }}
              value={mouse_clicking?.click_position?.y || 0}
              onChange={(val) => {
                mouse_clicking.click_position.y = val
                onChange({ ...data, action_detail: { mouse_clicking } })
              }}
            />
          </div>
        </div>
        <div className="tips">控制鼠标在元素上的点击位置，默认元素的左上角为 0,0</div>
      </div>
      <SettingsAndAsserts data={data} onChange={onChange} />
    </>
  )
}
export default MouseClicking;