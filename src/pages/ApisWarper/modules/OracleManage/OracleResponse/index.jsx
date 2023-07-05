import React, { useState, useEffect } from "react";
import './index.less';
import { Button, Tabs as TabComponent } from 'adesign-react';
import SqlResult from "./OracleResult";
import SqlAssertResult from "./OracleAssertResult";
import SqlRegularResult from "./OracleRegularResult";

import OracleResult from "./OracleResult";
import OracleAssertResult from "./OracleAssertResult";
import OracleRegularResult from "./OracleRegularResult";
import { useSelector, useDispatch } from 'react-redux';
import NotResponse from "@components/response/responsePanel/notResponse";
import { useTranslation } from 'react-i18next';
import { ResponseSendWrapper } from "../../../../../components/response/responsePanel/style";

const { Tabs, TabPan } = TabComponent;

const OracleResponse = (props) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const sql_res = useSelector((store) => store.opens.sql_res);
    const open_api_now = useSelector((store) => store.opens.open_api_now);

    const requestList = [
        {
            id: '0',
            title: '执行结果',
            content: <OracleResult />
        },
        {
            id: '1',
            title: '断言结果',
            content: <OracleAssertResult />
        },
        {
            id: '2',
            title: '提取结果',
            content: <OracleRegularResult />
        }
    ]


    return (
        <div className="sql-manage-detail-response">
            {
                sql_res[open_api_now] && sql_res[open_api_now].status === 'running' &&
                 (
                    <div className={ResponseSendWrapper}>
                        <div className="loading_bar_tram"></div>
                        <div className="apt_sendLoading_con">
                            <div className="apt_sendLoading_con_text">{t('btn.sending')}</div>
                            <Button
                                type="primary"
                                className="cancel-send-btn"
                                onClick={() => {

                                }}
                            >
                                { t('btn.cancelSend') }
                            </Button>
                        </div>
                    </div>
                )
            }
            <Tabs defaultActiveId='0' itemWidth={80}>
                {
                    requestList.map((item, index) => (
                        <TabPan
                            style={{ padding: '0 15px', width: 'auto !impoertant' }}
                            key={item.id}
                            id={item.id}
                            title={item.title}
                        >
                            { Object.entries(sql_res[open_api_now] || {}).length > 0 ? item.content: <NotResponse text={t('apis.resSqlEmpty')} /> }
                        </TabPan>
                    ))
                }
            </Tabs>
        </div>
    )
};

export default OracleResponse;