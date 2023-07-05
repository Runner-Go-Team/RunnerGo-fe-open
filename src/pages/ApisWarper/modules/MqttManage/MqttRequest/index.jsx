import React, { useState, useEffect } from "react";
import './index.less';
import { Tabs as TabComponent } from 'adesign-react';
import MqttSendMessage from "./MqttSendMessage";
import MqttConventionConfig from "./MqttConventionConfig";
import MqttSeniorConfig from "./MqttSeniorConfig";
import MqttWillConfig from "./MqttWillConfig";

const { Tabs, TabPan } = TabComponent;

const MqttRequest = (props) => {
    const { data, onChange } = props;

    const tabList = [
        {
            id: '0',
            title: '发送消息',
            content: <MqttSendMessage data={data} onChange={onChange} />
        },
        {
            id: '1',
            title: '常规',
            content: <MqttConventionConfig data={data} onChange={onChange} />
        },
        {
            id: '2',
            title: '高级',
            content: <MqttSeniorConfig data={data} onChange={onChange} />
        },
        {
            id: '3',
            title: 'Will and testament',
            content: <MqttWillConfig data={data} onChange={onChange} />
        }
    ];

    return (
        <div className="mqtt-manage-request">
            <Tabs defaultActiveId='0' itemWidth={80}>
                {
                    tabList.map((item, index) => (
                        <TabPan
                            style={{ padding: '0 15px', width: 'auto !impoertant' }}
                            key={item.id}
                            id={item.id}
                            title={item.title}
                        >
                            {item.content}
                        </TabPan>
                    ))
                }
            </Tabs>
        </div>
    )
};

export default MqttRequest;