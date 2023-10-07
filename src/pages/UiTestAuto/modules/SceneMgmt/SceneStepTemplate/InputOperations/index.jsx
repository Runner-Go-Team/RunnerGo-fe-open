import { Checkbox, Input, Select } from '@arco-design/web-react';
import React from 'react'
import { Scene_Element } from '@constants/sceneStep';
import SettingsAndAsserts from '../SettingsAndAsserts';
import SelectElements from '../../SelectElements';

const Option = Select.Option
const InputOperations = (props) => {
  const { data, onChange } = props;

  console.log(data, "OpenPagepropsdata");
  const types = {
    input_on_element: '在元素上输入',
    input_at_cursor_position: '在光标处输入'
  }
  const input_operations = data?.action_detail?.input_operations || {};
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
                input_operations.type = val;
                onChange({ ...data, action_detail: { input_operations } })
              }}
              value={input_operations?.type || 'input_on_element'}
            >
              {Object.keys(types).map(key => (
                <Option key={key} value={key}>
                  {types[key]}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        {input_operations?.type == 'input_on_element' && (
          <>
            <SelectElements value={input_operations?.element || {...Scene_Element}} onChange={(val) => {
              input_operations.element = val;
              onChange({ ...data, action_detail: { input_operations } })
            }} />
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>输入内容 </label>
              <div className="content">
                <Input value={input_operations?.input_content} onChange={(val) => {
                  input_operations.input_content = val;
                  onChange({ ...data, action_detail: { input_operations } })
                }} style={{ width: '100%', height: 40 }} placeholder={'输入内容'} />
              </div>
            </div>
            <Checkbox onChange={(val) => {
              input_operations.is_append_content = val;
              onChange({ ...data, action_detail: { input_operations } })
            }} checked={input_operations?.is_append_content}>追加输入（勾选则在现有内容后追加输入；不勾选则清空现有内容后再进行输入）</Checkbox>
          </>
        )}
        {input_operations?.type == 'input_at_cursor_position' && (
          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>输入内容 </label>
            <div className="content">
              <Input value={input_operations?.input_content || ''} onChange={(val) => {
                input_operations.input_content = val;
                onChange({ ...data, action_detail: { input_operations } })
              }} style={{ width: '100%', height: 40 }} placeholder={'输入内容'} />
            </div>
          </div>
        )}
      </div>
      <SettingsAndAsserts data={data} onChange={onChange} />
    </>
  )
}
export default InputOperations;