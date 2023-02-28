import React, { useState } from 'react';
import { Scale } from 'adesign-react';
import { Doubt as DoubtSvg, Right as RightSvg } from 'adesign-react/icons';
import { openUrl } from '@utils';
import { PRESCRIPT, TEST } from './constant';
import MonacoEditor from '../MonacoEditor';
import { ScriptBoxWraper } from './style';
import './index.less';
// import { ReactComponent as ReturnSvg } from '@Assets/icons/returnSvg.svg';

const { ScalePanel, ScaleItem } = Scale;

const LAYOUT_MIN_SIZE = 100;
const defaultLayoust = { 0: { flex: 1, width: 0 }, 1: { width: 300 } };

const ScriptBox = (props) => {
  const { scriptType, value, onChange = () => undefined } = props;

  const scriptList = !scriptType || scriptType === 'pre' ? PRESCRIPT : TEST;

  const [scriptLayoust, setScriptLayoust] = useState(defaultLayoust);

  const handleLayoutsChange = (newlayouts) => {
    if (newlayouts?.[1]?.width >= 300) {
      setScriptLayoust({ 0: { flex: 1, width: 0 }, 1: { width: 300 } });
    } else if (newlayouts?.[1]?.width < LAYOUT_MIN_SIZE) {
      setScriptLayoust({ 0: { flex: 1, width: 0 }, 1: { width: 40 } });
    } else {
      setScriptLayoust({ 0: { flex: 1, width: 0 }, 1: { width: newlayouts[1].width } });
    }

    // setScriptLayoust(layouts);
  };

  const handleAppendScript = (text) => {
    if (value === '') {
      onChange(text);
    } else {
      onChange(`${value}\n${text}`);
    }
  };

  const ScriptList = (
    <div className="script-box-scriptlist beautify-scroll-bar">
      <div
        className="script-item"
        onClick={() =>
          openUrl(
            'https://wiki.apipost.cn/document/00091641-1e36-490d-9caf-3e47cd38bcde/5772225b-267c-46f2-94d3-08ff622d80e3'
          )
        }
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <DoubtSvg className="svgfill" />
          <div style={{ margin: '0 10px' }}>了解预后行脚本</div>
          <RightSvg className="svgfill" />
        </div>
      </div>
      {Object.keys(scriptList).map((item) => (
        <div
          className="script-item"
          onClick={() => {
            handleAppendScript(item);
          }}
          key={item}
        >
          <span>{scriptList[item]}</span>
        </div>
      ))}
    </div>
  );

  return (
    <ScriptBoxWraper>
      <ScalePanel layouts={scriptLayoust} onLayoutsChange={handleLayoutsChange}>
        <ScaleItem enableScale={false}>
          <div className="script-box-editor">
            <MonacoEditor
              language="javascript"
              value={value}
              onChange={(val) => {
                onChange(val);
              }}
            ></MonacoEditor>
          </div>
        </ScaleItem>
        <ScaleItem barLocation="start">
          {scriptLayoust[1].width <= 40 ? (
            <div
              className="scale-toggle-box vertical"
              onClick={setScriptLayoust.bind(null, defaultLayoust)}
            >
              展开预\后执行脚本
            </div>
          ) : (
            ScriptList
          )}
        </ScaleItem>
      </ScalePanel>
    </ScriptBoxWraper>
  );
};

export default ScriptBox;
