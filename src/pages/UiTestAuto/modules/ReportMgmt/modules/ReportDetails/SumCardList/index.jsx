import { IconInfoCircle } from '@arco-design/web-react/icon';
import React from 'react'

export default function index(props) {
  const {value} = props;
  return (
    <div className="sum-card-list">
        <div className="sum-card-item">
          <div className="left">
            <div className="title">执行时长</div>
            <div className="content">{value?.run_duration_time || 0}s</div>
          </div>
        </div>
        <div className="sum-card-item">
          <div className="left">
            <div className="title">场景总数</div>
            <div className="content">{value?.scene_total_num || 0}</div>
          </div>
        </div>
        <div className="sum-card-item">
          <div className="left">
            <div className="title">步骤总数</div>
            <div className="content">{value?.operator_total_num || 0}</div>
            <div className="footer">
              <div className="success-text">{value?.operator_success_num || 0}</div>
              <div className="failed-text">{value?.operator_error_num || 0}</div>
              <div className="un-exec-text">{value?.operator_un_exec_num || 0}</div>
            </div>
          </div>
        </div>
        <div className="sum-card-item">
          <div className="left">
            <div className="title">断言总数</div>
            <div className="content">{value?.assert_total_num || 0}</div>
            <div className="footer">
              <div className="success-text">{value?.assert_success_num || 0}</div>
              <div className="failed-text">{value?.assert_error_num || 0}</div>
              <div className="un-exec-text">{value?.assert_un_exec_num || 0}</div>
            </div>
          </div>
        </div>
      </div>
  )
}
