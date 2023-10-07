import { Checkbox, Input, InputNumber, Select } from '@arco-design/web-react';
import React from 'react'
import SettingsAndAsserts from '../SettingsAndAsserts';
import SelectElements from '../../SelectElements';

const Option = Select.Option
const MouseMovement = (props) => {
  const { data, onChange } = props;
  const types = {
    'move_to_target_point': '移动至目标点',
  }
  console.log(data, "OpenPagepropsdata");
  const mouse_movement = data?.action_detail?.mouse_movement || {};
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
                mouse_movement.type = val
                onChange({ ...data, action_detail: { mouse_movement } })
              }}
              value={mouse_movement?.type || 'move_to_target_point'}
            >
              {Object.keys(types).map(key => (<Option key={key} value={key}>
                {types[key]}
              </Option>))}
            </Select>
          </div>
        </div>
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>终点坐标 </label>
          <div className="content flex-gap-10">
            <InputNumber
              placeholder='输入 X'
              min={0}
              max={9999}
              style={{ width: '50%', height: 40 }}
              value={mouse_movement?.end_point_coordinates?.x || 0}
              onChange={(val) => {
                mouse_movement.end_point_coordinates.x = val
                onChange({ ...data, action_detail: { mouse_movement } })
              }}
            />
            <InputNumber
              placeholder='输入 Y'
              min={0}
              max={9999}
              style={{ width: '50%', height: 40 }}
              value={mouse_movement?.end_point_coordinates?.y || 0}
              onChange={(val) => {
                mouse_movement.end_point_coordinates.y = val
                onChange({ ...data, action_detail: { mouse_movement } })
              }}
            />
          </div>
        </div>
        {/* <SelectElements value={mouse_movement?.element} onChange={(val) => {
          mouse_movement.element = val;
          onChange({ ...data, action_detail: { mouse_movement } })
        }} /> */}
      </div>
      <SettingsAndAsserts data={data} onChange={onChange} />
    </>
  )
}
export default MouseMovement;