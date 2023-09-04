import React, { useState, useEffect } from "react";
import './index.less';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import NotResponse from "@components/response/responsePanel/notResponse";
import { isArray } from "lodash";

const SqlRegularResult = (props) => {
    const { data } = props;

    const { t } = useTranslation();

    const sql_detail = data || {};
    const regex = sql_detail && sql_detail.regex && sql_detail.regex.regs ? sql_detail.regex.regs : [];

    const _regex = [];

    if (regex && regex.length > 0) {
        regex.forEach(item => {
            _regex.push(`${item.key}=${item.value}`)
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

export default SqlRegularResult;