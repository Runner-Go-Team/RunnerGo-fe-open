import React, { ReactDOM } from 'react';
import EmptySvg from '@assets/img/empty.svg';
import { EmptyWrapper } from './style';


const Empty = (props) => {
  const { text, image } = props;

  return (
    <div className={EmptyWrapper}>
      <div className="apipost-empty-container">
        <div className="apipost-empty-image">{image || <EmptySvg />}</div>
        <div className="apipost-empty-text">{text || '暂无数据'}</div>
      </div>
    </div>
  );
};

export default Empty;
