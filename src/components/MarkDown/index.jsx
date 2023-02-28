import React, { useRef, useEffect, useState } from 'react';
import { Message } from 'adesign-react';
import { Editor } from '@toast-ui/react-editor';
import { useSelector } from 'react-redux';
import '@toast-ui/editor/dist/toastui-editor.css';
// import '@toast-ui/editor/dist/i18n/zh-CN'; // TODO 需要找保保
import './themes/default.less';
import './themes/dark.less';
import { saveOssFile } from '@services/oss';
import { openUrl } from '@utils';

const MarkDown = (props) => {
  const { value, onChange = () => undefined, onBlur = () => undefined, ...restProps } = props;

  const editorRef = useRef(null);
  // 编辑器主题色
  const [editotThem, seteditotThem] = useState('white');

  const handleChange = (val) => {
    const markdownContent = editorRef.current?.editorInst?.getMarkdown();
    onChange(markdownContent);
  };
  const handleBlur = () => {
    const markdownContent = editorRef.current?.editorInst?.getMarkdown();
    onBlur(markdownContent);
  };

  const { config } = useSelector((d) => d?.user);
  const { SYSTHEMCOLOR } = config || { SYSTHEMCOLOR: 'white' };
  useEffect(() => {
    if (SYSTHEMCOLOR === 'white') {
      seteditotThem('defalut');
    } else {
      seteditotThem('dark');
    }
  }, [SYSTHEMCOLOR]);
  // useEffect(() => {
  //   if (editorRef.current !== null) {
  //     editorRef.current?.editorInst?.setMarkdown(value);
  //   }
  // }, [value]);

  const addImageBlobHook = (blob, callback) => {
    const data = new FormData();
    data.append('oss_type', 1);
    data.append('files', blob);
    saveOssFile(data).subscribe({
      next(resp) {
        if (resp?.code === 10000) {
          callback(resp.data, blob.name);
        } else {
          Message('error', resp.msg);
        }
      },
      error() {
        Message('error', '上传失败');
      },
    });
    return false;
  };

  const defaultSettings = {
    hooks: {
      addImageBlobHook,
    },
    language: 'zh-CN',
    initialValue: value,
    initialEditType: 'wysiwyg', // ['markdown', 'wysiwyg']
    previewStyle: 'vertical',
    useCommandShortcut: false,
    height: '100%',
    onChange: handleChange,
    onBlur: handleBlur,
  };
  const LinkMark = (e) => {
    if (e?.target?.tagName === 'A') {
      e && e.preventDefault();
      openUrl(e?.target?.href);
    }
  };
  useEffect(() => {
    try {
      document
        .querySelector('.toastui-editor-md-preview')
        ?.addEventListener('click', (e) => LinkMark(e));
    } catch (error) {

    }
    return () => {
      try {
        document
          .querySelector('.toastui-editor-md-preview')
          ?.removeEventListener('click', (e) => LinkMark(e));
      } catch (error) {

      }
    };
  }, []);
  return (
    <>
      <Editor ref={editorRef} theme={editotThem} {...defaultSettings} {...restProps} />
    </>
  );
};

export default MarkDown;
