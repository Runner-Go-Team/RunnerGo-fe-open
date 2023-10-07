import { Button, Dropdown, Menu, Message, Modal } from '@arco-design/web-react';
import { IconClose, IconDown } from '@arco-design/web-react/icon';
import React, { useContext, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { STEP_NAME } from '@constants/sceneStep';
import SceneMgmtContext from '../../context';
import SceneStep from '../SceneStep';
import Result from './result';
import { OpenPage, ClosePage, SwitchPage, 
  MouseClicking, MouseScrolling, MouseMovement, 
  MouseDragging, InputOperations, WaitEvents, ForLoop, 
  Assert, IfCondition, WhileLoop, DataWithdraw, SimpleCommon,
  CodeOperation
} from '../../SceneStepTemplate';
import { isArray, isEmpty, isPlainObject } from 'lodash';

const ItemTypes = {
  CARD: 'card'
};

const DraggableCard = ({ card, index, moveCard }) => {
  const [, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { index }
  }));

  return (
    <div ref={drag} style={{ padding: '10px', margin: '5px', border: '1px solid black' }}>
      {card.text}
    </div>
  );
};

const DroppableCard = ({ card, index, moveCard }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    hover: (item) => {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    }
  }));

  return (
    <div ref={(node) => drop(node)}>
      <div style={{ padding: '10px', margin: '5px', border: '1px solid black' }}>
        {card.text}
        {card.children.map((childCard, childIndex) => (
          <DraggableCard key={childCard.id} card={childCard} index={childIndex} moveCard={moveCard} />
        ))}
      </div>
    </div>
  );
};

const NestedSortableList = () => {
  const [cards, setCards] = useState([
    { id: 1, text: 'Card 1', children: [] },
    { id: 2, text: 'Card 2', children: [] },
    { id: 3, text: 'Card 3', children: [] },
    // Add more cards
  ]);
  const StepTempalte = {
    open_page: OpenPage,
    close_page: ClosePage,
    toggle_window: SwitchPage,
    mouse_clicking: MouseClicking,
    mouse_scrolling: MouseScrolling,
    mouse_movement: MouseMovement,
    mouse_dragging: MouseDragging,
    input_operations: InputOperations,
    wait_events: WaitEvents,
    for_loop: ForLoop,
    while_loop: WhileLoop,
    assert: Assert,
    if_condition: IfCondition,
    data_withdraw: DataWithdraw,
    forward: SimpleCommon,
    back: SimpleCommon,
    refresh: SimpleCommon,
    code_operation:CodeOperation
  }
  const moveCard = (fromIndex, toIndex) => {
    const newCards = [...cards];
    const [movedCard] = newCards.splice(fromIndex, 1);
    newCards.splice(toIndex, 0, movedCard);
    setCards(newCards);
  };
  const { openStep, setOpenStep, updateStep, stepDelete, selectedIds, setSelectedIds, stepForbidden, openResponse, setOpenResponse } = useContext(SceneMgmtContext);
  const StepComponent = StepTempalte?.[openStep?.action] ? StepTempalte[openStep.action] : null;

  const dropList = (<Menu onClickMenuItem={(key) => {
    if (!isArray(selectedIds) || selectedIds.length <= 0) {
      Message.error('您未选择任何内容!')
      return
    }
    if (key == 'delete') {
      Modal.confirm({
        title: '注意',
        content: '是否确定要批量删除您的步骤？',
        icon: null,
        closable: true,
        onOk: () => {
          return new Promise((resolve, reject) => {
            stepDelete(selectedIds);
            setSelectedIds([]);
            resolve();
          }).catch((e) => {
            throw e;
          })
        }
      });
    } else if (key == 'forbidden') {
      Modal.confirm({
        title: '注意',
        content: '是否确定要批量禁用您的步骤？',
        icon: null,
        closable: true,
        onOk: () => {
          return new Promise((resolve, reject) => {
            stepForbidden(selectedIds, 2);
            setSelectedIds([]);
            resolve();
          }).catch((e) => {
            throw e;
          })
        }
      });
    } else if (key == 'enable') {
      Modal.confirm({
        title: '注意',
        content: '是否确定要批量启用您的步骤？',
        icon: null,
        closable: true,
        onOk: () => {
          return new Promise((resolve, reject) => {
            stepForbidden(selectedIds, 1);
            setSelectedIds([]);
            resolve();
          }).catch((e) => {
            throw e;
          })
        }
      });
    }
  }}>
    <Menu.Item key='forbidden'>禁用</Menu.Item>
    <Menu.Item key='enable'>启用</Menu.Item>
    <Menu.Item key='delete'>删除</Menu.Item>
  </Menu>)
  console.log(openResponse, "openResponse");
  return (
    <div className='ui-scene-body'>
      <div className="body-left">
        <div className="body-left-header">
          <div className="title">
            场景步骤
          </div>
          <div className="more">
            <Dropdown droplist={dropList} trigger='click' position='br'>
              <Button>批量操作<IconDown fontSize={16} style={{ fontSize: '16px' }} /></Button>
            </Dropdown>
          </div>
        </div>
        <SceneStep />
      </div>
      {isPlainObject(openResponse) && !isEmpty(openResponse) && (
        <div className="body-right">
          <div className="body-right-header">
            <div className="title">{STEP_NAME?.[openResponse?.action] || '未定义标题'}</div>
            <IconClose onClick={() => setOpenResponse(null)} />
          </div>
          <div className="body-right-content runnergo-ui-test-scene-drawer">
            <Result value={openResponse} />
          </div>
        </div>
      )}
      {isPlainObject(openStep) && !isEmpty(openStep) && !openResponse && (<div className="body-right">
        <div className="body-right-header">
          <div className="title">{STEP_NAME?.[openStep?.action] || '未定义标题'}</div>
          <IconClose onClick={() => setOpenStep(null)} />
        </div>
        <div className="body-right-content runnergo-ui-test-scene-drawer">
          {StepComponent && <StepComponent data={openStep} onChange={setOpenStep} />}
        </div>

        <div className="body-right-footer">
          <Button type='primary' onClick={() => updateStep()}>保存</Button>
        </div>
      </div>)}
    </div>

  );
};

export default NestedSortableList;
