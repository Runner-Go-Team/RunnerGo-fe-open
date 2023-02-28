import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import striptags from 'striptags';
import { useDispatch } from 'react-redux';
import { Select, Input, Tooltip } from 'adesign-react';
import {
  Delete as DeleteSvg,
  Explain as ExplainSvg,
  Clone as CloneSvg,
  Beautify as BeautifySvg,
} from 'adesign-react/icons';
import SentSvg from '@assets/websocket/sent.svg';
import SuccessSvg from '@assets/websocket/success.svg';
import ReceiveSvg from '@assets/websocket/receive.svg';
import MonacoEditor from '@components/MonacoEditor';
import MultiLevel from '@components/MultiLevel';
import { cloneDeep, isArray, isPlainObject, isUndefined } from 'lodash';
import { EditFormat, copyStringToClipboard, sizeFormat } from '@utils';
import { handleSocketResponse, RenderDeep } from './handle';
import { ConsoleWrapper } from './style';
import { MsgStatusList, ConsoleModeList, socketResponse } from '../constant';

const Option = Select.Option;

const WssConsole = (props) => {
  const { data, status, socketRes } = props;
  const { messagetime = '' } = props;

  const [searchVal, setSearchVal] = useState('');
  const [listFilterVal, setListFilterVal] = useState('all');

  const dispatch = useDispatch();
  const ConnectStatus = () => {
    let str = '断开连接';
    if (status === 'connect') str = '连接成功';
    if (status === 'error') str = '连接失败';
    if (status === 'connecting') str = '正在连接';
    return <span>{str}</span>;
  };

  // 清除全部消息
  const handleClear = () => {
    dispatch({
      type: 'opens/updateWebsocket',
      id: data?.target_id,
      payload: { socketRes: [] },
    });
  };

  const [msgList, setMsgList] = useState([]);
  useEffect(() => {
    const list = handleSocketResponse(
      socketRes,
      data?.request?.header?.parameter || [],
      data?.url || '',
      data?.method || '',
      searchVal,
      listFilterVal
    );
    setMsgList(list);
  }, [socketRes, searchVal, listFilterVal]);

  const RenderIcon = (type) => {
    if (type === 'connect') return <SuccessSvg width="16px" height="16px" />;
    if (type === 'error' || type === 'disconnect')
      return <ExplainSvg width="16px" height="16px" fill="#ED6A5F" />;
    if (type === 'message') return <ReceiveSvg width="16px" height="16px" />;
    if (type === 'send') return <SentSvg width="16px" height="16px" />;
  };
  const setModeEdit = (val, id) => {
    const tem = cloneDeep(msgList);
    tem?.forEach((itm, index) => {
      if (itm?.id === id) {
        itm.mode = val;
      }
    });
    setMsgList(tem);
  };
  const RenderEditor = (item) => {
    return (
      <div className="msg-content">
        <div className="msg-content-header">
          <div className="editor-mode">
            <Select
              optionListClassName="headerSelect"
              value={
                !isUndefined(ConsoleModeList.find((i) => i?.value === item?.mode))
                  ? item?.mode || 'text'
                  : 'text'
              }
              onChange={(val) => {
                setModeEdit(val, item?.id);
              }}
            >
              {ConsoleModeList.map((modeItem) => (
                <Option value={modeItem.value} key={modeItem.key}>
                  {modeItem.key}
                </Option>
              ))}
            </Select>
          </div>
          {/* <div
            className="beautify"
            onClick={() => {
              const tem = cloneDeep(msgList);
              isArray(tem) &&
                tem.forEach((itm: any) => {
                  if (itm?.id === item?.id) {
                    itm.message = EditFormat(item?.message).value;
                  }
                });
              setMsgList(tem);
            }}
          >
            <BeautifySvg width="16px" height="16px" />
            <span>美化</span>
          </div> */}
        </div>
        <div className="msg-content-editor">
          <MonacoEditor
            value={EditFormat(item?.message).value || ''}
            Height="100%"
            language={item?.mode || 'text'}
            options={{ readOnly: true, minimap: { enabled: false } }}
          />
        </div>
      </div>
    );
  };
  const renderMultiLevelTitle = (item) => {
    switch (item.action) {
      case 'connect':
        return (
          <div className="socket-msg">
            <div className="msg-icon">{RenderIcon(item?.action)}</div>
            <div className="msg-title">{`连接成功${item.requestCon['Request URL']}`}</div>
            <div className="msg-right">
              <span className="socket_time">{item?.time || ''}</span>
            </div>
          </div>
        );
      case 'disconnect':
        return (
          <div className="socket-msg">
            <div className="msg-icon">{RenderIcon(item?.action)}</div>
            <div className="msg-title">{`断开连接:${item.requestCon['Request URL']}`}</div>
            <div className="msg-right">
              <span className="socket_time">{item?.time || ''}</span>
            </div>
          </div>
        );
      case 'message':
        return (
          <div className="socket-msg">
            <div className="msg-icon">{RenderIcon(item?.action)}</div>
            <div className="msg-title">{item?.message || ''}</div>
            <div className="msg-right">
              <Tooltip content="复制消息" placement="top">
                <span>
                  <CloneSvg
                    onClick={(e) => {
                      e.stopPropagation();
                      copyStringToClipboard(item?.message, true);
                    }}
                    width="16px"
                    height="16px"
                  />
                </span>
              </Tooltip>

              <Tooltip
                content={
                  <ul className="msg-tooltip">
                    <li>
                      <span>size：</span>
                      <span>{sizeFormat(item?.size)}</span>
                    </li>
                    <li>
                      <span>time：</span>
                      <span>{item?.time}</span>
                    </li>
                    <li>
                      <span>Mime Type：</span>
                      <span>{item?.mode || 'text'}</span>
                    </li>
                  </ul>
                }
                placement="top"
              >
                <span onClick={(e) => e.stopPropagation()}>
                  <ExplainSvg width="16px" height="16px" />
                </span>
              </Tooltip>
              <span className="socket_time">{item?.time || ''}</span>
            </div>
          </div>
        );
      case 'send':
        return (
          <div className="socket-msg">
            <div className="msg-icon">{RenderIcon(item?.action)}</div>
            <div className="msg-title">{item?.message || ''}</div>
            <div className="msg-right">
              <Tooltip content="复制消息" placement="top">
                <span>
                  <CloneSvg
                    onClick={(e) => {
                      e.stopPropagation();
                      copyStringToClipboard(item?.message, true);
                    }}
                    width="16px"
                    height="16px"
                  />
                </span>
              </Tooltip>

              <Tooltip
                content={
                  <ul className="msg-tooltip">
                    <li>
                      <span>size：</span>
                      <span>{sizeFormat(item?.size)}</span>
                    </li>
                    <li>
                      <span>time：</span>
                      <span>{item?.time}</span>
                    </li>
                    <li>
                      <span>Mime Type：</span>
                      <span>{item?.mode || 'text'}</span>
                    </li>
                  </ul>
                }
                placement="top"
              >
                <span onClick={(e) => e.stopPropagation()}>
                  <ExplainSvg width="16px" height="16px" />
                </span>
              </Tooltip>
              <span className="socket_time">{item?.time || ''}</span>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="socket-msg">
            <div className="msg-icon">{RenderIcon(item?.action)}</div>
            <div className="msg-title">{`异常:${data?.url}`}</div>
            <div className="msg-right">
              <span className="socket_time">{item?.time || ''}</span>
            </div>
          </div>
        );
      default:
        break;
    }
  };
  return (
    <ConsoleWrapper>
      <div className="console-header">
        <div className="left-area">
          <div className="header-item">消息列表</div>
          <div className="header-item">
            <Input
              size="small"
              placeholder="搜索消息"
              value={searchVal}
              onChange={(val) => setSearchVal(val)}
            />
          </div>
          <div className="header-item">
            <Select
              optionListClassName="headerSelect"
              value={listFilterVal}
              onChange={(val) => {
                setListFilterVal(val);
              }}
            >
              {MsgStatusList.map((item) => (
                <Option key={item.key} value={item.value}>
                  {item.key}
                </Option>
              ))}
            </Select>
          </div>
          <div className="header-item">
            <div className="clear-msg apipost-light-btn" onClick={handleClear}>
              <DeleteSvg />
              <span>清除消息</span>
            </div>
          </div>
        </div>
        <div className="right-area">
          <Tooltip
            content={
              <div className="msg-tooltip">
                <div>连接详情</div>
                <div>
                  {ConnectStatus('')}
                  <span>{messagetime}</span>
                </div>
              </div>
            }
          >
            <div className={cn('connect', { error: status !== 'connect' })}>
              {ConnectStatus('')}
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="console-body">
        {msgList.map((item, index) => (
          <MultiLevel key={index} showDefaultIcon={false} title={renderMultiLevelTitle(item)}>
            {['disconnect', 'connect', 'error'].includes(item?.action)
              ? RenderDeep(item.requestCon)
              : RenderEditor(item)}
          </MultiLevel>
        ))}
      </div>
    </ConsoleWrapper>
  );
};

export default WssConsole;
