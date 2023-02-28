import React, { useEffect, useRef } from 'react';
import { HelpDoc as HelpSvg, Right as RightSvg } from 'adesign-react/icons';
import { isString } from 'lodash';
import { openUrl } from '@utils';
import { VisualWrapper } from './style';

// const template = require('art-template/lib/template-web');

const Visualizing = (props) => {
  const visualizingRef = useRef(null);
  const { tempData, target_id } = props;
  const { html } = tempData || {};
  useEffect(() => {
    if (isString(html)) {
      visualizingRef.current.contentDocument.body.innerHTML = `<div class="markdown-section">${html}</div>`;
    }
  }, [visualizingRef, html]);
  return (
    <>
      {isString(html) ? (
        <iframe
          title="可视化"
          ref={visualizingRef}
          width="100%"
          style={{ border: 0, height: '100%' }}
          frameBorder="0"
        ></iframe>
      ) : (
        <div className={VisualWrapper}>
          <div>
            欢迎使用可视化功能，请先阅读使用说明
            <p className="text" onClick={() => openUrl('https://mp.apipost.cn/a/bf608b95fc5da479')}>
              <HelpSvg />
              什么是可视化?
              <RightSvg />
            </p>
          </div>
        </div>
      )}
    </>
  );
};
export default Visualizing;
