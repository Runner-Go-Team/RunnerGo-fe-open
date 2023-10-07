import { Button, Cascader, InputNumber, Select } from '@arco-design/web-react';
import { isArray } from 'lodash';
import React from 'react'

const Option = Select.Option;
const Settings = (props) => {
  const { data, onChange } = props;
  const settingsChange = (type, val) => {
    onChange({ ...data, [type]: val })
  }
  const error_handlings = [
    { key: 'terminate', name: '终止流程' },
    { key: 'ignore', name: '忽略' },
  ]
  const screenshot_configs = [
    { key: 'current_step', name: '当前步骤截图' },
    { key: 'exception', name: '出现异常截图' },
    { key: 'none', name: '不截图' },
  ]
  const element_sync_modes = [
    { value: '1', label: '与元素管理相互实时同步' },
    {
      value: 'hand', label: '手动同步',
      children: [{ value: '2', label: '元素同步至场景' }, { value: '3', label: '场景同步至元素' }]
    }
  ]
  const getCascaderValue = (key) => {
    if (key == '2' || key == '3') {
      return ['hand', key]
    }
    return [key]
  }
  return (
    <div className='settings'>
      <div className='settings-item'><label>执行前等待时间</label>
        <div className='settings-item-right'>
          <InputNumber
            placeholder='请输入'
            min={0}
            max={9999}
            style={{ width: '346px', height: 40 }}
            value={data?.wait_before_exec || 1}
            onChange={(val) => {
              settingsChange('wait_before_exec', val);
            }}
          />
          <div className='unit'>s</div>
        </div>
      </div>
      <div className='settings-item'><label>超时时间</label>
        <div className='settings-item-right'>
          <InputNumber
            placeholder='请输入'
            min={0}
            max={9999}
            style={{ width: '346px', height: 40 }}
            value={data?.timeout || 15}
            onChange={(val) => {
              settingsChange('timeout', val);
            }}
          />
          <div className='unit'>s</div>
        </div>
      </div>
      <div className='settings-item'><label>遇到错误时</label>
        <div className='settings-item-right'>
          <Select
            placeholder='Please select'
            style={{ width: 346 }}
            onChange={(val) => {
              settingsChange('error_handling', val);
            }}
            value={data?.error_handling || 'terminate'}
          >
            {error_handlings.map(item => (<Option key={item.key} value={item.key}>
              {item.name}
            </Option>))}
          </Select>
          <div className='unit'></div>
        </div>
      </div>
      <div className='settings-item'><label>截图配置</label>
        <div className='settings-item-right'>
          <Select
            placeholder='Please select'
            style={{ width: 346 }}
            onChange={(val) => {
              settingsChange('screenshot_config', val);
            }}
            value={data?.screenshot_config || 'exception'}
          >
            {screenshot_configs.map(item => (<Option key={item.key} value={item.key}>
              {item.name}
            </Option>))}
          </Select>
          <div className='unit'></div>
        </div>
      </div>
      {/* <div className='settings-item'><label>元素同步方式</label>
        <div className='settings-item-right'>
          <Cascader
            placeholder='Please select ...'
            style={{ width: 276 }}
            options={element_sync_modes}
            value={getCascaderValue(data?.element_sync_mode || '1')}
            onChange={(val) => {
              let lastElement = '';
              if (isArray(val)) {
                lastElement = val.pop();
              } else {
                lastElement = val;
              }
              settingsChange('element_sync_mode', lastElement);
            }}
          />
          {(data?.element_sync_mode == '2' || data?.element_sync_mode == '3') && (<Button style={{ width: '64px', height: 40, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '6px' }}>手动同步</Button>)}
          <div className='unit'></div>
        </div>
      </div> */}
    </div>
  )
}
export default Settings;