import { Button, Checkbox, Drawer, Dropdown, Input, InputNumber, Menu, Select } from '@arco-design/web-react';
import React, { useState } from 'react'
import SettingsAndAsserts from '../SettingsAndAsserts';
import ConditionOperators from '../IfCondition/conditionOperators';
import './index.less';
import { cloneDeep, isString } from 'lodash';

const Option = Select.Option;
const WhileLoop = (props) => {
  const { data, onChange } = props;
  console.log(data, "OpenPagepropsdata");
  const types = {
    condition_step: '条件步骤',
    expression: '表达式'
  }
  const condition_relates = {
    and: '且',
    or: '或'
  }

  const while_loop = data?.action_detail?.while_loop || {};
  return (
    <>
      <div className='runnerGo-card-special'>
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>条件关系</label>
          <div className="content">
            <Select
              placeholder='Please select'
              style={{ width: '100%' }}
              onChange={(val) => {
                while_loop.condition_relate = val;
                onChange({ ...data, action_detail: { while_loop } })
              }}
              value={while_loop?.condition_relate || 'and'}
            >
              {Object.keys(condition_relates).map(key => (
                <Option key={key} value={key}>
                  {condition_relates[key]}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <ConditionOperators data={while_loop?.condition_operators || []} onChange={(val) => {
          while_loop.condition_operators = val;
          onChange({ ...data, action_detail: { while_loop } })
        }} />
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>最大次数</label>
          <div className="content">
            <InputNumber
              placeholder='请输入最大次数,最大20次'
              min={1}
              max={20}
              style={{ width: '100%', height: 40 }}
              value={while_loop?.max_count || 1}
              onChange={(val) => {
                while_loop.max_count = val;
                onChange({ ...data, action_detail: { while_loop } })
              }}
            />
          </div>
        </div>
      </div>
      <SettingsAndAsserts data={data} onChange={onChange} hiddenAssert={true} />
    </>
  )
}
export default WhileLoop;