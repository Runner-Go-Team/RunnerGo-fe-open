import React from 'react';
// import { Input } from 'adesign-react';
import AuthInput from '../authInput';
import { useTranslation } from 'react-i18next';

const BasicAuth = (props) => {
  const { value, type, handleAttrChange } = props;
  const { t } = useTranslation();

  return (
    <>
      {value?.basic && (
        <div className="apipost-auth-content">
          <div className="auth-item">
            <div className="title">username</div>
            <AuthInput
              size="mini"
              placeholder={ t('placeholder.auth.username') }
              value={value.basic.username}
              onChange={(val) => {
                handleAttrChange(type, 'username', val);
              }}
            />
          </div>
          <div className="auth-item">
            <div className="title">password</div>
            <AuthInput
              size="mini"
              placeholder={ t('placeholder.auth.password') }
              value={value.basic.password}
              onChange={(val) => {
                handleAttrChange(type, 'password', val);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BasicAuth;
