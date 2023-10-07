import React from 'react';
import './index.less'; 

const ProgressBar = ({ completed }) => {
  const progressBarStyle = {
    width: `${completed}%`,
    backgroundColor: 'rgba(76, 203, 126, 1)' ,
  };

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={progressBarStyle}></div>
    </div>
  );
};

export default ProgressBar;
