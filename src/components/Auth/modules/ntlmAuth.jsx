import React from 'react';
import { Input } from 'adesign-react';
import { ntlmPlacrholder } from '@constants/auth';
import AuthInput from '../authInput';

const NtlmAuth = (props) => {
  const { value, type, handleAttrChange } = props;

  const renderDom = (renderList) => {
    return (
      <>
        {renderList.map((k) => {
          return (
            <div key={k} className="auth-item">
              <div className="title">{k}</div>
              <AuthInput
                size="mini"
                value={value.ntlm[k]}
                placeholder={ntlmPlacrholder[k]}
                onChange={(val) => {
                  handleAttrChange(type, k, val);
                }}
              />
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      {(
        <div className="apipost-auth-content">
          {renderDom(Object.keys(ntlmPlacrholder).splice(0, 2))}
          {renderDom(Object.keys(ntlmPlacrholder).splice(2, 4))}
        </div>
      )}
    </>
  );
};

export default NtlmAuth;
