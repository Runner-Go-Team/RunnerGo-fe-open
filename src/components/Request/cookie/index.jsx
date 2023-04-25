import React, { useState } from 'react';
import { Input, Table, Switch, Button } from 'adesign-react';
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
import { useTranslation } from 'react-i18next';

const Cookie = (props) => {
    const { parameter = [], onChange } = props;
    const { t } = useTranslation();


    console.log(parameter);
    const handleChange = (rowData, rowIndex, newVal) => {
        const newList = [...parameter];
        if (
            (newVal.hasOwnProperty('key') && newVal?.key !== '') ||
            newVal.hasOwnProperty('value')
        ) {
            delete rowData.static;
        }
        newList[rowIndex] = {
            ...rowData,
            ...newVal,
        };
        // key和value都是空的数据不要
        onChange('cookie', [...newList.filter(item => item.key.trim().length > 0 || item.value.trim().length > 0)]);
    };

    const handleTableDelete = (index) => {
        const newList = [...parameter];
        if (newList.length > 0) {
            newList.splice(index, 1);
            onChange('cookie', [...newList]);
        }
    };
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
            title: t('apis.cookieName'),
            dataIndex: 'key',
            enableResize: true,
            width: 80,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        size="mini"
                        value={text}
                        placeholder={t('apis.key')}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { key: newVal });
                        }}
                    />
                );
            },
        },
        {
            title: t('apis.cookieValue'),
            dataIndex: 'value',
            enableResize: true,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        size="mini"
                        value={text}
                        placeholder={t('placeholder.bodyValue')}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { value: newVal });
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
        return [...parameter, { ...newDataItem }];
    };
    return (
        <div className="apipost-req-wrapper">
            <Table showBorder hasPadding={false} columns={columns} data={tableDataList()} />
        </div>
    );
};

export default Cookie;
