import React from 'react';
// import { Input } from 'adesign-react';
import AuthInput from '../authInput';
import { useTranslation } from 'react-i18next';

const BearerAuth = (props) => {
  const { value, type, handleAttrChange } = props;
  const { t } = useTranslation();

  return (
    <>
      {value?.bearer && (
        <div className="apipost-auth-content">
          <div className="auth-item">
            <div className="title">token</div>
            <AuthInput
              size="mini"
              placeholder={ t('placeholder.auth.token') }
              value={value.bearer.key}
              onChange={(val) => {
                handleAttrChange(type, 'key', val);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BearerAuth;
