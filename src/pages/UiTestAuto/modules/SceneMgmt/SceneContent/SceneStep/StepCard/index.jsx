import { Button, Checkbox, Dropdown, Menu, Modal, Tooltip } from '@arco-design/web-react';
import { IconDown, IconMore, IconPlayArrowFill, IconPlusCircle, IconRight } from '@arco-design/web-react/icon';
import classNames from 'classnames';
import { isArray, isString, throttle } from 'lodash';
import { STEP_NAME, HAS_CHILD_STEP, STEP_FOOTERS } from '@constants/sceneStep';
import React, { useContext, useRef, useState } from 'react'
import useNodeSort from '../hooks/useNodeSort';
import SceneMgmtContext from '../../../context';
import { useDrag, useDrop } from 'react-dnd';

const SubMenu = Menu.SubMenu;
const StepCard = (props) => {
  const { data } = props;
  const { handleNodeSelect, stepList, stepSort, stepDelete, stepForbidden, stepCopy, runScene, createStep, openStep, getStepDetail, selectedIds, sceneResponse, setOpenResponse } = useContext(SceneMgmtContext);
  const { handleNodeDragEnd } = useNodeSort({ treeData: stepList });
  const dragRef = useRef(null);
  const dropRef = useRef(null);
  const [showChild, setShowChild] = useState(true);
  const [drageMode, setDragMode] = useState(null);
  const handleHover = throttle((item, monitor) => {
    if (item?.operator_id == data?.operator_id) {
      return
    }
    if (!dragRef?.current) {
      return;
    }
    try {
      const { top, bottom, y } = dragRef.current.getBoundingClientRect();
      const halfOfHeight = (bottom - top) / 3
      const { y: mY } = monitor.getClientOffset();

      if (mY < y + halfOfHeight) {
        setDragMode('top');
      } else if (mY >= y + halfOfHeight &&
        mY < y + halfOfHeight * 2) {
        setDragMode('inside');
      } else {
        setDragMode('bottom');
      }
    } catch (error) { }
  }, 50)

  const handleDrop = (item, monitor) => {
    const didDrop = monitor.didDrop();
    if (!didDrop && item.operator_id != data.operator_id) {
      console.log("把", item.operator_id, '拖动到', data.operator_id, "模式未", drageMode);
      const dropOverList = handleNodeDragEnd(item.operator_id, data.operator_id, drageMode);
      if (!dropOverList) {
        return
      }
      console.log(dropOverList, "dropOverList");
      stepSort(dropOverList);
    }
  }

  let [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: () => ({ ...data }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [{ isOver }, drop] = useDrop({
    accept: 'CARD',
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    hover: handleHover,
    drop: handleDrop
  })

  drag(dragRef);
  drop(dropRef);
  const dropList = (
    <Menu onClickMenuItem={(key) => {
      if (key == 'delete') {
        Modal.confirm({
          title: '删除',
          content: `确认删除该步骤吗？`,
          icon: null,
          closable: true,
          onOk: () => {
            return new Promise((resolve, reject) => {
              stepDelete([data.operator_id]);
              resolve();
            }).catch((e) => {
              throw e;
            })
          }
        });

      } else if (key == 'forbidden') {
        stepForbidden([data.operator_id], data?.status == 1 ? 2 : 1);
      } else if (key == 'copy') {
        stepCopy(data.operator_id);
      }
    }}>
      <Menu.Item key='copy'>复制</Menu.Item>
      <Menu.Item key='forbidden'>{data?.status == 1 ? '禁用' : '恢复'}</Menu.Item>
      <Menu.Item key='delete'>删除</Menu.Item>
    </Menu>
  );
  const plusDropList = (
    <Menu className={'adjacent-menus'} onClickMenuItem={(key, a, keyPath) => {
      if (keyPath.includes('adjacent')) {
        // 添加相邻节点
        createStep(key, { sort: data.sort, parent_id: data?.parent_id });
      } else if (keyPath.includes('child')) {
        // 添加子节点
        createStep(key, { sort: 0, parent_id: data.operator_id });
      }
    }}>
      <SubMenu
      className={'adjacent-menus-submenu'}
        key='adjacent'
        title={
          <>
            添加相邻步骤
          </>
        }
      >
        {STEP_FOOTERS.map(item => {
          if (isArray(item?.menus) && item.menus.length > 0) {
            return <SubMenu
              key={item.type}
              title={
                <>
                  {item.name}
                </>
              }
            >
              {item.menus.map(i => (
                <Menu.Item key={i.action}>{i.name}</Menu.Item>
              ))}
            </SubMenu>
          } else {
            return <Menu.Item key={item.type}>{item.name}</Menu.Item>
          }
        })}
        {/* {Object.keys(STEP_NAME).map(key => (
          <Menu.Item key={key}>{STEP_NAME[key]}</Menu.Item>
        ))} */}
      </SubMenu>
      {HAS_CHILD_STEP.includes(data?.action) && (
        <SubMenu
          key='child'
          title={
            <>
              添加子步骤
            </>
          }
        >
          {STEP_FOOTERS.map(item => {
          if (isArray(item?.menus) && item.menus.length > 0) {
            return <SubMenu
              key={item.type}
              title={
                <>
                  {item.name}
                </>
              }
            >
              {item.menus.map(i => (
                <Menu.Item key={i.action}>{i.name}</Menu.Item>
              ))}
            </SubMenu>
          } else {
            return <Menu.Item key={item.type}>{item.name}</Menu.Item>
          }
        })}
        </SubMenu>
      )}
    </Menu>
  );

  const nodeChecked = (node) => {
    if (!node.children || node.children.length === 0) {
      return selectedIds.includes(node?.operator_id);
    }
    const allChildrenSelected = node.children.every(child => nodeChecked(child));
    return allChildrenSelected;
  }

  const isAnyChildSelected = (node) => {
    if (!node.children || node.children.length === 0) {
      return selectedIds.includes(node?.operator_id);
    }

    const anyChildSelected = node.children.some(child => isAnyChildSelected(child));
    return anyChildSelected;
  }
  const response = sceneResponse?.[data?.operator_id] ? sceneResponse?.[data?.operator_id] : null
  return (
    <>
      <div key={data?.operator_id} ref={dropRef} onClick={(e) => {
        e.stopPropagation();
        getStepDetail(data?.operator_id)
      }} className={classNames({
        'step-list-item': true,
        'step-list-item-dragging': isDragging,
        'step-list-item-top': isOver && drageMode == 'top',
        'step-list-item-inside': isOver && drageMode == 'inside',
        'step-list-item-bottom': isOver && drageMode == 'bottom',
        'step-list-item-forbidden': data?.status != 1,
        'step-list-item-active': data?.operator_id == openStep?.operator_id,
        'step-list-item-success': response?.status == 'success',
        'step-list-item-failed': response?.status == 'failed',
      })}>
        <div className="item-info" ref={dragRef}>
          <div className="item-left"><Checkbox onChange={(val, event) => {
            event.stopPropagation();
            handleNodeSelect(data, val)
          }} indeterminate={!nodeChecked(data) && isAnyChildSelected(data)} checked={nodeChecked(data)} /> <div className='item-sort'>{data?.sort}</div> <div className={classNames({
            "item-type": true,
            [data?.action]: true
          })}>{STEP_NAME?.[data?.action] || '未识别类型'}</div>
            <Tooltip position='top' trigger='hover' content={data?.name}>
              <div className='item-name text-ellipsis'>
                {data?.name}
              </div>
            </Tooltip>
          </div>
          <div className="item-right" onClick={(event) => {
            event.stopPropagation();
          }}>
            {(response?.status == 'success' || response?.status == 'failed') ?
              (<Button onClick={(event) => {
                event.stopPropagation();
                setOpenResponse({ ...response, action: data?.action });
              }} className='step-list-item-response-show'>查看结果</Button>)
              : (
                <></>
                // <IconPlayArrowFill onClick={() => {
                //   runScene(data.scene_id, [data.operator_id]);
                // }} className='icon-run-step' fontSize={20} />
              )}

            {isString(response?.status) && response.status == '' && <span>未执行</span>}
            <Dropdown droplist={plusDropList} trigger='click' position='br'>
              <IconPlusCircle onClick={() => {
              }} fontSize={20} />
            </Dropdown>
            <Dropdown droplist={dropList} trigger='click' position='br'>
              <IconMore onClick={() => {
              }} fontSize={20} />
            </Dropdown>
            {isArray(data?.children) && data.children.length > 0 && (showChild ? <IconDown onClick={() => setShowChild(false)} /> : <IconRight onClick={() => setShowChild(true)} />)}
          </div>
        </div>
        {isArray(data?.children) && data.children.length > 0 && showChild && (<div className='step-child-node'>
          {data.children.map(i => (<StepCard key={i?.operator_id} data={i} />))}
        </div>)}
      </div>
    </>
  )
}
export default StepCard