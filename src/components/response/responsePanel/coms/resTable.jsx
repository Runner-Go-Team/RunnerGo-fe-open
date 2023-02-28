import React, { useState } from 'react';
import { Table } from 'adesign-react';
import './index.less';

const ResTable = (props) => {
  const { data } = props;
  const headerList = [];
  const resHeader = data?.response_header || '';
  for (const key in resHeader) {
    if (typeof resHeader[key] === 'object') {
      for (const it in resHeader[key]) {
        headerList.push({ key, value: resHeader[key][it] });
      }
    } else {
      headerList.push({ key, value: resHeader[key] });
    }
  }

  const [list, setList] = useState([...headerList]);

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
    <div style={{ padding: '20px' }} className='res-header-table'>
      {/* <Table showHeader={false} showBorder columns={columns} data={list} /> */}
      { resHeader.split('\r').map(item => <p style={{ marginBottom: '10px' }} className='can-copy'>{item}</p>) }
    </div>
  );
};

export default ResTable;
