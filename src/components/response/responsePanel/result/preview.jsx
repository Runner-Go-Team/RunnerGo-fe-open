import React, { useState } from 'react';
import Empty from '@components/Empty';
import PDF from 'react-pdf-js';

const Preview = (props) => {
  const { data } = props;

  const [numPages, setnumPages] = useState(0);
  const setColor = (aa) => {
    // const color = system?.SYSTHEMCOLOR === 'dark' ? 'var(--font-1)' : 'var(--content-color-secondary)';
    const bgcolor = 'white';
    let str = `<style>
      body{
        background:${bgcolor};
      }
    </style>`;
    // eslint-disable-next-line no-return-assign
    return (str += aa);
  };
  const onDocumentComplete = (pages) => {
    setnumPages(pages);
  };
  function directlyRenderPdf(nums) {
    const x = [];
    for (let i = 2; i <= nums; i++) {
      x.push(<PDF page={i} key={`x${i}`} file={data?.resBody || data?.base64Body} scale={0.61} />);
    }
    return x;
  }
  const responsePreview =
    data?.responseSize / 1024 > 20 ? (
      <Empty text="文件过大，请下载查看" />
    ) : (
      <>
        {data?.fitForShow === 'Monaco' ? (
          <iframe
            sandbox=""
            srcDoc={setColor(data?.rawBody)}
            title="w"
            frameBorder="0"
            width="100%"
            z-index="100"
            height="100%"
          ></iframe>
        ) : data?.fitForShow === 'Image' ? (
          <div style={{ width: 300 }}>
            <img src={data?.resBody || data?.base64Body} style={{ maxWidth: '100%' }} />
          </div>
        ) : data?.fitForShow === 'Pdf' ? (
          <>
            <PDF
              scale={0.61}
              onDocumentComplete={onDocumentComplete}
              page={1}
              file={data?.resBody || data?.base64Body}
            />
            {numPages > 1 && directlyRenderPdf(numPages)}
          </>
        ) : (
          <Empty text="非图片和文本格式,暂时不支持预览" />
        )}
      </>
    );
  return <>{responsePreview}</>;
};

export default Preview;
