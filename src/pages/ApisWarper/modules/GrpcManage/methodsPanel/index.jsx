import React, { useRef } from 'react';
import { Tabs as TabComponent, Switch, Select, Button } from 'adesign-react';
import {
  Clone as CloneSvg,
  Export as ExportSvg,
  Beautify as BeautifySvg,
  Simplify as SimplifySvg,
} from 'adesign-react/icons';
import Example from '@components/Example';
import isFunction from 'lodash/isFunction';
import { useSelector } from 'react-redux';
import useApi from '../../../hooks/useApi';
import Header from './Header';

const { Tabs, TabPan } = TabComponent;

function MethodsPanel(props) {
  const { path, data, onChange, target_id } = props;

  // 展示方向 1.水平 -1 上下
  const { APIS_TAB_DIRECTION } = useSelector((store) => store?.user?.config);

  const { getMockMethodRequest } = useApi();
  const refRequest = useRef(null);
  return (
    <>
      <Tabs defaultActiveId="1">
        <TabPan id="1" title="请求内容">
          <div className="api-example-header" style={{ userSelect: 'none' }}>
            <Button
              onClick={() => {
                if (isFunction(refRequest?.current?.extractData)) refRequest.current.extractData();
              }}
            >
              <ExportSvg width={16} />
              <>提取字段和描述</>
            </Button>
            <Button
              onClick={() => {
                if (isFunction(refRequest?.current?.butifyFormatJson))
                  refRequest.current.butifyFormatJson();
              }}
            >
              <BeautifySvg width={16} />
              <>美化</>
            </Button>
            <Button
              onClick={() => {
                if (isFunction(refRequest?.current?.simplifyJson))
                  refRequest.current.simplifyJson();
              }}
            >
              <SimplifySvg width={16} />
              <>简化</>
            </Button>
            <Button
              onClick={() => {
                getMockMethodRequest(data, target_id, path);
              }}
            >
              <CloneSvg width={16} />
              <>生成模拟数据</>
            </Button>
          </div>
          <Example
            direction={APIS_TAB_DIRECTION > 0 ? 'vertical' : 'horizontal'}
            ref={refRequest}
            data={data?.request?.body || {}}
            onChange={(type, val) => {
              if (type === 'Raw') {
                onChange(`${path}.request.body.raw`, val);
              } else if (type === 'Parameter') {
                onChange(`${path}.request.body.parameter`, val);
              }
            }}
          />
        </TabPan>
        <TabPan id="2" title="请求MetaData">
          <Header
            data={data?.request?.header || []}
            onChange={(val) => {
              onChange(`${path}.request.header`, val);
            }}
            path={path}
          ></Header>
        </TabPan>
      </Tabs>
    </>
  );
}

export default MethodsPanel;
