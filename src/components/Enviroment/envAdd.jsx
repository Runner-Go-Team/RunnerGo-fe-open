import React, { useMemo, useState } from 'react';
import { Modal, Card, Table, Input, Button, Message } from 'adesign-react';
import { HelpDoc as HelpDocSvg, Delete as DeleteSvg } from 'adesign-react/icons';
// import { IEnvDataItem, IEnv } from '@models/project/env';
import cloneDeep from 'lodash/cloneDeep';
import { v4 as uuidV4 } from 'uuid';
import { openUrl } from '@utils';
import { EnvModalWrapper } from './style';
import { defaultDataItem, defaultEmptyEnv } from './constant';
import useEnvs from './hooks/useEnv';

const EnvAddModal = (props) => {
  const { onCancel } = props;

  const { saveEnvs } = useEnvs({});

  const [envData, setEnvData] = useState(defaultEmptyEnv);
  const [envList, setEnvList] = useState([defaultDataItem]);
  const env_id = useMemo(() => {
    return uuidV4();
  }, []);

  // 修改tableItem
  const handleItemChange = (newVal, filedKey, index) => {
    const newList = cloneDeep(envList);
    newList[index][filedKey] = newVal;
    if (filedKey === 'value') {
      newList[index].current_value = newVal;
    }
    if (index === newList.length - 1 && filedKey !== 'is_checked') {
      newList.push(cloneDeep(defaultDataItem));
    }
    setEnvList(newList);
  };

  // 删除table Item
  const handleDeleteItem = (index) => {
    const newList = cloneDeep(envList);
    if (newList.length === 1 || index === newList.length - 1) {
      return;
    }
    newList.splice(index, 1);
    setEnvList(newList);
  };

  const handleEnvChange = (key, value) => {
    const newEnv = cloneDeep(envData);
    newEnv[key] = value;
    setEnvData(newEnv);
  };

  const handelSaveEnv = () => {
    saveEnvs({
      envData,
      envList,
      env_id,
    });

    onCancel();
  };

  const envColumn = [
    {
      title: '变量名称',
      width: 150,
      dataIndex: 'key',
      enableResize: true,
      render: (text, rowData, rowIndex) => (
        <Input
          size="mini"
          value={text}
          onChange={(newVal) => {
            handleItemChange(newVal, 'key', rowIndex);
          }}
        />
      ),
    },
    {
      title: '变量初始值',
      width: 150,
      dataIndex: 'value',
      enableResize: true,
      render: (text, rowData, rowIndex) => (
        <Input
          size="mini"
          value={text}
          onChange={(newVal) => {
            handleItemChange(newVal, 'value', rowIndex);
          }}
        />
      ),
    },
    {
      title: '变量当前值',
      width: 150,
      dataIndex: 'current_value',
      enableResize: true,
      render: (text, rowData, rowIndex) => (
        <Input
          size="mini"
          value={text}
          onChange={(newVal) => {
            handleItemChange(newVal, 'current_value', rowIndex);
          }}
        />
      ),
    },
    {
      title: '变量描述',
      dataIndex: 'description',
      render: (text, rowData, rowIndex) => (
        <Input
          size="mini"
          value={text}
          onChange={(newVal) => {
            handleItemChange(newVal, 'description', rowIndex);
          }}
        />
      ),
    },
    {
      title: '',
      dataIndex: 'del',
      align: 'center',
      width: 50,
      render: (text, rowData, rowIndex) => (
        <Button onClick={handleDeleteItem.bind(null, rowIndex)}>
          <DeleteSvg style={{ width: 16, height: 16 }} />
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal
        visible
        title="新建环境变量"
        className={EnvModalWrapper}
        onCancel={onCancel}
        footer={
          <div className="env-footer">
            <div
              className="footer-marks"
              onClick={() => {
                openUrl(
                  'https://wiki.apipost.cn/document/00091641-1e36-490d-9caf-3e47cd38bcde/69b2bf9d-57c7-443b-b5c7-bbb5a5ce1f48'
                );
              }}
            >
              <HelpDocSvg /> ApiPost如何设置一个变量?
            </div>
            <div>
              <Button onClick={onCancel}>关闭</Button>
              <Button type="primary" onClick={handelSaveEnv}>
                保存
              </Button>
            </div>
          </div>
        }
      >
        <Card bordered>
          <p>您可以在请求变量或者接口 URL 中引用环境变量，引用方法:{`{{ 变量名 }}`}</p>
          <p>变量初始值:当该变量未在其他地方重新定义（比如预/后执行脚本）时，该变量使用的默认值</p>
          <p>变量当前值:当该变量在其他地方被重新定义（比如预/后执行脚本）时，该变量被定义的新值</p>
        </Card>
        <Input
          placeholder="请输入环境名称"
          value={envData.name}
          onChange={handleEnvChange.bind(null, 'name')}
        />
        <div style={{ marginTop: 8 }}>
          <Input
            placeholder="请输入环境前缀url"
            value={envData.pre_url}
            onChange={handleEnvChange.bind(null, 'pre_url')}
          />
        </div>
        <div className="env-table-wrapper">
          <Table showBorder data={envList} columns={envColumn}></Table>
        </div>
      </Modal>
    </>
  );
};

export default EnvAddModal;
