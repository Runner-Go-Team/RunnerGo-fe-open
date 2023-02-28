import React, { useMemo, useState } from 'react';
import { Input, Table, Switch, Select, Button } from 'adesign-react';
import { useSelector, useDispatch } from 'react-redux';
import { Delete as DeleteSvg, Down as DownSvg, Right as RightSvg } from 'adesign-react/icons';
import { dataItem, newDataItem } from '@constants/dataItem';
import Bus from '@utils/eventBus';
import { HEADERTYPELIST } from '@constants/typeList';
import cloneDeep from 'lodash/cloneDeep';
import ApiInput from '@components/ApiInput';
import SearchInput from '@components/SearchInput';
import AutoSizeTextArea from '@components/AutoSizeTextArea';
import DescChoice from '@components/descChoice';
import { isString, trim } from 'lodash';
import { REQUEST_HEADER } from '@constants/api';
import Importexport from '../importExport';
// import { COMPARE_IF_TYPE } from '@constants/compare';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const Assert = (props) => {
    const { parameter, onChange } = props;
    const { t } = useTranslation();
    const [unKey, setUnKey] = useState(false);
    const [unValue, setUnValue] = useState(false);

    const handleTableDelete = (index) => {
        const newList = [...parameter];
        if (newList.length > 0) {
            newList.splice(index, 1);
            onChange('assert', [...newList]);
        }
    };

    const handleChange = (rowData, rowIndex, newVal) => {
        const newList = [...parameter];
        newList[rowIndex] = {
            ...rowData,
            ...newVal,
        };

        onChange('assert', [...newList]);
    }

    const COMPARE_IF_TYPE = [
        { type: 'eq', title: t('apis.compareSelect.eq') },
        { type: 'uneq', title: t('apis.compareSelect.uneq') },
        { type: 'gt', title: t('apis.compareSelect.gt') },
        { type: 'gte', title: t('apis.compareSelect.gte') },
        { type: 'lt', title: t('apis.compareSelect.lt') },
        { type: 'lte', title: t('apis.compareSelect.lte') },
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
                        if (parameter[rowIndex] ? (e === 3 || e === 1) : false) {
                            handleChange(rowData, rowIndex, { var: '', response_type: e });
                        } else {
                            handleChange(rowData, rowIndex, { response_type: e });
                        }
                    }}
                >
                    <Option value={1}>{t('apis.assertSelect.resHeader')}</Option>
                    <Option value={2}>{t('apis.assertSelect.resBody')}</Option>
                    <Option value={3}>{t('apis.assertSelect.resCode')}</Option>
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
                        disabled={parameter[rowIndex] ? (
                            parameter[rowIndex].response_type === 3 || parameter[rowIndex].response_type === 1 ||
                            parameter[rowIndex].compare === 'includes' || parameter[rowIndex.compare === 'unincludes' ||
                            parameter[rowIndex].compare === 'null' || parameter[rowIndex].compare === 'notnull'
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
                            if (parameter[rowIndex] ? (e === 'notnull' || e === 'null') : false) {
                                handleChange(rowData, rowIndex, { val: '', compare: e });
                            } else {
                                handleChange(rowData, rowIndex, { compare: e });
                            }
                        }}
                    >
                        {
                            parameter[rowIndex] 
                                && res_type[parameter[rowIndex].response_type]
                            ? res_type[parameter[rowIndex].response_type].map(item => <Option value={item.type}>{item.title}</Option>)
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
                        disabled={parameter[rowIndex] ? (parameter[rowIndex].compare === 'notnull' || parameter[rowIndex].compare === 'null') : false}
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
        return [...parameter, { is_checked: 1, response_type: 0, var: '', compare: '', val: '' }]
    };

    return (
        <div className='apipost-req-wrapper'>
            <Table showBorder hasPadding={false} columns={columns} data={tableDataList()} />
        </div>
    )
};

export default Assert;