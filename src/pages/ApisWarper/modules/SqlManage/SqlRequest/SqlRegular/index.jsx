import React, { useMemo, useState } from 'react';
import { Input, Table, Switch, Select, Button } from 'adesign-react';
import { useSelector, useDispatch } from 'react-redux';
import { Delete as DeleteSvg, Down as DownSvg, Right as RightSvg } from 'adesign-react/icons';

import { useTranslation } from 'react-i18next';
const { Option } = Select;

const SqlRegular = (props) => {
    const { parameter = [], onChange } = props;

    const { t } = useTranslation();

    const handleTableDelete = (index) => {
        const newList = [...parameter];
        if (newList.length > 0) {

            newList.splice(index, 1);

            onChange('sql_regex', [...newList]);
        }
    };

    const handleChange = (rowData, rowIndex, newVal) => {
        const newList = [...parameter];
        newList[rowIndex] = {
            ...rowData,
            ...newVal,
        };
        onChange('sql_regex', [...newList]);
    }


    const columns = [
        {
            title: '',
            width: 40,
            dataIndex: 'is_checked',
            render: (text, rowData, rowIndex) => (
                <Switch
                    size="small"
                    checked={text === '1' || text === 1}
                    onChange={(e) => {
                        handleChange(rowData, rowIndex, { is_checked: e ? 1 : 2 });
                    }}
                />
            ),
        },
        {
            title: t('apis.varName'),
            width: 150,
            dataIndex: 'var',
            // enableResize: true,
            render: (text, rowData, rowIndex) => (
                <Input
                    size="mini"
                    value={text}
                    onChange={(newVal) => {
                        handleChange(rowData, rowIndex, { var: newVal });
                    }}
                />
            ),
        },
        {
            title: t('apis.field'),
            dataIndex: 'field',
            // enableResize: true,
            render: (text, rowData, rowIndex) => (
                <Input
                    size="mini"
                    value={text}
                    onChange={(newVal) => {
                        handleChange(rowData, rowIndex, { field: newVal });
                    }}
                />
            ),
        },
        {
            title: t('apis.index'),
            dataIndex: 'index',
            // enableResize: true,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        size="mini"
                        value={`${text}`}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { index: parseInt(newVal) });
                        }}
                    />
                );
            },
        },
        {
            title: '',
            width: 30,
            render: (text, rowData, rowIndex) => (
                <Button
                    onClick={() => {
                        handleTableDelete(rowIndex);
                    }}
                >
                    <DeleteSvg style={{ width: 16, height: 16 }} />
                </Button>
            ),
        },
    ];

    const tableDataList = () => {
        return [...parameter, { is_checked: 1, var: '', field: '', index: 0 }]
    };

    return (
        <div className='apipost-req-wrapper'>
            <Table showBorder hasPadding={false} columns={columns} data={tableDataList()} />
        </div>
    )
};

export default SqlRegular;