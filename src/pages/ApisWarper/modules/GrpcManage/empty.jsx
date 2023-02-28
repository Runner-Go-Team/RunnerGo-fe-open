import React, { useState } from 'react';
import { Button } from 'adesign-react';
import ImportProto from './importProto';

const Empty = (props) => {
  const { data } = props;
  const [importVisible, setImportVisible] = useState(false);
  return (
    <>
      {importVisible && (
        <ImportProto
          data={data}
          onCancel={() => {
            setImportVisible(false);
          }}
        ></ImportProto>
      )}
      <div className="grpc-empty-content">
        <div className="api-grpc-empty">
          <em>请先导入一个 proto</em>
          <Button className="apipost-blue-btn" onClick={() => setImportVisible(true)}>
            立即导入proto
          </Button>
        </div>
      </div>
    </>
  );
};

export default Empty;
