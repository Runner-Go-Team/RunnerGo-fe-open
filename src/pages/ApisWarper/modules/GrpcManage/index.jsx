import React, { useState } from 'react';
import { Input, CheckBox, Button, Drawer } from 'adesign-react';
import { Right as RightSvg, Copy as CopySvg } from 'adesign-react/icons';
import { useSelector } from 'react-redux';
import { get, isString } from 'lodash';
import MonacoEditor from '@components/MonacoEditor';
import { copyStringToClipboard } from '@utils';
import Bus from '@utils/eventBus';
import useApi from '../../hooks/useApi';
import InfoPanel from './infoPanel';
import Menu from './menu';
import { GrpcWrapepr, GenerateWrapper } from './style';
import Workspace from './workspace';
import Empty from './empty';

const GrpcManage = (props) => {
  const { data, onChange } = props;
  const [path, setPath] = useState('');
  const [protpCodeShow, setProtpCodeShow] = useState(false);

  const { temp_grpcs } = useSelector((store) => store?.opens);

  const temp_data =
    temp_grpcs.hasOwnProperty(data?.target_id) && temp_grpcs[data.target_id].hasOwnProperty(path)
      ? temp_grpcs[data.target_id][path]
      : {};

  const methodBody = get(data, path, {});

  const { grpcSend } = useApi();

  const showProtoCode = () => {
    setProtpCodeShow(true);
  };
  const handleCopy = () => {
    copyStringToClipboard(data?.protos[methodBody.proto]?.protoContent || '', true);
  };

  return (
    <>
      {protpCodeShow && (
        <Drawer
          visible
          width={860}
          mask={false}
          onCancel={() => {
            setProtpCodeShow(false);
          }}
          className={GenerateWrapper}
          title={<>查看proto</>}
          footer={null}
        >
          <div className="generate-wrapper">
            <div className="generate-wrapper-editor">
              <div>
                <Button
                  size="mini"
                  onClick={handleCopy}
                  preFix={<CopySvg width="12px" height="12px" />}
                >
                  复制代码
                </Button>
              </div>
              <div style={{ height: 'calc(100% - 32px)' }}>
                <MonacoEditor
                  options={{
                    readOnly: true,
                  }}
                  value={data?.protos[methodBody.proto]?.protoContent || ''}
                  language="javascript"
                ></MonacoEditor>
              </div>
            </div>
          </div>
        </Drawer>
      )}
      <GrpcWrapepr>
        <InfoPanel data={data} onChange={onChange}></InfoPanel>
        <div className="grpc-body">
          <div className="grpc-folder">
            <Menu data={data} setPath={setPath} />
          </div>
          {isString(path) && path.length > 0 ? (
            <div className="grpc-content">
              <div className="grpc-url-panel">
                <div className="grpc-url-panel-item">服务器地址</div>
                <Input
                  className="grpc-url-panel-item"
                  size="mini"
                  value={methodBody?.url || ''}
                  onChange={(val) => {
                    onChange(`${path}.url`, val);
                  }}
                />
                <div className="grpc-certificate grpc-url-panel-item">
                  <CheckBox></CheckBox>
                  <Button
                    className="apipost-light-btn"
                    size="mini"
                    onClick={() => {
                      Bus.$emit('openModal', 'SystemSetting', { defaultActiveId: '2' });
                    }}
                  >
                    证书
                    <RightSvg width={12}></RightSvg>
                  </Button>
                </div>
                <Button
                  className="apipost-light-btn grpc-url-panel-item"
                  size="mini"
                  onClick={() => {
                    showProtoCode();
                  }}
                >
                  查看proto
                </Button>
                <Button
                  className="apipost-blue-btn grpc-url-panel-item"
                  type="primary"
                  onClick={() => {
                    grpcSend(methodBody, data?.target_id, path);
                  }}
                  disabled={temp_data?.sendStatus === 'sending'}
                >
                  {temp_data?.sendStatus === 'sending' ? '调用中...' : '调用'}
                </Button>
              </div>

              <Workspace {...{ data, onChange, path, methodBody, temp_data }} />
            </div>
          ) : (
            <Empty data={data} />
          )}
        </div>
      </GrpcWrapepr>
    </>
  );
};

export default GrpcManage;
