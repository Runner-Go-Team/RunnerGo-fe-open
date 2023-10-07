import { Tabs } from '@arco-design/web-react';
import SceneList from './sceneList';
import SceneBody from '../SceneBody';
import React, { useCallback, useEffect, useState } from 'react'
import { isArray } from 'lodash';
import { arrayToTreeObject } from '@utils';

const TabPane = Tabs.TabPane;
const SceneInfo = (props) => {
  const { value } = props;

  const [current_scene_id, setCurrent_scene_id] = useState('');
  const [current_operator, setCurrent_operator] = useState(null);
  const treeList = useCallback(() => {
    const scene = value.find(item => item?.scene_id == current_scene_id);
    if (scene == undefined || !isArray(scene?.operators)) {
      return {}
    }

    return arrayToTreeObject(scene.operators, 'operator_id')?.sort((pre, after) => pre.sort - after.sort)
  }, [current_scene_id, value]);

  useEffect(() => {
    if (isArray(value) && value.length > 0 && !current_scene_id) {
      setCurrent_scene_id(value[0]?.scene_id);
    }
  }, [value]);

  useEffect(() => {
    if(current_scene_id){
      setCurrent_operator(null)
    }
  }, [current_scene_id]);

  const updateCurrentOperator = (id) => {
    const scene = value.find(item => item?.scene_id == current_scene_id);
    if (scene == undefined || !isArray(scene?.operators)) {
      setCurrent_operator(null);
      return
    }
    const operator = scene.operators.find(item => item?.operator_id == id)
    if (operator == undefined) {
      setCurrent_operator(null);
      return
    }
    setCurrent_operator(operator);
  }
  console.log(current_operator, "current_operator123");
  return (
    <div className='report-scene-info'>
      <div className="left">
        <div className="title">场景结果</div>
        <Tabs defaultActiveTab='all'>
          <TabPane key='all' title='全部'>
            <SceneList value={value || []} curent_id={current_scene_id} setCurrent_scene_id={setCurrent_scene_id} />
          </TabPane>
          <TabPane key='success' title='成功'>
            <SceneList value={isArray(value) ? value.filter(i => i?.run_status == 2) : []} curent_id={current_scene_id} setCurrent_scene_id={setCurrent_scene_id} />
          </TabPane>
          <TabPane key='failed' title='失败'>
            <SceneList value={isArray(value) ? value.filter(i => i?.run_status == 3) : []} curent_id={current_scene_id} setCurrent_scene_id={setCurrent_scene_id} />
          </TabPane>
        </Tabs>
      </div>
      <div className="right">
        <SceneBody value={treeList()} current={current_operator} onIdChange={(newID) => updateCurrentOperator(newID)} />
      </div>
    </div>
  )
}
export default SceneInfo;