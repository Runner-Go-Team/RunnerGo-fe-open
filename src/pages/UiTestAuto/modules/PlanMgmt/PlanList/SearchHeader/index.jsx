import React, { useContext, useEffect, useRef, useState } from 'react'
import './index.less';
import { Button, DatePicker, Divider, Dropdown, Input, Menu, Message, Modal, Select } from '@arco-design/web-react';
import { IconDown, IconPlus, IconSearch } from '@arco-design/web-react/icon';
import { t } from 'i18next';
import PlantMgmtContext from '../../context';
import Bus from '@utils/eventBus';
import { isArray, isNumber, isString } from 'lodash';
import { ServicDeletePlan } from '@services/UiTestAuto/plan';
import { DEFABLR_SEARCH } from '@constants/plan';
import { lastValueFrom } from 'rxjs';
import { useSelector } from 'react-redux';
const Option = Select.Option;

const searchName = {
  name: '元素名称',
  task_type: '任务类型',
  updated_time: '更新时间',
  created_time: '创建时间',
  head_user_name: '负责人',
  created_user_name: '创建人',
}
const options = [{ key: 0, name: '全部任务' },{ key: 1, name: '普通任务' }];
const { RangePicker } = DatePicker;
const SearchHeader = () => {
  const [searchOptions, setSearchOptions] = useState(['name', 'updated_time']);

  const teamMember = useSelector((store) => store?.teams?.teamMember);

  const { search, setSearch, checkPlanIds, setCheckPlanIds } = useContext(PlantMgmtContext);
  const handleChangeSearch = (propertyName, val) => {
    setSearch({ ...search, [propertyName]: val });
  }
  console.log(search, "search123");
  const searchItemDom = {
    name: <Input value={search?.name || ''} onChange={(val) => handleChangeSearch('name', val)} style={{ maxWidth: '200px', minWidth: '100px', height: 28 }} prefix={<IconSearch />} placeholder={'请输入计划名称'} />,
    task_type: <Select
      placeholder='任务类型'
      style={{ maxWidth: '200px', minWidth: '100px', height: 30 }}
      value={isNumber(search?.task_type) ? search.task_type : 0}
      onChange={(val) => handleChangeSearch('task_type', val)}
      allowClear
    >
      {options.map((option) => (
        <Option key={option.key} value={option.key}>
          {option.name}
        </Option>
      ))}
    </Select>,
    head_user_name: <Input value={search?.head_user_name || ''} onChange={(val) => handleChangeSearch('head_user_name', val)} style={{ maxWidth: '200px', minWidth: '100px', height: 28 }} prefix={<IconSearch />} placeholder={'请输入负责人名称'} />,
    created_user_name: <Input value={search?.created_user_name || ''} onChange={(val) => handleChangeSearch('created_user_name', val)} style={{ maxWidth: '200px', minWidth: '100px', height: 28 }} prefix={<IconSearch />} placeholder={'请输入创建人名称'} />,
    updated_time:
      (
        <div>
          <label>修改时间: </label>
          <RangePicker
            mode={'date'}
            onChange={onChange}
            onSelect={onSelect}
            style={{ maxWidth: '254px', height: 30 }}
            value={search?.updated_time || []}
          />
        </div>
      )
    ,
    created_time:
      (
        <div>
          <label>创建时间: </label>
          <RangePicker
            mode={'date'}
            onChange={(dateString) => {
              handleChangeSearch('created_time', dateString)
            }}
            onSelect={onSelect}
            style={{ maxWidth: '254px', height: 30 }}
            value={search?.created_time || []}
          />
        </div>
      )

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
          lastValueFrom(ServicDeletePlan({ team_id: sessionStorage.getItem('team_id'), plan_ids: ids })).then(res => {
            if (res?.code == 0) {
              Message.success('删除元素成功');
              Bus.$emit('planList/debounceGetPlanList')
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
      if (checkPlanIds.length <= 0) {
        Message.error('批量操作至少选择一项!');
        return
      }
      if (key == '2') {
        batchDeletion(checkPlanIds);
      } else if (key == '1') {
        // 批量通知
        Bus.$emit('openModal', 'Notice', { event_id: 105, batch: true, options: { plan_ids: checkPlanIds } })
      }
      setCheckPlanIds([]);
    }}>
      <Menu.Item key='1'>批量通知</Menu.Item>
      <Menu.Item key='2'>批量删除</Menu.Item>
      <Divider style={{ margin: '4px 0' }} />
      <div className='arco-dropdown-menu-item arco-dropdown-menu-item-view'>
        已选{checkPlanIds.length}项
      </div>
    </Menu>
  );
  return (
    <div className='plan-list-search-header'>
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
                  setSearchOptions(['name', 'updated_time'])
                  setSearch(DEFABLR_SEARCH)
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
        <Button type='primary' onClick={() => Bus.$emit('openModal', 'CreateUiPlan')}>
          <IconPlus fontSize={11} />
          新建计划
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