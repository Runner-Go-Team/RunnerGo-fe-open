import React, { useCallback, useEffect, useRef, useState } from 'react'
import './index.less';
import { Input } from '@arco-design/web-react';
import { Button, Message, Select } from 'adesign-react';
import JsonSchema from '@components/JsonSchema';
import {
  Beautify as BeautifySvg,
  Refresh2 as RefreshSvg,
} from 'adesign-react/icons';
import { Add as AddSvg } from 'adesign-react/icons';
import MonacoEditor from '@components/MonacoEditor';
import SchemaSvg from '@assets/mock/schema.svg';
import YuanShenSvg from '@assets/mock/yuanshen.svg';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { getExpectNew } from '@constants/baseCollection';
import NewExpectModal from './newExpectModal';
import { EXPECT_CONTENT_TYPE } from '@constants/expect';
import ConditionTable from './conditionTable';
import produce from 'immer';
import { cloneDeep, debounce, isArray, isEmpty, isFunction, isObject, isPlainObject, isString, set, trim } from 'lodash';
import { EditFormat, isJSON, parseModelToJsonSchema } from '@utils';
import MockSchema from 'apipost-mock-schema';
const Option = Select.Option;

const MockExpectPanel = (props) => {
  const { value, onChange } = props;
  const { t } = useTranslation();
  const [modalShow, setModalShow] = useState(false);
  const [currentExpectId, setCurrentExpectId] = useState('');
  const [currentExpect, setCurrentExpect] = useState({});
  const [responseType, setResponseType] = useState('visualization'); // protogenesis
  const monacoRef = useRef(null);
  useEffect(() => {
    if (currentExpectId !== '') {
      const item = value.find((i) => i?.expect_id == currentExpectId);
      if (item && item != undefined && isPlainObject(item)) {
        setCurrentExpect(item);
      }
    } else {
      setCurrentExpect({});
    }
  }, [currentExpectId, value]);
  useEffect(() => {
    if (isArray(value) && value.length > 0 && currentExpectId == '') {
      setCurrentExpectId(value[0]?.expect_id || '');
    }
  }, [value])

  const updateCurrentExpectId = (id) => {
    setCurrentExpectId(id);
  }

  const addExpect = useCallback((newExpect) => {
    const newData = produce(value, (draft) => {
      draft.push(newExpect);
    });
    onChange(newData);
  }, [value]);

  const removeExpect = useCallback((expect_id) => {
    const newData = produce(value, (draft) => {
      const index = draft.findIndex(item => item?.expect_id == expect_id)
      if (index >= 0) {
        draft.splice(index, 1);
      }
    });
    onChange(newData);
    // 更改当前选中的期望id
    if (currentExpectId == expect_id) {
      if (isString(newData?.[0]?.expect_id)) {
        updateCurrentExpectId(newData[0].expect_id);
      } else {
        updateCurrentExpectId('');
      }
    }
  }, [value, currentExpectId, setCurrentExpectId]);

  const updateExpect = useCallback((path, newVal) => {
    if (path == 'name' && trim(newVal).length <= 0) {
      Message('error', t('mock.expect_name_cannot_null'))
      return;
    }
    const newData = produce(value, (draft) => {
      const todo = draft.find((todo) => todo.expect_id === currentExpectId);
      if (todo != undefined) {
        set(todo, path, newVal)
      }
    });
    onChange(newData);
  }, [value, currentExpectId]);
  const onNewExpectSumbit = (data) => {
    if (!data?.name || trim(data.name).length <= 0) {
      Message('error', t('mock.expect_name_cannot_null'))
      return
    }
    const newExpect = getExpectNew();
    newExpect.name = trim(data.name);
    newExpect.response.content_type = data?.type || 'json';
    addExpect(newExpect);
    setModalShow(false);
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
          const newData = produce(value, (draft) => {
            const todo = draft.find((todo) => todo.expect_id === currentExpectId);
            if (todo != undefined) {
              todo.response.json_schema = JSON.stringify(dataModel);
              todo.response.json = beautifyText;
            }
          });
          onChange(newData);
          // updateExpect('response.raw', beautifyText);
        }
      })
      .catch((err) => {
        const newData = produce(value, (draft) => {
          const todo = draft.find((todo) => todo.expect_id === currentExpectId);
          if (todo != undefined) {
            todo.response.json_schema = JSON.stringify(dataModel);
            todo.response.json = '';
          }
        });
        onChange(newData);
      });
  };
  const handleGenerateResult = () => {
    let schemaObj = { type: 'object' };
    if (isJSON(currentExpect?.response?.json_schema)) {
      schemaObj = JSON.parse(currentExpect.response.json_schema);
    }
    if (!isPlainObject(schemaObj)) {
      return;
    }
    handleViewSchemaText(schemaObj);
  };
  const onJsonSchemaChange = (newVal) => {
    try {
      const textSchema = JSON.stringify(newVal);
      updateExpect('response.json_schema', textSchema);
      handleViewSchemaText(newVal);
    } catch (error) { }
  }
  const handleBeautify = () => {
    if (isFunction(monacoRef?.current?.formatEditor)) {
      monacoRef.current.formatEditor();
    }
  };
  const responseRawRender = () => {
    if (currentExpect?.response?.content_type == 'json') {
      if (responseType === 'protogenesis') {
        return (<div className='protogenesis-body'>
          <div className='protogenesis-header'>
            <Button onClick={handleGenerateResult}>
              <RefreshSvg width={16} />
              <>点击更新</>
            </Button>
            <Button onClick={handleBeautify}>
              <BeautifySvg width={16} />
              <>美化</>
            </Button>
          </div>
          <MonacoEditor
            ref={monacoRef}
            value={currentExpect?.response?.json || ''}
            style={{ minHeight: '100%' }}
            Height="200px"
            language="json"
            onChange={(val) => {
              updateExpect('response.json', val);
            }}
          />
        </div>)
      } else if (responseType === 'visualization') {
        return (
          <JsonSchema
            value={isJSON(currentExpect?.response?.json_schema) ? JSON.parse(currentExpect.response.json_schema) : { type: 'object' }}
            onChange={onJsonSchemaChange}
            isRequired={false}
          />
        )
      }
    } else {
      return (<MonacoEditor
        value={currentExpect?.response?.raw || ''}
        style={{ minHeight: '100%' }}
        Height="200px"
        language="json"
        onChange={(val) => {
          updateExpect('response.raw', val);
        }}
      />)
    }
  }
  return (
    <>
      {modalShow && <NewExpectModal onSumbit={onNewExpectSumbit} onCancel={() => setModalShow(false)} />}
      <div className='mock-expects-panel'>
        <div className="expects-header">
          {isArray(value) && value.length > 0 && (<div className="expect-list">
            {value.map((item) => (
              <div
                onClick={() => setCurrentExpectId(item?.expect_id)}
                className={cn("expect-item", {
                  'text-ellipsis': true,
                  active: item?.expect_id === currentExpectId
                })} key={item?.expect_id}>
                {item?.name}
                <AddSvg onClick={(e) => {
                  e.stopPropagation();
                  removeExpect(item?.expect_id)
                }} width={15} />
              </div>
            ))}
          </div>)
          }
          <Button onClick={() => setModalShow(true)}><AddSvg style={{ width: '16px' }} /> {t('mock.create_expect')}</Button>
        </div>
        {isPlainObject(currentExpect) && !isEmpty(currentExpect) && (
          <div className="expects-content">
            <div className="expect-info">
              <label>{t('apis.dbDiyName')}：</label>
              <Input maxLength={30} value={currentExpect?.name || ''} placeholder={t('mock.create_ecpect_input_placeholder')} onChange={(val) => updateExpect('name', val)} />
              <label>{t('mock.content_format')}：</label>
              <Select value={currentExpect?.response?.content_type || 'json'} onChange={(val) => updateExpect('response.content_type', val)}>
                {EXPECT_CONTENT_TYPE.map((item) => <Option key={item} value={item}>
                  {item}
                </Option>)}
              </Select>
            </div>
            {isArray(currentExpect?.conditions) && (
              <div className="expect-conditions">
                <div className="condition-header">{t('mock.conditional_statement')}</div>
                <ConditionTable value={currentExpect?.conditions} onChange={(val) => updateExpect("conditions", val)} />
              </div>
            )}
            <div className="expect-response">
              <div className="response-header">{t('mock.return_data')} </div>
              {currentExpect?.response?.content_type == 'json' && (
                <div className='response-tabs'>
                  <div
                    onClick={() => setResponseType('visualization')}
                    className={cn('response-tabs-item', {
                      active: responseType === 'visualization'
                    })}><SchemaSvg />{t('mock.visual_structure')}</div>
                  <div
                    onClick={() => setResponseType('protogenesis')}
                    className={cn('response-tabs-item', {
                      active: responseType === 'protogenesis'
                    })}><YuanShenSvg />{t('mock.native_mode')}</div>
                </div>
              )}
              <div className='response-raw'>
                {responseRawRender()}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
export default MockExpectPanel;