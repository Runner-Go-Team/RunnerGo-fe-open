import { Button, Drawer, Dropdown, Input, Menu, Select } from '@arco-design/web-react';
import { cloneDeep, isArray } from 'lodash';
import { DEFAULT_ASSERT, ASSERT_TYPES } from '@constants/sceneStep';
import AssertItem from '../Assert/assertItem';
import React, { useState } from 'react'
import { IconCopy, IconDelete, IconEdit } from '@arco-design/web-react/icon';

const Option = Select.Option
const ConditionOperators = (props) => {
  const { data, onChange } = props;
  const [visible, setVisible] = useState(false);
  const [newAssert, setNewAssert] = useState(null);
  const [updateAssert, setUpdateAssert] = useState(null);

  const stepDropList = (<Menu onClickMenuItem={(key) => {
    if (key == 'assert') {
      const new_assert = cloneDeep(DEFAULT_ASSERT)
      setNewAssert(new_assert);
      setVisible(true);
      console.log('断言操作');
    } else if (key == 'expression') {
      if (isArray(data)) {
        const temp_data = cloneDeep(data);
        temp_data.push({
          type: "expression",
          expression: {
            relation_options:'Equal',
            actual_value:'',
            expected_value:''
          }
        })
        onChange(temp_data)
      }
      console.log('表达式');
    }
  }}>
    <Menu.Item key='assert'>断言操作</Menu.Item>
    <Menu.Item key='expression'>表达式</Menu.Item>
  </Menu>)

  const addConditionOperators = () => {
    if (isArray(data)) {
      const temp_data = cloneDeep(data);
      if (updateAssert) {
        temp_data[updateAssert.index] = {
          type: "assert",
          assert: cloneDeep(updateAssert)
        };
      } else {
        temp_data.push({
          type: "assert",
          assert: cloneDeep(newAssert)
        })
      }

      onChange(temp_data)
      setNewAssert(null);
      setUpdateAssert(null);
      setVisible(false);
    }
  }

  const editOperators = (item, index) => {
    setUpdateAssert({ ...item.assert, index });
    setVisible(true);
  }

  const copyOperators = (item, index) => {
    const temp_data = cloneDeep(data);
    temp_data.splice(index, 0, item)
    onChange(temp_data);
  }

  const deleteOperators = (index) => {
    const temp_data = cloneDeep(data);
    temp_data.splice(index, 1)
    onChange(temp_data);
  }
  const updateExpression = (index,newExpression)=>{
    const temp_data = cloneDeep(data);
    temp_data[index] = newExpression;
    onChange(temp_data);
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
    Regex: '正则匹配'
  }
  return (
    <>
      <div className="conditional-steps">
        {isArray(data) && data.map((item, index) => (
          <div className="conditional-step-item">
            {item?.type == 'assert' && ( <div className="left"><div className="type">{ASSERT_TYPES?.[item?.assert?.type]}</div></div>)}
            {item?.type == 'expression' && <div className="left">
            <Input value={item?.expression?.actual_value || ''} onChange={(val) => {
                item.expression.actual_value = val;
                updateExpression(index,item);
              }} style={{ width: '100%', height: 28 }} placeholder={'{{var}}'} />
                <Select
                  placeholder='选择关系'
                  style={{ width: '100%' }}
                  onChange={(val) => {
                    item.expression.relation_options = val;
                    updateExpression(index,item);
                  }}
                  value={item?.expression?.relation_options || 'Equal'}
                >
                  {Object.keys(relation_options).map(key => (<Option key={key} value={key}>
                    {relation_options[key]}
                  </Option>))}
                </Select>
                <Input value={item?.expression?.expected_value || ''} onChange={(val) => {
                item.expression.expected_value = val;
                updateExpression(index,item);
              }} style={{ width: '100%', height: 28 }} placeholder={'{{var}}'} />
              </div>}
            <div className="right">
              {item?.type == 'assert' && <IconEdit onClick={() => editOperators(item, index)} />}
              <IconCopy onClick={() => copyOperators(item, index)} />
              <IconDelete onClick={() => deleteOperators(index)} /></div>
          </div>
        ))}
         <div className="step-add">
          <Dropdown droplist={stepDropList} trigger='click' position='bottom'>
            <Button>添加条件步骤</Button>
          </Dropdown>
        </div>
      </div>
      <Drawer
        width={500}
        title={'断言'}
        visible={visible}
        onOk={() => {
          addConditionOperators();
        }}
        okText='添加'
        onCancel={() => {
          setUpdateAssert(null);
          setVisible(false);
        }}
      >
        {<AssertItem data={updateAssert || newAssert} onChange={(val) => {
          if (updateAssert) {
            setUpdateAssert(val)
          } else {
            setNewAssert(val)
          }
        }} />}
      </Drawer>
    </>
  )
}
export default ConditionOperators;