import React, { useEffect } from 'react';
import { Select } from 'adesign-react';
import { AUTH, defaultAuth } from '@constants/auth';
import OAuth1 from './modules/OAuth1';
import { AuthWrapper } from './style';
import KvAuth from './modules/kvAuth';
import BearerAuth from './modules/bearerAuth';
import BasicAuth from './modules/basicAuth';
import DigestAuth from './modules/digestAuth';
import AWSAuth from './modules/awsAuth';
import HawkAuth from './modules/hawkAuth';
import NtlmAuth from './modules/ntlmAuth';
import EdgeridAuth from './modules/edgeridAuth';
import BidirectionalAuth from './modules/BidirectionalAuth';
import './index.less';
import { useTranslation } from 'react-i18next';

const Option = Select.Option;

const PERFIXNAME = 'apipost-auth';

const Authen = (props) => {
  const { value = {}, onChange = () => undefined } = props;
  const { t } = useTranslation();

  useEffect(() => {
    let isDifferent = false;
    const newValue = {};
    for (const key in defaultAuth) {
      if (!value?.hasOwnProperty(key)) isDifferent = true;
      if (key !== 'type') {
        newValue[key] = Object.assign({}, defaultAuth[key], value?.[key]);
      } else {
        newValue[key] = value?.[key] || defaultAuth[key];
      }
    }
    if (isDifferent) {
      // setTimeout(() => {
        // onChange('auth', { ...newValue });
      // }, 300);
    }
  }, []);

  const { type = 'noauth' } = value || {};

  if (!type) return <></>;

  const handleAuthTypeChange = (authType) => {
    onChange('authType', authType);
  };

  const handleAttrChange = (authType, attr, attrValue) => {
    onChange('authValue', attrValue, `${authType}.${attr}`);
  };
  const authTypeBox = () => {
    switch (type) {
      case 'kv':
        return <KvAuth value={value} type={type} handleAttrChange={handleAttrChange}></KvAuth>;
      case 'bearer':
        return (
          <BearerAuth value={value} type={type} handleAttrChange={handleAttrChange}></BearerAuth>
        );
      case 'basic':
        return (
          <BasicAuth value={value} type={type} handleAttrChange={handleAttrChange}></BasicAuth>
        );
      case 'digest':
        return (
          <DigestAuth value={value} type={type} handleAttrChange={handleAttrChange}></DigestAuth>
        );
      case 'hawk':
        return <HawkAuth value={value} type={type} handleAttrChange={handleAttrChange}></HawkAuth>;
      case 'awsv4':
        return <AWSAuth value={value} type={type} handleAttrChange={handleAttrChange}></AWSAuth>;
      case 'ntlm':
        return <NtlmAuth value={value} type={type} handleAttrChange={handleAttrChange}></NtlmAuth>;
      case 'edgegrid':
        return (
          <EdgeridAuth value={value} type={type} handleAttrChange={handleAttrChange}></EdgeridAuth>
        );
      case 'oauth1':
        return <OAuth1 value={value} type={type} handleAttrChange={handleAttrChange}></OAuth1>;
      case 'unidirectional':
        return t('apis.oneWayAuth');
      case 'bidirectional':
        return <BidirectionalAuth value={value} type={type} handleAttrChange={handleAttrChange}></BidirectionalAuth>;
      default:
        return t('apis.notAuth');
    }
  };
  const authList = {
    noauth: t('apis.authList.noauth'),
    unidirectional: t('apis.authList.oneway'),
    bidirectional: t('apis.authList.twoway'),
    kv: t('apis.authList.kv'),
    bearer:t('apis.authList.bearer'),
    basic: t('apis.authList.basic'),
    digest: t('apis.authList.digest'),
    // oauth1: t('apis.authList.oauth1'),
    // hawk: t('apis.authList.hawk'),
    // awsv4: t('apis.authList.awsv4'),
    // ntlm: t('apis.authList.ntlm'),
    // edgegrid: t('apis.authList.edgegrid')
  };

  return (
    <AuthWrapper className={PERFIXNAME}>
      <Select className={`${PERFIXNAME}-select`} value={type} onChange={handleAuthTypeChange}>
        {Object.entries(authList).map((item) => (
          <Option value={item[0]} key={item[0]}>
            {item[1]}
          </Option>
        ))}
      </Select>
      <div className="apipost-auth-type-content">{authTypeBox()}</div>
    </AuthWrapper>
  );
};

export default Authen;
