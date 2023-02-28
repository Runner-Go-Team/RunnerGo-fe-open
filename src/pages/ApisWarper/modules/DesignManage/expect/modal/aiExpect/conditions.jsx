import React from 'react';
import { Table, Input, Button } from 'adesign-react';
import { v4 as uuidV4 } from 'uuid';
import { Delete as DeleteSvg, Add as AddSvg } from 'adesign-react/icons';
import { cloneDeep } from 'lodash';
import SelCompare from './selCompare';
import SelLocation from './selLocation';
import { ConditionItem } from './style';
import { DEFAULT_CONDITION } from './constant';


const ConditionTable = (props) => {
  const { conditionList, expectList, onChange = (list) => undefined } = props;

  // 删除条件
  const handleTableDelete = (index) => {
    const newList = conditionList.filter((item, itemIndex) => itemIndex !== index);
    onChange(newList);
  };

  // 添加条件
  const handleAddCondition = (index) => {
    const newList = [
      ...conditionList,
      {
        ...cloneDeep(DEFAULT_CONDITION),
        conditionId: uuidV4(),
      },
    ];
    onChange(newList);
  };

  // 修改条件
  const handleChange = (rowKey, index, newValue) => {
    const newList = cloneDeep(conditionList);
    newList[index][rowKey] = newValue;
    onChange(newList);
  };

  const renderInput = (text, rowData, rowIndex, rowKey) => {
    return (
      <Input
        size="mini"
        value={text}
        onChange={(newVal) => {
          handleChange(rowKey, rowIndex, newVal);
        }}
      />
    );
  };

  const renderLocation = (text, rowData, rowIndex, rowKey) => {
    return (
      <SelLocation
        value={text}
        onChange={(newVal) => {
          handleChange(rowKey, rowIndex, newVal);
        }}
      />
    );
  };

  const renderCompare = (text, rowData, rowIndex, rowKey) => {
    return (
      <SelCompare
        value={text}
        onChange={(newVal) => {
          handleChange(rowKey, rowIndex, newVal);
        }}
      />
    );
  };

  const columns = [
    {
      title: '参数位置',
      dataIndex: 'location',
      enableResize: true,
      width: 130,
      render: renderLocation,
    },
    {
      title: '参数名',
      dataIndex: 'name',
      enableResize: true,
      width: 130,
      render: renderInput,
    },
    {
      title: '比较',
      dataIndex: 'compareType',
      enableResize: true,
      width: 150,
      render: renderCompare,
    },
    {
      title: '参数值',
      dataIndex: 'value',
      render: renderInput,
    },
    {
      title: '',
      width: 40,
      render: () => (
        <Button onClick={handleAddCondition}>
          <AddSvg className="btn-add" />
        </Button>
      ),
    },
    {
      title: '',
      width: 40,
      render: (text, rowData, rowIndex) => (
        <Button onClick={handleTableDelete.bind(null, rowIndex)}>
          <DeleteSvg className="btn-delete" />
        </Button>
      ),
    },
  ];

  return (
    <ConditionItem>
      <Table showBorder columns={columns} data={conditionList} />
    </ConditionItem>
  );
};

export default ConditionTable;
