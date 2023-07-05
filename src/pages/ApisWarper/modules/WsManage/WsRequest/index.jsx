import React, { useState, useEffect } from "react";
import './index.less';
import WsSendMessage from "./WsSendMessage";
import WsReqHeader from "./WsReqHeader";
import WsReqParam from "./WsReqParam";
import WsReqEvent from "./WsReqEvent";
import WsReqConfig from "./WsReqConfig";
import { useTranslation } from 'react-i18next';
import { Tabs } from '@arco-design/web-react';

const { TabPane } = Tabs;
const WsRequest = (props) => {
    const { data, onChange } = props;
    const { t } = useTranslation();

    const tabList = [
        {
            id: '0',
            title: t('apis.ws.reqTab.0'),
            content: <WsSendMessage data={data} onChange={onChange} />
        },
        {
            id: '1',
            title: t('apis.ws.reqTab.1'),
            content: <WsReqHeader parameter={data ? (data.websocket_detail ? data.websocket_detail.ws_header : []) : []} onChange={onChange} />
        },
        {
            id: '2',
            title: t('apis.ws.reqTab.2'),
            content: <WsReqParam parameter={data ? (data.websocket_detail ? data.websocket_detail.ws_param : []) : []} onChange={onChange} />
        },
        {
            id: '3',
            title: t('apis.ws.reqTab.3'),
            content: <WsReqEvent parameter={data ? (data.websocket_detail ? data.websocket_detail.ws_event : []) : []} onChange={onChange} />
        },
        {
            id: '4',
            title: t('apis.ws.reqTab.4'),
            content: <WsReqConfig data={data} onChange={onChange} />
        }
    ];

    return (
        <div className="ws-manage-request">
            <Tabs defaultActiveTab='0' itemWidth={80}>
                {
                    tabList.map((item, index) => (
                        <TabPane
                            style={{ padding: '0 15px', width: 'auto !impoertant' }}
                            key={item.id}
                            title={item.title}
                        >
                            {item.content}
                        </TabPane>
                    ))
                }
            </Tabs>
        </div>
    )
};

export default WsRequest;