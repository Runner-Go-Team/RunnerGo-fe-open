import { Checkbox, Input, InputNumber, Select } from '@arco-design/web-react';
import React from 'react'
import { Scene_Element } from '@constants/sceneStep';
import SettingsAndAsserts from '../SettingsAndAsserts';
import SelectElements from '../../SelectElements';

const Option = Select.Option
const MouseDragging = (props) => {
  const { data, onChange } = props;

  const types = {
    drag_element: '拖动至目标元素',
    drag_to_target_point: '拖动至目标点',
  }
  console.log(data, "OpenPagepropsdata");
  const mouse_dragging = data?.action_detail?.mouse_dragging || {};
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
                mouse_dragging.type = val
                onChange({ ...data, action_detail: { mouse_dragging } })
              }}
              value={mouse_dragging?.type || 'drag_element'}
            >
              {Object.keys(types).map(key => (<Option key={key} value={key}>
                {types[key]}
              </Option>))}
            </Select>
          </div>
        </div>
          <SelectElements title='拖动元素' value={mouse_dragging?.element || {...Scene_Element}} onChange={(val) => {
            mouse_dragging.element = val;
            onChange({ ...data, action_detail: { mouse_dragging } })
          }} />
        {mouse_dragging?.type == 'drag_element' && (
           <SelectElements value={mouse_dragging?.target_element || {...Scene_Element}} onChange={(val) => {
            mouse_dragging.target_element = val;
            onChange({ ...data, action_detail: { mouse_dragging } })
          }} />
          )}
        {mouse_dragging?.type == 'drag_to_target_point' && (
          <>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>终点坐标 </label>
              <div className="content flex-gap-10">
                <InputNumber
                  placeholder='输入 X'
                  min={0}
                  max={9999}
                  style={{ width: '50%', height: 40 }}
                  value={mouse_dragging?.end_point_coordinates?.x || 0}
                  onChange={(val) => {
                    mouse_dragging.end_point_coordinates.x = val
                    onChange({ ...data, action_detail: { mouse_dragging } })
                  }}
                />
                <InputNumber
                  placeholder='输入 Y'
                  min={0}
                  max={9999}
                  style={{ width: '50%', height: 40 }}
                  value={mouse_dragging?.end_point_coordinates?.y || 0}
                  onChange={(val) => {
                    mouse_dragging.end_point_coordinates.y = val
                    onChange({ ...data, action_detail: { mouse_dragging } })
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <SettingsAndAsserts data={data} onChange={onChange} />
    </>
  )
}
export default MouseDragging;