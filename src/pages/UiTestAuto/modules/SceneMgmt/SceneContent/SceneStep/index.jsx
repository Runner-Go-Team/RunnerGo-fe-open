import { Button, Checkbox, Dropdown, Menu } from '@arco-design/web-react';
import { IconDown } from '@arco-design/web-react/icon';
import React, { useContext, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { STEP_FOOTERS } from '@constants/sceneStep';
import SceneMgmtContext from '../../context';
import StepCard from './StepCard';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './index.less';
import { isArray } from 'lodash';
import { arrayToTreeObject } from '@utils';


const SceneStep = () => {

  const { createStep, treeList } = useContext(SceneMgmtContext);
  const renderDropList = (menus) => {
    return (<Menu onClickMenuItem={(key) => createStep(key)}>
      {menus.map(item => (<Menu.Item key={item.action}>{item.name}</Menu.Item>))}
    </Menu>)
  }

  return (
    <DndProvider backend={HTML5Backend}>
    <div className='ui-scene-step'>
      <div className="step-list">
        {isArray(treeList) && treeList.map(item => (<StepCard key = {item?.operator_id} data={item}/>))}
      </div>
      <div className="step-footer">
        <div className="top-border"></div>
        <div className="right-border"></div>
        <div className="bottom-border"></div>
        <div className="left-border"></div>
        {STEP_FOOTERS.map((item) => {
          if (isArray(item?.menus)) {
            return (<Dropdown key={item.type} droplist={renderDropList(item.menus)} trigger='click' position='br'>
              <div className='step-footer-item' style={{
                color: item.color,
                backgroundColor: item.backgroundColor,
                border: '1px solid',
                borderColor: item?.borderColor || item.color
              }}>
                {item.name}
                {isArray(item?.menus) && <IconDown fontSize={16} />}
              </div>
            </Dropdown>)
          }
          return (<div key={item.type} onClick={() => createStep(item.type)} className='step-footer-item' style={{
            color: item.color,
            backgroundColor: item.backgroundColor,
            border: '1px solid',
            borderColor: item?.borderColor || item.color
          }}>
            {item.name}
            {isArray(item?.menus) && <IconDown fontSize={16} />}
          </div>)
        })}
      </div>
    </div>
    </DndProvider>
  );
};

export default SceneStep;
