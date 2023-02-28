import React from 'react';
import EmptyWhite from '@assets/apis/empty-white.svg';
import EmptyDark from '@assets/apis/empty-dark.svg';
import { notResponseWrapper } from './style';

const NotResponse = () => {
  return (
    <div className={notResponseWrapper}>
      {/* <div className="panel-header">
        <div className="panel-header_text">请求区</div>
      </div> */}
      <div className="panel-content">
        <EmptyWhite />
        <div className="panel-content_text">输入url点击发送按钮获取响应结果</div>
      </div>
    </div>
  );
};

export default NotResponse;
