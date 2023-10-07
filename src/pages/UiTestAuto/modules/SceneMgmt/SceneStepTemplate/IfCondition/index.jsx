import { Button, Checkbox, Drawer, Dropdown, Input, Menu, Select } from '@arco-design/web-react';
import React, { useState } from 'react'
import SettingsAndAsserts from '../SettingsAndAsserts';
import ConditionOperators from './conditionOperators';
import './index.less';
import { cloneDeep } from 'lodash';

const Option = Select.Option;
const IfCondition = (props) => {
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

  const if_condition = data?.action_detail?.if_condition || {};
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
                if_condition.condition_relate = val;
                onChange({ ...data, action_detail: { if_condition } })
              }}
              value={if_condition?.condition_relate || 'and'}
            >
              {Object.keys(condition_relates).map(key => (
                <Option key={key} value={key}>
                  {condition_relates[key]}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <ConditionOperators data={if_condition?.condition_operators || []} onChange={(val) => {
          if_condition.condition_operators = val;
          onChange({ ...data, action_detail: { if_condition } })
        }} />
      </div>
      <SettingsAndAsserts data={data} onChange={onChange} hiddenAssert={true} hiddenDataWithdraw={true} />
    </>

  )
}
export default IfCondition;