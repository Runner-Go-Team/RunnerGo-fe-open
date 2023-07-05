import React, { useState, useEffect } from "react";
import './index.less';
import MonacoEditor from '@components/MonacoEditor';

const OracleEdit = (props) => {
    const { data, onChange } = props;
    return (
        <div className="sql-edit">
            <MonacoEditor
                value={data.sql_string}
                style={{ minHeight: '100%' }}
                Height="100%"
                language="sql"
                onChange={(e) => {
                    onChange('oracle_sql_string', e);
                }}
            />
        </div>
    )
};

export default OracleEdit;