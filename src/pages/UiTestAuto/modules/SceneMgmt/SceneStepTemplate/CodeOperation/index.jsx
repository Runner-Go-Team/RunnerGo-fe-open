import { Checkbox, Input, InputNumber, Select } from '@arco-design/web-react';
import React from 'react'
import SettingsAndAsserts from '../SettingsAndAsserts';
import MonacoEditor from '@components/MonacoEditor';
import SelectElements from '../../SelectElements';

const Option = Select.Option;
const CodeOperation = (props) => {
  const { data, onChange } = props;
  const types = {
    javascript: 'JavaScript'
  }
  const operationTypes= {
    element:'元素操作',
    page:'页面操作'
  }
  // "first","previous","next","last","custom_index","custom_handle_id"
  console.log(data, "OpenPagepropsdata");
  const code_operation = data?.action_detail?.code_operation || {};
  return (
    <>
      <div className='runnerGo-card-special'>
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>代码类型</label>
          <div className="content">
            <Select
              placeholder='请选择代码类型'
              style={{ width: '100%' }}
              onChange={(val) => {
                code_operation.type = val
                onChange({ ...data, action_detail: { code_operation } })
              }}
              value={code_operation?.type || 'javascript'}
            >
              {
                Object.keys(types).map(key => (
                  <Option key={key} value={key}>
                    {types[key]}
                  </Option>
                ))
              }
            </Select>
          </div>
        </div>
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>操作类型</label>
          <div className="content">
            <Select
              placeholder='请选择操作类型'
              style={{ width: '100%' }}
              onChange={(val) => {
                code_operation.operation_type = val
                onChange({ ...data, action_detail: { code_operation } })
              }}
              value={code_operation?.operation_type || 'element'}
            >
              {
                Object.keys(operationTypes).map(key => (
                  <Option key={key} value={key}>
                    {operationTypes[key]}
                  </Option>
                ))
              }
            </Select>
          </div>
        </div>
        {code_operation?.operation_type == 'element' && (
          <SelectElements value={code_operation?.element || { ...Scene_Element }} onChange={(val) => {
            code_operation.element = val;
            onChange({ ...data, action_detail: { code_operation } })
          }} />
        )}
        <div className='runnerGo-card-special-item'>
          <label>编辑器</label>
          <div className="content">
            <MonacoEditor
              value={code_operation?.code_text || ''}
              style={{ minHeight: '200px' }}
              Height="200px"
              language="javascript"
              onChange={(val) => {
                code_operation.code_text = val;
                onChange({ ...data, action_detail: { code_operation } })
              }}
            />
          </div>
        </div>
      </div>
      <SettingsAndAsserts data={data} onChange={onChange} />
    </>
  )
}
export default CodeOperation;