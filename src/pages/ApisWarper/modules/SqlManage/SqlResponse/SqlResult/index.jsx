import React, { useState, useEffect } from "react";
import './index.less';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'adesign-react';
import { isArray } from "lodash";

const SqlResult = (props) => {
    const { data: datas } = props;


    const { t } = useTranslation();

    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [isErr, setIsErr] = useState(false);

    function arrayToTable(array) {
        // 定义一个空数组来存储columns
        let columns = [];
        // 定义一个空数组来存储data
        let data = [];
        // 遍历输入数组的每个子元素
        for (let i = 0; i < array.length; i++) {
            // 获取当前子元素的Key和Value
            let key = array[i].Key;
            let value = array[i].Value;
            // 将Key作为一个对象添加到columns数组中，对象的title属性为Key，dataIndex属性为Key，key属性为i
            columns.push({ title: key, dataIndex: key, key: i });
            // 遍历Value数组的每个元素
            for (let j = 0; j < value.length; j++) {
                // 如果data数组的第j个元素不存在，就创建一个空对象
                if (!data[j]) {
                    data[j] = {};
                }
                // 将Value数组的第j个元素作为一个属性添加到data数组的第j个对象中，属性的键为Key，值为Value
                data[j][key] = value[j];
            }
        }
        // 对columns数组按照key属性进行升序排序
        columns.sort((a, b) => a.key - b.key);
        // 返回一个包含columns和data的对象
        return { columns, data };
    }



    useEffect(() => {
        if (datas) {
            const { response_body } = datas;
            if (isArray(response_body)) {
                setIsErr(false);
                const { columns, data } = arrayToTable(isArray(response_body) ? response_body : []);
                setColumns(columns);
                setData(data);
            } else {
                setIsErr(true);
                setColumns([]);
                setData([]);
            }
        }
    }, [datas]);


    return (
        <div className="sql-result">
            {
                datas ? isArray(datas.response_body) ? <Table showBorder hasPadding={false} columns={columns} data={data} /> : datas.response_body : '' 
            }
        </div>
    );
};

export default SqlResult;