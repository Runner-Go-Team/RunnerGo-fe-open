import { Button, Checkbox, Input, InputNumber, Radio, Select, Tooltip, Tree } from '@arco-design/web-react';
import React, { useEffect, useState } from 'react'
import cn from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import {
  Folder as SvgFolder,
} from 'adesign-react/icons';
import { ServiceGetElementList } from '@services/UiTestAuto/element';
import { ELEMENT_ATTR_METHOD, ELEMENT_ATTR_TYPE } from '@constants/element';
import { debounce, divide, isArray, isEmpty, isNumber, isPlainObject, isString } from 'lodash';
import { IconDelete, IconDown, IconDriveFile, IconPlus, IconQuestionCircle, IconSort } from '@arco-design/web-react/icon';
import produce from 'immer';
import './index.less';
import { useSelector } from 'react-redux';
import useTreeData from '@components/ArcoTree/hooks/useTreeData';
import { lastValueFrom } from 'rxjs';
import Bus from '@utils/eventBus';

const RadioGroup = Radio.Group;
const Option = Select.Option;
const SelectElements = (props) => {
  const { value, onChange, title } = props;

  const fieldNames = {
    key: 'element_id',
    title: 'name',
    type: 'element_type',
  }
  const [filterParams, setFilterParams] = useState({ name: '' })
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState('-1');
  const [elementList, setElementList] = useState([]);
  const treeData = useSelector((store) => store?.uitest_auto?.elementFolderDatas);
  const { filteredTreeData } = useTreeData({ filterParams: {}, treeData: treeData, fieldNames });
  console.log(value, "SelectElementsvalue");
  const onExpand = (keys) => {
    setExpandedKeys(keys);
  }
  const getDefalutLocator = () => {
    return {
      id: uuidv4(),
      method: 'playwright_selector',
      type: undefined,
      value: '',
      key: '',
      index: -1,
      is_checked: 1
    }
  }

  const updateLocator = (id, data) => {
    onChange(
      produce(value, (draft) => {
        let item = value?.target_type == 1 ? draft.locators.find(item => item.id == id) : draft.custom_locators.find(item => item.id == id)
        if (isPlainObject(data)) {
          Object.keys(data).forEach(key => {
            item[key] = data[key];
          })
        }
      })
    );
  }

  const addLocator = debounce(() => {
    onChange(
      produce(value, (draft) => {
        if (value?.target_type == 1) {
          draft.locators.push(getDefalutLocator());
        } else {
          draft.custom_locators.push(getDefalutLocator());
        }
      })
    );
  }, 200)

  const deleteLocator = (id) => {
    onChange(
      produce(value, (draft) => {
        if (value?.target_type == 1) {
          draft.locators = draft.locators.filter(i => i.id != id);
        } else {
          draft.custom_locators = draft.custom_locators.filter(i => i.id != id);
        }

      })
    );
  }

  const tabChange = (type) => {
    onChange(
      produce(value, (draft) => {
        draft.target_type = type;
      })
    );
  }

  const locators = value?.target_type == 1 ? value?.locators || [getDefalutLocator()] : value?.custom_locators || [getDefalutLocator()]

  const getElementList = async () => {
    const resp = await lastValueFrom(ServiceGetElementList({
      team_id: sessionStorage.getItem('team_id'),
      parent_id: selectedKey,
      ...filterParams
    }));
    if (resp?.code == 0) {
      isArray(resp?.data?.elements) && setElementList(resp.data.elements)
    }
  };

  useEffect(() => {
    getElementList();
  }, [selectedKey, filterParams]);

  const selectedElement = debounce(async (element_id) => {
    let selectValue = elementList.find(i => i?.element_id == element_id)
    if (selectValue != undefined) {
      onChange(
        produce(value, (draft) => {
          for (const key in selectValue) {
            draft[key] = selectValue[key];
          }
        })
      );
    }
  }, 100);
  console.log(value, "value12312321");

  const renderInputDom = (item) => {
    if (item?.method == 'playwright_selector') {
      return (<>
        <Tooltip position='top' trigger='hover' content={item?.value || ''}>
          <Input value={item.value} onChange={(val) => updateLocator(item.id, { value: val })} style={{ flex: 1 }} placeholder={'值'} />
        </Tooltip>
        {/* <InputNumber
          placeholder='下标'
          min={-1}
          max={9999}
          style={{ flex: 1 }}
          value={isNumber(item?.index) ? item.index : -1}
          onChange={(val) => {
            updateLocator(item.id, { index: val })
          }}
        /> */}
      </>)
    } else if (item?.method == 'playwright_locator') {
      if (!isEmpty(item?.type) && item?.type == 'role') {
        return (<>
          <Tooltip position='top' trigger='hover' content={item?.key || ''}>
            <Input value={item.key} onChange={(val) => updateLocator(item.id, { key: val })} style={{ flex: 1 }} placeholder={'key'} />
          </Tooltip>
          <Tooltip position='top' trigger='hover' content={item?.value || ''}>
            <Input value={item.value} onChange={(val) => updateLocator(item.id, { value: val })} style={{ flex: 1 }} placeholder={'值'} />
          </Tooltip>
          {/* <InputNumber
            placeholder='下标'
            min={-1}
            max={9999}
            style={{ flex: 1 }}
            value={isNumber(item?.index) ? item.index : -1}
            onChange={(val) => {
              updateLocator(item.id, { index: val })
            }}
          /> */}
        </>)
      } else if (!isEmpty(item?.type)) {
        return (
          <>
            <Tooltip position='top' trigger='hover' content={item?.value || ''}>
              <Input value={item.value} onChange={(val) => updateLocator(item.id, { value: val })} style={{ flex: 1 }} placeholder={'值'} />
            </Tooltip>
            {/* <InputNumber
              placeholder='下标'
              min={-1}
              max={9999}
              style={{ flex: 1 }}
              value={isNumber(item?.index) ? item.index : -1}
              onChange={(val) => {
                updateLocator(item.id, { index: val })
              }}
            /> */}
          </>
        )
      }
    }
  }
  const renderIcon = (node) => {
    return { dragIcon: null, switcherIcon: isArray(node?.childrenData) && node.childrenData.length > 0 ? <IconDown fontSize={14} width={14} /> : null }
  }
  const renderTitle = (node) => {
    let NodeIcon = <SvgFolder className='arco-icon adesign-to-arco-icon' width={14} style={{ marginRight: 5 }} />
    return <div className='arco-tree-node-title-group'>{NodeIcon}<span className='arco-tree-node-title-group-text'>{node?.name}</span></div>
  }
  return (
    <>
      <div className='runnerGo-card-special-item'>
        <label><span className='required'>*</span>{title || '目标元素'} <span onClick={() => tabChange(1)} className={cn('tab-select-element', { active: !value?.target_type || value?.target_type == 1 })}>选择元素</span><span onClick={() => tabChange(2)} className={cn('tab-select-element', { active: value?.target_type == 2 })}>自定义元素</span></label>
        <div className="content">
          {value?.target_type != 2 && (<div className="select-elements">
            <div className="left">
              <div onClick={() => {
                setSelectedKey('-1')
              }} className={cn('other-tree-node', {
                "active": selectedKey == '-1'
              })}><span className='icon'><IconSort /></span><span className='text'>全部元素</span></div>
              <div onClick={() => setSelectedKey('0')} className={cn('other-tree-node', {
                "active": selectedKey == '0'
              })}><span className='icon'><IconDriveFile /></span><span className='text'>根目录元素</span></div>
              <Tree
                autoExpandParent={true}
                blockNode
                fieldNames={fieldNames}
                virtualListProps={
                  { height: 118 }
                }
                icons={renderIcon}
                renderTitle={renderTitle}
                showLine={true}
                treeData={filteredTreeData}
                expandedKeys={expandedKeys}
                selectedKeys={[selectedKey]}
                onSelect={(keys) => {
                  if (isArray(keys) && keys.length > 0) {
                    setSelectedKey(keys[0]);
                  } else {
                    setSelectedKey('-1');
                  }
                }}
                onExpand={onExpand}
              />
            </div>
            <div className="right">
              <Input value={filterParams.name} onChange={(val) => setFilterParams({ ...filterParams, name: val })} style={{ width: '100%', height: 24 }} placeholder={'请输入元素名称'} />
              <div className="element-list">
                <RadioGroup value={value?.element_id} onChange={(val) => {
                  selectedElement(val);
                }}>
                  {isArray(elementList) && elementList.map(item => (
                    <div className={cn('element-list-item', { active: item.element_id == value.element_id })}>
                      <Radio value={item.element_id}>
                        <Tooltip position='top' trigger='hover' content={item?.name || '未命名元素'}>
                          {item?.name || '未命名元素'}
                        </Tooltip>
                      </Radio>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>)}
        </div>
      </div>
      {isArray(locators) && locators.length > 0 && (
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>元素属性
            {/* <Tooltip position='top' trigger='hover' content={'下标：-1 代表定位到的所有元素，0代表定位到的第一个元素，依次类推'}>
              <IconQuestionCircle />
            </Tooltip> */}
          </label>
          <div className="content element-attr-list">
            {locators.map((item, index) => (<div key={item.id} className='element-attr-item'>
              <div className="info">
                <Checkbox checked={item.is_checked == 1} onChange={(val) => updateLocator(item.id, { is_checked: val ? 1 : 2 })}></Checkbox>
                <Select style={{ width: 100 }} placeholder='请选择' value={item.method} onChange={(val) => updateLocator(item.id, { method: val, type: undefined, value: '', key: '' })}>
                  {ELEMENT_ATTR_METHOD.map(i => <Option key={i.key} value={i.key}>{i.name}</Option>)}
                </Select>
                {isArray(ELEMENT_ATTR_TYPE[item.method]) && item.method == 'playwright_locator' && (
                  <Select triggerProps={{
                    autoAlignPopupWidth: false,
                  }} style={{ width: 100 }} placeholder='请选择' value={item.type} onChange={(val) => updateLocator(item.id, { type: val })}>
                    {ELEMENT_ATTR_TYPE[item.method].map(i => <Option key={i} value={i}>{i}</Option>)}
                  </Select>
                )}
                {renderInputDom(item)}
              </div>
              <div className='operations'>
                <IconPlus onClick={addLocator} fontSize={16} />
                {locators.length > 1 && <IconDelete onClick={() => {
                  deleteLocator(item.id)
                }} fontSize={16} />}
              </div>
            </div>))}
          </div>
        </div>
      )}
      {value?.target_type == 2 && <div className='save-to-element'>
        <Button onClick={() => Bus.$emit('openModal', 'CreateElement', { custom: true, element: { locators: locators } })}>保存至元素管理</Button>
      </div>}
    </>
  )
}
export default SelectElements