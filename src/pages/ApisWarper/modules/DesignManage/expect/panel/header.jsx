import React, { useState } from 'react';
import cn from 'classnames';
import { Button } from 'adesign-react';
import ImportModal from '../modal/importModal';
import PreviwModal from '../modal/previewModal';
import './statuscode.less';

const JsonHeader = (props) => {
  const { jsonMode, setJsonMode, expectInfo, onChange } = props;

  const [modalType, setModalType] = useState('');

  return (
    <>
      {modalType === 'import' && (
        <ImportModal
          jsonMode={jsonMode}
          onChange={onChange}
          onCancel={setModalType.bind(null, '')}
        />
      )}
      {modalType === 'preview' && (
        <PreviwModal
          jsonMode={jsonMode}
          expectInfo={expectInfo}
          onCancel={setModalType.bind(null, '')}
        />
      )}

      <div className="jsonpanel-wrapper-header">
        <div className="header-left">
          <div
            className={cn('item', { active: jsonMode === 'schema' })}
            style={{ width: 114 }}
            onClick={setJsonMode.bind(null, 'schema')}
          >
            json-schema模式
          </div>
          <div
            className={cn('item', { active: jsonMode === 'mock' })}
            style={{ width: 80 }}
            onClick={setJsonMode.bind(null, 'mock')}
          >
            mockjs模式
          </div>
        </div>
        <div className="header-right">
          <Button
            type="primary"
            className="apipost-light-btn"
            size="mini"
            onClick={setModalType.bind(null, 'import')}
          >
            导入
          </Button>
          <Button
            type="primary"
            className="apipost-light-btn"
            size="mini"
            onClick={setModalType.bind(null, 'preview')}
          >
            预览
          </Button>
        </div>
      </div>
    </>
  );
};

export default JsonHeader;
