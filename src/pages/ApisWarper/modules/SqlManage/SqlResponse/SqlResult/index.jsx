import React, { useState, useEffect } from "react";
import './index.less';
import { Table } from '@arco-design/web-react';
import { isJSON } from '@utils';

const SqlResult = (props) => {
    const { data: datas } = props;

    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);

    const getTextWidth = (text) => {
        const span = document.createElement('span');
        span.innerText = text;
        span.style.fontSize = '14px';
        document.body.appendChild(span);
        let width = span.offsetWidth;
        document.body.removeChild(span);

        console.log(text, width);

        return width + 52;
    }

    const arrayToTable = (array) => {
        // 获取数据的 key 数组，即表头的字段
        const keys = Object.keys(array);

        // 找到最长的列的长度
        const maxColumnLength = keys.reduce((max, key) => Math.max(max, array[key].length), 0);

        // 转换为 datas 格式
        const data = [];
        for (let i = 0; i < maxColumnLength; i++) {
            const rowData = {};
            keys.forEach((key) => {
                rowData[key] = array[key][i] || ''; // 处理数据不足的情况，缺少数据时使用空字符串填充
            });
            data.push(rowData);
        }

        // 转换为 columns 格式
        const columns = keys.map((key) => {
            return {
                title: key,
                dataIndex: key,
                width: getTextWidth(key)
            };
        });

        return { columns, data };
    }



    useEffect(() => {
        if (datas) {
            const { response_body } = datas;
            if (isJSON(response_body)) {
                const { columns, data } = arrayToTable(JSON.parse(response_body));
                setColumns(columns);
                setData(data);
            } else {
                setColumns([]);
                setData([]);
            }
        }
    }, [datas]);

    return (
        <div className="sql-result">
            {
                datas ? 
                    isJSON(datas.response_body) ? 
                        <Table 
                            border 
                            borderCell 
                            columns={columns} 
                            data={data}
                            scroll={{
                                x: 800,
                                y: 250
                            }}
                            pagination={false}
                        /> 
                        : datas.response_body 
                : ''
            }
        </div>
    );
};

export default SqlResult;
