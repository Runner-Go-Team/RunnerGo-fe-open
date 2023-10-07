import { Button, Checkbox, Input, InputNumber, Message, Modal, Select, Switch, Tooltip, Upload } from '@arco-design/web-react';
import { Button as ApipoitButton } from 'adesign-react';
import React, { useRef, useState } from 'react'
import cn from 'classnames';
import SchemaSvg from '@assets/mock/schema.svg';
import YuanShenSvg from '@assets/mock/yuanshen.svg';
import MonacoEditor from '@components/MonacoEditor';
import JsonSchema from '@components/JsonSchema';
import axios from "axios";
import OSS from 'ali-oss';
import { v4 } from 'uuid';
import { RD_FileURL, OSS_Config, USE_OSS } from '@config';
import PreviewFile from '@modals/PreviewFile';
import {
  Beautify as BeautifySvg,
  Refresh2 as RefreshSvg,
} from 'adesign-react/icons';
import JsonFileSvg from '@assets/img/jsonFile.svg';
import NotJsonFileSvg from '@assets/img/notJsonFile.svg';
import SettingsAndAsserts from '../SettingsAndAsserts';
import { useTranslation } from 'react-i18next';
import { EditFormat, isJSON, parseModelToJsonSchema } from '@utils';
import MockSchema from 'apipost-mock-schema';
import { cloneDeep, isArray, isFunction, isObject, isPlainObject } from 'lodash';
import './index.less';
import { IconDelete, IconDownload, IconEye, IconImport, IconPlus, IconQuestionCircle } from '@arco-design/web-react/icon';
import { str2testData } from '@utils';

