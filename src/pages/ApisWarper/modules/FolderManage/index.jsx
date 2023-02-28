import React, { useState } from 'react';
import { Select, Input, Tabs as TabComponent, Button, Switch, Table, Message } from 'adesign-react';
import { Delete as DeleteSvg } from 'adesign-react/icons';
import Authen from '@components/Auth';
import ScriptBox from '@components/ScriptBox';
import { HEADERTYPELIST } from '@constants/typeList';
import isArray from 'lodash/isArray';
import Bus from '@utils/eventBus';
import { newDataItem, dataItem } from '@constants/dataItem';
import AutoSizeTextArea from '@components/AutoSizeTextArea';
import DescChoice from '@components/descChoice';
// import MetionInput from '@components/metionInput ';
import { isString, trim } from 'lodash';
import { FolderWrapper } from './style';

const { Tabs, TabPan } = TabComponent;
const Option = Select.Option;

const FolderManage = (props) => {
  const { data, onChange } = props;

  const [tabActiveId, setTabActiveId] = useState('0');

  const handleChange = (rowData, rowIndex, newVal) => {
    const requestKey = {
      '0': 'header',
      '1': 'query',
      '2': 'body',
    };
    const type = requestKey[tabActiveId];
    if (isArray(data?.request[type])) {
      const newList = [...data.request[type]];
      // 如果改的是最后一行静态行 添加新的行。
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
      onChange(`folder${requestKey[tabActiveId]}`, newList);
    }
  };

  const handleTableDelete = (index) => {
    const requestKey = {
      '0': 'header',
      '1': 'query',
      '2': 'body',
    };
    const type = requestKey[tabActiveId];
    if (isArray(data?.request[type])) {
      const newList = [...data.request[type]];
      if (newList.length > 0) {
        newList.splice(index, 1);
        onChange(`folder${requestKey[tabActiveId]}`, newList);
      }
    }
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
          <MetionInput
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
          <MetionInput
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
            style={{ width: '100%' }}
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
          <AutoSizeTextArea
            // size="mini"
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
      width: 40,
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
  const getTableList = (type) => {
    if (isArray(data?.request[type]) && data.request[type].length > 0) {
      const hasStatic = data.request[type].some((item) => item.static);
      if (!hasStatic) {
        return [...data.request[type], { ...dataItem }];
      }
      return [...data.request[type]];
    }
    return [{ ...newDataItem }];
  };

  return (
    <div className={FolderWrapper}>
      <div className="apipost-folder-name">
        <Input
          value={data?.name || ''}
          placeholder="请输入目录名称"
          onChange={(val) => {
            onChange('name', val);
          }}
        />
        <Button
          type="primary"
          size="large"
          onClick={() => {
            Bus.$emit('saveTargetById', {
              id: data?.target_id,
              callback: () => {
                Message('success', '保存成功');
              },
            });
          }}
        >
          保存
        </Button>
      </div>
      <div className="apipost-folder-desc">
        <AutoSizeTextArea
          placeholder="请输入目录描述"
          value={data?.request?.description || ''}
          onChange={(val) => {
            onChange('description', val);
          }}
          autoSize={false}
        />
      </div>

      <Tabs
        defaultActiveId={tabActiveId}
        onChange={(val) => {
          setTabActiveId(val || '0');
        }}
      >
        <TabPan id="0" title="目录公用header">
          <Table showHeader showBorder columns={columns} data={getTableList('header')}></Table>
        </TabPan>
        <TabPan id="1" title="目录公用query">
          <Table showHeader showBorder columns={columns} data={getTableList('query')}></Table>
        </TabPan>
        <TabPan id="2" title="目录公用body">
          <Table showHeader showBorder columns={columns} data={getTableList('body')}></Table>
        </TabPan>
        <TabPan id="3" title="目录公用认证">
          <Authen value={data?.request?.auth || {}} onChange={onChange}></Authen>
        </TabPan>
        <TabPan id="4" title="目录公用预执行脚本">
          <div>
            预执行脚本已开启{' '}
            <Switch
              size="small"
              checked={data?.script?.pre_script_switch > 0}
              onChange={(checked) => {
                onChange('folderScriptPreSwitch', checked ? 1 : -1);
              }}
            />
          </div>
          <ScriptBox
            scriptType="pre"
            value={data?.script?.pre_script || ''}
            onChange={(val) => {
              onChange('folderScriptPre', val);
            }}
          ></ScriptBox>
        </TabPan>
        <TabPan id="5" title="目录公用后执行脚本">
          <div>
            后执行脚本已开启{' '}
            <Switch
              size="small"
              checked={data?.script?.test_switch > 0}
              onChange={(checked) => {
                onChange('folderScriptTestSwitch', checked ? 1 : -1);
              }}
            />
          </div>
          <ScriptBox
            scriptType="after"
            value={data?.script?.test}
            onChange={(val) => {
              onChange('folderScriptTest', val);
            }}
          ></ScriptBox>
        </TabPan>
      </Tabs>
    </div>
  );
};

export default FolderManage;
