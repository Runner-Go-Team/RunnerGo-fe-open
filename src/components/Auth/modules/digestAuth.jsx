import React from 'react';
import { Input, Select } from 'adesign-react';
import { digestPlaceholder, digestAlgorithmOptions } from '@constants/auth';
import AuthInput from '../authInput';
import { useTranslation } from 'react-i18next';

const Option = Select.Option;

const DigestAuth = (props) => {
  const { value, type, handleAttrChange } = props;
  const { t } = useTranslation();
  const renderDom = (renderList) => {
    return (
      <>
        {renderList.map((k) => {
          return digestPlaceholder[k] !== 'select' ? (
            <div key={k} className="auth-item">
              <div className="title">{k}</div>
              <AuthInput
                size="mini"
                value={value?.digest[k]}
                placeholder={digestPlaceholder[k]}
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
                value={value?.digest[k]}
                placeholder={ t('placeholder.plsSelect') }
                onChange={(val) => {
                  handleAttrChange(type, k, val);
                }}
              >
                {digestAlgorithmOptions.map((opt) => (
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
    <div className="apipost-auth-content">
      {renderDom(Object.keys(digestPlaceholder).splice(0, 2))}
      {renderDom(Object.keys(digestPlaceholder).splice(2, 8))}
    </div>
  );
};

export default DigestAuth;
