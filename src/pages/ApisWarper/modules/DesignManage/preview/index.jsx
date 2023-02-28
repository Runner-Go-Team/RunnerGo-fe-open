import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Message } from 'adesign-react';
import MockSchema from 'apipost-mock-schema';
import { Down as DownSvg, Delete as DeleteSvg } from 'adesign-react/icons';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { cloneDeep, isString, isUndefined, set } from 'lodash';
import MonacoEditor from '@components/MonacoEditor';
// import { RD_MOCK_URL, CLIENT_MOCK_ADDRESS } from '@config/index';
// import { Collection } from '@indexedDB/project';
import Bus from '@utils/eventBus';
// import { PreviewWrapper } from './style';
import './index.less';

const Preview = (props) => {
  const newSchema = new MockSchema();

  const clientAddress = useSelector((store) => store?.global?.clientAddress);
  const CURRENT_PROJECT_ID = useSelector((store) => store?.workspace?.CURRENT_PROJECT_ID);
  const clientMockHost = CLIENT_MOCK_ADDRESS.replace('{CLIENT_IP_ADDRESS}', clientAddress);

  const { data } = props;
  const [previewData, setPreviewData] = useState({});
  useEffect(() => {
    setPreviewData(cloneDeep(data));
  }, [data]);

  const headerColumn = [
    {
      title: '参数名',
      dataIndex: 'key',
    },
    {
      title: '参数值',
      dataIndex: 'value',
    },
  ];

  // query,body,参数描述表格头
  const columns = [
    {
      title: '参数名',
      dataIndex: 'key',
      render: (text, rowData, rowIndex) => (
        <span className="table-cell-span">{text || '-'}</span>
      ),
    },
    {
      title: '参数值',
      dataIndex: 'value',
      render: (text, rowData, rowIndex) => (
        <span className="table-cell-span">{text || '-'}</span>
      ),
    },
    {
      title: '参数类型',
      dataIndex: 'field_type',
      render: (text, rowData, rowIndex) => (
        <span className="table-cell-span">{text || '-'}</span>
      ),
    },
    {
      title: '是否必填',
      dataIndex: 'is_checked',
      render: (text, rowData, rowIndex) => {
        return <>{text > 0 ? '是' : '否'}</>;
      },
    },
    {
      title: '参数描述',
      dataIndex: 'email',
      render: () => <span className="table-cell-span">-</span>,
    },
  ];

  const handleShowShareModal = async () => {
    const { target_id, target_type } = data || {};
    if (!isString(target_id) || !isString(target_type)) {
      return;
    }
    const apiData = await Collection.get(target_id);
    if (isUndefined(apiData) || apiData?.status !== 1) {
      Message('error', '接口未保存或已删除！');
      return;
    }
    Bus.$emit('openModal', 'CreateShare', {
      defaultShareName: apiData?.name || '',
      defaultShareMode: apiData?.target_type || 'api',
      project_id: apiData?.project_id,
      target_id: apiData?.target_id,
    });
  };

  const handleDelete = (key) => {
    Modal.confirm({
      title: '提示',
      content: '是否确认删除',
      onOk: () => {
        const newData = { ...previewData };
        set(newData, `response.${key}.raw`, '');
        setPreviewData(newData);
      },
    });
  };

  const handleGenerate = async (json, key) => {
    const newData = { ...previewData };
    const jsonExample = await newSchema.mock(json?.expect?.schema || {});

    set(newData, `response.${key}.raw`, JSON.stringify(jsonExample));
    setPreviewData(newData);
  };

  const handleGenerateAll = () => {
    const obj = data?.response;
    for (const key in obj) {
      handleGenerate(obj[key], key);
    }
  };

  const renderResponseName = (node, key) => {
    if (key === 'success') {
      return '成功';
    }
    if (key === 'error') {
      return '失败';
    }
    if (node?.expect?.name) {
      return node?.expect?.name;
    }
    return '响应示例';
  };

  return (
    <div className="preview-wrapper">
      <div className="preview-info-wrapper">
        <div className="info-title">
          <div className="title-name">{previewData?.name || ''}</div>
          <div>
            <Button
              type="primary"
              size="mini"
              onClick={() => {
                Bus.$emit('saveTargetByObj', { Obj: previewData });
              }}
            >
              保存
            </Button>
            <Button type="primary" size="mini" onClick={handleShowShareModal}>
              分享文档
            </Button>
          </div>
        </div>
        <div className="info-other">
          {/* <div>创建人：aaa</div> */}
          <div>
            最后更新：{dayjs(previewData?.update_dtime * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </div>
          <div>
            更新时间：
            {previewData?.update_dtime !== undefined &&
              dayjs(previewData?.update_dtime * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
      </div>

      <div className="preview-url-wrapper">
        <div className="preview-title">
          <div>基本信息</div>
          <DownSvg width={16} />
        </div>
        <div className="url-msg">
          <div>
            接口状态：<span>开发中</span>
          </div>
          <div>
            接口URL： <span className="green">{previewData?.method}</span>
            <span className="red">{previewData?.request?.url || ''}</span>
          </div>
          <div>
            云端MockUrl：
            <span className="red">{`${RD_MOCK_URL}/${CURRENT_PROJECT_ID}${
              isString(data?.mock_url) ? `${data?.mock_url}` : ''
            }`}</span>
          </div>
          <div>
            本地MockUrl：
            <span className="red">{`${clientMockHost}/${CURRENT_PROJECT_ID}${
              isString(data?.mock_url) ? `${data?.mock_url}` : ''
            }`}</span>
          </div>
          <div>
            Content-Type：<span className="red">{previewData?.body?.mode}</span>
          </div>
          <div>
            认证：<span>noauth</span>
          </div>
        </div>
      </div>

      <div className="preview-request">
        <div className="preview-title">
          <div>请求参数</div>
          <DownSvg width={16} />
        </div>

        {previewData?.request?.header?.parameter?.length > 0 && (
          <>
            <div className="preview-second-title">Header参数及说明</div>
            <Table
              showBorder
              columns={headerColumn}
              data={previewData?.request?.header?.parameter || []}
            ></Table>
          </>
        )}

        {previewData?.request?.query?.parameter?.length > 0 && (
          <>
            <div className="preview-second-title">Query参数及说明</div>
            <Table
              showBorder
              columns={columns}
              data={previewData?.request?.query?.parameter || []}
            ></Table>
          </>
        )}

        {previewData?.request?.body?.mode === 'none' && (
          <div style={{ textAlign: 'center' }}>此请求没有正文</div>
        )}

        {['form-data', 'urlencoded'].includes(previewData?.request?.body?.mode) &&
          previewData?.request?.body?.parameter?.lenght > 0 && (
            <>
              <div className="preview-second-title">Body参数及说明</div>
              <Table
                showBorder
                columns={columns}
                data={previewData?.request?.body?.parameter || []}
              ></Table>
            </>
          )}

        {['json', 'xml', 'javascript', 'plain', 'html'].includes(
          previewData?.request?.body?.mode
        ) && (
          <>
            <div className="preview-second-title">Body参数及说明</div>
            <div className="monaco-wrapper">
              <MonacoEditor
                value={previewData?.request?.body?.raw}
                options={{
                  readOnly: true,
                }}
              ></MonacoEditor>
            </div>
          </>
        )}

        <div className="preview-second-title">认证及说明</div>
        <div></div>
      </div>

      <div className="preview-response">
        <div className="preview-title">
          <div className="btn-wrapper">
            <div>响应示例</div>
            <Button size="mini" onClick={handleGenerateAll}>
              生成全部示例
            </Button>
          </div>
        </div>
        {Object.keys(previewData?.response || {}).map((k) => (
          <div key={k}>
            <div className="preview-second-title">
              <div className="btn-wrapper">
                <div>{renderResponseName(previewData?.response?.[k], k)}</div>
                <Button
                  size="mini"
                  onClick={() => {
                    handleGenerate(previewData?.response?.[k], k);
                  }}
                >
                  更新
                </Button>
                {/* <Button size="mini" type="primary">
                  保存
                </Button> */}
              </div>
              <Button
                size="mini"
                onClick={() => {
                  handleDelete(k);
                }}
              >
                <DeleteSvg width={16} />
              </Button>
            </div>
            {previewData?.response?.[k]?.raw !== '' && (
              <div className="monaco-wrapper">
                <MonacoEditor
                  value={previewData?.response?.[k]?.raw || ''}
                  options={{
                    readOnly: true,
                  }}
                ></MonacoEditor>
              </div>
            )}
          </div>
        ))}

        {/* <div className="preview-second-title">字段描述</div>
        <Table showBorder columns={columns} data={[]}></Table> */}
      </div>
      <div className="preview-copyright">
        本文档由<span>APIPOST接口调试与管理工具</span>生成
      </div>
    </div>
  );
};

export default Preview;
