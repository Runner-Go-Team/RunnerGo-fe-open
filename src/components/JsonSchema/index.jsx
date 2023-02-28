import React, { useMemo } from 'react';
import { Tabs as TabComponent } from 'adesign-react';
import JsonTable from './jsonTable';
import JsonRaw from './jsonRaw';
import './index.less';

const { Tabs, TabPan } = TabComponent;

const JsonSchema = (props) => {
  const { value, onChange } = props;

  return (
    <Tabs defaultActiveId="1" elementCache={false}>
      <TabPan id="1" title="JSON">
        <JsonTable {...{ value, onChange }} />
      </TabPan>
      <TabPan id="2" title="RAW">
        <JsonRaw {...{ value, onChange }} />
      </TabPan>
    </Tabs>
  );
};

export default JsonSchema;
