import React, { useState, useEffect } from "react";
import './index.less';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import NotResponse from "@components/response/responsePanel/notResponse";

const OracleRegularResult = () => {
    const { t } = useTranslation();
    const sql_res = useSelector((store) => store.opens.sql_res);
    const open_api_now = useSelector((store) => store.opens.open_api_now);

    const sql_detail = sql_res[open_api_now] || {};
    const regex = sql_detail.regex || [];

    const _regex = [];

    if (regex && regex.length > 0) {
        regex.forEach(item => {
            for (let i in item) {
                _regex.push(`${i}=${item[i]}`)
            }
        })
    }

    return (
        <div className="res-regex can-copy">
            {
                _regex.length > 0 ? (
                    _regex.map(item => (
                        <p className='res-regex-item can-copy'>{item}</p>
                    ))
                ) : <NotResponse text={ t('apis.noData') } />
            }
        </div>
    )
};

export default OracleRegularResult;