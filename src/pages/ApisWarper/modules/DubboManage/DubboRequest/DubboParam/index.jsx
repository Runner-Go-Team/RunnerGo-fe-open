import React, { useMemo, useState } from 'react';
import './index.less';
import { Input, Switch, Select, Button } from 'adesign-react';
import { Delete as DeleteSvg, Down as DownSvg, Right as RightSvg } from 'adesign-react/icons';
// import { COMPARE_IF_TYPE } from '@constants/compare';
import { useTranslation } from 'react-i18next';
import { Table } from '@arco-design/web-react';

const { Option } = Select;

const DubboParam = (props) => {
    const { data: { dubbo_detail: { dubbo_param } }, onChange } = props;
    const { t } = useTranslation();

    const handleTableDelete = (index) => {
        const newList = [...dubbo_param];
        if (newList.length > 0) {
            newList.splice(index, 1);
            onChange('dubbo_param', [...newList]);
        }
    };

    const handleChange = (rowData, rowIndex, newVal) => {
        const newList = [...dubbo_param];
        newList[rowIndex] = {
            ...rowData,
            ...newVal,
        };

        console.log(newList);
        onChange('dubbo_param', [...newList]);
    }

    const typeList = [
        'java.lang.String',
        'java.lang.Integer',
        'java.lang.Double',
        'java.lang.Short',
        'java.lang.Long',
        'java.lang.Float',
        'java.lang.Byte',
        'java.lang.Boolean',
        'java.lang.Character',
        // 'java.util.Map',
        // 'java.util.List',
        // 'java.util.ArrayList'
    ];

    const columns = [
        // {
        //     title: '',
        //     dataIndex: '',
        //     width: 20,
        //     render: () => {
        //         return <></>
        //     }
        // },
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
            title: t('apis.key'),
            dataIndex: 'var',
            render: (text, rowData, rowIndex) => (
                <Input
                    size="mini"
                    disabled={true}
                    value={`arg${rowIndex}`}
                    onChange={(newVal) => {
                        handleChange(rowData, rowIndex, { var: newVal });
                    }}
                />
            ),
        },
        // 包含 不包含 等于空 不等于空
        {
            title: t('apis.type'),
            dataIndex: 'param_type',
            render: (text, rowData, rowIndex) => {
                return (
                    <Select
                        value={rowData.param_type || null}
                        placeholder={t('placeholder.plsSelect')}
                        onChange={(e) => {
                            handleChange(rowData, rowIndex, { param_type: e });
                        }}
                    >
                        {
                            typeList.map(item => (
                                <Option key={item} value={item}>{ item }</Option>
                            ))
                        }
                    </Select>
                );
            },
        },
        {
            title: t('apis.value'),
            dataIndex: 'val',
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
                    <DeleteSvg style={{ width: 16, height: 16,fill:'var(--font-1)' }} />
                </Button>
            ),
        },
    ];

    const tableDataList = () => {
        return [...dubbo_param, { is_checked: 1, param_type: '', var: '', val: '' }]
    };

    return (
        <div className='apipost-req-wrapper dubbo-manage-request-param'>
            <Table border borderCell hasPadding={false} columns={columns} data={tableDataList()} pagination={false} />
        </div>
    )
};

export default DubboParam;