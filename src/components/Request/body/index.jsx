import React, { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Input, Table, Switch, Select, Radio, Button } from 'adesign-react';
import {
  Delete as DeleteSvg,
  Export as ExportSvg,
  Beautify as BeautifySvg,
  Simplify as SimplifySvg,
} from 'adesign-react/icons';
import { dataItem, newDataItem } from '@constants/dataItem';
import AutoSizeTextArea from '@components/AutoSizeTextArea';
import DescChoice from '@components/descChoice';
import isArray from 'lodash/isArray';
import Bus from '@utils/eventBus';
import InputSelectFile from '@components/InputSelectFile';
import { BODYTYPELIST, INPUTTYPELIST } from '@constants/typeList';
import isFunction from 'lodash/isFunction';
import { isArrayLikeObject, isString, trim } from 'lodash';
import ApiInput from '@components/ApiInput';
import Importexport from '../importExport';
import Example from '../../Example';
import { MODE, RAWMODE } from '../constant';
import './body.less';
import { useTranslation } from 'react-i18next';

const Option = Select.Option;

const RadioGroup = Radio.Group;

const Body = (props) => {
  const readonly = useSelector((store) => store?.user?.readonly);
  const { value, onChange, direction = 'horizontal', defaultHideTable = false } = props;
  const { t } = useTranslation();

  const refRequest = useRef(null);
  const { config } = useSelector((d) => d?.user);
  const { APIS_TAB_DIRECTION } = config || {};

  const renderBodyTabSelect = () => {
    if (APIS_TAB_DIRECTION > 0) {
      return (
        <Select
          style={{ flexShrink: 0 }}
          value={
            ['none', 'urlencoded', 'form-data'].includes(value?.mode || MODE.none)
              ? value?.mode || MODE.none
              : 'raw'
          }
          className="select-body-method"
          onChange={(e) => {
            let mode = e;
            if (e && e === 'raw') {
              mode = 'json';
            }
            onChange('bodyMode', mode);
          }}
        >
          {Object.keys(MODE)?.map((d) => (
            <Option key={d} value={d}>
              {MODE[d]}
            </Option>
          ))}
        </Select>
      );
    }
    return (
      <RadioGroup
        value={
          ['none', 'urlencoded', 'form-data'].includes(value?.mode || MODE.none)
            ? value?.mode || MODE.none
            : 'raw'
        }
        onChange={(e) => {
          let mode = e;
          if (e && e === 'raw') {
            mode = 'json';
          }
          onChange('bodyMode', mode);
        }}
      >
        {Object.keys(MODE).map((k) => (
          <Radio value={k} key={k}>
            {MODE[k]}
          </Radio>
        ))}
      </RadioGroup>
    );
  };
  const handleChange = (rowData, rowIndex, newVal) => {
    const newList = isArray(value?.parameter) ? [...value.parameter] : [];
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
    // key和value都是空的数据不要
    onChange('bodyParameter', [...newList.filter(item => item.key.trim().length > 0 || item.value.trim().length > 0)]);
  };

  const handleTableDelete = (index) => {
    const newList = isArray(value?.parameter) ? [...value.parameter] : [];
    if (newList.length > 0) {
      newList.splice(index, 1);
      onChange('bodyParameter', [...newList]);
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
          checked={text === '1' || text === 1}
          disabled={readonly == 1}
          onChange={(e) => {
            handleChange(rowData, rowIndex, { is_checked: e ? 1 : 2 });
          }}
        />
      ),
    },
    {
      title: t('apis.key'),
      dataIndex: 'key',
      enableResize: true,
      width: 220,
      render: (text, rowData, rowIndex) => {
        if (value.mode === 'form-data') {
          return (
            <Input
              placeholder={t('apis.key')}
              className="request-key"
              value={text}
              readonly={readonly == 1}
              afterFix={
                <Select
                  style={{ flexShrink: 0 }}
                  value={rowData?.type || 'Text'}
                  className="select-filetype"
                  disabled={readonly == 1}
                  onChange={(newVal) => {
                    if (rowData?.type !== newVal) {
                      handleChange(rowData, rowIndex, { type: newVal, value: '' });
                    } else {
                      handleChange(rowData, rowIndex, { type: newVal });
                    }
                  }}
                >
                  {INPUTTYPELIST?.map((d) => (
                    <Option key={d} value={d}>
                      {d}
                    </Option>
                  ))}
                </Select>
              }
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
        }
        return (
          <Input
            placeholder={t('apis.key')}
            value={text}
            readonly={readonly == 1}
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
      title: t('apis.value'),
      dataIndex: 'value',
      enableResize: true,
      width: 150,
      render: (text, rowData, rowIndex) => {
        if (rowData?.type === 'File' && value?.mode === 'form-data') {
          return (
            <InputSelectFile
              value={text}
              multiple
              onChange={(files) => {
                let val = '';
                if (isArrayLikeObject(files) && files.length > 0) {
                  const fileBase64 = [];
                  const arr = Array.from(files).map((item) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(item);
                    reader.onload = function (e) {

                      fileBase64.push(e?.target?.result);
                      handleChange(rowData, rowIndex, {
                        value: val,
                        fileBase64,
                      });
                    };
                    return item.name;
                  });
                  val = arr.join('|');
                  handleChange(rowData, rowIndex, { value: val });
                } else {
                  handleChange(rowData, rowIndex, { value: val, fileBase64: [] });
                }
              }}
            />
          );
        }
        return (
          <Input
            placeholder={t('placeholder.bodyValue')}
            value={text}
            onChange={(newVal) => {
              handleChange(rowData, rowIndex, { value: newVal });
            }}
          />
        );
      },
    },
    // {
    //   title: t('apis.must'),
    //   dataIndex: 'not_null',
    //   width: 55,
    //   render: (text, rowData, rowIndex) => {
    //     return (
    //       <Switch
    //         size="small"
    //         checked={text > 0}
    //         onChange={(e) => {
    //           handleChange(rowData, rowIndex, { not_null: e ? 1 : 2 });
    //         }}
    //       />
    //     );
    //   },
    // },
    // {
    //   title: t('apis.type'),
    //   dataIndex: 'type',
    //   enableResize: false,
    //   width: 100,
    //   render: (text, rowData, rowIndex) => {
    //     return (
    //       <Select
    //         size="mini"
    //         style={{ width: '100%' }}
    //         value={BODYTYPELIST.includes(rowData?.field_type) ? rowData?.field_type : 'String'}
    //         disabled={readonly == 1}
    //         onChange={(newVal) => {
    //           if (newVal === 'Text') {
    //             handleChange(rowData, rowIndex, { fileBase64: [] });
    //           }
    //           handleChange(rowData, rowIndex, { field_type: newVal });
    //         }}
    //       >
    //         {BODYTYPELIST.map((item) => (
    //           <Option key={item} value={item}>
    //             {item}
    //           </Option>
    //         ))}
    //       </Select>
    //     );
    //   },
    // },
    {
      title: t('apis.desc'),
      dataIndex: 'description',
      render: (text, rowData, rowIndex) => {
        return (
          <Input
            placeholder={t('placeholder.bodyDesc')}
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
        );
      },
    },
    // {
    //   title: '',
    //   width: 30,
    //   render: (text, rowData, rowIndex) => (
    //     <div>
    //       <DescChoice
    //         onChange={(newVal) => {
    //           handleChange(rowData, rowIndex, { description: newVal });
    //         }}
    //         filterKey={rowData?.key}
    //       ></DescChoice>
    //     </div>
    //   ),
    // },
    {
      title: '',
      width: 30,
      render: (text, rowData, rowIndex) => (
        <Button
          disabled={readonly == 1}
          onClick={() => {
            handleTableDelete(rowIndex);
          }}
        >
          <DeleteSvg style={{ width: 16, height: 16 }} />
        </Button>
      ),
    },
  ];
  const tableDataList = useMemo(() => {
    let headerParameter = isArray(value?.parameter) ? [...value.parameter] : [];
    if (value.hasOwnProperty('parameter') && isArray(value.parameter)) {
      const hasStatic = value?.parameter.some((item) => item.static);
      if (!hasStatic) {
        headerParameter = [...value?.parameter, { ...dataItem }];
      } else {
        headerParameter = [...value?.parameter];
      }
    } else {
      headerParameter = [{ ...dataItem }];
    }
    return headerParameter;
  }, [value, value?.parameter]);

  return (
    <div className="apipost-req-wrapper">
      <div className="apipost-req-wrapper-body">
        <div className="body-type">
          {renderBodyTabSelect()}
          {!['none', 'urlencoded', 'form-data'].includes(value?.mode || MODE.none) && (
            <Select
              value={value?.mode || 'json'}
              onChange={(val) => {
                onChange('bodyMode', val);
              }}
            >
              {Object.keys(RAWMODE).map((k) => {
                return (
                  <Option key={k} value={k}>
                    {RAWMODE[k]}
                  </Option>
                );
              })}
            </Select>
          )}
          <div style={{ flex: 1 }}></div>
          {!['none', 'urlencoded', 'form-data'].includes(value?.mode || MODE.none) && (
            <div className="api-example-header" style={{ userSelect: 'none' }}>
              {/* {readonly != 1 && (
                <Button
                  onClick={() => {
                    if (isFunction(refRequest?.current?.extractData))
                      refRequest.current.extractData();
                  }}
                >
                  <ExportSvg width={16} />
                  <>提取字段和描述</>
                </Button>
              )} */}
              <Button
                onClick={() => {
                  if (isFunction(refRequest?.current?.butifyFormatJson))
                    refRequest.current.butifyFormatJson();
                }}
              >
                <BeautifySvg width={16} />
                <>{t('btn.beautify')}</>
              </Button>
              <Button
                onClick={() => {
                  if (isFunction(refRequest?.current?.simplifyJson))
                    refRequest.current.simplifyJson();
                }}
              >
                <SimplifySvg width={16} />
                <>{t('btn.simplify')}</>
              </Button>
            </div>
          )}
        </div>
        {false && (
          <Importexport data={[...value?.parameter]} type="bodyParameter" onChange={onChange} />
        )}
      </div>
      {value?.mode === 'none' && <div className="body-none">{t('apis.emptyBody')}</div>}
      {['urlencoded', 'form-data'].includes(value?.mode) && (
        <Table hasPadding={false} showBorder columns={columns} data={tableDataList} />
      )}
      {!['none', 'urlencoded', 'form-data'].includes(value?.mode || MODE.none) && (
        <>
          <Example
            direction={direction}
            defaultHideTable={defaultHideTable}
            ref={refRequest}
            data={{
              raw: value?.raw || '',
              parameter: value?.raw_para || [],
            }}
            onChange={(type, val) => {
              if (type === 'Raw') {
                onChange('bodyRaw', val);
              } else if (type === 'Parameter') {
                onChange('bodyRawPara', val);
              }
            }}
          ></Example>
        </>
      )}
    </div>
  );
};

export default Body;