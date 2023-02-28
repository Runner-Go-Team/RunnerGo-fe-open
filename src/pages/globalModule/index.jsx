import React from 'react';
import { useSelector } from 'react-redux';
import RunnerExecute from './runnerExecute';

const GlobalModule = (props) => {
  const moduleType = useSelector((store) => store?.global?.moduleType);

  return (
    <>
      {moduleType === 'runnerExecute' && <RunnerExecute />}

      {/* {moduleType === 'miniTest' && <MiniTest />} */}
    </>
  );
};

export default GlobalModule;
