import { IconCheckCircleFill, IconCloseCircleFill } from '@arco-design/web-react/icon';
import { isArray } from 'lodash';
import cn from 'classnames';
import ProgressBar from '@components/ProgressBar';
import React from 'react'
import { Tooltip } from '@arco-design/web-react';

const SceneList = (props) => {
  const { value, curent_id, setCurrent_scene_id } = props

  return (
    <div className='report-scene-info-scene-list'>
      {isArray(value) && value.map(item => (
        <div className={cn('item', {
          active: curent_id == item.scene_id
        })} key={item?.scene_id} onClick={() => setCurrent_scene_id(item.scene_id)}>
          <div className="status">{item?.run_status == 2 ? <IconCheckCircleFill style={{ color: 'rgba(60, 192, 113, 1)' }} color='rgba(60, 192, 113, 1)' /> : <IconCloseCircleFill style={{ color: 'rgba(201, 53, 63, 1)' }} color='rgba(201, 53, 63, 1)' />}</div>
          <div className="name text-ellipsis">
            <Tooltip position='top' trigger='hover' content={item?.name || ""}>
              {item?.name || ""}
            </Tooltip>
          </div>
          <div className="progress"><ProgressBar completed={(item?.operator_success_num / item?.operator_total_num) * 100} /></div>
          <div className={cn({
            "ratio-success": item?.operator_success_num / item?.operator_total_num == 1,
            "ratio-failed": item?.operator_success_num / item?.operator_total_num != 1
          })}>{`${item?.operator_success_num || 0}/${item?.operator_total_num || 0}`}</div>
        </div>
      ))}
    </div>
  )
}
export default SceneList;