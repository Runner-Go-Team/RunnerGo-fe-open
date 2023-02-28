import React from 'react';
import { Input } from 'adesign-react';
import { edgegridPlaceholder } from '@constants/auth';
import AuthInput from '../authInput';

const EdgeridAuth = (props) => {
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
                value={value.edgegrid[k]}
                placeholder={edgegridPlaceholder[k]}
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
          {renderDom(Object.keys(edgegridPlaceholder).splice(0, 3))}
          {renderDom(Object.keys(edgegridPlaceholder).splice(3, 6))}
        </div>
      )}
    </>
  );
};

export default EdgeridAuth;
