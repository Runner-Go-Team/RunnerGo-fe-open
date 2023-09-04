import React, { useState, useEffect } from "react";
import './index.less';
import { useSelector } from 'react-redux';
import NotResponse from "@components/response/responsePanel/notResponse";
import { useTranslation } from 'react-i18next';
import { isArray } from "lodash";

const SqlAssertResult = (props) => {
    const { data } = props;

    const { t } = useTranslation();

    const sql_detail = data || {};
    const assert = sql_detail && sql_detail.assert && sql_detail.assert.assertion_msgs ? sql_detail.assert.assertion_msgs : [];

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

export default SqlAssertResult;