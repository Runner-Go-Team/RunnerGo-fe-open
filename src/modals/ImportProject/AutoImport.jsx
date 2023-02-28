import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Switch, Radio, Input, Select, Message } from 'adesign-react';
import { MODAL_TYPE, IMPORT_INTERVAL, DATA_SOURCES } from '@constants/import';
// import { SourceAutoImport } from '@indexedDB/project';
import { saveSyncProjectApi } from '@services/projects';
import cloneDeep from 'lodash/cloneDeep';
import { v4 as uuidv4 } from 'uuid';
import { isArray, isObject, isPlainObject, isString, trim } from 'lodash';
import useFolders from '@hooks/useFolders';
import Bus from '@utils/eventBus';
import { AutoImportWrapper } from './style';

const RadioGroup = Radio.Group;
const Option = Select.Option;

const AutoImport = (props, ref) => {
  const { CURRENT_PROJECT_ID, onCancel, setLoading, loading, importObj, setImportObj } = props;

  useImperativeHandle(ref, () => ({
    autoImportSave,
    nowImport,
  }));

  const { apiFolders } = useFolders();

  const autoImportSave = () => {
    if (
      isString(importObj?.data_source_url) &&
      trim(importObj.data_source_url).length <= 0 &&
      importObj?.is_open > 0
    ) {
      Message('error', '数据源URL必填');
      return;
    }
    const param = cloneDeep(importObj);
    // param.auto_import_id = uuidv4(); // 添加主键
    param.uuid = localStorage.getItem('uuid') || '-1'; // 用户id
    param.project_id = CURRENT_PROJECT_ID; // 所在项目的id
    param.updated_at = ~~(new Date().getTime() / 1000); // 最后修改时间
    SourceAutoImport.put(param, param.auto_import_id);
    Message('success', '保存成功');
    onCancel();
    saveSyncProjectApi(param).subscribe({
      next: async (resp) => {
        if (resp?.code === 10000) {
        }
      },
    });
    // 执行保存
  };
  const nowImport = async () => {
    if (!loading) {
      Bus.$emit('autoImport', {
        ...importObj,
        project_id: CURRENT_PROJECT_ID,
        uuid: localStorage.getItem('uuid') || '-1',
        callback: () => {
          setLoading(false);
          onCancel();
        },
      });
    }
  };
  useEffect(() => {
    const init = async () => {
    //   const autoImports = await SourceAutoImport.where('project_id')
    //     .anyOf(CURRENT_PROJECT_ID)
    //     .toArray();
    //   let defalutImportObj = {
    //     auto_import_id: uuidv4(),
    //     is_open: -1, // 是否开启
    //     import_interval: 3, // 执行间隔 单位/小时
    //     data_source_format: 'openApi', // 数据源格式
    //     data_source_name: '', // 数据源名字
    //     data_source_url: '', // 数据源地址
    //     folder_id: '0', // 导入目标目录的id
    //     cover_modal: 'urlAndFolder', // 导入接口的覆盖模式 url(同url覆盖)，urlAndFolder(同url同目录覆盖)uniqueUrl(同url不覆盖)，bothUrl（同url保留二者）
    //     is_base_path: -1, // 接口路径是否拼接basePath
    //   };
    //   if (isArray(autoImports) && autoImports.length > 0 && isObject(autoImports[0])) {
    //     defalutImportObj = autoImports[0];
    //   }
    //   setImportObj(defalutImportObj);
    };
    init();
  }, []);

  const folderSelect = () => {
    return (
      <>
        <Select
          defaultValue={importObj?.folder_id || '0'}
          style={{ marginRight: 24 }}
          onChange={(val) => {
            setImportObj((state) => {
              return { ...state, folder_id: val || '0' };
            });
          }}
        >
          <Option key="0" value="0">
            根目录
          </Option>
          {apiFolders
            .filter((i) => (isPlainObject(i) && !i.hasOwnProperty('status')) || i?.status == 1)
            .map((item) => (
              <Option key={item?.target_id} value={item?.target_id}>
                {`|${new Array(item?.level).fill('—').join('')}${item?.name}`}
              </Option>
            ))}
        </Select>
      </>
    );
  };

  return (
    <div className={AutoImportWrapper}>
      <div className="import-switch">
        自动导入
        <Switch
          checked={importObj?.is_open > 0}
          onChange={(val) => {
            setImportObj((state) => {
              return { ...state, is_open: val ? 1 : -1 };
            });
          }}
          size="small"
        ></Switch>
        <span className="prompt">（只有项目拥有者有权限）</span>
      </div>
      {importObj?.is_open > 0 && (
        <>
          <div className="import-flex">
            <div className="import-label">导入频率</div>
            <div>
              <RadioGroup
                value={importObj.hasOwnProperty('import_interval') ? importObj.import_interval : 3}
                onChange={(val) => {
                  setImportObj((state) => ({ ...state, import_interval: val || 0 }));
                }}
              >
                {IMPORT_INTERVAL.map((item) => (
                  <Radio key={item.id} value={item.id}>
                    {item.name}
                  </Radio>
                ))}
              </RadioGroup>
            </div>
          </div>
          <div className="import-flex">
            <div className="import-label">数据源格式</div>
            <div>
              <RadioGroup
                value="openApi"
                onChange={(val) => {
                }}
              >
                {DATA_SOURCES.map((item) => (
                  <Radio key={item.id} value={item.id}>
                    {item.name}
                  </Radio>
                ))}
              </RadioGroup>
            </div>
          </div>
          <div className="import-flex">
            <div className="import-label">数据源名称</div>
            <Input
              value={importObj?.data_source_name || ''}
              onChange={(val) => {
                setImportObj((state) => ({ ...state, data_source_name: val || '' }));
              }}
              size="small"
            />
          </div>
          <div className="import-flex">
            <div className="import-mandatory">*</div>
            <div className="import-label">数据源URL</div>
            <Input
              value={importObj?.data_source_url || ''}
              onChange={(val) => {
                setImportObj((state) => ({ ...state, data_source_url: val || '' }));
              }}
              size="small"
            />
          </div>
          <div className="import-setting">
            <div className="setting-title">设置</div>
            <div className="setting-select-wrapper">
              <div className="select-label">导入到目录</div>
              {folderSelect()}
              <div className="select-label">接口覆盖模式</div>
              <Select
                value={importObj?.cover_modal || ''}
                onChange={(val) => {
                  setImportObj((state) => ({ ...state, cover_modal: val || 'urlAndFolder' }));
                }}
              >
                {MODAL_TYPE.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="settin-basepath">
              接口路径加上basePath
              <Switch
                checked={importObj?.is_base_path > 0}
                onChange={(val) => {
                  setImportObj((state) => {
                    return { ...state, is_base_path: val ? 1 : -1 };
                  });
                }}
                size="small"
              ></Switch>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default forwardRef(AutoImport);
