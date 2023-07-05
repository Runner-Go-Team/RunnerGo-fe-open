import React, { useState, useEffect } from "react";
import './index.less';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'adesign-react';

const OracleResult = () => {

    const { t } = useTranslation();

    const sql_res = useSelector((store) => store.opens.sql_res);
    const open_api_now = useSelector((store) => store.opens.open_api_now);

    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (sql_res[open_api_now] && sql_res[open_api_now].status === 'finish') {
            let _columns = [];
            let _data = [];
            const { sql_result } = sql_res[open_api_now];
            if (sql_result) {
                let keys = Object.keys(sql_result);
                let values = Object.values(sql_result);
                let length = Math.max(...values.map((v) => v.length));
                for (let key of keys) {
                    _columns.push({ dataIndex: key, title: key });
                }
                for (let i = 0; i < length; i++) {
                    let obj = {};
                    for (let key of keys) {
                        obj[key] = sql_result[key][i];
                    }
                    _data.push(obj);
                }
            }
            setColumns(_columns);
            setData(_data);
        }
    }, [sql_res, open_api_now]);

    return (
        <div className="sql-result">
            <Table showBorder hasPadding={false} columns={columns} data={data}  />
        </div>
    );
};

export default OracleResult;