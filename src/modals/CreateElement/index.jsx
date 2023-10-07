import React, { useState } from 'react'
import { Input, Message, Modal, Select, TreeSelect, Checkbox, InputNumber, Tooltip } from '@arco-design/web-react';
import { v4 as uuidv4 } from 'uuid';
import produce from 'immer';
import useElementHooks from '@hooks/useFolders/element';
import { ELEMENT_ATTR_METHOD, ELEMENT_ATTR_TYPE } from '@constants/element';
import { ServiceCreateElement, ServiceEditElement } from '@services/UiTestAuto/element';
import './index.less';
import { filterArcoTree } from '@utils';
import { debounce, isArray, isEmpty, isNumber, isPlainObject, trim } from 'lodash';
import { lastValueFrom } from 'rxjs';
import Bus from '@utils/eventBus';
import { IconDelete, IconPlus, IconQuestionCircle } from '@arco-design/web-react/icon';
const Option = Select.Option;

const CreateElementModal = (props) => {
  const { onCancel, element, parent_id, custom } = props;

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

  const { elementFolders } = useElementHooks();
  const [elementData, setElementData] = useState({
    parent_id: parent_id || element?.parent_id || '0',
    name: element?.name || '新建元素',
    locators: isArray(element?.locators) ? element.locators : [getDefalutLocator()],
  })

  const onSubmit = debounce(() => {
    if (trim(elementData.name).length <= 0) {
      Message.error('元素名称不能为空');
      return
    }
    if (elementData.locators.length <= 0) {
      Message.error('元素属性不能为空');
      return
    }
    // if(elementData.locators.length == 1 && elementData.locators[0]?.type == undefined){
    //   Message.error('元素属性不能为空');
    //   return
    // }
    if (!custom && element) {
      lastValueFrom(ServiceEditElement({
        "team_id": sessionStorage.getItem('team_id'),
        element_id: element.element_id,
        ...elementData
      })).then((res) => {
        if (res?.code == 0) {
          Message.success('修改元素成功');
          Bus.$emit('elementList/debounceGetElementList');
          onCancel();
        }
      })
      return
    }
    lastValueFrom(ServiceCreateElement({
      "team_id": sessionStorage.getItem('team_id'),
      ...elementData
    })).then((res) => {
      if (res?.code == 0) {
        Message.success('新建元素成功');
        Bus.$emit('elementList/debounceGetElementList');
        onCancel();
      }
    })
  }, 200)
  const updateLocator = (id, data) => {
    setElementData(
      produce(elementData, (draft) => {
        let item = draft.locators.find(item => item.id == id)
        if (isPlainObject(data)) {
          Object.keys(data).forEach(key => {
            item[key] = data[key];
          })
        }
      })
    );
  }
  const addLocator = debounce(() => {
    setElementData(
      produce(elementData, (draft) => {
        draft.locators.push(getDefalutLocator());
      })
    );
  }, 200)
  const deleteLocator = (id) => {
    setElementData(
      produce(elementData, (draft) => {
        draft.locators = draft.locators.filter(i => i.id != id);
      })
    );
  }
  const renderInputDom = (item) => {
    if (item?.method == 'playwright_selector') {
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
  return (
    <>
      <Modal
        className="runnerGo-element-create-modal"
        title={custom || !element ? '新增元素' : '编辑元素'}
        visible
        onOk={onSubmit}
        onCancel={onCancel}
        maskClosable={false}
      >
        <div className='runnerGo-card-special'>
          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>元素名称</label>
            <div className="content">
              <Input maxLength={30} value={elementData.name} onChange={(val) => setElementData({ ...elementData, name: val })} style={{ width: '100%', height: 38 }} placeholder={'请输入元素名称'} />
            </div>
          </div>
          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>元素属性
              {/* <Tooltip position='top' trigger='hover' content={'下标：-1 代表定位到的所有元素，0代表定位到的第一个元素，依次类推'}>
                <IconQuestionCircle />
              </Tooltip> */}
            </label>
            <div className="content element-attr-list">
              {elementData.locators.map((item, index) => (<div key={item.id} className='element-attr-item'>
                <div className="info">
                  <Checkbox checked={item.is_checked == 1} onChange={(val) => updateLocator(item.id, { is_checked: val ? 1 : 2 })}></Checkbox>
                  <Select style={{ width: 100 }} placeholder='请选择' value={item.method} onChange={(val) => updateLocator(item.id, { method: val, type:undefined,value:'',key:'' })}>
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
                  {elementData.locators.length > 1 && <IconDelete onClick={() => {
                    deleteLocator(item.id)
                  }} fontSize={16} />}
                </div>
              </div>))}
            </div>
          </div>
          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>父级目录</label>
            <div className="content">
              <TreeSelect
                value={elementData.parent_id}
                onChange={(val) => {
                  setElementData({ ...elementData, parent_id: val })
                }}
                getPopupContainer={() => document.querySelector('body')}
                placeholder='根目录'
                treeData={[{ key: '0', title: '根目录', children: elementFolders }]}
                style={{ width: '100%' }}
                dropdownMenuStyle={{
                  maxHeight: 500,
                }}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                  </>
                )}
              ></TreeSelect>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
export default CreateElementModal;