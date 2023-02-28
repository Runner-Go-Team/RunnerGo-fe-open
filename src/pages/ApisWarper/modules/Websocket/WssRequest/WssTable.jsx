import React, { useState } from 'react';
import { Input, Table, Switch, Button } from 'adesign-react';
import { Delete as DeleteSvg } from 'adesign-react/icons';
import { dataItem, newDataItem } from '@constants/dataItem';
import isArray from 'lodash/isArray';
import Bus from '@utils/eventBus';
import DescChoice from '@components/descChoice';
import ApiInput from '@components/ApiInput';
import { cloneDeep, isString, trim } from 'lodash';

const WssTable = (props) => {
  const { paramsType, type = 'params', onChange, value, onTableDelete } = props;
  const getTableData = () => {
    const hasStatic = value.some((item) => item.static);
    if (!hasStatic) {
      return [...value, { ...dataItem }];
    }
    return [...value];
  };
  // const [list, setList] = useState([...value]);
  const handleChange = (rowData, rowIndex, newVal) => {
    const newList = [...value];
    if (
      newVal.hasOwnProperty('key') ||
      newVal.hasOwnProperty('value') ||
      newVal.hasOwnProperty('description')
    ) {
      delete rowData.static;
    }
    newList[rowIndex] = {
      ...rowData,
      ...newVal,
    };
    onChange([...newList]);
  };
  const getEventData = () => {
    const tableData = [...value];

    const hasStatic = tableData.some((item) => item.static);
    if (!hasStatic) {
      return [
        ...value,
        {
          key: '',
          value: '',
          description: '',
          is_checked: 1,
          static: 1,
        },
      ];
    }
    return [...value];
  };
  const handleTableDelete = (index) => {
    const newList = [...value];
    if (newList.length > 0) {
      newList.splice(index, 1);
      onTableDelete([...newList]);
    }
  };

  const columns = [
    {
      title: '',
      width: 45,
      dataIndex: 'is_checked',
      render: (text, rowData, rowIndex) => {
        return (
          <Switch
            size="small"
            checked={text === '1' || text === 1}
            onChange={(e) => {
              handleChange(rowData, rowIndex, { is_checked: e ? 1 : -1 });
            }}
          />
        );
      },
    },
    {
      title: '参数名',
      dataIndex: 'key',
      enableResize: true,
      width: 100,
      render: (text, rowData, rowIndex) => {
        return (
          <ApiInput
            size="mini"
            value={text}
            onChange={(newVal) => {
              handleChange(rowData, rowIndex, { key: newVal });
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
      width: 150,
      render: (text, rowData, rowIndex) => {
        return (
          <ApiInput
            size="mini"
            value={text}
            onChange={(newVal) => {
              handleChange(rowData, rowIndex, { value: newVal });
            }}
          />
        );
      },
    },
    {
      title: '参数描述',
      dataIndex: 'description',
      render: (text, rowData, rowIndex) => {
        return (
          <Input
            size="mini"
            value={text}
            onChange={(newVal) => {
              handleChange(rowData, rowIndex, { description: newVal });
            }}
          />
        );
      },
    },
    {
      title: '',
      width: 30,
      render: (text, rowData, rowIndex) => (
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
      width: 35,
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

  const eventColumns = [
    {
      title: '',
      width: 45,
      dataIndex: 'is_checked',
      render: (text, rowData, rowIndex) => (
        <Switch
          size="small"
          checked={text === '1' || text === 1}
          onChange={(e) => {
            handleChange(rowData, rowIndex, { is_checked: e ? '1' : '0' });
          }}
        />
      ),
    },
    {
      title: '事件名',
      dataIndex: 'key',
      enableResize: true,
      width: 180,
      render: (text, rowData, rowIndex) => {
        return (
          <Input
            size="mini"
            value={text}
            onChange={(newVal) => {
              handleChange(rowData, rowIndex, { key: newVal });
            }}
          />
        );
      },
    },
    {
      title: '事件描述',
      dataIndex: 'description',
      render: (text, rowData, rowIndex) => {
        return (
          <Input
            size="mini"
            value={text}
            onChange={(newVal) => {
              handleChange(rowData, rowIndex, { description: newVal });
            }}
          />
        );
      },
    },
    {
      title: '',
      width: 35,
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

  return (
    <div>
      <Table
        hasPadding={false}
        showBorder
        columns={type === 'params' ? columns : eventColumns}
        data={
          type === 'params' ? getTableData() : (type === 'event' ? getEventData() : value) || []
        }
      />
    </div>
  );
};

export default WssTable;
