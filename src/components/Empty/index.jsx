import React, { ReactDOM } from 'react';
import EmptySvg from '@assets/empty.svg';
import EmptyWhiteSvg from '@assets/empty-white.svg'
import { EmptyWrapper } from './style';
import { useSelector } from 'react-redux';


const Empty = (props) => {
  const { text, image } = props;
  const theme = useSelector((store) => store?.user?.theme);
  return (
    <div className={EmptyWrapper}>
      <div className="apipost-empty-container">
      <div className="apipost-empty-image">{image || (theme == 'dark' ? <EmptySvg /> : <EmptyWhiteSvg />)}</div>
        <div className="apipost-empty-text">{text || '暂无数据'}</div>
      </div>
    </div>
  );
};

export default Empty;
