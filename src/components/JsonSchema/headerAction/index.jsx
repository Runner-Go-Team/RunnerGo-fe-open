import React, { useState } from 'react';
import { Button } from 'adesign-react';
import { isObject } from 'lodash';
import { useLocation } from 'react-router-dom';
import { HeaderActionWrap } from './style';
import ImportModal from './modals/importModal';
import PreviewModal from './modals/previewModal';
// import EditRow from './modals/editRaw';

const HeaderAction = (props) => {
  const { value, onChange } = props;
  const [modalType, setModalType] = useState('');
  const shemaData = isObject(value) ? value : {};
  const location = useLocation();
  return (
    <HeaderActionWrap>
      {modalType === 'import' && (
        <ImportModal onChange={onChange} onCancel={setModalType.bind(null, '')} />
      )}
      {modalType === 'preview' && (
        <PreviewModal value={value} onCancel={setModalType.bind(null, '')} />
      )}
      {modalType === 'edit-raw' && (
        <></>
        // <EditRow value={shemaData} onChange={onChange} onCancel={setModalType.bind(null, '')} />
      )}
      <div className="action-left">
        {!location.pathname.includes('/data-model') && (
          <Button
            className=""
            size="mini"
            onClick={setModalType.bind(null, 'import')}
          >
            导入
          </Button>
        )}
      </div>
      <div className="action-right">
        {/* <Button
          type="primary"
          size="mini"
          className="apipost-light-btn"
          onClick={setModalType.bind(null, 'edit-raw')}
        >
          {'{}'}Raw编辑
        </Button> */}
        {!location.pathname.includes('/data-model') && (
          <Button
            type="primary"
            className="apipost-light-btn preview-btn"
            size="mini"
            onClick={setModalType.bind(null, 'preview')}
          >
            预览
          </Button>
        )}
      </div>
    </HeaderActionWrap>
  );
};

export default HeaderAction;
