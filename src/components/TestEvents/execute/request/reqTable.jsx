import React, { useState, useEffect } from 'react';
import { Table } from 'adesign-react';
import { isArray } from 'lodash';

const ReqTable = (props) => {
  const { data } = props;
  const headerList = [];
  const reqHeader = data?.headers || {};
  for (const key in reqHeader) {
    if (typeof reqHeader[key] === 'object') {
      for (const it in reqHeader[key]) {
        headerList.push({ key, value: reqHeader[key][it] });
      }
    } else {
      headerList.push({ key, value: reqHeader[key] });
    }
  }

  const [list, setList] = useState([...headerList]);
  useEffect(() => {
    if (isArray(headerList)) {
      setList([...headerList]);
    }
  }, [data?.headers]);
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
      <Table showHeader={false} showBorder columns={columns} data={list} />
    </>
  );
};

export default ReqTable;
