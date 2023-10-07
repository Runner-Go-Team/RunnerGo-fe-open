import { Button, Cascader, Dropdown, Message, Radio } from '@arco-design/web-react';
import { IconDown, IconLink } from '@arco-design/web-react/icon';
import { ServiceSaveUiSceneSyncMode } from '@services/UiTestAuto/scene';
import { ServicPlanSceneSyncLastData } from '@services/UiTestAuto/plan';
import React, { useContext, useState } from 'react'
import './syncMode.less';
import { debounce, isArray, last } from 'lodash';
import { lastValueFrom } from 'rxjs';
import Bus from '@utils/eventBus';
import SceneContext from '../../context';
import { useNavigate } from 'react-router-dom';

const RadioGroup = Radio.Group;
const SyncMode = (props) => {
  const { data, plan_id } = props;
  const { source_ui_scene } = data;
  const navigate = useNavigate();
  const { getSceneDetail, getSceneOperatorList, setOpenStep } = useContext(SceneContext);
  const [popupVisible, setPopupVisible] = useState(false);
  const [syncData, setSyncData] = useState({
    sync_mode: data?.sync_mode || 1,
    target_source: 1 // 1:已场景为准  2:已计划为准
  })

  const submit = debounce(async () => {
    let param = {
      plan_id: data?.plan_id,
      team_id: sessionStorage.getItem('team_id'),
      scene_id: data?.scene_id,
      sync_mode: syncData.sync_mode, // 状态：1-实时，2-手动
      target_source: syncData.target_source // 1:已场景为准  2:已计划为准
    }
    const resp = await lastValueFrom(ServiceSaveUiSceneSyncMode(param))
    if (resp?.code == 0) {
      Message.success('保存同步信息成功!')
      setPopupVisible(false);
      // 刷新左侧目录列表
      data?.plan_id && Bus.$emit('element/getPlanSceneList', { plan_id: data.plan_id })
      // 刷新当前打开步骤列表
      data?.scene_id && getSceneOperatorList(data.scene_id)
      // 刷新当前打开场景详情
      data?.scene_id && getSceneDetail(data.scene_id)
      
      setOpenStep(null)
    }
  }, 200)

  const modeText = {
    1: '同步：与场景管理相互实时同步',
    2: '同步：手动同步/场景同步至计划',
    3: '同步：手动同步/计划同步至场景',
  }

  const scene_sync_modes = [
    { value: 1, label: '与场景管理相互实时同步' },
    {
      value: 'hand', label: '手动同步',
      children: [{ value: 2, label: '场景同步至计划' }, { value: 3, label: '计划同步至场景' }]
    }
  ]
  const getCascaderValue = (key) => {
    if (key == 2 || key == 3) {
      return ['hand', key]
    }
    return [key]
  }
  const dropList = (<div className='scene-sync-mode-content'>
    <div className="conten-item">
      <label>被导入场景：</label>
      <div className="import-scene" onClick={() => {
        navigate(`/uiTestAuto/scene/${source_ui_scene?.scene_id}`)
      }}>
        <div className="text">{source_ui_scene?.name || '未命名场景'}</div>
        <IconLink />
      </div>
    </div>
    <div className="conten-item">
      <label>同步方式：</label>
      <Cascader
        placeholder='Please select ...'
        style={{ width: 276 }}
        options={scene_sync_modes}
        value={getCascaderValue(syncData.sync_mode)}
        onChange={(val) => {
          let lastMode = '';
          if (isArray(val)) {
            lastMode = val.pop();
          } else {
            lastMode = val;
          }
          setSyncData({ ...syncData, sync_mode: lastMode })
        }}
      />
    </div>
    {data?.sync_mode != 1 && syncData.sync_mode == 1 && (
      <>
        <div className="conten-item">
          <label>此次数据源：</label>
          <RadioGroup value={syncData.target_source} onChange={(val) => {
            setSyncData({ ...syncData, target_source: val })
          }}>
            <Radio value={1}>保留场景管理中的场景</Radio>
            <Radio value={2}>保留该计划中的场景</Radio>
          </RadioGroup>
        </div>
        <div className="target-source-description">
          开启实时同步时，两者数据可能存在差异，故切换该方式时需要选择您希望保留哪个数据，保存该同步方式后，以后不管哪里修改数据都将互相同步
        </div>
      </>
    )}
    <div className="footer">
      <Button type='primary' onClick={submit}>保 存</Button>
    </div>
  </div>)

  const syncDataNow = async () => {
    try {
      const resp = await lastValueFrom(ServicPlanSceneSyncLastData({
        plan_id,
        team_id: sessionStorage.getItem('team_id'),
        scene_id: data?.scene_id
      }))
      if (resp?.code == 0) {
        Message.success('手动同步成功!')
        // 刷新当前打开步骤列表
        data?.scene_id && getSceneOperatorList(data.scene_id)
        // 刷新当前打开场景详情
        data?.scene_id && getSceneDetail(data.scene_id)

        setOpenStep(null)
      }
    } catch (error) { }
  }

  return (
    <div className='scene-sync-mode'>
      <Dropdown
        droplist={dropList}
        trigger='click'
        position='bl'
        popupVisible={popupVisible}
        onVisibleChange={(val) => setPopupVisible(val)}
      >
        <div className='scene-sync-mode-text'>
          <div className='text'>{modeText?.[data?.sync_mode] || '同步：与场景管理相互实时同步'}</div>
          <IconDown />
        </div>
      </Dropdown>
      {(data?.sync_mode == '2' || data?.sync_mode == '3') && <Button type='primary' onClick={() => syncDataNow()}>同步</Button>}
    </div>
  )
}
export default SyncMode;
