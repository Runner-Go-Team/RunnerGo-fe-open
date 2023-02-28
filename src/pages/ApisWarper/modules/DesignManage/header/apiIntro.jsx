import React, { useState, useContext, useEffect } from 'react';
import { Button, Modal } from 'adesign-react';
import Markdown from '@components/MarkDown';
import { HelpDoc, Right, Down, Add as AddSvg } from 'adesign-react/icons';
import Context from '../designContext';

const ApiIntro = (props) => {
  const [explainVisible, setExplainVisible] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const { data, onChange } = useContext(Context);

  const handleIntroChange = (val) => {
    onChange('description', val);
  };
  return (
    <>
      <Modal
        title="接口说明"
        visible={showEditor}
        onCancel={setShowEditor.bind(null, false)}
        footer={null}
      >
        <div style={{ height: 500 }}>
          <Markdown value={data?.request?.description || ''} onChange={handleIntroChange} />
        </div>
      </Modal>
      <div>
        <div className="module-title">
          <div className="title-left">
            <HelpDoc className="title-svg" />
            接口说明
          </div>
          <div className="title-right">
            <Button size="mini" onClick={setShowEditor.bind(null, true)} prefix={<AddSvg />}>
              添加
            </Button>
            {explainVisible ? (
              <Down className="title-svg" onClick={setExplainVisible.bind(null, !explainVisible)} />
            ) : (
              <Right
                className="title-svg"
                onClick={setExplainVisible.bind(null, !explainVisible)}
              />
            )}
          </div>
        </div>
        {explainVisible && (
          <div style={{ height: 300 }}>
            <Markdown value={data?.request?.description || ''} onChange={handleIntroChange} />
          </div>
        )}
      </div>
    </>
  );
};

export default ApiIntro;
