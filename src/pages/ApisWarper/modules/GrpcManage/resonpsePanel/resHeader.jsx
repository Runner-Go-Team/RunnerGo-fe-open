import React, { useState } from 'react';
import { Table } from 'adesign-react';

const ResHeader = (props) => {
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
  ];

  return (
    <>
      <Table showBorder columns={columns} data={data} />
    </>
  );
};

export default ResHeader;
