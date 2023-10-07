import { Button, Checkbox, Input, InputNumber, InputTag, Select, Tooltip } from '@arco-design/web-react';
import React from 'react'
import SettingsAndAsserts from '../SettingsAndAsserts';
import { isArray, isNumber, isString } from 'lodash';
import { Scene_Element } from '@constants/sceneStep';
import SelectElements from '../../SelectElements';
import TargetTexts from '../components/TargetTexts';
import { IconDelete, IconEdit, IconQuestionCircle } from '@arco-design/web-react/icon';

const Option = Select.Option
const WaitEvents = (props) => {
  const { data, onChange } = props;

  console.log(data, "OpenPagepropsdata");
  const types = {
    fixed_time: '等待固定时长',
    element_exist: '等待元素存在',
    element_non_exist: '等待元素不存在',
    element_displayed: '等待元素显示',
    element_not_displayed: '等待元素不显示',
    element_editable: '等待元素可编辑',
    element_not_editable: '等待元素不可编辑',
    // text_appearance: '等待文本出现',
    // text_disappearance: '等待文本消失'
  }
  const wait_events = data?.action_detail?.wait_events || {};
  return (
    <>
      <div className='runnerGo-card-special'>
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>等待类型</label>
          <div className="content">
            <Select
              placeholder='Please select'
              style={{ width: '100%' }}
              onChange={(val) => {
                wait_events.type = val;
                onChange({ ...data, action_detail: { wait_events } })
              }}
              value={wait_events?.type || 'fixed_time'}
            >
              {Object.keys(types).map(key => (
                <Option key={key} value={key}>
                  {types[key]}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        {wait_events?.type == 'fixed_time' && (
          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>等待时间 </label>
            <div className="content flex">
              <InputNumber
                placeholder='输入 等待时间'
                min={1}
                max={9999}
                style={{ width: '100%', height: 40 }}
                value={isNumber(wait_events?.wait_time) ? wait_events.wait_time : 1}
                onChange={(val) => {
                  wait_events.wait_time = val;
                  onChange({ ...data, action_detail: { wait_events } })
                }}
              />s 
            </div>
          </div>
        )}
        {isString(wait_events?.type) && wait_events.type.includes('element') && (
          <SelectElements value={wait_events?.element || {...Scene_Element}} onChange={(val) => {
            wait_events.element = val;
            onChange({ ...data, action_detail: { wait_events } })
          }} />
        )}
        {(wait_events?.type == 'text_appearance' || wait_events?.type == 'text_disappearance') && (
          <>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>
                <Tooltip position='top' trigger='hover' content={'支持添加多组目标文本，将等待至所有目标文本同时存在'}>
                  <IconQuestionCircle />
                </Tooltip>
              </label>
              <div className="content">
                <TargetTexts
                  data={wait_events?.target_texts ? wait_events.target_texts : []}
                  onChange={(val) => {
                    if (isArray(val)) {
                      wait_events.target_texts = val
                      onChange({ ...data, action_detail: { wait_events } })
                    }
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
export default WaitEvents;