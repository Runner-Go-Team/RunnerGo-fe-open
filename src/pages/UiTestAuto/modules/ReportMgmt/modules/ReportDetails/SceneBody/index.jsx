import { Button, Dropdown, Menu, Tabs } from '@arco-design/web-react';
import { IconClose, IconDown } from '@arco-design/web-react/icon';
import React, { useContext, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { STEP_NAME } from '@constants/sceneStep';
import SceneStep from '../SceneStep';
import Result from '../../../../SceneMgmt/SceneContent/SceneBody/result';
import { isArray, isEmpty, isPlainObject } from 'lodash';
import './index.less';

const TabPane = Tabs.TabPane
const NestedSortableList = (props) => {
  const { value, current, onIdChange } = props;

  return (
    <div className='ui-scene-body'>
      <div className="body-left">
        <div className="body-left-header">
          <div className="title">
            场景步骤
          </div>
          <div className="more">
          </div>
        </div>
        <Tabs defaultActiveTab='all' destroyOnHide={true}>
          <TabPane key='all' title='全部'>
            <SceneStep value={value} current={current} onIdChange={onIdChange} />
          </TabPane>
          <TabPane key='success' title='成功'>
            <SceneStep value={isArray(value) ? value.filter(i=>i?.run_status == 2) : []} current={current} onIdChange={onIdChange} />
          </TabPane>
          <TabPane key='failed' title='失败'>
            <SceneStep value={isArray(value) ? value.filter(i=>i?.run_status == 3) : []} current={current} onIdChange={onIdChange} />
          </TabPane>
          <TabPane key='un_exec' title='未测'>
            <SceneStep value={isArray(value) ? value.filter(i=>i?.run_status == 1) : []} current={current} onIdChange={onIdChange} />
          </TabPane>
        </Tabs>
      </div>
      {isPlainObject(current) && !isEmpty(current) && (
        <div className="body-right">
          <div className="body-right-header">
            <div className="title">{STEP_NAME?.[current?.action] || '未定义标题'}</div>
            <IconClose onClick={() => onIdChange('')} />
          </div>
          <div className="body-right-content">
            <Result value={current} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NestedSortableList;
