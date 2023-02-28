import React, { useEffect, useState } from 'react';
import { Drawer, Button, Message } from 'adesign-react';
import { Code as CodeSvg, Copy as CopySvg } from 'adesign-react/icons';
import Har2languages from 'har2languages';
import Apipost2har from 'apipost2har';
import cn from 'classnames';
import MonacoEditor from '@components/MonacoEditor';
import { copyStringToClipboard, completionHttpProtocol } from '@utils';
import { isArray, isObject, isString } from 'lodash';
import { GenerateWrapper } from './style';

const har2languages = new Har2languages();
const apipost2har = new Apipost2har();
const GenerateCode = (props) => {
  const { data, onCancel } = props;

  const [menuKey, setMenuKey] = useState('shell.curl');
  const [codeText, setCodeText] = useState('');
  const [monacoLanguage, setMonacoLanguage] = useState('javascript');

  // 复制代码
  const handleCopy = () => {
    copyStringToClipboard(codeText, true);
  };

  const menuClick = (language, subclass) => {
    const harRes = apipost2har.convert(data);
    if (harRes?.status === 'error') {
      Message('error', harRes?.message);
      return;
    }
    isString(harRes?.data?.url) && completionHttpProtocol(harRes.data);
    const languagesRes = har2languages.convert(harRes?.data, language, subclass);
    if (languagesRes?.status === 'error') {
      Message('error', languagesRes?.message);
      return;
    }
    setCodeText(languagesRes?.data || '');
    setMenuKey(`${language}.${subclass}`);
    setMonacoLanguage(isString(language) && language === 'node' ? 'javascript' : language);
  };
  useEffect(() => {
    menuClick('shell', 'curl');
  }, []);
  const generateMenuDom =
    isObject(har2languages.languages) &&
    Object.keys(har2languages.languages).map((language) => {
      if (isArray(har2languages.languages[language])) {
        return har2languages.languages[language].map((subclass) => (
          <div
            className={cn('menu-item', { active: `${language}.${subclass}` === menuKey })}
            key={`${language}.${subclass}`}
            onClick={() => {
              menuClick(language, subclass);
            }}
          >
            {`${language}(${subclass})`}
          </div>
        ));
      }
      return '';
    });
  return (
    <Drawer
      visible
      width={860}
      mask={false}
      onCancel={onCancel}
      className={GenerateWrapper}
      title={
        <>
          <CodeSvg width="14px" height="14px"></CodeSvg>
          生成代码
        </>
      }
      footer={null}
    >
      <div className="generate-wrapper">
        <div className="generate-wrapper-menu">{generateMenuDom}</div>
        <div className="generate-wrapper-editor">
          <div>
            <Button
              size="mini"
              onClick={handleCopy}
              preFix={<CopySvg width="12px" height="12px" />}
            >
              复制代码
            </Button>
          </div>
          <div style={{ height: 'calc(100% - 32px)' }}>
            <MonacoEditor
              value={codeText}
              onChange={(val) => {
                setCodeText(val);
              }}
              language={monacoLanguage}
            ></MonacoEditor>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default GenerateCode;
