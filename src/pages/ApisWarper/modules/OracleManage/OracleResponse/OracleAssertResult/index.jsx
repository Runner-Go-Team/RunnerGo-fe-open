import React, { useState, useEffect } from "react";
import './index.less';
import { useSelector } from 'react-redux';
import NotResponse from "@components/response/responsePanel/notResponse";
import { useTranslation } from 'react-i18next';

const OracleAssertResult = () => {

    const { t } = useTranslation();
    const sql_res = useSelector((store) => store.opens.sql_res);
    const open_api_now = useSelector((store) => store.opens.open_api_now);

    const sql_detail = sql_res[open_api_now] || {};
    const assert = sql_detail.assert || [];

    return (
        <div className="res-assert can-copy">
            {
                assert.length ? assert.map(item => (
                    <div className='assert-item can-copy'
                        style={{
                            backgroundColor: item.is_succeed ? 'rgba(60, 192, 113, 0.1)' : 'rgba(255, 76, 76, 0.1)',
                            color: item.is_succeed ? 'var(--run-green)' : 'var(--delete-red)'
                        }}
                    >
                        {item.msg}
                    </div>
                )) : <NotResponse text={t('apis.noData')} />
            }
        </div>
    )
};

export default OracleAssertResult;