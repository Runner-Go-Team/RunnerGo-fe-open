import React, { useContext, useEffect, useRef, useState } from 'react'
import './index.less';
import { Button, DatePicker, Divider, Dropdown, Input, Menu, Message, Modal, Select } from '@arco-design/web-react';
import { IconDown, IconPlus, IconSearch } from '@arco-design/web-react/icon';
import { t } from 'i18next';
import PlantMgmtContext from '../context';
import Bus from '@utils/eventBus';
import { isArray, isNumber, isString } from 'lodash';
import { ServicDeleteReport } from '@services/UiTestAuto/report';
import { DEFABLR_SEARCH } from '@constants/report';
import { lastValueFrom } from 'rxjs';
import { useSelector } from 'react-redux';
const Option = Select.Option;

const searchName = {
  task_type: '任务类型',
  run_time: '运行时间',
  status: '状态',
  report_name: '报告名称',
  plan_name: '计划名称'
}
const options = [{ key: 0, name: '全部任务' },{ key: 1, name: '普通任务' }];

const statusObj = {
  0: '全部',
  1: '进行中',
  2: '已完成',
}

const { RangePicker } = DatePicker;
const SearchHeader = () => {
  const [searchOptions, setSearchOptions] = useState(['report_name', 'run_time']);

  const teamMember = useSelector((store) => store?.teams?.teamMember);

  const { search, setSearch, checkPlanIds,setCheckPlanIds } = useContext(PlantMgmtContext);
  const handleChangeSearch = (propertyName, val) => {
    setSearch({ ...search, [propertyName]: val });
  }

  const searchItemDom = {
    plan_name: <Input value={search?.plan_name || ''} onChange={(val) => handleChangeSearch('plan_name', val)} style={{ maxWidth: '200px', minWidth: '100px', height: 28 }} prefix={<IconSearch />} placeholder={'请输入计划名称'} />,
    report_name: <Input value={search?.report_name || ''} onChange={(val) => handleChangeSearch('report_name', val)} style={{ maxWidth: '200px', minWidth: '100px', height: 28 }} prefix={<IconSearch />} placeholder={'请输入报告名称'} />,
    task_type: <Select
      placeholder='任务类型'
      style={{ maxWidth: '200px', minWidth: '100px', height: 30 }}
      value={isNumber(search?.task_type ) ? search.task_type : 0}
      onChange={(val) => {
        console.log(val,"task_type111");
        handleChangeSearch('task_type', val)
      }}
      allowClear
    >
      {options.map((option) => (
        <Option key={option.key} value={option.key}>
          {option.name}
        </Option>
      ))}
    </Select>,
    status:
      <Select
        placeholder='状态'
        style={{ maxWidth: '200px', minWidth: '100px', height: 30 }}
        value={isNumber(search?.status ) ? search.status : 0}
        onChange={(val) => handleChangeSearch('status', val)}
        allowClear
      >
        {Object.keys(statusObj).map((key) => (
          <Option key={parseInt(key)} value={parseInt(key)}>
            {statusObj[key]}
          </Option>
        ))}
      </Select>,
    run_time: <RangePicker
      mode={'date'}
      onChange={onChange}
      onSelect={onSelect}
      style={{ maxWidth: '254px', height: 30 }}
      value={search?.updated_time || []}
    />
  }
  function onSelect(dateString, date) {
    console.log('onSelect', dateString, date);
  }

  function onChange(dateString) {
    if (isArray(dateString) && dateString.length > 1) {
      setSearch({ ...search, start_time: dateString[0], end_time: dateString[1] });
    }
  }

  const batchDeletion = (ids) => {
    Modal.confirm({
      title: '批量删除',
      content: `确认批量删除选中项吗？`,
      icon: null,
      closable: true,
      onOk: () => {
        return new Promise((resolve, reject) => {
          lastValueFrom(ServicDeleteReport({ team_id: sessionStorage.getItem('team_id'), report_ids: ids })).then(res => {
            if (res?.code == 0) {
              Message.success('删除报告成功');
              Bus.$emit('planList/debounceGetReportList')
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
        Bus.$emit('openModal', 'Notice', { event_id: 106 ,batch:true, options: { report_ids: checkPlanIds } })
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
    <div className='report-list-search-header'>
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
                  setSearchOptions(['report_name', 'run_time'])
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