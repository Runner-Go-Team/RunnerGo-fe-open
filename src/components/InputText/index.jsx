import React, { useState, useEffect, useRef } from "react";
import { Input, Tooltip } from '@arco-design/web-react';
import { IconEdit } from '@arco-design/web-react/icon';
import './index.less';
import { isFunction, isString } from "lodash";

const InputText = (props) => {
    const { value, onChange, maxLength, placeholder, disabled, maxWidth } = props;
    // 是否展示输入框
    const [showInput, setShowInput] = useState(false);
    // 展示的文本内容
    const [text, setText] = useState('');
    const inputRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        if (isString(value)) {
            setText(value);
        }
    }, [value]);

    const toggleView = () => {
        setShowInput(false)
    }

    useEffect(() => {
        if (showInput) {
            inputRef.current.focus();
        }
    }, [showInput]);

    return (
        <div className="input-text-component">
            {
                showInput ?
                    <Input autoFocus ref={inputRef} showWordLimit disabled={disabled} placeholder={placeholder} maxLength={maxLength} value={text} onChange={(e) => setText(e)} onBlur={() => {
                        if (isFunction(onChange) && text !== value) {
                            onChange(text);
                            toggleView()
                        }
                    }} />
                    : <div className="default-status">
                        {
                            textRef.current && textRef.current.clientWidth >= 200 ?
                                <Tooltip color="var(--select-hover)" content={text}>
                                    <p style={maxWidth ? { maxWidth: maxWidth } : {}} className="ellipsis" ref={textRef}>{text}</p>
                                </Tooltip>
                                : 
                                    <p ref={textRef}>{text}</p>
                        }

                        <IconEdit onClick={() => {
                            setShowInput(true);
                        }} />
                    </div>

            }
        </div>
    )
};

export default InputText;