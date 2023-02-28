import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import './index.less';

const HighLight = (props) => {
  const { code } = props;
  const refCode = useRef<HTMLElement>(null);

  useEffect(() => {
    if (refCode?.current !== undefined) {
      hljs.highlightElement(refCode.current);
    }
  }, []);

  return (
    <div className="highlight-item">
      <pre>
        <code ref={refCode} className="javascript" style={{ background: 'none' }}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default HighLight;
