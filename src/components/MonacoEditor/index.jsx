import React, { useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { useSelector } from 'react-redux';
import createDependencyProposals from './dependencyProposals';
import './index.less';
import { isFunction, isArray } from 'lodash';

const ftObj = {
  90: '10px',
  100: '12px',
  110: '14px',
  120: '16px',
};
const fileurl = '/monaco-editor/vs';
// if (isClient()) {
//   const paths = window?.path;
//   fileurl = paths.join(window.__dirname, './public/assets/monaco-editor/vs');
// }
loader.config({
  paths: { vs: fileurl },
  'vs/nls': {
    availableLanguages: { '*': 'zh-cn' },
  },
});
// 给代码编辑加自定义提示
loader.init().then((monaco) => {
  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems(model, position) {
      // find out if we are completing a property in the 'dependencies' object.
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      const match = textUntilPosition.match(
        /"dependencies"\s*:\s*\{\s*("[^"]*"\s*:\s*"[^"]*"\s*,\s*)*([^"]*)?$/
      );
      if (match) {
        return { suggestions: [] };
      }
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: createDependencyProposals(range),
      };
    },
  });
});
const MonacoEditor = (props, ref) => {
  const {
    language,
    _theme,
    onChange,
    value,
    Height,
    options = { minimap: { enabled: false }, scrollbar: { useShadows: false } },
    editorDidMount = undefined,
    lineNumbers = 'on', // 关闭编辑器行号
    showCheck = true // 是否校验并提示数据格式问题
  } = props;


  const { config } = useSelector((d) => d?.user);
  const theme = useSelector((store) => store.user.theme);
  const { SYSTHEMCOLOR } = config || { SYSTHEMCOLOR: 'white' };
  // 切换tab时禁止触发编辑器onchange事件
  const MONOCAINIT = true;
  // 编辑器字号大小
  const SYSSCALE = 100;
  // 编辑器主题色
  const [editotThem, seteditotThem] = useState('vs');
  useEffect(() => {
    if (theme === 'white') {
      seteditotThem('vs');
    } else {
      seteditotThem('vs-dark');
    }
  }, [theme]);

  const [editor, seteditor] = useState();
  const formatEditor = () => {
    // const newVal = EditFormat(editorValue).value;
    // onChange(newVal);
    if (editor && isFunction(editor?.getAction)) {
      editor.getAction('editor.action.formatDocument').run();
    }
  };

  useImperativeHandle(ref, () => ({
    formatEditor,
  }));
  const [ftSize, setFtSize] = useState('14px');
  useEffect(() => {
    setFtSize(ftObj?.[SYSSCALE] || '14px');

  }, [SYSSCALE]);

  // if (isClient()) {
  //   const paths = window?.path;
  //   fileurl = paths.join(window.__dirname, './public/assets/monaco-editor/vs');
  // }
  loader.config({ paths: { vs: fileurl } });

  const JeditorDidMount = (editorJ) => {
    editorJ.trigger('anyString', 'editor.action.formatDocument'); // 自动格式化代码
    seteditor(editorJ);
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: showCheck,
      allowComments: true,
      comments: true,
      trailingCommas: true,
    });

  };
  const mEditor = useMemo(() => {
    return (
      <Editor
        height={Height}
        language={language}
        value={typeof value === 'string' ? value : value?.toString()}
        onMount={(e) => {
          JeditorDidMount(e);
          editorDidMount && editorDidMount(e);
        }}
        onChange={(val, changeObj) => {
          if (
            !isArray(changeObj?.changes) ||
            changeObj.changes.length <= 0 ||
            !changeObj.changes[0]?.forceMoveMarkers
          ) {
            if (onChange) {
              onChange(val);
            }
          }
        }}
        theme={editotThem}
        options={{
          ...options,
          // TODO 编辑器字号跟随系统
          fontSize: ftSize,
          // lineHeight: ftSize,
          hover: {
            enabled: false,
          },
          onemptied: () => null,
          minimap: { enabled: false },
          links: false,
          wordWrap: 'on',
          wrappingIndent: 'same',
          lineNumbers,
        }}
      />
    );
  }, [value, language, Height, editotThem, SYSTHEMCOLOR, SYSSCALE, MONOCAINIT, ftSize]);
  return <>{mEditor}</>;
};

export default forwardRef(MonacoEditor);