const Option = Select.Option;
const TextArea = Input.TextArea;
const ForLoop = (props) => {
  const { data, onChange } = props;
  const { t } = useTranslation();
  console.log(data, "OpenPagepropsdata");
  const for_loop = data?.action_detail?.for_loop || {};

  const fileList = for_loop?.files || [];
  // 是否显示预览文件的弹窗
  const [showPreview, setPreview] = useState(false);
  // 预览的文件内容
  const [previewData, setPreviewData] = useState([]);
  // 预览的文件类型
  const [fileType, setFileType] = useState('');
  const [content_type, setContent_type] = useState('visualization');
  const types = {
    for_times: '循环次数',
    for_data: '循环数据'
  }
  const loopCollections = {
    JSON: 'JSON',
    String: 'String'
  }
  const handleViewSchemaText = async (dataModel) => {
    const schema = await parseModelToJsonSchema(dataModel, []);
    const schemaData = cloneDeep(schema);
    if (!isObject(schemaData)) {
      return;
    }
    new MockSchema()
      .mock(schemaData)
      .then((mockData) => {
        if (isObject(mockData)) {
          const beautifyText = EditFormat(JSON.stringify(mockData)).value;
          for_loop.loop_collection.json_schema = JSON.stringify(dataModel);
          for_loop.loop_collection.content = beautifyText;

          onChange({ ...data, action_detail: { for_loop } })
          // updateExpect('response.raw', beautifyText);
        }
      })
      .catch((err) => {
        for_loop.loop_collection.json_schema = JSON.stringify(dataModel);
        for_loop.loop_collection.content = '';

        onChange({ ...data, action_detail: { for_loop } })
      });
  };
  const handleGenerateResult = () => {
    let schemaObj = { type: 'object' };
    if (isJSON(for_loop?.loop_collection?.json_schema)) {
      schemaObj = JSON.parse(for_loop.loop_collection.json_schema);
    }
    if (!isPlainObject(schemaObj)) {
      return;
    }
    handleViewSchemaText(schemaObj);
  };
  const handleBeautify = () => {
    if (isFunction(monacoRef?.current?.formatEditor)) {
      monacoRef.current.formatEditor();
    }
  };
  const onJsonSchemaChange = (newVal) => {
    try {
      const textSchema = JSON.stringify(newVal);
      for_loop.loop_collection.json_schema = textSchema;
      onChange({ ...data, action_detail: { for_loop } })
      handleViewSchemaText(newVal);
    } catch (error) { }
  }
  const monacoRef = useRef(null);
  const responseRawRender = () => {
    if (content_type === 'protogenesis') {
      return (<div className='protogenesis-body'>
        <div className='protogenesis-header'>
          <ApipoitButton onClick={handleGenerateResult}>
            <RefreshSvg width={16} />
            <>点击更新</>
          </ApipoitButton>
          <ApipoitButton onClick={handleBeautify}>
            <BeautifySvg width={16} />
            <>美化</>
          </ApipoitButton>
        </div>
        <MonacoEditor
          ref={monacoRef}
          value={for_loop?.loop_collection?.content || ''}
          style={{ minHeight: '100%' }}
          Height="200px"
          language="json"
          onChange={(val) => {
            for_loop.loop_collection.content = val;
            onChange({ ...data, action_detail: { for_loop } })
          }}
        />
      </div>)
    } else if (content_type === 'visualization') {
      return (
        <JsonSchema
          value={isJSON(for_loop?.loop_collection?.json_schema) ? JSON.parse(for_loop.loop_collection.json_schema) : { type: 'object' }}
          onChange={onJsonSchemaChange}
          isRequired={false}
          hideNull={true}
          showDescription={false}
        />
      )
    }
  }

  // 预览文件
  const previewFile = async (url) => {
    const result = await fetch(url);
    const file = await result.blob();

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = reader.result;

      const testData = str2testData(text);

      setPreviewData(testData.length > 0 ? testData : text);
      setFileType(testData.length > 0 ? 'csv' : 'txt');
      setPreview(true);
    };

    reader.readAsText(file);
  };

  // 下载文件
  const downloadFile = async (name, url) => {
    const result = await fetch(url);
    const file = await result.blob();
    let a = document.createElement('a');
    let _url = window.URL.createObjectURL(file);
    let filename = name;
    a.href = _url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(_url);
    document.body.removeChild(a);
  };

  // 删除文件
  const deleteFile = (item, index) => {
    for_loop.files.splice(index, 1);
    if (for_loop.files.length > 1 && item?.mark) {
      for_loop.files[0].mark = true
    }
    onChange({ ...data, action_detail: { for_loop } })
  };

  // 上传文件
  const uploadFile = async (fileLists, files) => {
    const { status } = files;
    if (status === 'done') {
      if (USE_OSS) {
        if (!OSS_Config.region || !OSS_Config.accessKeyId || !OSS_Config.accessKeySecret || !OSS_Config.bucket) {
          Message.error(t('message.setOssConfig'));
          return;
        }
      }

      const fileMaxSize = 1024 * 10;
      const fileType = ['csv', 'txt'];
      const { originFile: { size, name } } = files;
      const nameType = name.split('.')[1];

      if (fileList.filter(item => item.name === name).length > 0) {
        Message.error(t('message.filenameRepeat'));
        return;
      }

      // if (fileLists.length === 5) {
      //     Message.error(t('message.maxFileNum'));
      //     return;
      // }
      if (size / 1024 > fileMaxSize) {
        Message.error(t('message.maxFileSize'));
        return;
      };
      if (!fileType.includes(nameType)) {
        Message.error(t('message.FileType'));
        return;
      }

      let url = '';
      let res = null;

      if (USE_OSS) {
        const client = new OSS(OSS_Config);
        res = await client.put(
          `kunpeng/test/${v4()}.${nameType}`,
          files.originFile,
        );
        const { name: res_name, url: res_url } = res;

        url = res_url;
      } else {
        let formData = new FormData();
        formData.append('file', files.originFile);

        res = await axios.post(`${RD_FileURL}/api/upload`, formData);
        const res_url = `${RD_FileURL}/${res.data[0].filename}`;

        url = res_url;
      }
      const markArr = for_loop.files.filter(i => i.mark) || [];

      for_loop.files.push({ url, name, file_type: 0, mark: markArr.length > 0 ? false : true, status: 1 });

      onChange({ ...data, action_detail: { for_loop } })
    }
  };

  const updateFileType = (type, index) => {
    try {
      for_loop.files[index].file_type = type ? 0 : 1;

      onChange({ ...data, action_detail: { for_loop } })
    } catch (error) { }
  }
  const editCheckFile = (index, status) => {
    try {
      for_loop.files[index].status = status;

      onChange({ ...data, action_detail: { for_loop } })
    } catch (error) { }
  }

  const checkFileMark = (index) => {
    try {
      for_loop.files.filter((item, i) => {
        if (index == i) {
          for_loop.files[index].mark = true;
        } else {
          for_loop.files[i].mark = false;
        }
      })

      onChange({ ...data, action_detail: { for_loop } })
    } catch (error) { }
  }

  return (
    <>
      <div className='runnerGo-card-special'>
        <div className='runnerGo-card-special-item'>
          <label><span className='required'>*</span>循环方式</label>
          <div className="content">
            <Select
              placeholder='Please select'
              style={{ width: '100%' }}
              onChange={(val) => {
                for_loop.type = val;
                onChange({ ...data, action_detail: { for_loop } })
              }}
              value={for_loop?.type || 'for_times'}
            >
              {Object.keys(types).map(key => (
                <Option key={key} value={key}>
                  {types[key]}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        {for_loop?.type == 'for_times' && (
          <>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>循环次数</label>
              <div className="content">
                <InputNumber
                  placeholder='请输入循环次数'
                  min={1}
                  max={20}
                  style={{ width: '100%', height: '38px' }}
                  value={for_loop?.count || 1}
                  onChange={(val) => {
                    for_loop.count = val;
                    onChange({ ...data, action_detail: { for_loop } })
                  }}
                />
              </div>
            </div>
            {/* <div className='runnerGo-card-special-item'>
              <label>key变量名</label>
              <div className="content">
                <Input value={for_loop?.loop_count?.key || ''} onChange={(val) => {
                  for_loop.loop_count.key = val;
                  onChange({ ...data, action_detail: { for_loop } })
                }} style={{ width: '100%', height: 38 }} placeholder={'填写key变量名'} />
              </div>
            </div> */}
          </>
        )}
        <div className='runnerGo-card-special-item'>
          <label>上传文件
            <Tooltip position='top' trigger='hover' content={'支持添加10M以内的csv、txt文件上传csv、txt格式文件中包含中文字符时, 需将文件格式改成UTF-8编码'}>
              <IconQuestionCircle />
            </Tooltip> </label>
          <div className="content">
            <Upload
              multiple={true}
              showUploadList={false}
              onChange={uploadFile}
              customRequest={(option) => {
                const { file, onSuccess } = option;
                onSuccess({ file });
              }}
              style={{ width: '100%' }}
            >
              <Button className='add-file-btn' icon={<IconPlus />}>点击上传</Button>
            </Upload>
            <div className='file-list'>
              {
                isArray(fileList) && fileList.length > 0 && fileList.map((item, index) => (
                  <>
                    <div onClick={() => checkFileMark(index)} className={cn('file-list-item', {
                      mark: item?.mark
                    })} key={index}>
                      <div className='file-list-item-left'>
                        {/* <Switch size='small' checked={item.status === 1} onChange={(e) => editCheckFile(index, e ? 1 : 2)} /> */}
                      </div>
                      <Tooltip position='top' trigger='hover' content={'以该文件中的数据行数作为循环次数；如该文件有10条数据则循环10次'}>
                        <div className='file-list-item-middle'>
                          {item.name}
                        </div>
                      </Tooltip>
                      <div className='file-list-item-right' onMouseEnter={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}>

                        <Tooltip position='top' trigger='hover' content={item?.file_type == 1 ? '取消标识' : '标识该文件里的数据为JSON格式'}>
                          {item?.file_type == 1 ? <JsonFileSvg onClick={() => updateFileType(item?.file_type, index)} /> : <NotJsonFileSvg onClick={() => updateFileType(item?.file_type, index)} />}
                        </Tooltip>
                        <Tooltip position='top' trigger='hover' content={'预览文件'}>
                          <IconEye onClick={() => previewFile(item.url)} />
                        </Tooltip>
                        <Tooltip position='top' trigger='hover' content={'下载文件'}>
                          <IconDownload onClick={() => downloadFile(item.name, item.url)} />
                        </Tooltip>
                        <Tooltip position='top' trigger='hover' content={'删除文件'}>
                          <IconDelete className='delete' onClick={() => deleteFile(item, index)} />
                        </Tooltip>
                      </div>
                    </div>
                  </>

                ))
              }
            </div>

          </div>
        </div>
        {/* {for_loop?.type == 'for_data' && (
          <>
            <div className='runnerGo-card-special-item'>
              <label>key变量名</label>
              <div className="content">
                <Input value={for_loop?.loop_count?.key || ''} onChange={(val) => {
                  for_loop.loop_count.key = val;
                  onChange({ ...data, action_detail: { for_loop } })
                }} style={{ width: '100%', height: 38 }} placeholder={'填写key变量名'} />
              </div>
            </div>
            <div className='runnerGo-card-special-item'>
              <label>value变量名</label>
              <div className="content">
                <Input value={for_loop?.loop_count?.key || ''} onChange={(val) => {
                  for_loop.loop_count.key = val;
                  onChange({ ...data, action_detail: { for_loop } })
                }} style={{ width: '100%', height: 38 }} placeholder={'填写value变量名'} />
              </div>
            </div>
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>集合类型</label>
              <div className="content">
                <Select
                  placeholder='Please select'
                  style={{ width: '100%' }}
                  onChange={(val) => {
                    for_loop.loop_collection.collection_type = val;
                    onChange({ ...data, action_detail: { for_loop } })
                  }}
                  value={for_loop?.loop_collection?.collection_type || 'JSON'}
                >
                  {Object.keys(loopCollections).map(key => (
                    <Option key={key} value={key}>
                      {loopCollections[key]}
                    </Option>
                  ))}
                </Select>
                {for_loop?.loop_collection?.collection_type == 'String' && (
                  <TextArea placeholder='请输入' style={{ minHeight: 64, width: '100%', marginTop: '10px' }} />
                )}
                {for_loop?.loop_collection?.collection_type == 'JSON' && (
                  <>
                    <div className='response-tabs'>
                      <div
                        onClick={() => setContent_type('visualization')}
                        className={cn('response-tabs-item', {
                          active: content_type === 'visualization'
                        })}><SchemaSvg />{t('mock.visual_structure')}</div>
                      <div
                        onClick={() => setContent_type('protogenesis')}
                        className={cn('response-tabs-item', {
                          active: content_type === 'protogenesis'
                        })}><YuanShenSvg />{t('mock.native_mode')}</div>
                    </div>
                    <div className='response-raw'>
                      {responseRawRender()}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )} */}
      </div>
      {showPreview && <PreviewFile fileType={fileType} data={previewData} onCancel={() => setPreview(false)} />}
      <SettingsAndAsserts data={data} onChange={onChange} hiddenAssert={true} hiddenDataWithdraw={true} />
    </>
  )
}
export default ForLoop;