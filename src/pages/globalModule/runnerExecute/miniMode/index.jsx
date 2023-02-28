import React, { useEffect } from 'react';
import { Close as CloseSvg } from 'adesign-react/icons';
import { useDispatch, useSelector } from 'react-redux';
import './index.less';
import { isFunction, isString } from 'lodash';
import { useNavigate } from 'react-router-dom';
import SvgStop from './stop.svg';
import SvgHide from './hide.svg';

const MiniTest = (props) => {
  const { currentProgress, title, onRestore, onStop } = props;

  // const navigate = useNavigate();

  // const handleRestoreCurrentTest = () => {
  //   // if (isString(currentTest?.target_type) && currentTest?.target_type === 'test') {
  //   //  // navigate('/test/single', { state: { test_id: currentTest.test_id } });
  //   // }
  // };

  return (
    <div className="global-mini-test">
      <div className="mini-test-header">
        <div className="text">{title}</div>
        <div className="btn-list">
          <div className="btn btn-stop" onClick={onStop}>
            {currentProgress === 1 ? <CloseSvg width={16} /> : <SvgStop />}
          </div>
          <div className="btn btn-hide" onClick={onRestore}>
            <SvgHide />
          </div>
        </div>
      </div>
      <div className="progress-panel">
        <div className="progress-title"> 执行进度:{`${(currentProgress * 100).toFixed(2)}%`}</div>
        <div className="progress-bg">
          <div className="bar" style={{ width: `${currentProgress * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default MiniTest;
