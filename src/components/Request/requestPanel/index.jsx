import React from 'react';
import { Select } from 'adesign-react';
import Authen from '@components/Auth';
import ScriptBox from '@components/ScriptBox';
import { isArray, isObject } from 'lodash';
import Cookie from '@components/Request/cookie';
import Header from '@components/Request/header';
import Query from '@components/Request/query';
import Body from '@components/Request/body';
import Assert from '@components/Request/assert';
import Regular from '@components/Request/regular';
import Setting from '@components/Request/setting';
import { RequestWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { Tabs } from '@arco-design/web-react';

const { TabPane }  = Tabs;

// const { Tabs, TabPan } = TabComponent;
const Option = Select.Option;

const RequestPanel = (props) => {
  const { data, onChange, showAssert, from } = props;
  const { t } = useTranslation();

  const defaultList = [
    {
      id: '0',
      title: t('apis.cookie'),
      content: (
        <Cookie
          parameter={isArray(data?.request?.cookie?.parameter) ? data.request.cookie.parameter : []}
          onChange={onChange}
        />
      ),
    },
    {
      id: '1',
      title: t('apis.header'),
      content: (
        <Header
          parameter={data.request ? (isArray(data?.request?.header?.parameter) ? data.request.header.parameter : []) : []}
          onChange={onChange}
        />
      ),
    },
    {
      id: '2',
      title: t('apis.query'),
      content: (
        <Query
          resful={data.request ? (isArray(data?.request.resful?.parameter) ? data?.request.resful.parameter : []) : []}
          parameter={data.request ? (isArray(data?.request.query?.parameter) ? data?.request.query.parameter : []) : []}
          onChange={onChange}
        />
      ),
    },
    {
      id: '3',
      title: t('apis.body'),
      content: <Body value={data.request ? (isObject(data?.request?.body) ? data?.request.body : {}) : {}} onChange={onChange} />,
    },
    {
      id: '4',
      title: t('apis.auth'),
      content: <Authen value={data.request ? (data?.request?.auth || {}) : {}} onChange={onChange}></Authen>,
    },
    {
      id: '5',
      title: t('apis.assert'),
      content: <Assert parameter={isArray(data?.request?.assert) ? data?.request?.assert : []} onChange={onChange}></Assert>,
    },
    {
      id: '6',
      title: t('apis.regular'),
      content: <Regular parameter={isArray(data?.request?.regex) ? data?.request?.regex : []} onChange={onChange}></Regular>,
    },
    {
      id: '7',
      title: t('apis.setting'),
      content: <Setting parameter={isObject(data?.request?.http_api_setup) ? data?.request?.http_api_setup : {}} onChange={onChange}></Setting>
    }
  ];
  return (
    <RequestWrapper style={{ padding: '0 16px' }}>
      <Tabs defaultActiveTab={ showAssert ? '5' : '3' } itemWidth={80}>
        {defaultList.map((d) => (
          <TabPane
            style={{ padding: '0 15px', width: 'auto !impoertant' }}
            key={d.id}
            title={d.title}
          >
            {d.content}
          </TabPane>
        ))}
      </Tabs>
    </RequestWrapper>
  );
};

export default RequestPanel;
