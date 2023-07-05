import React, { useMemo, useState } from 'react';
import { Input, Table, Switch, Select, Button } from 'adesign-react';
import { Delete as DeleteSvg, Down as DownSvg, Right as RightSvg } from 'adesign-react/icons';

import { useTranslation } from 'react-i18next';
const { Option } = Select;

const DubboRegular = (props) => {
    const { data: { dubbo_detail: { dubbo_regex } }, onChange } = props;

    const { t } = useTranslation();

    const handleTableDelete = (index) => {
        const newList = [...dubbo_regex];
        if (newList.length > 0) {

            newList.splice(index, 1);

            onChange('dubbo_regex', [...newList]);
        }
    };

    const handleChange = (rowData, rowIndex, newVal) => {
        const newList = [...dubbo_regex];
        newList[rowIndex] = {
            ...rowData,
            ...newVal,
        };
        onChange('dubbo_regex', [...newList]);
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
            title: t('apis.type'),
            width: 150,
            dataIndex: 'type',
            // enableResize: true,
            render: (text, rowData, rowIndex) => (
                <Select
                    value={rowData ? rowData.type : 1}
                    placeholder={t('placeholder.plsSelect')}
                    onChange={(e) => {
                        handleChange(rowData, rowIndex, { type: e });
                    }}
                >
                    <Option value={1}>json</Option>
                    <Option value={0}>{ t('apis.regular_text') }</Option>
                    {/* <Option value={2}>{ t('apis.regular_header') }</Option>
                    <Option value={3}>{ t('apis.regular_code') }</Option> */}
                </Select>
            ),
        },
        {
            title: t('apis.varName'),
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
            title: t('apis.expression'),
            dataIndex: 'express',
            // enableResize: true,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        size="mini"
                        disabled={rowData ? rowData.type === 3 : false}
                        value={text}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { express: newVal });
                        }}
                    />
                );
            },
        },
        {
            title: t('apis.desc'),
            dataIndex: 'val',
            // enableResize: true,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        size="mini"
                        value={text}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { val: newVal });
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
        return [...dubbo_regex, { is_checked: 1, type: 1, var: '', express: '', val: '' }]
    };

    return (
        <div className='apipost-req-wrapper'>
            <Table showBorder hasPadding={false} columns={columns} data={tableDataList()} />
        </div>
    )
};

export default DubboRegular;