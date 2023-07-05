import React, { useState, useEffect } from "react";
import './index.less';
import { Tabs } from '@arco-design/web-react';
import DubboParam from "./DubboParam";
import DubboAssert from "./DubboAssert";
import DubboRegular from "./DubboRegular";
import DubboConfig from "./DubboConfig";

const { TabPane } = Tabs;
const DubboRequest = (props) => {
    const { data, onChange } = props;

    const tabList = [
        {
            id: '0',
            title: '基本参数',
            content: <DubboParam data={data} onChange={onChange} />
        },
        {
            id: '1',
            title: '断言',
            content: <DubboAssert data={data} onChange={onChange} />
        },
        {
            id: '2',
            title: '关联提取',
            content: <DubboRegular data={data} onChange={onChange} />
        },
        {
            id: '3',
            title: '设置',
            content: <DubboConfig data={data} onChange={onChange} />
        }
    ]

    return (
        <div className="dubbo-manage-request">
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

export default DubboRequest;