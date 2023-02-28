import React, { useState } from 'react';
import { Tabs as TabComponent, Table, Tooltip } from 'adesign-react';
import classNames from 'classnames';
import CookiesTable from '@components/response/responsePanel/coms/cookies';
import ReqTable from '@components/response/responsePanel/coms/reqTable';
import ResTable from '@components/response/responsePanel/coms/resTable';
import Atools from 'apipost-tools';
import MonacoEditor from '@components/MonacoEditor';
import HighLight from '@components/HighLights';
import PDF from 'react-pdf-js';
import Empty from '@components/Empty';
import { RequestPanel } from './style';

const { Tabs, TabPan } = TabComponent;

const Request = (props) => {
  const { value } = props;

  const [activeId, setActiveId] = useState('1');

  const assert = value?.assert || [];
  const data = value?.response?.data;

  const [numPages, setnumPages] = useState(0);
  const onDocumentComplete = (pages) => {
    setnumPages(pages);
  };

  const responsePreview = () => {
    const response = data?.response;
    const { resMime, stream, resBody } = response || {};
    const { raw: rawBody, buffer, base64 } = Atools.bufferToRaw(stream?.data || '', resMime);

    const base64Body = base64;

    function directlyRenderPdf(nums) {
      const x = [];
      for (let i = 2; i <= nums; i++) {
        x.push(<PDF page={i} key={`x${i}`} file={rawBody || base64Body} scale={0.61} />);
      }
      return x;
    }

    return data?.response?.responseSize / 1024 > 20 ? (
      <Empty text="文件过大，请下载查看" />
    ) : (
      <>
        {response?.fitForShow === 'Monaco' ? (
          <>
            <HighLight code={rawBody || ''}></HighLight>
          </>
        ) : response?.fitForShow === 'Image' ? (
          <div style={{ width: 300 }}>
            <img src={resBody || base64Body} style={{ maxWidth: '100%' }} />
          </div>
        ) : response?.fitForShow === 'Pdf' ? (
          <>
            <PDF
              scale={0.61}
              onDocumentComplete={onDocumentComplete}
              page={1}
              file={resBody || base64Body}
            />
            {numPages > 1 && directlyRenderPdf(numPages)}
          </>
        ) : (
          <Empty text="非图片和文本格式,暂时不支持预览" />
        )}
      </>
    );
  };

  const envColumns = [
    {
      title: '参数名称',
      dataIndex: 'key',
      render: (text, rowData, rowIndex) => (
        <Tooltip
          style={{
            maxWidth: '200px',
            maxHeight: 'auto',
            wordBreak: 'break-all',
          }}
          content={text}
        >
          <div className="apipost-table-cell">{text}</div>
        </Tooltip>
      ),
    },
    {
      title: '参数值',
      dataIndex: 'value',
      render: (text, rowData, rowIndex) => (
        <span>
          {typeof text === 'object' ? (
            '对象格式不支持预览'
          ) : (
            <Tooltip
              style={{
                maxWidth: '200px',
                maxHeight: 'auto',
                wordBreak: 'break-all',
              }}
              content={text}
            >
              <div className="apipost-table-cell">{text}</div>
            </Tooltip>
          )}
        </span>
      ),
    },
  ];

  const renderParamer = (body) => {
    if (body?.mode === 'formdata' || body?.mode === 'urlencoded') {
      return <Table columns={envColumns} showBorder data={body?.formdata || []} />;
    }
    if (body?.mode === 'none') {
      return <span className="white">此请求没正文</span>;
    }
    return (
      <div style={{ height: '300px', overflow: 'hidden' }}>
        <MonacoEditor
          value={body?.raw}
          options={{
            disableLayerHinting: true,
            domReadOnly: true,
            readOnly: true,
            wordWrap: 'on',
            minimap: {
              enabled: false,
            },
          }}
        ></MonacoEditor>
      </div>
    );
  };

  return (
    <RequestPanel>
      <div className="request-title">断言</div>
      <div className="request-logs">
        {assert?.map((item, index) => (
          <div key={index}>
            {item?.expect && (
              <div
                className={classNames('log-item', {
                  error: item?.status === 'error',
                  success: item?.status !== 'error',
                })}
              >
                {item?.expect}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="request-title">接口详情</div>

      <Tabs defaultActiveId="1">
        <TabPan id="1" title="请求Header">
          <ReqTable data={data?.request}></ReqTable>
        </TabPan>
        <TabPan id="2" title="请求Body">
          {renderParamer(data?.request?.body)}
        </TabPan>
        {/* <TabPan id="3" title="认证">

        </TabPan> */}
      </Tabs>
      {value?.response?.status === 'OK' && (
        <Tabs defaultActiveId="1">
          <TabPan id="1" title="响应Header">
            <ResTable data={data?.response}></ResTable>
          </TabPan>
          <TabPan id="2" title="响应Cookies">
            <CookiesTable data={data?.response}></CookiesTable>
          </TabPan>
          <TabPan id="3" title="响应body">
            <div style={{ width: 334 }}>{responsePreview()}</div>
          </TabPan>
        </Tabs>
      )}
    </RequestPanel>
  );
};

export default Request;
