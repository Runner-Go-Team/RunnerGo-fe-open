import React, { useState } from 'react';
import { Input, Table, Switch, Button } from 'adesign-react';
import { Delete as DeleteSvg } from 'adesign-react/icons';
import DescChoice from '@components/descChoice';
import Bus from '@utils/eventBus';
import { isString, trim } from 'lodash';

const Header = (props) => {
  const data = [
    {
      key: '1',
      name: 'name',
      value: 'value',
      desc: 'desc',
    },
  ];

  const [list, setList] = useState([...data]);

  const handleChange = (rowData , rowIndex , newVal ) => {
    const newList = [...list];
    newList[rowIndex] = {
      ...rowData,
      ...newVal,
    };
    setList([...newList]);
  };

  const columns = [
    {
      title: '',
      dataIndex: 'is_checked',
      width: 15,
      render: (text , rowData , rowIndex ) => <Switch size="small" />,
    },
    {
      title: '参数名',
      dataIndex: 'name',
      enableResize: true,
      width: 50,
      render: (text , rowData , rowIndex ) => {
        return (
          <Input
            size="mini"
            value={text}
            onChange={(newVal) => {
              handleChange(rowData, rowIndex, { name: newVal });
            }}
            onBlur={async () => {
              if (
                isString(rowData?.key) &&
                trim(rowData.key).length > 0 &&
                isString(rowData?.description) &&
                trim(rowData.description).length <= 0
              ) {
                const desc = await Bus.$asyncEmit('getProjectDescList', rowData.key);
                if (isString(desc) && desc.length > 0) {
                  handleChange(rowData, rowIndex, { description: desc });
                }
              }
            }}
          />
        );
      },
    },
    {
      title: '参数值',
      dataIndex: 'value',
      enableResize: true,
      width: 50,
      render: (text , rowData , rowIndex ) => {
        return (
          <Input
            size="mini"
            value={text}
            onChange={(newVal) => {
              handleChange(rowData, rowIndex, { salary: newVal });
            }}
          />
        );
      },
    },
    {
      title: '参数描述',
      dataIndex: 'desc',
      width: 50,
      enableResize: true,
      render: (text , rowData , rowIndex ) => {
        return (
          <div>
            <Input
              size="mini"
              value={text}
              onChange={(newVal) => {
                handleChange(rowData, rowIndex, { salary: newVal });
              }}
            />
            {/* <MiniEditor forbidEnter={false} /> */}
          </div>
        );
      },
    },
    {
      title: '',
      width: 30,
      render: (text , rowData , rowIndex ) => (
        <div>
          <DescChoice
            onChange={(newVal) => {
              handleChange(rowData, rowIndex, { description: newVal });
            }}
            filterKey={rowData?.key}
          ></DescChoice>
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'del',
      width: 10,
      render: (text , rowData , rowIndex ) => (
        <Button>
          <DeleteSvg style={{ width: 16, height: 16 }} />
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table showHeader showBorder columns={columns} data={list} />,
    </>
  );
};

export default Header;
