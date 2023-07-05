import React, { useState, useEffect } from "react";
import './index.less';
import TcpSendMessage from "./TcpSendMessage";
import TcpSendConfig from "./TcpSendConfig";
import { useTranslation } from 'react-i18next';
import { Tabs } from '@arco-design/web-react';

const { TabPane } = Tabs;
const TcpRequest = (props) => {
    const { data, onChange } = props;
    const { t } = useTranslation();

    const tabList = [
        {
            id: '0',
            title: t('apis.tcp.sendMessage'),
            content: <TcpSendMessage data={data} onChange={onChange} />
        },
        {
            id: '1',
            title: t('apis.tcp.config'),
            content: <TcpSendConfig data={data} onChange={onChange} />
        }
    ];

    return (
        <div className="tcp-manage-request">
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

export default TcpRequest;