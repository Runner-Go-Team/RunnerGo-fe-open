import React from 'react';
import { Input } from 'adesign-react';
import AuthInput from '../authInput';
import { useTranslation } from 'react-i18next';

const KvAuth = (props) => {
  const { value, type, handleAttrChange } = props;
  const { t } = useTranslation();
  return (
    <>
      {value?.kv && (
        <div className="apipost-auth-content">
          <div className="auth-item">
            <div className="title">key</div>
            <AuthInput
              size="mini"
              placeholder={ t('placeholder.auth.key') }
              value={value.kv.key}
              onChange={(val) => {
                handleAttrChange(type, 'key', val);
              }}
            />
          </div>
          <div className="auth-item">
            <div className="title">value</div>
            <AuthInput
              size="mini"
              placeholder={ t('placeholder.auth.value') }
              value={value.kv.value}
              onChange={(val) => {
                handleAttrChange(type, 'value', val);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default KvAuth;
