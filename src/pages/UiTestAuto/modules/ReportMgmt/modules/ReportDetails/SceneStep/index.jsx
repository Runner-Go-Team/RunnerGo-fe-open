import { Button, Checkbox, Dropdown, Menu } from '@arco-design/web-react';
import { IconDown } from '@arco-design/web-react/icon';
import React from 'react';
import { DndProvider } from 'react-dnd';
import StepCard from './StepCard';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './index.less';
import { isArray } from 'lodash';

const SceneStep = (props) => {
  const { value, current, onIdChange } = props;

  return (
    <DndProvider backend={HTML5Backend}>
    <div className='ui-scene-step'>
      <div className="step-list">
        {isArray(value) && value.map(item => (<StepCard onClick={onIdChange} active={current?.operator_id == item?.operator_id} key = {item?.operator_id} data={item}/>))}
      </div>
    </div>
    </DndProvider>
  );
};

export default SceneStep;
