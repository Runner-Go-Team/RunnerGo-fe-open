import React, { useEffect, useRef, useState } from 'react';
import { Tabs as TabComponent, Button } from 'adesign-react';
import cn from 'classnames';
import {
  Import as ImportSvg,
  Export as ExportSvg,
  Beautify as BeautifySvg,
  Simplify as SimplifySvg,
  Duration as DurationSvg,
} from 'adesign-react/icons';
import { timeStatus, EditFormat } from '@utils';
import { useDispatch, useSelector } from 'react-redux';
import Example from '@components/Example';
import Resclose from '@assets/apis/resclose.svg';
import isFunction from 'lodash/isFunction';
import MonacoEditor from '@components/MonacoEditor';
import { isPlainObject, isString } from 'lodash';
import NotResponse from '@components/NotResponse';
import ResHeader from './resHeader';
import { ResponseStatusRight, ResponseSendWrapper, ResponseErrorWrapper } from './style';

const { Tabs, TabPan } = TabComponent;

const ResonpsePanel = (props) => {
  const { path, data, onChange, tempData } = props;

  // 展示方向 1.水平 -1 上下
  const { APIS_TAB_DIRECTION } = useSelector((store) => store?.user?.config);
  const dispatch = useDispatch();
  const refRequest = useRef(null);
  const refErrRequest = useRef(null);
  const { response, sendStatus, message } = tempData || {};

  const result = response?.result ? EditFormat(response?.result) : '';
  const [activeIndex, setActiveIndex] = useState('1');
  const [specialStatus, setSpecialStatus] = useState('none');
  const defaultList = [
    {
      id: '1',
      title: '响应内容',
      content: (
        <MonacoEditor
          value={result?.value || ''}
          style={{ minHeight: '100%' }}
          Height="100%"
          options={{
            readOnly: true,
          }}
          language={result?.mode || 'json'}
        />
      ),
    },
    {
      id: '2',
      title: '响应MetaData',
      content: <ResHeader data={response?.metadata || []}></ResHeader>,
    },
    {
      id: '3',
      title: '成功响应示例',
      content: (
        <>
          {' '}
          <div className="api-example-header" style={{ userSelect: 'none' }}>
            <div
              className="button"
              onClick={() => {
                if (isFunction(refRequest?.current?.importFromData))
                  refRequest.current.importFromData(result?.value || '');
              }}
            >
              <ImportSvg width={16} />
              <>从现有响应导入</>
            </div>
            <div
              className="button"
              onClick={() => {
                if (isFunction(refRequest?.current?.extractData)) refRequest.current.extractData();
              }}
            >
              <ExportSvg width={16} />
              <>提取字段和描述</>
            </div>
            <div
              className="button"
              onClick={() => {
                if (isFunction(refRequest?.current?.butifyFormatJson))
                  refRequest.current.butifyFormatJson();
              }}
            >
              <BeautifySvg width={16} />
              <>美化</>
            </div>
            <div
              className="button"
              onClick={() => {
                if (isFunction(refRequest?.current?.simplifyJson))
                  refRequest.current.simplifyJson();
              }}
            >
              <SimplifySvg width={16} />
              <>简化</>
            </div>
          </div>
          <Example
            data={data?.success || {}}
            direction={APIS_TAB_DIRECTION > 0 ? 'vertical' : 'horizontal'}
            ref={refRequest}
            onChange={(type, val) => {
              if (type === 'Raw') {
                onChange(`${path}.response.success.raw`, val);
              } else if (type === 'Parameter') {
                onChange(`${path}.response.success.parameter`, val);
              }
            }}
          ></Example>
        </>
      ),
    },
    {
      id: '4',
      title: '失败响应示例',
      content: (
        <>
          {' '}
          <div className="api-example-header" style={{ userSelect: 'none' }}>
            <div
              className="button"
              onClick={() => {
                if (isFunction(refErrRequest?.current?.importFromData))
                  refErrRequest.current.importFromData(response?.result?.message || '');
              }}
            >
              <ImportSvg width={16} />
              <>从现有响应导入</>
            </div>
            <div
              className="button"
              onClick={() => {
                if (isFunction(refErrRequest?.current?.extractData))
                  refErrRequest.current.extractData();
              }}
            >
              <ExportSvg width={16} />
              <>提取字段和描述</>
            </div>
            <div
              className="button"
              onClick={() => {
                if (isFunction(refErrRequest?.current?.butifyFormatJson))
                  refErrRequest.current.butifyFormatJson();
              }}
            >
              <BeautifySvg width={16} />
              <>美化</>
            </div>
            <div
              className="button"
              onClick={() => {
                if (isFunction(refErrRequest?.current?.simplifyJson))
                  refErrRequest.current.simplifyJson();
              }}
            >
              <SimplifySvg width={16} />
              <>简化</>
            </div>
          </div>
          <Example
            data={data?.error || {}}
            direction={APIS_TAB_DIRECTION > 0 ? 'vertical' : 'horizontal'}
            ref={refErrRequest}
            onChange={(type, val) => {
              if (type === 'Raw') {
                onChange(`${path}.response.error.raw`, val);
              } else if (type === 'Parameter') {
                onChange(`${path}.response.error.parameter`, val);
              }
            }}
          ></Example>
        </>
      ),
    },
    // { id: '6', title: '失败响应示例', content: <Example></Example> },
  ];
  const handleTabChange = (index) => {
    setActiveIndex(index);
  };

  const activeContent = defaultList.find((d) => d.id === activeIndex)?.content;
  const headerRender = ({ headerTabItems, handleMouseWeel }) => {
    return (
      <>
        <div className="apipost-tabs-header" onWheel={handleMouseWeel}>
          {headerTabItems}
          {isPlainObject(response) && (
            <div className={ResponseStatusRight}>
              <div className="status-group">
                <div>响应码：</div>
                <span className={response?.status?.code === 0 ? 'success' : 'error'}>
                  {response?.status?.code} {response?.status?.details}
                </span>
              </div>

              <div className="status-group cursor">
                <DurationSvg className="success" />
                <span className="success">{timeStatus(response?.status?.responseTime)}</span>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };
  useEffect(() => {
    if (isString(sendStatus)) {
      if (sendStatus === 'sending') {
        setSpecialStatus('sending');
      } else if (sendStatus === 'sendError' && isString(message) && message.length > 0) {
        setSpecialStatus('error');
      } else {
        setSpecialStatus('none');
      }
    } else {
      setSpecialStatus('none');
    }
  }, [sendStatus]);
  return (
    <>
      {specialStatus === 'sending' && (
        <div className={ResponseSendWrapper}>
          <div className="loading_bar_tram"></div>
          <div className="apt_sendLoading_con">
            <div className="apt_sendLoading_con_text">发送中...</div>
            <Button
              type="primary"
              onClick={() => {
                dispatch({
                  type: 'opens/updateTempGrpcsById',
                  id: data?.target_id,
                  methodPath: path,
                  payload: { sendStatus: 'initial' },
                });
              }}
            >
              取消发送
            </Button>
          </div>
        </div>
      )}
      {specialStatus === 'error' && (
        <div className={ResponseErrorWrapper}>
          <Resclose className="close-error-wrapper" onClick={() => setSpecialStatus('none')} />
          <div className="container">
            无法访问以下内容
            <p className="error_str">{message}</p>
            <p className="err_desc_go_index">
              去&nbsp;
              <span onClick={() => window.open('https://www.apipost.cn/')}>
                https://www.apipost.cn/
              </span>
              &nbsp;官网，了解更多信息或寻求帮助
            </p>
          </div>
        </div>
      )}
      <Tabs defaultActiveId={activeIndex} headerRender={headerRender} onChange={handleTabChange}>
        {defaultList.map((d) => (
          <TabPan
            className="response-tabs-content"
            style={{ padding: '0 15px' }}
            key={d.id}
            id={d.id}
            title={d.title}
          >
            {isPlainObject(response) ? (
              d.content
            ) : ['1', '2'].includes(d.id) ? (
              <NotResponse />
            ) : (
              d.content
            )}
          </TabPan>
        ))}
      </Tabs>
    </>
  );
};

export default ResonpsePanel;
