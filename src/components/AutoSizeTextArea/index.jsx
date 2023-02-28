import React, { useRef, useState } from 'react';
import cn from 'classnames';
import ContentEditable from './ContentEditable';
import './index.less';

const AutoSizeTextArea = (props) => {
  const {
    value,
    onBlur = () => undefined,
    onChange,
    onFocus = () => undefined,
    readonly = false,
    ...restProps
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editStyle, setEditStyle] = useState({});

  const refTextbox = useRef(null);

  const handleOnFocus = () => {
    if (refTextbox.current === null) {
      return;
    }
    const sourceOffset = refTextbox.current?.getBoundingClientRect();

    // setEditStyle({
    //   width: sourceOffset.width,
    //   left: sourceOffset.left,
    //   top: sourceOffset.top,
    // });
    setIsEditing(true);
    onFocus();
  };

  const handleOnBlur = (e) => {
    // setEditStyle({});
    setIsEditing(false);
    onBlur(e);
  };

  const handleChange = (e) => {
    // const  sanitizeConf = {
    //   allowedTags: ["b", "i", "em", "strong", "a", "p", "h1"],
    //   allowedAttributes: { }
    // };

    // const newContent= sanitizeHtml(e.target.value, sanitizeConf)
    if (!readonly) onChange(e.target.value);
  };

  return (
    <ContentEditable
      {...restProps}
      html={value}
      onChange={handleChange}
      className={cn('auto-size-textbox mousetrap', {
        'edit-mode': isEditing,
      })}
      innerRef={refTextbox}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      spellCheck="false"
      style={editStyle}
      contentEditable="plaintext-only"
    />
  );
};

export default AutoSizeTextArea;
