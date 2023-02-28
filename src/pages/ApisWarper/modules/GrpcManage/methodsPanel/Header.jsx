import React, { useState } from 'react';
import { Input, Table, Switch, Select, Dropdown, Button } from 'adesign-react';
import { HEADERTYPELIST } from '@constants/typeList';
import { newDataItem, dataItem } from '@constants/dataItem';
import { Delete as DeleteSvg } from 'adesign-react/icons';
import Bus from '@utils/eventBus';
import DescChoice from '@components/descChoice';
import { isArray, isString, trim } from 'lodash';

const Option = Select.Option;

const Header = (props) => {
  const { data, onChange, path } = props;

  const handleChange = (rowData, rowIndex, newVal) => {
    let newList = [...data];
    // 如果改的是最后一行静态行 添加新的行。
    if (
      newVal.hasOwnProperty('key') ||
      newVal.hasOwnProperty('value') ||
      newVal.hasOwnProperty('description')
    ) {
      if ((rowData.hasOwnProperty('static') && rowData.static) || newList.length - 1 <= rowIndex) {
        delete rowData.static;
        newList[rowIndex] = {
          ...rowData,
          ...newVal,
        };
        newList = [...newList, { ...newDataItem }];
      } else {
        newList[rowIndex] = {
          ...rowData,
          ...newVal,
        };
      }
    } else {
      newList[rowIndex] = {
        ...rowData,
        ...newVal,
      };
    }
    onChange(newList);
  };
  const handleTableDelete = (index) => {
    const newList = [...data];
    if (newList.length > 1) {
      newList.splice(index, 1);
      onChange([...newList]);
    }
  };
  const getTableList = () => {
    if (isArray(data) && data.length > 0) {
      return data;
    }
    return [{ ...newDataItem }];
  };
  const columns = [
    {
      title: '',
      width: 40,
      dataIndex: 'is_checked',
      render: (text, rowData, rowIndex) => (
        <Switch
          size="small"
          checked={text > 0}
          onChange={(e) => {
            handleChange(rowData, rowIndex, { is_checked: e ? '1' : '0' });
          }}
        />
      ),
    },
    {
      title: '参数名',
      dataIndex: 'key',
      enableResize: true,
      width: 100,
      render: (text, rowData, rowIndex) => {
        return (
          <Input
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
          <Input
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
      title: '必填',
      dataIndex: 'not_null',
      width: 55,
      render: (text, rowData, rowIndex) => {
        return (
          <Switch
            size="small"
            checked={text > 0}
            onChange={(e) => {
              handleChange(rowData, rowIndex, { not_null: e ? 1 : -1 });
            }}
          />
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'field_type',
      enableResize: false,
      width: 100,
      render: (text, rowData, rowIndex) => {
        return (
          <Select
            value={rowData?.field_type || 'String'}
            onChange={(newVal) => {
              handleChange(rowData, rowIndex, { field_type: newVal });
            }}
          >
            {HEADERTYPELIST.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
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

  return (
    <div className="apipost-req-wrapper">
      <Table showBorder columns={columns} data={getTableList()} />
    </div>
  );
};

export default Header;
