import React, { useState, useImperativeHandle } from 'react';
import MonacoEditor from '@components/MonacoEditor';
import { EditFormat } from '@utils';

const Beautify = (props) => {
  const { mode, value, currentRef } = props;
  const [editorDom, setEditorDom] = useState(null);
  const { mode: language, value: editValue } = EditFormat(value);
  const handleSetEditor = (editor) => {
    setEditorDom(editor);
  };
  useImperativeHandle(currentRef, () => ({
    searchOpen: () => {
      try {
        editorDom.getContribution('editor.contrib.findController')._start({}, true);
      } catch (error) {
      }
    },
  }));
  return (
    <MonacoEditor
      Height="100%"
      editorDidMount={handleSetEditor}
      language={mode || language}
      options={{ readOnly: true, minimap: { enabled: false } }}
      value={editValue || ''}
    />
  );
};
export default Beautify;
