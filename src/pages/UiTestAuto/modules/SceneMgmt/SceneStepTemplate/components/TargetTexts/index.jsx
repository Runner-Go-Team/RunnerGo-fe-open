import { Button, Dropdown, Input, Menu, Message, Select } from '@arco-design/web-react';
import { IconDelete, IconDown, IconEdit, IconRight } from '@arco-design/web-react/icon';
import { cloneDeep, isArray } from 'lodash';
import React, { useState } from 'react'
import './index.less';

const TextArea = Input.TextArea
const TargetTexts = (props) => {
  const { data, onChange } = props;

  const [showIndex, setShowIndex] = useState([]);

  const addAssert = () => {
    onChange([...data, ''])
    let temp_hide_index = [...showIndex];
    temp_hide_index.push(data.length)
    setShowIndex(temp_hide_index);
  }

  const deleteAssert = (index) => {
    const temp_data = cloneDeep(data);
    temp_data.splice(index, 1)
    onChange(temp_data);
    setShowIndex([]);
  }

  const updateAssert = (index, newItem) => {
    const temp_data = cloneDeep(data);
    temp_data[index] = newItem
    onChange(temp_data);
  }

  const unpackAssertItem = (index) => {
    let temp_hide_index = [...showIndex];
    if (temp_hide_index.includes(index)) {
      temp_hide_index = temp_hide_index.filter(i => i != index);
    } else {
      temp_hide_index.push(index)
    }
    setShowIndex(temp_hide_index);
  }

  return (
    <div className='appearance-texts'>
      <div className="text-add">
        <Button onClick={() => addAssert()}>添加目标文本</Button>
        {isArray(data) && data.map((item, index) => (
          <div className="appearance-texts-item">
            <div className="appearance-texts-item-header">
              <div className="appearance-texts-item-header-left text-ellipsis">
              {item || '您未输入文本'}
              </div>
              <div className="header-right">
                <IconDelete onClick={() => deleteAssert(index)} />
                {!showIndex.includes(index) ? <IconRight onClick={() => unpackAssertItem(index)} /> : <IconDown onClick={() => unpackAssertItem(index)} />}
              </div>
            </div>
            {showIndex.includes(index) &&
              <div className='appearance-texts-item-body'>
                <TextArea
                  placeholder='请输入文本'
                  value={item || ''}
                  autoSize={{ minRows: 2, maxRows: 20 }}
                  onChange={(val) => {
                    updateAssert(index, val);
                  }}
                />
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}
export default TargetTexts;