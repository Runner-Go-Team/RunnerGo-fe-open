import React, { useState } from 'react';
import { Input, Table, Switch, Select, Button } from 'adesign-react';
import { VARTYPES, BODYTYPELISTMAPVARTYPES } from '@constants/typeList';
import { Delete as DeleteSvg } from 'adesign-react/icons';
import Bus from '@utils/eventBus';
import { newDataItem, dataItem } from '@constants/dataItem';
import DescChoice from '@components/descChoice';
import isArray from 'lodash/isArray';
import AutoSizeTextArea from '@components/AutoSizeTextArea';
import { isPlainObject, isString, trim } from 'lodash';

const Option = Select.Option;

const MarkList = (props) => {
  const { list, onChange } = props;

  const handleChange = (rowData, rowIndex, newVal) => {
    const newList = [...list];
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
  const handleDelete = (index) => {
    const newList = [...list];
    if (newList.length > 0) {
      newList.splice(index, 1);
      onChange([...newList]);
    }
  };
  const handleTableDel = () => {
    const newList = list.filter((item) => !(item.is_checked > 0));
    onChange([...newList]);
  };
  const tableDataList = () => {
    const hasStatic = list.some((item) => item.static);
    if (!hasStatic) {
      return [...list, { ...dataItem }];
    }
    return [...list];
  };
  const columns = [
    {
      title: '',
      dataIndex: 'is_checked',
      width: 40,
      render: (text  , rowData  , rowIndex  ) => (
        <Switch
          checked={text > 0}
          size="small"
          onChange={(newVal) => {
            handleChange(rowData, rowIndex, { is_checked: newVal ? 1 : -1 });
          }}
        />
      ),
    },
    {
      title: '参数名',
      dataIndex: 'key',
      enableResize: true,
      width: 100,
      render: (text  , rowData  , rowIndex  ) => {
        return (
          <Input
            size="mini"
            bordered={false}
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
      render: (text  , rowData  , rowIndex  ) => {
        return (
          <Input
            size="mini"
            bordered={false}
            value={text}
            onChange={(newVal) => {
              handleChange(rowData, rowIndex, { value: newVal });
            }}
          />
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'field_type',
      width: 100,
      enableResize: false,
      render: (text  , rowData  , rowIndex  ) => {
        return (
          <Select
            size="mini"
            style={{ width: '100%' }}
            bordered={false}
            value={BODYTYPELISTMAPVARTYPES[text] || text || 'String'}
            onChange={(selectVal) => {
              handleChange(rowData, rowIndex, { field_type: selectVal });
            }}
          >
            {VARTYPES?.map((item) => (
              <Option key={item} value={item || '类型'}>
                {item || '类型'}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '参数描述',
      dataIndex: 'description',
      render: (text  , rowData  , rowIndex  ) => {
        return (
          <div>
            <AutoSizeTextArea
              height={24}
              bordered={false}
              value={text}
              onChange={(newVal) => {
                handleChange(rowData, rowIndex, { description: newVal });
              }}
              onBlur={(e) => {
                // 添加临时描述
                Bus.$emit('addTempParams', {
                  key: rowData?.key || '',
                  description: e?.target?.textContent || '',
                });
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
      render: (text  , rowData  , rowIndex  ) => (
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
      width: 40,
      render: (text  , rowData  , rowIndex  ) => (
        <Button onClick={() => handleDelete(rowIndex)}>
          <DeleteSvg style={{ width: 16, height: 16 }} />
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="listheader">
        <Button onClick={handleTableDel} style={{ userSelect: 'none' }}>
          <DeleteSvg width={16} />
          <>批量删除</>
        </Button>
      </div>
      <Table showBorder hasPadding={false} columns={columns} data={tableDataList()} />
    </>
  );
};

export default MarkList;
