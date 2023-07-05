import React, { useState, useEffect } from "react";
import './index.less';
import { Tabs as TabComponent } from 'adesign-react';

import OracleEdit from "./OracleEdit";
import OracleAssert from "./OracleAssert";
import OracleRegular from "./OracleRegular";
import OracleDbInfo from "./OracleDbInfo";

const { Tabs, TabPan } = TabComponent;

const OracleRequest = (props) => {
    const { onChange, data = {} } = props;

    const requestList = [
        {
            id: '0',
            title: '编辑器SQL',
            content: <OracleEdit data={data.oracle ? data.oracle_detail : {}} onChange={onChange} />
        },
        {
            id: '1',
            title: '断言',
            content: <OracleAssert parameter={data.oracle_detail ? data.oracle_detail.assert : []} onChange={onChange} />
        },
        {
            id: '2',
            title: '关联提取',
            content: <OracleRegular parameter={data.oracle_detail ? data.oracle_detail.regex : []} onChange={onChange} />
        },
        {
            id: '3',
            title: '数据库',
            content: <OracleDbInfo data={data ? data : {}} onChange={onChange} />
        }
    ];

    return (
        <div className="sql-manage-detail-request">
            <Tabs defaultActiveId='0' itemWidth={80}>
                {
                    requestList.map((item, index) => (
                        <TabPan
                            style={{ padding: '0 15px', width: 'auto !impoertant' }}
                            key={item.id}
                            id={item.id}
                            title={item.title}
                        >
                            { item.content }
                        </TabPan>
                    ))
                }
            </Tabs>
        </div>
    )
};

export default OracleRequest;