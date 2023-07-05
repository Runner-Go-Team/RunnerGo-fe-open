import React, { useMemo, useState } from 'react';
import { Input, Table, Switch, Select, Button } from 'adesign-react';
import { Delete as DeleteSvg, Down as DownSvg, Right as RightSvg } from 'adesign-react/icons';
import cloneDeep from 'lodash/cloneDeep';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const DubboAssert = (props) => {
    const { data: { dubbo_detail: { dubbo_assert } }, onChange } = props;
    const { t } = useTranslation();

    const handleTableDelete = (index) => {
        const newList = [...dubbo_assert];
        if (newList.length > 0) {
            newList.splice(index, 1);
            onChange('dubbo_assert', [...newList]);
        }
    };

    const handleChange = (rowData, rowIndex, newVal) => {
        const newList = [...dubbo_assert];
        newList[rowIndex] = {
            ...rowData,
            ...newVal,
        };

        onChange('dubbo_assert', [...newList]);
    }

    const COMPARE_IF_TYPE = [
        // { type: 'eq', title: t('apis.compareSelect.eq') },
        // { type: 'uneq', title: t('apis.compareSelect.uneq') },
        // { type: 'gt', title: t('apis.compareSelect.gt') },
        // { type: 'gte', title: t('apis.compareSelect.gte') },
        // { type: 'lt', title: t('apis.compareSelect.lt') },
        // { type: 'lte', title: t('apis.compareSelect.lte') },
        { type: 'includes', title: t('apis.compareSelect.includes') },
        { type: 'unincludes', title: t('apis.compareSelect.unincludes') },
        { type: 'null', title: t('apis.compareSelect.null') },
        { type: 'notnull', title: t('apis.compareSelect.notnull') },
    ];

    const res_type = {
        1: cloneDeep(COMPARE_IF_TYPE).splice(6, 10),
        2: COMPARE_IF_TYPE,
        3: cloneDeep(COMPARE_IF_TYPE).slice(0, 2)
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
            title: t('apis.assertBody'),
            width: 150,
            dataIndex: 'response_type',
            // enableResize: true,
            render: (text, rowData, rowIndex) => (
                <Select
                    value={rowData.response_type || null}
                    placeholder={t('placeholder.plsSelect')}
                    onChange={(e) => {
                        if (dubbo_assert[rowIndex] ? (e === 3 || e === 1) : false) {
                            handleChange(rowData, rowIndex, { var: '', response_type: e });
                        } else {
                            handleChange(rowData, rowIndex, { response_type: e });
                        }
                    }}
                >
                    {/* <Option value={1}>{t('apis.assertSelect.resHeader')}</Option> */}
                    <Option value={2}>{t('apis.assertSelect.resBody')}</Option>
                    {/* <Option value={3}>{t('apis.assertSelect.resCode')}</Option> */}
                </Select>
            ),
        },
        // 包含 不包含 等于空 不等于空
        {
            title: t('apis.field'),
            dataIndex: 'var',
            // enableResize: true,
            width: 120,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        size="mini"
                        value={text}
                        disabled={dubbo_assert[rowIndex] ? (
                            dubbo_assert[rowIndex].response_type === 3 || dubbo_assert[rowIndex].response_type === 1 ||
                            dubbo_assert[rowIndex].compare === 'includes' || dubbo_assert[rowIndex.compare === 'unincludes' ||
                            dubbo_assert[rowIndex].compare === 'null' || dubbo_assert[rowIndex].compare === 'notnull'
                        ]
                        ) : false}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { var: newVal });
                        }}
                    />
                );
            },
        },
        {
            title: t('apis.condition'),
            dataIndex: 'compare',
            // enableResize: true,
            width: 150,
            render: (text, rowData, rowIndex) => {
                let compare = cloneDeep(COMPARE_IF_TYPE);

                return (
                    <Select
                        value={rowData.compare || null}
                        placeholder={t('placeholder.plsSelect')}
                        onChange={(e) => {
                            if (dubbo_assert[rowIndex] ? (e === 'notnull' || e === 'null') : false) {
                                handleChange(rowData, rowIndex, { val: '', compare: e });
                            } else {
                                handleChange(rowData, rowIndex, { compare: e });
                            }
                        }}
                    >
                        {
                            dubbo_assert[rowIndex] 
                                && res_type[dubbo_assert[rowIndex].response_type]
                            ? res_type[dubbo_assert[rowIndex].response_type].map(item => <Option value={item.type}>{item.title}</Option>)
                            : COMPARE_IF_TYPE.map(item => <Option value={item.type}>{item.title}</Option>)
                        }
                    </Select>
                );
            },
        },
        {
            title: t('apis.val'),
            dataIndex: 'val',
            // enableResize: true,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        size="mini"
                        value={text}
                        disabled={dubbo_assert[rowIndex] ? (dubbo_assert[rowIndex].compare === 'notnull' || dubbo_assert[rowIndex].compare === 'null') : false}
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
        return [...dubbo_assert, { is_checked: 1, response_type: 2, var: '', compare: '', val: '' }]
    };

    return (
        <div className='apipost-req-wrapper'>
            <Table showBorder hasPadding={false} columns={columns} data={tableDataList()} />
        </div>
    )
};

export default DubboAssert;