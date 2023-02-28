import React, { useState, useContext } from 'react';
import { Tabs as TabComponent } from 'adesign-react';
import { Right as RightSvg, Down as DownSvg } from 'adesign-react/icons';
import Authen from '@components/Auth';
import Header from '@components/Request/header';
import Query from '@components/Request/query';
import Body from '@components/Request/body';
import { isObject } from'lodash';
import { RequestWrapper } from './style';
import Context from '../designContext';

const { Tabs, TabPan } = TabComponent;

const RequestPanel = (props) => {
  const { data, onChange = () => undefined } = useContext(Context);

  const [requestVisible, setRequestVisible] = useState(true);
  const handleRquestVisible = () => {
    setRequestVisible(!requestVisible);
  };
  const defaultList = [
    {
      id: '1',
      title: 'Header',
      content: (
        <Header
          parameter={
            Array.isArray(data?.request?.header?.parameter) ? data?.request.header.parameter : []
          }
          onChange={onChange}
        />
      ),
    },
    {
      id: '2',
      title: 'Query',
      content: (
        <Query
          parameter={
            Array.isArray(data?.request?.query?.parameter) ? data?.request.query.parameter : []
          }
          resful={
            Array.isArray(data?.request?.resful?.parameter) ? data?.request.resful.parameter : []
          }
          onChange={onChange}
        />
      ),
    },
    {
      id: '3',
      title: 'Body',
      content: (
        <Body value={isObject(data?.request?.body) ? data?.request.body : {}} onChange={onChange} />
      ),
    },
    {
      id: '4',
      title: '认证',
      content: <Authen value={data?.request?.auth || {}} onChange={onChange} />,
    },
  ];

  return (
    <RequestWrapper>
      <div className="request-title" onClick={handleRquestVisible}>
        <span>预定义请求参数</span>
        <div className="right-btns">
          {requestVisible ? <DownSvg className="title-svg" /> : <RightSvg className="title-svg" />}
        </div>
      </div>
      {requestVisible && (
        <Tabs defaultActiveId="1">
          {defaultList.map((d) => (
            <TabPan style={{ padding: '0 15px' }} key={d.id} id={d.id} title={d.title}>
              {d.content}
            </TabPan>
          ))}
        </Tabs>
      )}
    </RequestWrapper>
  );
};

export default RequestPanel;
