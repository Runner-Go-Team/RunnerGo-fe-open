import React, { useMemo } from 'react';
import Mock from 'mockjs';
import { Beautify as BeautifySvg } from 'adesign-react/icons';
import MonacoEditor from '@components/MonacoEditor';
import { EditFormat, openUrl } from '@utils';

const MockPanel = (props) => {
  const { value = '', onChange } = props;

  const MockText = useMemo(() => {
    let text = '';
    try {
      text = Mock.mock(value);
    } catch (ex) {
      return '';
    }
    return text;
  }, [value]);

  const formatJson = () => {
    const beautifyText = EditFormat(value).value;
    onChange(beautifyText);
  };

  return (
    <>
      <div className="jsonpanel-wrapper-handle">
        {/* <Button shape="round" size="mini">
          <Refresh2Svg />
        </Button> */}
        <div className="handle-item" onClick={formatJson}>
          <BeautifySvg />
          美化
        </div>
        <div
          className="handle-item"
          onClick={() =>
            openUrl(
              'https://wiki.apipost.cn/document/00091641-1e36-490d-9caf-3e47cd38bcde/832f6d9f-7951-4361-b959-229666685ba9?reffer=clientApp'
            )
          }
        >
          Mock服务使用文档
        </div>
      </div>
      <div className="jsonpanel-wrapper-mock" style={{ height: 400 }}>
        <MonacoEditor language="json" onChange={onChange} value={value} />
        {/* <div>
          <MonacoEditor language="json" onChange={onChange} value={value} />
        </div>
        <div>
          <MonacoEditor value={MockText} options={{ readOnly: true }} />
        </div> */}
      </div>
    </>
  );
};

export default MockPanel;
