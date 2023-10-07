import React, { useState } from 'react'
import { Input, InputNumber, Message, Modal, Select } from '@arco-design/web-react';
import produce from 'immer';
import { ServiceSaveScene } from '@services/UiTestAuto/scene';
import './index.less';
import { debounce, isArray, isObject, trim } from 'lodash';
import { lastValueFrom } from 'rxjs';
import Bus from '@utils/eventBus';
import { BROWSER_TYPES } from '@constants/sceneStep';
import SelectMachine from '@components/SelectMachine';
import { useSelector } from 'react-redux';

const Option = Select.Option;
const UiSceneRunConfig = (props) => {
  const { onCancel, scene, plan_id, getSceneDetail } = props;

  const [configData, setConfigData] = useState({
    ui_machine_key: '',
    browsers: isArray(scene?.browsers) ? scene.browsers : [
      {
        browser_type: "chromium", //   firefox,internet_explorer,edge,opera,safari
        headless: false,
        size_type: "default", // set_size
        set_size: {
          x: 0,
          y: 0
        }
      }
    ],
    ...scene
  })
  const browser = isObject(configData?.browsers?.[0]) ? configData?.browsers?.[0] : {};
  const onSubmit = debounce(async () => {
    if (trim(configData.ui_machine_key).length <= 0) {
      Message.error('运行设备不能为空');
      return
    }
    if (scene) {
      const resp = await lastValueFrom(ServiceSaveScene({ ...configData }))
      if (resp?.code == 0) {
        Message.success('保存场景配置成功!')
        // 刷新左侧目录列表
        Bus.$emit('element/getSceneList', { plan_id })
        // 刷新当前打开详情
        configData?.scene_id && getSceneDetail(configData.scene_id)
        onCancel();
      }
    }
  }, 200)

  return (
    <>
      <Modal
        className="runnerGo-ui-scene-config-modal"
        title={'运行配置'}
        visible
        onOk={onSubmit}
        onCancel={onCancel}
        focusLock={false}
        maskClosable={false}
      >
        <div className='runnerGo-card-special'>
          {/* <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>名称</label>
            <div className="content">
              <Input value={configData.name} onChange={(val) => setConfigData({ ...configData, name: val })} style={{ width: '100%', height: 38 }} placeholder={'请输入计划名称'} />
            </div>
          </div> */}

          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>选择浏览器</label>
            <div className="content">
              <Select onChange={(val) => {
                browser.browser_type = val
                setConfigData({ ...configData, browsers: [browser] });
              }} value={browser?.browser_type || 'chromium'}>
                 {Object.keys(BROWSER_TYPES).map(key => (
                  <Option key={key} value={key}>
                    {BROWSER_TYPES[key]}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>运行模式</label>
            <div className="content">
              <Select onChange={(val) => {
                browser.headless = val == 'behind'
                setConfigData({ ...configData, browsers: [browser] });
              }} value={browser?.headless ? 'behind' : 'frond'}>
                <Option key={'behind'} value={'behind'}>
                  后台运行
                </Option>
                <Option key={'frond'} value={'frond'}>
                  前台运行
                </Option>
              </Select>
            </div>
          </div>

          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>窗口大小</label>
            <div className="content">
              <Select onChange={(val) => {
                browser.size_type = val;
                setConfigData({ ...configData, browsers: [browser] });
              }} value={browser?.size_type || 'default'}>
                <Option key='default' value={'default'}>默认(1280 x 720)</Option>
                <Option key={'max'} value={'max'}>
                  窗口最大化
                </Option>
                <Option key={'set_size'} value={'set_size'}>
                  指定像素
                </Option>
              </Select>
            </div>
          </div>
          {browser?.size_type == 'set_size' && (
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>尺寸</label>
              <div className="content">
                <div className="size-input-group">
                  <InputNumber min={0} value={browser?.set_size?.x || 0} onChange={(val) => {
                    browser.set_size.x = val
                    setConfigData({ ...configData, browsers: [browser] });
                  }} /> <InputNumber min={0} value={browser?.set_size?.y || 0} onChange={(val) => {
                    browser.set_size.y = val
                    setConfigData({ ...configData, browsers: [browser] });
                  }} />
                </div>
              </div>
            </div>
          )}
          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>选择设备</label>
            <div className="content">
              <SelectMachine selectKey={configData?.ui_machine_key} setSelectKey={(val) => {
                setConfigData({ ...configData, ui_machine_key: val })
              }} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
export default UiSceneRunConfig;