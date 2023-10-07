import { Checkbox, Input, InputTag, Select, Tooltip } from '@arco-design/web-react';
import React, { useEffect, useState } from 'react'
import { DEFAULT_ASSERT, ASSERT_TYPES, Scene_Element } from '@constants/sceneStep';
import SettingsAndAsserts from '../SettingsAndAsserts';
import { isArray } from 'lodash';
import SelectElements from '../../SelectElements';
import TargetTexts from '../components/TargetTexts';
import { IconQuestionCircle } from '@arco-design/web-react/icon';

const Option = Select.Option;
const AssertItem = (props) => {
  const { data, onChange } = props;
  const assert = data || DEFAULT_ASSERT;
  console.log(data, "AssertItemData");
  const condition_types = {
    // CSSValue: '元素的CssValue',
    TagName: '元素的标签名称',
    InputText:'输入框的值',
    // Scope:,
    // Size: '元素的size',
    ElementCount: '元素个数',
    Text: '元素的文本',
    // TextColor: '文字色',
    // BackgroundColor: '背景色'
  }
  const assert_attributes = {
    url: "页面url",
    title: "页面标题",
    // handle: "页面句柄",
    // html: "页面HTML"
  }
  const relation_options = {
    Equal: '相等',
    NotEqual: '不相等',
    Contains: '包含',
    NotContains: '不包含',
    GreaterThan: '大于',
    LessThan: '小于',
    NotEqualTo: '不等于',
    GreaterThanorEqualTo: '大于等于',
    LessThanorEqualTo: '小于等于',
    Regex: '正则断言'
  }
 
  const elements = ['element_exists', 'element_not_exists', 'element_displayed', 'element_not_displayed', 'element_attribute_assertion'];
  return (
    <div className='assert-item-content'>
      <div className='runnerGo-card-special'>
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>断言类型</label>
          <div className="content">
            <Select
              placeholder='Please select'
              style={{ width: '100%' }}
              onChange={(val) => {
                onChange({ ...assert, type: val })
              }}
              value={assert?.type || 'element_exists'}
            >
              {Object.keys(ASSERT_TYPES).map(key => (
                <Option key={key} value={key}>
                  {ASSERT_TYPES[key]}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        {elements.includes(assert?.type) && (
          <SelectElements value={assert?.element || {...Scene_Element}} onChange={(val) => {
            onChange({ ...assert, element: val })
          }} />
        )}
        {(assert?.type == 'text_exists' || assert?.type == 'text_not_exists') && (
          <>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>目标文本 
              <Tooltip position='top' trigger='hover' content={'支持添加多组目标文本，将等待至所有目标文本同时存在'}>
              <IconQuestionCircle />
            </Tooltip>
              </label>
              <div className="content">
                <TargetTexts
                  data={assert?.[assert?.type]?.target_texts || []}
                  onChange={(val) => {
                    if (isArray(val)) {
                      assert[assert?.type].target_texts = val;
                      onChange({ ...assert })
                    }
                  }}
                />
              </div>
            </div>
          </>
        )}
        {assert?.type == 'variable_assertion' && (
          <>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>断言关系 </label>
              <div className="content">
                <Select
                  placeholder='Please select'
                  style={{ width: '100%' }}
                  onChange={(val) => {
                    console.log(val);
                    assert.variable_assertion.relation_options = val;
                    onChange({ ...assert })
                  }}
                  value={assert?.variable_assertion?.relation_options || 'Equal'}
                >
                  {Object.keys(relation_options).map(key => (<Option key={key} value={key}>
                    {relation_options[key]}
                  </Option>))}
                </Select>
              </div>
            </div>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>实际值 </label>
              <div className="content">
                <Input value={assert?.variable_assertion?.actual_value} onChange={(val) => {
                  assert.variable_assertion.actual_value = val;
                  onChange({ ...assert })
                }} style={{ width: '100%', height: 40 }} placeholder={'填写实际值'} />
              </div>
            </div>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>期望值 </label>
              <div className="content">
                <Input value={assert?.variable_assertion?.expected_value} onChange={(val) => {
                  assert.variable_assertion.expected_value = val;
                  onChange({ ...assert })
                }} style={{ width: '100%', height: 40 }} placeholder={'填写期望值'} />
              </div>
            </div>
          </>
        )}
        {assert?.type == 'expression_assertion' && (
          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>期望值 </label>
            <div className="content">
              <Input value={assert?.expression_assertion?.expected_value} onChange={(val) => {
                assert.expression_assertion.expected_value = val;
                onChange({ ...assert })
              }} style={{ width: '100%', height: 40 }} placeholder={'支持==，===，<，<=，>，>=，&&，||，!=以及&，|，!运算符'} />
            </div>
          </div>
        )}
        {assert?.type == 'element_attribute_assertion' && (
          <>
           <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>条件类型 </label>
              <div className="content">
                <Select
                  placeholder='Please select'
                  style={{ width: '100%' }}
                  onChange={(val) => {
                    console.log(val);
                    assert.element_attribute_assertion.condition_type = val;
                    onChange({ ...assert })
                  }}
                  value={assert?.element_attribute_assertion?.condition_type || 'TagName'}
                >
                  {Object.keys(condition_types).map(key => (<Option key={key} value={key}>
                    {condition_types[key]}
                  </Option>))}
                </Select>
              </div>
            </div>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>断言关系 </label>
              <div className="content">
                <Select
                  placeholder='Please select'
                  style={{ width: '100%' }}
                  onChange={(val) => {
                    console.log(val);
                    assert.element_attribute_assertion.relation_options = val;
                    onChange({ ...assert })
                  }}
                  value={assert?.element_attribute_assertion?.relation_options || 'Equal'}
                >
                  {Object.keys(relation_options).map(key => (<Option key={key} value={key}>
                    {relation_options[key]}
                  </Option>))}
                </Select>
              </div>
            </div>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>期望值 </label>
              <div className="content">
                <Input value={assert?.element_attribute_assertion?.expected_value} onChange={(val) => {
                  assert.element_attribute_assertion.expected_value = val;
                  onChange({ ...assert })
                }} style={{ width: '100%', height: 40 }} placeholder={'填写期望值'} />
              </div>
            </div>
          </>
        )}
        {assert?.type == 'page_attribute_assertion' && (
          <>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>断言属性 </label>
              <div className="content">
                <Select
                  placeholder='Please select'
                  style={{ width: '100%' }}
                  onChange={(val) => {
                    console.log(val);
                    assert.page_attribute_assertion.assert_attribute = val;
                    onChange({ ...assert })
                  }}
                  value={assert?.page_attribute_assertion?.assert_attribute || 'url'}
                >
                  {Object.keys(assert_attributes).map(key => (<Option key={key} value={key}>
                    {assert_attributes[key]}
                  </Option>))}
                </Select>
              </div>
            </div>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>断言关系 </label>
              <div className="content">
                <Select
                  placeholder='Please select'
                  style={{ width: '100%' }}
                  onChange={(val) => {
                    console.log(val);
                    assert.page_attribute_assertion.relation_options = val;
                    onChange({ ...assert })
                  }}
                  value={assert?.page_attribute_assertion?.relation_options || 'Equal'}
                >
                  {Object.keys(relation_options).map(key => (<Option key={key} value={key}>
                    {relation_options[key]}
                  </Option>))}
                </Select>
              </div>
            </div>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>期望值 </label>
              <div className="content">
                <Input value={assert?.page_attribute_assertion?.expected_value} onChange={(val) => {
                  assert.page_attribute_assertion.expected_value = val;
                  onChange({ ...assert })
                }} style={{ width: '100%', height: 40 }} placeholder={'填写期望值'} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
export default AssertItem;