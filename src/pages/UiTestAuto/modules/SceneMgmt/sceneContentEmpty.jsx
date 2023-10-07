import React, { useContext } from 'react'
import SvgUiScene from '@assets/icons/scene32.svg';
import SceneMgmtContext from './context';
import './sceneContentEmpty.less'
import Bus from '@utils/eventBus';

const SceneContentEmpty = () => {

  const { createScene } = useContext(SceneMgmtContext);

  return (
    <div className='empty-new-scene' onClick={() => createScene()}>
      <div className="icon"><SvgUiScene /></div>
      <div className="text">新建场景</div>
    </div>
  )
}

export default SceneContentEmpty;