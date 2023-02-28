import React, { useState } from 'react';
import { Button, Input, Select, Message } from 'adesign-react';
import MonacoEditor from '@components/MonacoEditor';
import { useDispatch, useSelector } from 'react-redux';
import { hanldeSocketMessageByType } from '@utils';
import dayjs from 'dayjs';
import useApi from '../../../hooks/useApi';
import { WssSendWrapper } from './style';

const Option = Select.Option;

const WssSend = (props) => {
  const { data, onChange } = props;
  const { message, messageType } = data || {};
  const dispatch = useDispatch();
  const { sendMessageWebSocket } = useApi();
  const MessageTypeList = [
    {
      key: 'Text',
      value: 'Text',
    },
    {
      key: 'Json',
      value: 'Json',
    },
    {
      key: 'Xml',
      value: 'Xml',
    },
    {
      key: 'Binary',
      value: 'Binary',
    },
  ];

  const BinaryTypeList = [
    {
      key: 'Base64',
      value: 'Base64',
    },
    {
      key: 'Hexadecimal',
      value: 'Hexadecimal',
    },
  ];

  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const opens = useSelector((store) => store?.opens);
  const { websockets } = opens;
  const handleSend = () => {
    // 发送消息
    const socket = websockets[data?.target_id];
    if (socket && socket.hasOwnProperty('status') && socket.status === 'connect') {
      if (data?.method === 'Raw') {
        const bl = new Blob([data?.message]);
        const maxMb = data?.socketConfig?.informationSize || 5;
        if (bl?.size / 1024 / 1024 > parseInt(maxMb, 10)) {
          Message('error', '发送内容超出最大内容大小。');
          return;
        }
      }
      const message = hanldeSocketMessageByType(data?.message, messageType);
      if (data?.method === 'Socket.IO') {
        sendMessageWebSocket(
          data?.target_id,
          message,
          data?.socketConfig?.socketEventName || 'message'
        );
      } else {
        sendMessageWebSocket(data?.target_id, message);
      }

      dispatch({
        type: 'opens/setSocketResById',
        payload: {
          status: 'connect',
          res: { message, action: 'send', time: dayjs().format('HH:mm:ss') },
        },
        id: data?.target_id,
      });
    } else {
      Message('error', '尚未连接无法发送');
      return;
    }
    // 清除当前发送内容框内容
    onChange('message', '');
  };

  return (
    <WssSendWrapper>
      <div className="send-header">
        <div className="header-item">发送内容</div>
        <div className="header-item">
          <Select
            defaultValue={
              messageType === 'Base64' || messageType === 'Hexadecimal'
                ? 'Binary'
                : messageType || 'Text'
            }
            onChange={(val) => {
              let newType = val;
              if (val === 'Binary') {
                newType = 'Base64';
              }
              onChange('messageType', newType);
            }}
          >
            {MessageTypeList.map((item) => (
              <Option value={item.value} key={item.key}>
                {item.key}
              </Option>
            ))}
          </Select>
        </div>
        {(messageType === 'Base64' || messageType === 'Hexadecimal') && (
          <div className="header-item">
            <Select
              defaultValue={messageType || 'Base64'}
              onChange={(val) => {
                onChange('messageType', val);
              }}
            >
              {BinaryTypeList.map((item) => (
                <Option value={item.value} key={item.key}>
                  {item.key}
                </Option>
              ))}
            </Select>
          </div>
        )}
      </div>
      <div className="editor-box">
        <MonacoEditor
          language="json"
          value={message || ''}
          onChange={(val) => {
            onChange('message', val);
          }}
        ></MonacoEditor>
      </div>
      <div className="send-footer">
        {data?.method === 'Socket.IO' && (
          <div className="event_name">
            <Input
              size="small"
              value={data?.socketConfig?.socketEventName || ''}
              placeholder="事件名，默认为message"
              onChange={(val) => {
                onChange('socketEventName', val);
              }}
            />
          </div>
        )}
        <Button
          type="primary"
          class="apipost-blue-btn"
          disabled={!(message && message.length > 0)}
          onClick={handleSend}
        >
          {isSendingMsg ? '发送中...' : '发送'}
        </Button>
      </div>
    </WssSendWrapper>
  );
};

export default WssSend;
