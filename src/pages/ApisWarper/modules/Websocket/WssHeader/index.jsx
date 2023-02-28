import React from 'react';
import { Select, Input, Button } from 'adesign-react';
import ManageGroup from '@components/ManageGroup';
import ApiStatus from '@components/ApiStatus';
import { isString } from 'lodash';
import Bus from '@utils/eventBus';
import useApi from '../../../hooks/useApi';
import { HeaderWrapper } from './style';
// import useWssConnect from '../../hooks/useWssConnect';

const Option = Select.Option;

const WssHeader = (props) => {
  const { data, status, onChange } = props;
  // const { socketConnect } = useWssConnect();
  const { connectWebSocket, disconnectWebSocket } = useApi();
  const connectSocket = () => {
    if (status === 'connect') {
      // 断开连接
      disconnectWebSocket(data);
    } else {
      // 连接
      connectWebSocket(data);
    }
  };
  return (
    <>
      <div className={HeaderWrapper}>
        <div className="header-name">
          <div className="header-name-left api-name-group">
            <ApiStatus
              value={data?.mark}
              onChange={(value) => {
                onChange('mark', value);
              }}
            ></ApiStatus>
            <Input
              width={200}
              value={data?.name || ''}
              size="mini"
              // readonly={readonly == 1}
              onChange={(val) => {
                onChange('name', val);
              }}
            />
          </div>
          <Button
            className="api-explain"
            size="mini"
            onClick={() => {
              Bus.$emit('openModal', 'DescriptionModal', {
                value: data?.request?.description || '',
                onChange,
              });
            }}
          >
            服务说明
          </Button>
          <div className="header-name-right">
            <ManageGroup target={data} />
          </div>
        </div>
        <div className="header-url">
          <div className="api-url-panel-group">
            <Select
              defaultValue={data?.method || 'Raw'}
              onChange={(value) => {
                onChange('method', value);
              }}
              disabled={!!(isString(status) && (status === 'connect' || status === 'connecting'))}
            >
              <Option value="Raw" key="Raw">
                Raw
              </Option>
              <Option value="Socket.IO" key="Socket.IO">
                Socket.IO
              </Option>
              <Option value="SockJs" key="SockJs">
                SockJs
              </Option>
            </Select>
            <Input
              placeholder="请输入socket地址(wss://)"
              onChange={(value) => {
                onChange('url', value);
              }}
              value={data?.request?.url || data?.url || ''}
            />
          </div>
          <Button
            type="primary"
            className="apipost-blue-btn"
            onClick={connectSocket}
            disabled={status === 'connecting'}
          >
            {status === 'connect' ? '断开连接' : status === 'connecting' ? '连接中...' : '连接'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default WssHeader;
