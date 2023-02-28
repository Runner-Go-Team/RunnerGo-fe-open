import React, { useState } from 'react';
import { Select, Input, CheckBox } from 'adesign-react';
import { Down as DownSvg, Right as RightSvg } from 'adesign-react/icons';
import { OAuth1MethodsOptions } from '@constants/auth';
import AuthInput from '../authInput';
import { useTranslation } from 'react-i18next';

const Option = Select.Option;
const Textarea = Input.Textarea;

const OAuth1 = (props) => {
  const { value, type, handleAttrChange } = props;

  const [isRSA, setIsRSA] = useState(true);
  const [moreVisible, setMoreVisible] = useState(true);
  const { t } = useTranslation();

  return (
    <>
      <div className="apipost-auth-content">
        <div className="auth-item">
          <div className="title">Signature Method</div>
          <Select
            value={value.oauth1.signatureMethod}
            placeholder={ t('placeholder.plsSelect') }
            onChange={(val) => {
              if (['RSA-SHA1', 'RSA-SHA256', 'RSA-SHA512'].includes(val)) {
                setIsRSA(false);
              }
              handleAttrChange('oauth1', 'signatureMethod', val);
            }}
          >
            {OAuth1MethodsOptions.map((opt) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
        </div>
        <div className="auth-item">
          <div className="title">Consumer Key</div>
          <AuthInput
            size="mini"
            value={value.oauth1.consumerKey}
            onChange={(val) => {
              handleAttrChange('oauth1', 'consumerKey', val);
            }}
          />
        </div>
        {isRSA ? (
          <>
            <div className="auth-item">
              <div className="title">Consumer Secret</div>
              <AuthInput
                size="mini"
                value={value.oauth1.consumerSecret}
                onChange={(val) => {
                  handleAttrChange('oauth1', 'consumerSecret', val);
                }}
              />
            </div>
            <div className="auth-item">
              <div className="title">Access Secret</div>
              <AuthInput
                size="mini"
                value={value.oauth1.AccessSecret}
                onChange={(val) => {
                  handleAttrChange('oauth1', 'AccessSecret', val);
                }}
              />
            </div>
            <div className="auth-item">
              <div className="title">Token Secret</div>
              <AuthInput
                size="mini"
                value={value.oauth1.tokenSecret}
                onChange={(val) => {
                  handleAttrChange('oauth1', 'tokenSecret', val);
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="auth-item">
              <div className="title">Access Token</div>
              <AuthInput
                size="mini"
                value={value.oauth1.token}
                onChange={(val) => {
                  handleAttrChange('oauth1', 'token', val);
                }}
              />
            </div>
            <div className="auth-item">
              <div className="title">Private Key</div>
            </div>
            <div className="auth-item">
              <div></div>
              <div style={{ width: 500 }}>
                <div>select File</div>
                <Textarea
                  value={value.oauth1.Consumer}
                  onChange={(val) => {
                    handleAttrChange('oauth1', 'Consumer', val);
                  }}
                ></Textarea>
              </div>
            </div>
          </>
        )}

        <div
          className="auth-item-center"
          onClick={() => {
            setMoreVisible(!moreVisible);
          }}
        >
          { t('apis.more') }
          {moreVisible ? <DownSvg width={16} /> : <RightSvg width={16} />}
        </div>
        {moreVisible && (
          <>
            <div className="auth-item">
              <div className="title">Callback Url</div>
              <AuthInput
                size="mini"
                value={value.oauth1.callback}
                onChange={(val) => {
                  handleAttrChange('oauth1', 'callback', val);
                }}
              />
            </div>
            <div className="auth-item">
              <div className="title">Verifier</div>
              <AuthInput
                size="mini"
                value={value.oauth1.verifier}
                onChange={(val) => {
                  handleAttrChange('oauth1', 'verifier', val);
                }}
              />
            </div>
            <div className="auth-item">
              <div className="title">Timestamp</div>
              <AuthInput
                size="mini"
                value={value.oauth1.timestamp}
                onChange={(val) => {
                  handleAttrChange('oauth1', 'timestamp', val);
                }}
              />
            </div>
            <div className="auth-item">
              <div className="title">Nonce</div>
              <AuthInput
                size="mini"
                value={value.oauth1.nonce}
                onChange={(val) => {
                  handleAttrChange('oauth1', 'nonce', val);
                }}
              />
            </div>
            <div className="auth-item">
              <div className="title">Version</div>
              <AuthInput
                size="mini"
                value={value.oauth1.version}
                onChange={(val) => {
                  handleAttrChange('oauth1', 'version', val);
                }}
              />
            </div>
            <div className="auth-item">
              <div className="title">Realm</div>
              <AuthInput
                size="mini"
                value={value.oauth1.realm}
                onChange={(val) => {
                  handleAttrChange('oauth1', 'realm', val);
                }}
              />
            </div>
          </>
        )}
        <div>
          <div>
            {/* includeBodyHash */}
            <CheckBox></CheckBox>Include body hash
          </div>
          <div>
            {/* addParamsToHeader */}
            <CheckBox></CheckBox>Add empty parameters to signature
          </div>
        </div>
      </div>
    </>
  );
};

export default OAuth1;
