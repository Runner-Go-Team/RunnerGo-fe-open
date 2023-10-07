import React, { useContext, useEffect, useRef, useState } from 'react'
import './index.less';
import { Button, DatePicker, Divider, Dropdown, Input, Menu, Message, Modal, Select } from '@arco-design/web-react';
import { IconDown, IconPlus, IconSearch } from '@arco-design/web-react/icon';
import { t } from 'i18next';
import ElementMgmtContext from '../../context';
import Bus from '@utils/eventBus';
import { isArray, isString } from 'lodash';
import { ServiceDeleteElement } from '@services/UiTestAuto/element';
import { DEFABLR_SEARCH, ELEMENT_ATTR_METHOD, ELEMENT_ATTR_TYPE } from '@constants/element';
import { lastValueFrom } from 'rxjs';
const Option = Select.Option;

const searchName = {
  name: '元素名称',
  locator_value: '定位值',
  locator_method: '定位方式',
  locator_type: '定位类型',
  updated_time: '更新时间',
}
const { RangePicker } = DatePicker;
const SearchHeader = () => {
  const { selectKey, searchOptions, setSearchOptions, search, setSearch, selectElementIds, setSelectElementIds } = useContext(ElementMgmtContext);
  const handleChangeSearch = (propertyName, val) => {
    setSearch({ ...search, [propertyName]: val });
  }
  const [popupVisible, setPopupVisible] = useState(false);
  const searchItemDom = {
    name: <Input value={search?.name || ''} onChange={(val) => handleChangeSearch('name', val)} style={{ maxWidth: '200px', minWidth: '100px', height: 28 }} prefix={<IconSearch />} placeholder={'请输入元素名称'} />,
    locator_value: <Input value={search?.locator_value || ''} onChange={(val) => handleChangeSearch('locator_value', val)} style={{ maxWidth: '200px', minWidth: '100px', height: 28 }} prefix={<IconSearch />} placeholder={'请输入定位值'} />,
    locator_method: <Select
      mode='multiple'
      maxTagCount={2}
      placeholder='定位方式'
      style={{ maxWidth: '200px', minWidth: '100px', height: 30 }}
      value={search?.locator_method || []}
      onChange={(val) => handleChangeSearch('locator_method', val)}
      allowClear
    >
      {ELEMENT_ATTR_METHOD.map((item) => (
        <Option key={item.key} value={item.key}>
          {item.name}
        </Option>
      ))}
    </Select>,
    locator_type: <Select
      mode='multiple'
      maxTagCount={2}
      placeholder='定位类型'
      style={{ maxWidth: '200px', minWidth: '100px', height: 30 }}
      value={search?.locator_type || []}
      onChange={(val) => handleChangeSearch('locator_type', val)}
      allowClear
    >
      {Object.keys(ELEMENT_ATTR_TYPE).map(key => ELEMENT_ATTR_TYPE[key].map(item => (
        <Option key={item} value={item}>
          {item}
        </Option>
      )))}
    </Select>,
    updated_time: <RangePicker
      mode={'date'}
      onChange={onChange}
      onSelect={onSelect}
      style={{ maxWidth: '254px', height: 30 }}
      value={search?.updated_time || []}
      disabledDate={(current) => current.isAfter(new Date().getTime())}
    />
  }
  function onSelect(dateString, date) {
    console.log('onSelect', dateString, date);
  }

  function onChange(dateString) {
    handleChangeSearch('updated_time', dateString)
  }
  const batchDeletion = (ids) => {
    Modal.confirm({
      title: '批量删除',
      content: `确认批量删除选中项吗？`,
      icon: null,
      closable: true,
      onOk: () => {
        return new Promise((resolve, reject) => {
          lastValueFrom(ServiceDeleteElement({ team_id: sessionStorage.getItem('team_id'), element_ids: ids })).then(res => {
            if (res?.code == 0) {
              Message.success('删除元素成功');
              // 刷新当前元素列表
              Bus.$emit('elementList/debounceGetElementList');
              resolve();
            }
            reject();
          })
        }).catch((e) => {
          throw e;
        })
      }
    });
  }
  const dropList = (
    <Menu onClickMenuItem={(key) => {
      if (selectElementIds.length <= 0) {
        Message.error('批量操作至少选择一项!');
        return
      }
      if (key == '2') {
        batchDeletion(selectElementIds);
      } else if (key == '1') {
        Bus.$emit('openModal', 'ElementTransferGroup', { ids: selectElementIds, setIds:setSelectElementIds })
      }
    }}>
      <Menu.Item key='1'>批量移动</Menu.Item>
      <Menu.Item key='2'>批量删除</Menu.Item>
      <Divider style={{ margin: '4px 0' }} />
      <div className='arco-dropdown-menu-item arco-dropdown-menu-item-view'>
        已选{selectElementIds.length}项
      </div>
    </Menu>
  );
  return (
    <div className='element-search-header'>
      <div className="left">
        {isArray(searchOptions) && searchOptions.map(item => {
          if (searchItemDom?.[item]) {
            return searchItemDom[item]
          }
        })}
        <Select
          mode='multiple'
          placeholder='筛选'
          style={{ maxWidth: '200px', minWidth: '100px', height: 30 }}
          value={searchOptions}
          onChange={(val) => {
            setSearchOptions(val)
          }}
          onDeselect={(val) => {
            if (search?.[val]) {
              setSearch({ ...search, [val]: isArray(search[val]) ? [] : '' })
            }
          }}
          allowClear
          popupVisible={popupVisible}
          onVisibleChange={(visible) => setPopupVisible(visible)}
          triggerProps={{ autoAlignPopupWidth: false }}
          triggerElement={<Button type='outline'>
            <IconPlus fontSize={11} />
            筛选
          </Button>}
          dropdownMenuClassName='element-search-header-dropdown-menu'
          dropdownRender={(menu) => (<>
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0',
                justifyContent: 'space-between'
              }}
            >
              <span>已选{searchOptions.length}项</span>
              <Button
                style={{ fontSize: 12, padding: '0' }}
                type='text'
                size='mini'
                onClick={() => {
                  setSearchOptions(['name', 'locator_value'])
                  setSearch(DEFABLR_SEARCH)
                  setPopupVisible(false)
                }}
              >
                重置
              </Button>
            </div>
          </>)}
        >
          {Object.keys(search).map(key => (<Option key={key} value={key}>
            {searchName[key]}
          </Option>))}
        </Select>

        <Button type='secondary' onClick={() => setSearch(DEFABLR_SEARCH)}>
          清空
        </Button>
      </div>
      <div className="right">
        <Button type='primary' onClick={() => Bus.$emit('openModal', 'CreateElement', { parent_id: selectKey && selectKey != '-1' ? selectKey : '0' })}>
          <IconPlus fontSize={11} />
          新建元素
        </Button>
        <Dropdown trigger={['click', 'hover']} droplist={dropList} position='bl'>
          <Button type='secondary'>
            批量操作<IconDown />
          </Button>
        </Dropdown>
      </div>
    </div>
  )
}
export default SearchHeader;