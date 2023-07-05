import React, { useState } from 'react';
import { Input } from 'adesign-react';
import { iGetFieldPos, getFocus } from '@utils';
import EnvVars from '@components/EnvVars';

const UrlInput = (props) => {
    const { value, onChange, placeholder, readonly = false, afterFix, onBlur, onModal } = props;

    const inputChange = (str, e) => {
        onChange(str);
    };

    return (
        <>
            <Input
                size="middle"
                className="api-url"
                value={value}
                placeholder={placeholder}
                readonly={readonly}
                onChange={(val, e) => {
                    inputChange(val, e);
                }}
                onBlur={onBlur}
            ></Input>
            {afterFix !== undefined && afterFix}
        </>
    );
};

export default UrlInput;
