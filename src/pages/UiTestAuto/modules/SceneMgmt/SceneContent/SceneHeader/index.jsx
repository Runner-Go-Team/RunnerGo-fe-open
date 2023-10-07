import React, { useContext, useState } from "react";
import SceneContext from '../../context';
import cn from 'classnames';
import { Input, Button, Dropdown, Select, Radio, InputNumber } from "@arco-design/web-react";
import { IconCaretRight, IconRecordStop, IconSave } from "@arco-design/web-react/icon";
import { isEmpty, isObject, isPlainObject, isString } from "lodash";
import SyncMode from './syncMode';
import Bus from "@utils/eventBus";
import { useDispatch } from "react-redux";

const Option = Select.Option
const RadioGroup = Radio.Group
const SceneHeader = () => {
  const { openScene, setOpenScene, saveScene, runScene, stopScene, plan_id, sceneResponse, getSceneDetail } = useContext(SceneContext);

  const [popupVisible, setPopupVisible] = useState(false);
  const dispatch = useDispatch();
  const config = isObject(openScene?.browsers?.[0]) ? openScene?.browsers?.[0] : {};

  console.log(config, "openScene.browsers");
  // const runningConfig = (<div className="runnergo-ui-scene-running-config">
  //   <div className="title">运行配置</div>
  //   <div className="card"><label>选择浏览器</label> <div className="card-right">
  //     <Select value={'Chrome'}>
  //       <Option key='Chrome' value={'Chrome'}>Chrome</Option>
  //     </Select>
  //   </div> </div>
  //   <div className="card"><label>运行模式</label><div className="card-right"> <RadioGroup onChange={(val) => {
  //     config.headless = val == 'headless'
  //     setOpenScene({ ...openScene, browsers: [config] });
  //     saveScene({ ...openScene, browsers: [config] });
  //     console.log(val, "运行模式change");
  //   }} value={config?.headless ? 'headless' : 'no-headless'}>
  //     <Radio value='no-headless'>前台运行</Radio>
  //     <Radio value='headless'>后台运行</Radio>
  //   </RadioGroup>  </div></div>
  //   <div className="card"><label>窗口大小</label><div className="card-right"> <Select onChange={(val) => {
  //     config.size_type = val
  //     setOpenScene({ ...openScene, browsers: [config] });
  //     saveScene({ ...openScene, browsers: [config] });
  //   }} value={config?.size_type || 'default'}>
  //     <Option key='default' value={'default'}>默认(1280 x 720)</Option>
  //     <Option key='max' value={'max'}>窗口最大化</Option>
  //     <Option key='set_size' value={'set_size'}>指定像素</Option>
  //   </Select> </div></div>
  //   {config?.size_type == 'set_size' && (<div className="card"><label>尺寸</label> <div className="card-right">
  //     <InputNumber min={0} value={config?.set_size?.x || 0} onChange={(val) => {
  //       config.set_size.x = val
  //       setOpenScene({ ...openScene, browsers: [config] });
  //       saveScene({ ...openScene, browsers: [config] });
  //     }} /> <InputNumber min={0} value={config?.set_size?.y || 0} onChange={(val) => {
  //       config.set_size.y = val
  //       setOpenScene({ ...openScene, browsers: [config] });
  //       saveScene({ ...openScene, browsers: [config] });
  //     }} />
  //   </div> </div>)}
  // </div>)

  return (
    <div className="ui-scene-header">
      <div className="ui-scene-header-left">
        <Input
          maxLength={30}
          placeholder="请输入场景名称"
          value={openScene?.name}
          onBlur={(e) => {
            if (isString(e?.target?.value)) {
              saveScene({ ...openScene, name: e.target.value });
            }
          }}
          onChange={(val) => {
            setOpenScene({ ...openScene, name: val })
          }} />
        <div className="description">
          <label>场景描述:</label>
          <Input
            maxLength={50}
            placeholder="请输入场景描述"
            value={openScene?.description}
            onBlur={(e) => {
              if (isString(e?.target?.value)) {
                saveScene({ ...openScene, description: e.target.value });
              }
            }}
            onChange={(val) => {
              setOpenScene({ ...openScene, description: val })
            }} />
        </div>
        {isPlainObject(openScene?.source_ui_scene) && !isEmpty(openScene.source_ui_scene) && <SyncMode plan_id={plan_id} data={openScene} />}
      </div>
      <div className="ui-scene-header-right">
        {/* <Dropdown
          position="bottom"
          droplist={runningConfig}
          trigger='click'
          popupVisible={popupVisible}
          onVisibleChange={(val) => setPopupVisible(val)}
        > */}
        {!isString(plan_id) && <Button onClick={() => Bus.$emit('openModal', 'UiSceneRunConfig', { scene: openScene, getSceneDetail })}>运行配置</Button>}
        {/* </Dropdown> */}
        <Button disabled={sceneResponse?.status == 'loading'} className={cn('scene-debug-btn', {
          "plan-scene-debug-btn": isString(plan_id),
          "plan-scene-debug-btn-run": sceneResponse?.status == 'running'
        })} onClick={() => {
          if (sceneResponse?.status == 'running') {
            stopScene(openScene?.scene_id, sceneResponse?.run_id)
          } else {
            // 开启调试中...
            dispatch({
              type: 'uitest_auto/setSceneRunResult',
              payload: {
                scene_id:openScene.scene_id,
                status: 'loading'
              },
            })
            runScene(openScene.scene_id)
          }
        }}>
           {sceneResponse?.status == 'running' && (<><IconRecordStop fontSize={14} />终止运行</>)} 
           {sceneResponse?.status == 'loading' && (<><IconCaretRight fontSize={14} />调试中...</>)}
           {(!sceneResponse?.status || sceneResponse?.status == 'over') && (<><IconCaretRight fontSize={14} />调试场景</>)}
        </Button>
      </div>
    </div>
  )
}

export default SceneHeader;