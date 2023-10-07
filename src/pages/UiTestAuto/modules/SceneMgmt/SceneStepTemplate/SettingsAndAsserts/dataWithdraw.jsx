import { Button, Dropdown, InputTag, Menu, Message, Select } from '@arco-design/web-react';
import { IconDown, IconMore, IconPlusCircle, IconRight } from '@arco-design/web-react/icon';
import { DEFAULT_DATAWITHDRAW } from '@constants/sceneStep';
import DataWithdrawItem from '../DataWithdraw/dataWithdrawItem';
import { cloneDeep, isArray } from 'lodash';
import React from 'react'

const Option = Select.Option
const DataWithdraw = (props) => {
  const { data, onChange } = props;

  const dataWithdrawTypes = {
    element_method: '获取元素信息',
    webpage_method: '获取网页信息',
    scroll_bar_method: '获取滚动条位置',
  }
  const addDataWithdraw = () => {
    if (DEFAULT_DATAWITHDRAW) {
      const new_item = cloneDeep(DEFAULT_DATAWITHDRAW)
      new_item.show = true;
      onChange([...data, new_item])
    } else {
      Message.error('不支持的类型')
    }
  }

  const updateWithdrawItem = (index, newItem) => {
    const temp_data = cloneDeep(data);
    temp_data[index] = newItem
    onChange(temp_data);
  }

  // const dropList = (<Menu onClickMenuItem={addAssert}>
  //   {Object.keys(assertTypes).map(key => (<Menu.Item key={key}>{assertTypes[key]}</Menu.Item>))}
  // </Menu>)
  const moreDropList = (item, index) => (<Menu onClickMenuItem={(key,e) => {
    e.stopPropagation();
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

const unpackWithdrawItem = (index, item) => {
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
            <div className="assert-item-header" onClick={()=>unpackWithdrawItem(index,item)}>
              <div className="header-left">
                <div className="type">{dataWithdrawTypes?.[item?.withdraw_type]}</div>
              </div>
              <div className="header-right">
                {/* <Dropdown droplist={plusDropList(index)} trigger='click' position='br'> */}
                {/* <IconPlusCircle onClick={() => {
                  if (DEFAULT_DATAWITHDRAW) {
                    const new_assert = cloneDeep(DEFAULT_DATAWITHDRAW)
                    const temp_data = cloneDeep(data);
                    temp_data.splice(index, 0, new_assert)
                  } else {
                    Message.error('不支持的类型')
                  }
                }} fontSize={20} /> */}
                {/* </Dropdown> */}
                <Dropdown droplist={moreDropList(item, index)} trigger='click' position='br'>
                  <IconMore fontSize={20} onClick={(e)=>e.stopPropagation()}/>
                </Dropdown>
                {!item?.show ? <IconRight /> : <IconDown />}
              </div>
            </div>
            {item?.show && <DataWithdrawItem data={item} onChange={(val) => {
              updateWithdrawItem(index, val);
            }} />}
          </div>
        ))}
        <Button onClick={addDataWithdraw}>添加关联提取</Button>
      </div>
    </div>
  )
}
export default DataWithdraw;