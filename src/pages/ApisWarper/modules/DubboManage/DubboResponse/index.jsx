import React, { useState, useEffect } from "react";
import './index.less';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import RealTimeResult from "@components/response/responsePanel/result";
import ResAssert from "@components/response/responsePanel/assert";
import ResRegex from "@components/response/responsePanel/regex";
import { Tabs } from '@arco-design/web-react';
import { isArray } from "lodash";

const { TabPane } = Tabs;

const DubboResponse = () => {
    const { t } = useTranslation();

    const dubbo_res = useSelector((store) => store.opens.dubbo_res);
    const open_api_now = useSelector((store) => store.opens.open_api_now);

    const response_data = (dubbo_res || {})[open_api_now];

    const tabList = [
        {
            id: '0',
            title: t('apis.response'),
            content: <RealTimeResult type="response_body" tempData={response_data || {}}  />
        },
        {
            id: '1',
            title: t('apis.reqBody'),
            content: <RealTimeResult type="request_body" tempData={response_data || {}} />
        },
        {
            id: '2',
            title: (
                <div style={{ position: 'relative' }}>
                    <span style={{ marginRight: (response_data && response_data.assert && response_data.assert.assertion_msgs && response_data.assert.assertion_msgs.length > 0) ? '8px' : 0 }}>{t('apis.resAssert')}</span>
                    {
                        response_data && response_data.assert && response_data.assert.assertion_msgs && response_data.assert.assertion_msgs.length > 0
                            ?
                            (
                                 response_data.assert.assertion_msgs.filter(item => !item.is_succeed).length > 0
                                    ? <p style={{ 'min-width': '6px', 'min-height': '6px', borderRadius: '50%', top: '0', right: '0', backgroundColor: '#f00', position: 'absolute' }}></p>
                                    : <p style={{ 'min-width': '6px', 'min-height': '6px', borderRadius: '50%', top: '0', right: '0', backgroundColor: '#0f0', position: 'absolute' }}></p>
                            )
                            : <></>
                    }
                </div>
            ),
            content: <ResAssert data={response_data || {}} />
        },
        {
            id: '3',
            title: t('apis.resRegular'),
            content: <ResRegex data={response_data || {}} />
        }
    ]

    return (
        <div className="dubbo-manage-response">
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

export default DubboResponse;