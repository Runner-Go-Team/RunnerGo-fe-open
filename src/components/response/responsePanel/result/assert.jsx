import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Switch, Select } from 'adesign-react';
import { Cancel as CancelSvg } from 'adesign-react/icons';
import AssertFaild from '@assets/apis/assertfaild.svg';
import AssertSuccess from '@assets/apis/assertsuccess.svg';
import { isArray, isPlainObject, isString, isUndefined } from 'lodash';
import Ajv from 'ajv';
import localize from 'ajv-i18n';
import { isJSON } from '@utils';
import { CheckAndAssertWrapper } from './style';

const Option = Select.Option;
const Assert = (props) => {
  const { data, onChange, tempData, valid, setValid, assert } = props;
  const { response } = tempData || {};

  const [errors, setErrors] = useState([]);
  useEffect(() => {
    try {
      if (
        isPlainObject(data?.response) &&
        isPlainObject(data.response[data?.check_result_expectId || 'success']?.expect)
      ) {
        const expect = data.response[data?.check_result_expectId || 'success'].expect;
        if (
          !isUndefined(expect) &&
          isPlainObject(expect?.schema) &&
          (!data.hasOwnProperty('is_check_result') || data.is_check_result > 0)
        ) {
          const ajv = new Ajv({
            allErrors: true,
            strictSchema: false,
            messages: false,
            meta: false,
            validateSchema: false,
          });
          const validate = ajv.compile(expect.schema);
          let body = {};
          if (isJSON(response?.rawBody)) {
            body = JSON.parse(response.rawBody);
          } else {
            setErrors([{ message: '返回数据格式不是json' }]);
            setValid('error');
            return;
          }
          const newValid = validate(body);
          setValid(newValid ? 'success' : 'error');
          if (!newValid) {
            // ru for Russian instancePath
            localize.zh(validate.errors);
            setErrors(validate.errors || []);
          }
        } else {
          setValid('init');
          setErrors([]);
        }
      } else {
        setValid('init');
        setErrors([]);
      }
    } catch (error) {
    }
  }, [response, data?.response]);
  const expectText = (key) => {
    if (isString(data?.response[key]?.expect?.name)) {
      return `${data.response[key]?.expect?.name || key || ''}(${
        data.response[key]?.expect?.code || ''
      })`;
    }
    if (key === 'success') {
      return `成功(${data.response[key]?.expect?.code || '200'})`;
    }
    if (key === 'error') {
      return `失败(${data.response[key]?.expect?.code || '201'})`;
    }
  };

  return (
    <div className={CheckAndAssertWrapper}>
      <div className="check-result">
        <div className="check-top">
          <Switch
            size="small"
            checked={!data.hasOwnProperty('is_check_result') || data.is_check_result > 0}
            onChange={(val) => {
              onChange('is_check_result', val ? 1 : -1);
            }}
          />
          <div className="assert-title">校验返回结果</div>
          {isPlainObject(data?.response) && Object.keys(data.response).length > 0 && (
            <Select
              value={
                data.hasOwnProperty('check_result_expectId') &&
                data.check_result_expectId.length > 0
                  ? data.check_result_expectId
                  : 'success'
              }
              onChange={(val) => {
                onChange('check_result_expectId', val);
              }}
            >
              {Object.keys(data.response).map((key) => (
                <Option key={key} value={key}>
                  {expectText(key)}
                </Option>
              ))}
            </Select>
          )}
        </div>
        {(!data.hasOwnProperty('is_check_result') || data.is_check_result > 0) &&
          isPlainObject(data?.response) &&
          Object.keys(data.response).length > 0 && (
            <div className="check-result-group assert">
              {valid === 'init' && <div className="check-result-item">未设置任何校验</div>}
              {valid === 'success' && (
                <div className="check-result-item check-true">返回数据校验成功</div>
              )}
              {valid === 'error' && (
                <div className="check-result-item check-false">返回数据校验失败</div>
              )}

              {isArray(errors) &&
                valid === 'error' &&
                errors.map((item) => {
                  return (
                    <div
                      key={item?.message}
                      className={cn('assert-item', {
                        faild: true,
                      })}
                    >
                      <AssertFaild /> {`${item?.instancePath || ''} ${item?.message || ''}`}
                    </div>
                  );
                })}
            </div>
          )}
      </div>
      <div className="assert">
        <div className="assert-title">断言结果</div>
        {isArray(assert) &&
          assert.map((item, index) => (
            <div
              key={index}
              className={cn('assert-item', {
                success: item?.status === 'success',
                faild: item?.status !== 'success',
              })}
            >
              {item?.status === 'success' ? <AssertSuccess /> : <AssertFaild />}
              {item.expect}
              {item?.status === 'success' ? '测试成功' : '测试失败'}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Assert;
