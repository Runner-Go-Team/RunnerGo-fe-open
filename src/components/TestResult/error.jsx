import React from 'react';
import SvgClock from '@assets/runner/clock.svg';
import SvgTimeStamp from '@assets/runner/timestamp.svg';
import SvgError from '@assets/runner/error.svg';
import { Download as SvgDownload } from 'adesign-react/icons';
import { bindSafeHtml } from '@utils/common';
import PieCharts from './pie';

const ErrorResult = (props) => {

  return (
    <div className="error-panel">
      <div className="box-left">
        <div className="text-line">
          <div className="api-success">接口通过:{bindSafeHtml(props?.http?.passed)}</div>
          <div className="assert-success">断言通过:{bindSafeHtml(props?.assert?.passed)}</div>
        </div>
        <div className="text-line">
          <div className="api-error">接口失败:{bindSafeHtml(props?.http?.failure)}</div>
          <div className="assert-error">断言失败:{bindSafeHtml(props?.assert?.failure)}</div>
        </div>
      </div>
      <div className="box-center">
        <PieCharts http={props?.http} assert={props?.assert} />
      </div>
      <div className="box-right">
        <div className="inner-content">
          <div>
            <SvgClock /> 开始时间：{bindSafeHtml(props?.start_time)}
          </div>
          <div>
            <SvgClock />
            结束时间：{bindSafeHtml(props?.end_time)}
          </div>
          <div>
            <SvgTimeStamp />
            总耗时： {bindSafeHtml(props?.long_time)}
          </div>
          <div>
            <SvgClock />
            总响应时间： {bindSafeHtml(props?.total_response_time)}ms
          </div>
          <div>
            <SvgClock />
            平均响应时间： {bindSafeHtml(props?.average_response_time)}ms
          </div>
          <div>
            <SvgDownload />
            总响应数据大小： {bindSafeHtml(props?.total_received_data)}kb
          </div>
          <div>
            <SvgError />
            未测接口： {bindSafeHtml(props?.ignore_count)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorResult;
