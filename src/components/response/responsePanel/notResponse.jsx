import React from 'react';
import EmptyWhite from '@assets/apis/empty-white.svg';
import EmptyDark from '@assets/apis/empty-dark.svg';
import { notResponseWrapper } from './style';
import { useTranslation } from 'react-i18next';

const NotResponse = (props) => {
  const { text } = props;
  const { t } = useTranslation();
  return (
    <div className={notResponseWrapper}>
      {/* <div className="panel-header">
        <div className="panel-header_text">请求区</div>
      </div> */}
      <div className="panel-content">
        <EmptyWhite />
        <div className="panel-content_text">{ text }</div>
      </div>
    </div>
  );
};

export default NotResponse;
