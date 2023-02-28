import React from 'react';
import { Select, Tabs as TabComponent } from 'adesign-react';
import WssTable from './WssTable';
import WssConfig from './WssConfig';

const Option = Select.Option;
const { Tabs, TabPan } = TabComponent;

const WssRequest = (props) => {
  const { data, onChange, onTabChange } = props;

  const TABSLIST = [
    {
      id: 1,
      title: '请求头',
      component: (
        <WssTable
          value={data?.request?.header?.parameter || []}
          paramsType="header"
          onChange={(table) => {
            onChange('header', table);
          }}
          onTableDelete={(table) => {
            onChange('header', table);
          }}
        />
      ),
    },
    {
      id: 2,
      title: '请求参数',
      component: (
        <WssTable
          value={data?.request?.query?.parameter || []}
          paramsType="query"
          onChange={(table) => {
            onChange('query', table);
          }}
          onTableDelete={(table) => {
            onChange('query', table);
          }}
        />
      ),
    },
    {
      id: 3,
      title: '事件',
      component: (
        <WssTable
          value={data?.socketConfig?.socketIoEventListeners || []}
          type="event"
          onChange={(table) => {
            onChange('socketIoEventListeners', table);
          }}
          onTableDelete={(table) => {
            onChange('socketIoEventListeners', table);
          }}
        />
      ),
    },
    {
      id: 4,
      title: '设置',
      component: (
        <WssConfig
          socketConfig={data?.socketConfig}
          paramsType="socketConfig"
          onChange={(filed, data) => {
            onChange(filed, data);
          }}
        />
      ),
    },
  ];
  const TABSLIST1 = [
    {
      id: 1,
      title: '请求头',
      component: (
        <WssTable
          value={data?.request?.header?.parameter || []}
          paramsType="header"
          onChange={(table) => {
            onChange('header', table);
          }}
          onTableDelete={(table) => {
            onChange('header', table);
          }}
        />
      ),
    },
    {
      id: 2,
      title: '请求参数',
      component: (
        <WssTable
          value={data?.request?.query?.parameter || []}
          paramsType="query"
          onChange={(table) => {
            onChange('query', table);
          }}
          onTableDelete={(table) => {
            onChange('query', table);
          }}
        />
      ),
    },
    {
      id: 3,
      title: '设置',
      component: (
        <WssConfig
          socketConfig={data?.socketConfig}
          method="Raw"
          paramsType="socketConfig"
          onChange={(filed, data) => {
            onChange(filed, data);
          }}
        />
      ),
    },
  ];
  return (
    <Tabs defaultActiveId={1} onChange={onTabChange}>
      {data?.method === 'Socket.IO'
        ? TABSLIST.map((d) => (
            <TabPan key={d.id} id={d.id} title={d.title}>
              {d.component}
            </TabPan>
          ))
        : TABSLIST1.map((d) => (
            <TabPan key={d.id} id={d.id} title={d.title}>
              {d.component}
            </TabPan>
          ))}
    </Tabs>
  );
};

export default WssRequest;
