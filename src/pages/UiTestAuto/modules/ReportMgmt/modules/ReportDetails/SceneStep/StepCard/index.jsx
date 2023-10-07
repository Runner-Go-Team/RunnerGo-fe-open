import { Button, Checkbox, Dropdown, Menu, Tooltip } from '@arco-design/web-react';
import { IconCheckCircleFill, IconCloseCircleFill, IconDown, IconMinusCircleFill, IconPlayArrowFill, IconRight } from '@arco-design/web-react/icon';
import classNames from 'classnames';
import { isArray, isNumber } from 'lodash';
import { STEP_NAME } from '@constants/sceneStep';
import React, { useRef, useState } from 'react'
import { FotmatTimeStamp } from '@utils';


const SubMenu = Menu.SubMenu;
const StepCard = (props) => {
  const { data, active = false, onClick } = props;
  const dragRef = useRef(null);
  const dropRef = useRef(null);
  const [showChild, setShowChild] = useState(true);
  return (
    <>
      <div ref={dropRef} onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(data?.operator_id)
      }} className={classNames({
        'step-list-item': true,
        // 'step-list-item-forbidden': data?.status != 1,
        'step-list-item-active': active,
        'step-list-item-success': data?.status == 'success',
        'step-list-item-failed': data?.status == 'failed',
      })}>
        <div className="item-info" ref={dragRef}>
          <div className="item-left"><div className='item-sort'>{data?.sort}</div> <div className={classNames({
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
            {data?.run_status != 1 && <div className="run-times">{isNumber(data?.exec_time) ? `${data?.exec_time || 0}s` : ''}</div>}
            <div className="end-times">{data?.run_end_times ? FotmatTimeStamp(data?.run_end_times, 'YYYY-MM-DD HH:mm:ss') : ''}</div>
            {data?.run_status != 1 && (
              <Button onClick={(event) => {
                event.stopPropagation();
                onClick && onClick(data?.operator_id)
              }} className='step-list-item-response-show'>查看结果</Button>
            )}
            {data?.run_status == 1 && <IconMinusCircleFill style={{ color: '#9E9E9E' }} />}
            {data?.run_status == 2 && <IconCheckCircleFill style={{ color: 'rgba(60, 192, 113, 1)' }} color='rgba(60, 192, 113, 1)' />}
            {data?.run_status == 3 && <IconCloseCircleFill style={{ color: 'rgba(201, 53, 63, 1)' }} color='rgba(201, 53, 63, 1)' />}
            {isArray(data?.children) && data.children.length > 0 && (showChild ? <IconDown onClick={() => setShowChild(false)} /> : <IconRight onClick={() => setShowChild(true)} />)}
          </div>
        </div>
        {isArray(data?.children) && data.children.length > 0 && showChild && (<div className='step-child-node'>
          {data.children.map(i => (<StepCard onClick={onClick} key={i?.operator_id} data={i} />))}
        </div>)}
      </div>
    </>
  )
}
export default StepCard