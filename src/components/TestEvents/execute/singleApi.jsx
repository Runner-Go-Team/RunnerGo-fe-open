import React, { useState } from 'react';
import { Right as RightSvg, Down as DownSvg } from 'adesign-react/icons';
import SvgFailure from '@assets/test/faild.svg';
import SvgSuccess from '@assets/test/success.svg';
import SvgIgnore from '@assets/test/ignore.svg';
import { isNumber, isString } from 'lodash';
import { SingleApiPanel } from './style';
import Request from './request';

const SingleApi = (props) => {
  const { type, dataList, filterEventId } = props;

  // http_error -1 成功 -2 忽略 1 失败

  const [showIndex, setShowIndex] = useState(null);

  const filterdList = isString(filterEventId)
    ? dataList.filter((item) => item.event_id === filterEventId)
    : dataList;

  const handleSetShowIndex = (index) => {
    if (showIndex !== index) {
      setShowIndex(index);
    } else {
      setShowIndex(null);
    }
  };

  return (
    <div className={SingleApiPanel}>
      <div className="single-api-list">
        {filterdList?.map((item, index) => (
          <div key={index} className="single-main">
            {type !== null && (
              <div className="status-panel">
                {type === 'success' && <SvgSuccess />}
                {type === 'failure' && <SvgFailure />}
                {type === 'ignore' && <SvgIgnore />}
              </div>
            )}
            <div className="api-msg" onClick={handleSetShowIndex.bind(null, index)}>
              <div className="api-method">{item?.request?.method}</div>
              <div className="api-name">{item?.request?.name}</div>
              <div className="api-url">{item?.request?.url}</div>
            </div>
            {/* <div className="ctrl-panel">
              <span>1kb</span>
              <span>33ms</span>
              <span>200</span>
            </div> */}
            {type !== null && (
              <div className="openDetail" onClick={handleSetShowIndex.bind(null, index)}>
                {showIndex === index ? <DownSvg width={16} /> : <RightSvg width={16} />}
              </div>
            )}
          </div>
        ))}
      </div>
      {isNumber(showIndex) && (
        <>
          <Request value={filterdList[showIndex]} />
        </>
      )}
    </div>
  );
};

export default SingleApi;
