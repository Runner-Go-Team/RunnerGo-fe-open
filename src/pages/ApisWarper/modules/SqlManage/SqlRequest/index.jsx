import React, { useState, useEffect } from "react";
import './index.less';
import SqlEdit from "./SqlEdit";
import SqlAssert from "./SqlAssert";
import SqlRegular from "./SqlRegular";
import SqlDbInfo from "./SqlDbInfo";
import { Tabs } from '@arco-design/web-react';

const { TabPane } = Tabs;
const SqlRequest = (props) => {
    const { onChange, data = {}, from } = props;

    console.log(data);

    const requestList = [
        {
            id: '0',
            title: '编辑器SQL',
            content: <SqlEdit data={data.sql_detail ? data.sql_detail : {}} onChange={onChange} />
        },
        {
            id: '1',
            title: '断言',
            content: <SqlAssert parameter={data.sql_detail ? (data.sql_detail.assert ? data.sql_detail.assert : []) : []} onChange={onChange} />
        },
        {
            id: '2',
            title: '关联提取',
            content: <SqlRegular parameter={data.sql_detail ? (data.sql_detail.regex ? data.sql_detail.regex : []) : []} onChange={onChange} />
        },
        {
            id: '3',
            title: '数据库',
            content: <SqlDbInfo data={data ? data : {}} onChange={onChange} from={from} />
        }
    ];

    return (
        <div className="sql-manage-detail-request">
            <Tabs defaultActiveTab='0' itemWidth={80}>
                {
                    requestList.map((item, index) => (
                        <TabPane
                            style={{ padding: '0 15px', width: 'auto !impoertant' }}
                            key={item.id}
                            title={item.title}
                        >
                            { item.content }
                        </TabPane>
                    ))
                }
            </Tabs>
        </div>
    )
};

export default SqlRequest;