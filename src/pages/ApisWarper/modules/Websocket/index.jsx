import React, { useState } from 'react';
import { Scale } from 'adesign-react';
import { isArray } from 'lodash';
import produce from 'immer';
import WssHeader from './WssHeader';
import WssRequest from './WssRequest';
import WssSend from './WssSend';
import WssConsole from './WssConsole';
import { WebsocketWapper } from './style';

const { ScaleItem, ScalePanel } = Scale;


const defaultLayouts = { 0: { height: 40 }, 1: { height: 300 }, 2: { flex: 1 } };

const Websocket = (props) => {
  const { data, tempData, onChange } = props;

  const [wssLayouts, setWssLayouts] = useState(defaultLayouts);
  const [showMiniSendScreen, setShowMiniSendScreen] = useState(false);
  const [showMiniMessageScreen, setShowMiniMessageScreen] = useState(false);
  // 重置scale
  const resetScreen = () => {
    setWssLayouts(defaultLayouts);
    setShowMiniSendScreen(false);
    setShowMiniMessageScreen(false);
  };

  // 调整scale
  const handleLayoutsChange = (layouts, panelOffset) => {
    setWssLayouts(layouts);
    const panelHeight = panelOffset.height || 0;
    const headerHeight = layouts[0].height || 0;
    const sendHeight = layouts[1].height || 0;
    const messageHeight = panelHeight - headerHeight - sendHeight;

    // 上部screen
    if (sendHeight <= 40) {
      if (!showMiniSendScreen) setShowMiniSendScreen(true);
    } else if (showMiniSendScreen) setShowMiniSendScreen(false);
    // 底部screen
    if (messageHeight <= 40) {
      if (!showMiniMessageScreen) setShowMiniMessageScreen(true);
    } else if (showMiniMessageScreen) setShowMiniMessageScreen(false);
  };

  // 切换到设置时，如果内容被关闭，则修改scale高度
  const handleRequestTabChange = (tabId) => {
    if (tabId === 3 && wssLayouts[0].height < 250) {
      setWssLayouts(
        produce((draft) => {
          draft[0].height = 250;
        })
      );
    }
  };

  return (
    <WebsocketWapper>
      <WssHeader data={data} status={tempData?.status || ''} onChange={onChange}></WssHeader>
      <div className="wss-content">
        <ScalePanel direction="vertical" onLayoutsChange={handleLayoutsChange} layouts={wssLayouts}>
          <ScaleItem minHeight={40} className="wss-scale-item">
            <WssRequest
              data={data}
              onChange={onChange}
              onTabChange={handleRequestTabChange}
            ></WssRequest>
          </ScaleItem>
          <ScaleItem minHeight={40} className="wss-scale-item wss-scale-send">
            {showMiniSendScreen ? (
              <div onClick={resetScreen}>mini</div>
            ) : (
              <WssSend data={data} onChange={onChange}></WssSend>
            )}
          </ScaleItem>
          <ScaleItem minHeight={40} enableScale={false} className="wss-scale-item wss-scale-last">
            {showMiniMessageScreen ? (
              <div onClick={resetScreen}>mini</div>
            ) : (
              <WssConsole
                data={data}
                socketRes={isArray(tempData?.socketRes) ? tempData.socketRes : []}
                status={tempData?.status || ''}
                onChange={onChange}
              ></WssConsole>
            )}
          </ScaleItem>
        </ScalePanel>
      </div>
    </WebsocketWapper>
  );
};

export default Websocket;
