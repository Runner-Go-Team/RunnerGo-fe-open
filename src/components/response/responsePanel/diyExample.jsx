import React, { useRef } from 'react';
import { Button } from 'adesign-react';
import {
  Export as ExportSvg,
  Beautify as BeautifySvg,
  Simplify as SimplifySvg,
  Import as ImportSvg,
} from 'adesign-react/icons';
import { isFunction } from 'lodash';
import Example from '@components/Example';

const DiyExample = (props) => {
  const { data, tempData, dataKey, onChange, direction } = props;

  const refDiyExample = useRef(null);

  return (
    <>
      <div className="api-example-header" style={{ userSelect: 'none' }}>
        <Button
          size="mini"
          onClick={() => {
            if (isFunction(refDiyExample?.current?.importFromData))
              refDiyExample.current.importFromData(tempData?.response?.rawBody);
          }}
        >
          <ImportSvg width={16} />
          <>从现有响应导入</>
        </Button>
        <Button
          size="mini"
          onClick={() => {
            if (isFunction(refDiyExample?.current?.extractData))
              refDiyExample.current.extractData();
          }}
        >
          <ExportSvg width={16} />
          <>提取字段和描述</>
        </Button>
        <Button
          size="mini"
          onClick={() => {
            if (isFunction(refDiyExample?.current?.butifyFormatJson))
              refDiyExample.current.butifyFormatJson();
          }}
        >
          <BeautifySvg width={16} />
          <>美化</>
        </Button>
        <Button
          size="mini"
          onClick={() => {
            if (isFunction(refDiyExample?.current?.simplifyJson))
              refDiyExample.current.simplifyJson();
          }}
        >
          <SimplifySvg width={16} />
          <>简化</>
        </Button>
      </div>
      <Example
        type="success"
        direction={direction}
        ref={refDiyExample}
        data={{
          raw: data?.response[dataKey]?.raw || '',
          parameter: data?.response[dataKey]?.parameter || [],
        }}
        onChange={(type, val) => {
          if (type === 'Raw') {
            onChange('exampleRaw', val, dataKey);
          } else if (type === 'Parameter') {
            onChange('exampleParameter', val, dataKey);
          }
        }}
      ></Example>
    </>
  );
};

export default DiyExample;
