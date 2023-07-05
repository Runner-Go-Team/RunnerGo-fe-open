import React from 'react'
import { Input, Table, Switch, Button, Select } from 'adesign-react';
import { Tooltip } from '@arco-design/web-react';
import { Delete as DeleteSvg } from 'adesign-react/icons';
import { EXPECT_CONDITION_DEFAULT, EXPECT_CONDITION_PATH_LIST, EXPECT_CONDITION_COMPARE_LIST } from '@constants/expect';
import { useTranslation } from 'react-i18next';
import { IconQuestionCircle } from '@arco-design/web-react/icon';

const Option = Select.Option;

const ConditionTable = (props) => {
  const { value, onChange } = props;
  const { t } = useTranslation();
  const handleChange = (rowData, rowIndex, newVal) => {
    const newList = [...value];
    if (
      newVal.hasOwnProperty('parameter_name') ||
      newVal.hasOwnProperty('parameter_value')
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
    const newList = [...value];
    if (newList.length > 0) {
      newList.splice(index, 1);
      onChange([...newList]);
    }
  };
  const columns = [
    {
      title: t('mock.parameter_position'),
      width: 202,
      dataIndex: 'path',
      render: (text, rowData, rowIndex) => (
        <Select value={text} onChange={(newVal) => {
          if (newVal == 'body-text') {
            handleChange(rowData, rowIndex, { path: newVal, parameter_name: 'data' });
          } else {
            if (text == 'body-text') {
              handleChange(rowData, rowIndex, { path: newVal, parameter_name: '' });
              return
            }
            handleChange(rowData, rowIndex, { path: newVal });
          }
        }}>
          {EXPECT_CONDITION_PATH_LIST.map((item) => (
            <Option key={item} value={item}>{item}</Option>
          ))}
        </Select>
      ),
    },
    {
      title: t('apis.key'),
      dataIndex: 'parameter_name',
      width: 220,
      render: (text, rowData, rowIndex) => {
        if (rowData?.path == 'body-text') {
          return <Input disabled value='Text' />
        }
        if (rowData?.path == 'body-json') {
          return (<Input
            placeholder={t('placeholder.json_path')}
            afterFix={<>
              <Tooltip content={t('placeholder.json_path_doc')}>
                <IconQuestionCircle onClick={()=>window.open('https://wiki.runnergo.cn/docs/58', '_blank')} width={16} style={{ fill: 'none', color: 'var(--font-1)',cursor:'pointer' }} />
              </Tooltip>
            </>} value={text} onChange={(newVal) => {
              handleChange(rowData, rowIndex, { parameter_name: newVal });
            }} />)
        }
        return (
          <Input value={text} onChange={(newVal) => {
            handleChange(rowData, rowIndex, { parameter_name: newVal });
          }} />
        );
      },
    },
    {
      title: t('mock.comparison'),
      dataIndex: 'compare',
      width: 162,
      render: (text, rowData, rowIndex) => {
        return (
          <Select value={text} onChange={(newVal) => {
            handleChange(rowData, rowIndex, { compare: newVal });
          }}>
            {Object.keys(EXPECT_CONDITION_COMPARE_LIST).map((key) => (
              <Option key={key} value={key}>{EXPECT_CONDITION_COMPARE_LIST[key]}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: t('apis.value'),
      dataIndex: 'parameter_value',
      width: 300,
      render: (text, rowData, rowIndex) => {
        return (
          <Input value={text} onChange={(newVal) => {
            handleChange(rowData, rowIndex, { parameter_value: newVal });
          }} />
        );
      },
    },
    {
      title: '',
      width: 30,
      render: (text, rowData, rowIndex) => (
        <Button
          onClick={() => {
            handleDelete(rowIndex);
          }}
          style={{height:'100%'}}
        >
          <DeleteSvg style={{ width: 16, height: 16 }} />
        </Button>
      ),
    },
  ];
  const tableDataList = () => {
    const hasStatic = value.some((item) => item.static);
    if (!hasStatic) {
      return [...value, { ...EXPECT_CONDITION_DEFAULT }];
    }
    return [...value];
  };

  return (
    <Table showBorder hasPadding={false} columns={columns} data={tableDataList()} />
  )
}

export default ConditionTable;
