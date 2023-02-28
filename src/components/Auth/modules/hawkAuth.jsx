import React from 'react';
import { Input, Select } from 'adesign-react';
import { hawkPlaceholder, hawkAlgotithOptions } from '@constants/auth';
import AuthInput from '../authInput';
import { useTranslation } from 'react-i18next';

const Option = Select.Option;

const HawkAuth = (props) => {
  const { value, type, handleAttrChange } = props;
  const { t } = useTranslation();

  const renderDom = (renderList) => {
    return (
      <>
        {renderList.map((k) => {
          return hawkPlaceholder[k] !== 'select' ? (
            <div key={k} className="auth-item">
              <div className="title">{k}</div>
              <AuthInput
                size="mini"
                value={value.hawk[k]}
                placeholder={hawkPlaceholder[k]}
                onChange={(val) => {
                  handleAttrChange(type, k, val);
                }}
              />
            </div>
          ) : (
            <div key={k} className="auth-item">
              <div className="title">{k}</div>
              <Select
                size="mini"
                value={value.hawk[k]}
                placeholder={ t('placeholder.plsSelect') }
                onChange={(val) => {
                  handleAttrChange(type, k, val);
                }}
              >
                {hawkAlgotithOptions.map((opt) => (
                  <Option key={opt} value={opt}>
                    {opt}
                  </Option>
                ))}
              </Select>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      { (
        <div className="apipost-auth-content">
          {renderDom(Object.keys(hawkPlaceholder).splice(0, 3))}
          {renderDom(Object.keys(hawkPlaceholder).splice(3, 9))}
        </div>
      )}
    </>
  );
};

export default HawkAuth;
