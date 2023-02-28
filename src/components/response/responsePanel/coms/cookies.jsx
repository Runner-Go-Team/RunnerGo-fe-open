import React, { useState } from 'react';
import dayjs from 'dayjs';
import Empty from '@components/Empty';
import { Table } from 'adesign-react';
import { isArray } from 'lodash';

const CookiesTable = (props) => {
  const { data } = props;

  const columns = [
    {
      title: 'name',
      dataIndex: 'key',
      render: (text, rowData, rowIndex) => (
        <span className="table-cell-span">{rowData.key || rowData.name}</span>
      ),
    },
    {
      title: 'value', // 参数key String
      dataIndex: 'value',
      render: (text, rowData, rowIndex) => (
        <span className="table-cell-span">{text || '-'}</span>
      ),
    },
    {
      title: 'httpOnly', // 参数key String
      dataIndex: 'httpOnly',
      render: (text, rowData, rowIndex) => (
        <span className="table-cell-span">{text || '-'}</span>
      ),
    },
    {
      title: 'domain', // 参数key String
      dataIndex: 'domain',
      render: (text, rowData, rowIndex) => (
        <span className="table-cell-span">{text || '-'}</span>
      ),
    },
    {
      title: 'expires', // 参数key String
      dataIndex: 'expires',
      render: (text, rowData, rowIndex) => (
        <span className="table-cell-span">{dayjs(text).format('YYYY-MM-DD HH:mm:ss') || '-'}</span>
      ),
    },
    {
      title: 'path', // 参数key String
      dataIndex: 'path',
      render: (text, rowData, rowIndex) => (
        <span className="table-cell-span">{text || '/'}</span>
      ),
    },
    {
      title: 'secure', // 参数key String
      dataIndex: 'secure',
      render: (text, rowData, rowIndex) => (
        <span className="table-cell-span">{rowData.secure || '-'}</span>
      ),
    },
  ];

  return (
    <>
      {isArray(data?.resCookies) && data.resCookies.length > 0 ? (
        <Table showBorder columns={columns} data={data?.resCookies || []} />
      ) : (
        <Empty />
      )}
    </>
  );
};

export default CookiesTable;
