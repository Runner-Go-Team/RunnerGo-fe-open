import { Checkbox, Input, InputNumber, Select, Tooltip } from '@arco-design/web-react';
import React from 'react'
import SettingsAndAsserts from '../SettingsAndAsserts';
import SelectElements from '../../SelectElements';
import { DEFAULT_DATAWITHDRAW, Scene_Element } from '@constants/sceneStep';
import { IconQuestionCircle } from '@arco-design/web-react/icon';

const Option = Select.Option
const DataWithdrawItem = (props) => {
  const { data, onChange } = props;
  const data_withdraw = data || DEFAULT_DATAWITHDRAW;
  const variable_types = {
    scene: '场景变量',
    global: '全局变量'
  }
  const withdraw_types = {
    element_method: '获取元素信息',
    webpage_method: "获取网页信息",
    scroll_bar_method: "获取滚动条位置"
  }

  const element_methods = {
    text_content: '获取元素文本内容',
    source_code: '获取元素源代码',
    value: '获取元素值',
    attribute: '获取元素属性',
    position: '获取元素位置',
  }

  const position_types = {
    screen_left: '屏幕左上角',
    browser_left: '浏览器页面左上角'
  }

  const webpage_methods = {
    url: '获取网址',
    title: '获取网页标题',
    source_code: '获取网页源代码',
    text_content: '获取网页文本内容',
    // handler_id: '获取网页句柄ID',
    cookie: '获取网页cookie'
  }

  const scroll_bar_methods = {
    direction: '纵向滚动条',
    transverse: '横向滚动条'
  }
  const scroll_positions = {
    current: '当前位置',
    bottom: '底部位置'
  }
  console.log(data, "OpenPagepropsdata");
  return (
    <>
      <div className='runnerGo-card-special'>
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>变量名称</label>
          <div className="content">
            <Input value={data_withdraw?.name} onChange={(val) => {
              onChange({ ...data_withdraw, name: val })
            }} style={{ width: '100%', height: 40 }} placeholder={'请输入变量名称'} />
          </div>
        </div>
        {/* <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>变量类型</label>
          <div className="content">
            <Select
              placeholder='Please select'
              style={{ width: '100%' }}
              onChange={(val) => {
                onChange({ ...data_withdraw, variable_type: val })
              }}
              value={data_withdraw?.variable_type || 'scene'}
            >
              {Object.keys(variable_types).map(key => (<Option key={key} value={key}>
                {variable_types[key]}
              </Option>))}
            </Select>
          </div>
        </div> */}
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>提取类型</label>
          <div className="content">
            <Select
              placeholder='选择提取类型'
              style={{ width: '100%' }}
              onChange={(val) => {
                onChange({ ...data_withdraw, withdraw_type: val })
              }}
              value={data_withdraw?.withdraw_type || 'element_method'}
            >
              {Object.keys(withdraw_types).map(key => (<Option key={key} value={key}>
                {withdraw_types[key]}
              </Option>))}
            </Select>
          </div>
        </div>
        {data_withdraw?.withdraw_type == 'element_method' && (
          <>
            <SelectElements value={data_withdraw?.element_method?.element || {...Scene_Element}} onChange={(val) => {
              data_withdraw.element_method.element = val;
              onChange({ ...data_withdraw })
            }} />
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>操作方式</label>
              <div className="content">
                <Select
                  placeholder='选择操作方式'
                  style={{ width: '100%' }}
                  onChange={(val) => {
                    data_withdraw.element_method.method = val
                    onChange({ ...data_withdraw })
                  }}
                  value={data_withdraw?.element_method?.method || 'text_content'}
                >
                  {Object.keys(element_methods).map(key => (<Option key={key} value={key}>
                    {element_methods[key]}
                  </Option>))}
                </Select>
              </div>
            </div>
            {data_withdraw?.element_method?.method == 'attribute' && (
              <div className='runnerGo-card-special-item'>
                <label><span className='required'>*</span>属性名称</label>
                <div className="content">
                  <Input value={data_withdraw?.element_method?.attribute_name || ''} onChange={(val) => {
                    data_withdraw.element_method.attribute_name = val;
                    onChange({ ...data_withdraw })
                  }} style={{ width: '100%', height: 40 }} placeholder={'请输入属性名称'} />
                </div>
              </div>

            )}
            {/* {data_withdraw?.element_method?.method == 'position' && (
              <div className='runnerGo-card-special-item'>
                <label><span className='required'>*</span>元素位置</label>
                <div className="content">
                  <Select
                    placeholder='选择元素位置'
                    style={{ width: '100%' }}
                    onChange={(val) => {
                      data_withdraw.element_method.position_type = val
                      onChange({ ...data_withdraw })
                    }}
                    value={data_withdraw?.element_method?.position_type || 'screen_left'}
                  >
                    {Object.keys(position_types).map(key => (<Option key={key} value={key}>
                      {position_types[key]}
                    </Option>))}
                  </Select>
                </div>
              </div>

            )} */}
          </>
        )}

        {data_withdraw?.withdraw_type == 'webpage_method' && (
          <>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>操作方式</label>
              <div className="content">
                <Select
                  placeholder='选择操作方式'
                  style={{ width: '100%' }}
                  onChange={(val) => {
                    data_withdraw.webpage_method.method = val
                    onChange({ ...data_withdraw })
                  }}
                  value={data_withdraw?.webpage_method?.method || 'url'}
                >
                  {Object.keys(webpage_methods).map(key => (<Option key={key} value={key}>
                    {webpage_methods[key]}
                  </Option>))}
                </Select>
              </div>
            </div>
            {data_withdraw?.webpage_method?.method == 'handler_id' && (
              <div className='runnerGo-card-special-item'>
                <label>句柄ID</label>
                <div className="content">
                  <Input value={data_withdraw?.webpage_method?.value || ''} onChange={(val) => {
                    data_withdraw.webpage_method.value = val;
                    onChange({ ...data_withdraw })
                  }} style={{ width: '100%', height: 40 }} placeholder={'请输入句柄ID'} />
                </div>
              </div>
            )}
            {data_withdraw?.webpage_method?.method == 'cookie' && (
              <div className='runnerGo-card-special-item'>
                <label className='flex-gap-10'>Cookie名称
                <Tooltip position='top' trigger='hover' content={'获取单个cookie的名称,不填默认获取所有cookie的键值对'}>
              <IconQuestionCircle />
            </Tooltip>
                </label>
                <div className="content">
                  <Input value={data_withdraw?.webpage_method?.value || ''} onChange={(val) => {
                    data_withdraw.webpage_method.value = val;
                    onChange({ ...data_withdraw })
                  }} style={{ width: '100%', height: 40 }} placeholder={'请输入cookie名称'} />
                </div>
              </div>
            )}
          </>
        )}
        {data_withdraw?.withdraw_type == 'scroll_bar_method' && (
          <>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>操作方式</label>
              <div className="content">
                <Select
                  placeholder='选择操作方式'
                  style={{ width: '100%' }}
                  onChange={(val) => {
                    data_withdraw.scroll_bar_method.method = val
                    onChange({ ...data_withdraw })
                  }}
                  value={data_withdraw?.scroll_bar_method?.method || 'direction'}
                >
                  {Object.keys(scroll_bar_methods).map(key => (<Option key={key} value={key}>
                    {scroll_bar_methods[key]}
                  </Option>))}
                </Select>
              </div>
            </div>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>操作方式</label>
              <div className="content">
                <Select
                  placeholder='选择操作方式'
                  style={{ width: '100%' }}
                  onChange={(val) => {
                    data_withdraw.scroll_bar_method.scroll_position = val
                    onChange({ ...data_withdraw })
                  }}
                  value={data_withdraw?.scroll_bar_method?.scroll_position || 'current'}
                >
                  {Object.keys(scroll_positions).map(key => (<Option key={key} value={key}>
                    {scroll_positions[key]}
                  </Option>))}
                </Select>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
export default DataWithdrawItem;