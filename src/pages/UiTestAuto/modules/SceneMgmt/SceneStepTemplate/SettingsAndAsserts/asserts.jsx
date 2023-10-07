import { Button, Dropdown, InputTag, Menu, Message, Select } from '@arco-design/web-react';
import { IconDelete, IconDown, IconMore, IconPlusCircle, IconRight } from '@arco-design/web-react/icon';
import { DEFAULT_ASSERT, ASSERT_TYPES } from '@constants/sceneStep';
import AssertItem from '../Assert/assertItem';
import { cloneDeep, isArray } from 'lodash';
import React from 'react'

const Option = Select.Option
const Asserts = (props) => {
  const { data, onChange } = props;

  const addAssert = (type) => {
    if (DEFAULT_ASSERT) {
      const new_assert = cloneDeep(DEFAULT_ASSERT)
      new_assert.type = type;
      new_assert.show = true;
      onChange([...data, new_assert])
    } else {
      Message.error('不支持的类型')
    }
  }

  const deleteAssert = (index) => {
    const temp_data = cloneDeep(data);
    temp_data.splice(index, 1)
    onChange(temp_data);
  }

  const updateAssert = (index, newItem) => {
    const temp_data = cloneDeep(data);
    temp_data[index] = newItem
    onChange(temp_data);
  }

  const dropList = (<Menu onClickMenuItem={(key,e)=>{
    e.stopPropagation();
    addAssert(key)
  }}>
    {Object.keys(ASSERT_TYPES).map(key => (<Menu.Item key={key}>{ASSERT_TYPES[key]}</Menu.Item>))}
  </Menu>)
  const moreDropList = (item, index) => (<Menu onClickMenuItem={(key) => {
    const temp_data = cloneDeep(data);
    if (key == 'copy') {
      temp_data.splice(index, 0, item)
    } else if (key == 'delete') {
      temp_data.splice(index, 1)
    }
    onChange(temp_data);
  }}>
    <Menu.Item key={'copy'}>{'复制'}</Menu.Item>
    <Menu.Item key={'delete'}>{'删除'}</Menu.Item>
  </Menu>)

  const plusDropList = (index) => (<Menu onClickMenuItem={(type) => {
    if (DEFAULT_ASSERT) {
      const new_assert = cloneDeep(DEFAULT_ASSERT)
      new_assert.type = type;
      const temp_data = cloneDeep(data);
      temp_data.splice(index, 0, new_assert)
    } else {
      Message.error('不支持的类型')
    }
  }}>
    {Object.keys(ASSERT_TYPES).map(key => (<Menu.Item key={key}>{ASSERT_TYPES[key]}</Menu.Item>))}
  </Menu>)

  const unpackAssertItem = (index, item) => {
    const temp_data = cloneDeep(data);
    item.show = !item?.show
    temp_data[index] = item
    onChange(temp_data);
  }

  return (
    <div className='asserts'>
      <div className="add-assert">
        {isArray(data) && data.map((item, index) => (
          <div className="assert-item">
            <div className="assert-item-header" onClick={()=>unpackAssertItem(index, item)}>
              <div className="header-left">
                <div className="type">{ASSERT_TYPES?.[item?.type]}</div>
              </div>
              <div className="header-right">
                {/* <Dropdown droplist={plusDropList(index)} trigger='click' position='br'>
                  <IconPlusCircle fontSize={20} />
                </Dropdown> */}
                {/* <Dropdown droplist={moreDropList(item, index)} trigger='click' position='br'>
                  <IconMore fontSize={20} />
                </Dropdown> */}
                <IconDelete onClick={(e) => {
                  e.stopPropagation();
                  deleteAssert(index)
                }} />
                {!item?.show ? <IconRight /> : <IconDown />}
              </div>
            </div>
            {item?.show && <AssertItem data={item} onChange={(val) => {
              updateAssert(index, val);
            }} />}
          </div>
        ))}
        <Dropdown droplist={dropList} trigger='click' position='bottom'>
          <Button>添加断言</Button>
        </Dropdown>
      </div>
    </div>
  )
}
export default Asserts;