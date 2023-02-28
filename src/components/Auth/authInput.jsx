import React, { useState } from 'react';
import { Input } from 'adesign-react';
import { iGetFieldPos, getFocus } from '@utils';
import EnvVars from '@components/EnvVars';

const AuthInput = (props) => {
  const { value, onChange, placeholder, readonly = false, afterFix, onBlur, onModal } = props;

  const [envVisible, setEnvVisible] = useState(false);
  const [envObj, setEnvObj] = useState({});

  const inputChange = (str, e) => {
    const atChar = str.charAt(iGetFieldPos(e.target));
    if (atChar !== '{') {
      const lastChar = str.charAt(iGetFieldPos(e.target) - 1);
      const secondLastChar = str.charAt(iGetFieldPos(e.target) - 2);
      const thirdLastChar = str.charAt(iGetFieldPos(e.target) - 3);
      if (
        atChar !== '{' &&
        ((lastChar === '{' && secondLastChar !== '{') ||
          (lastChar === '{' && secondLastChar === '{' && thirdLastChar !== '{'))
      ) {
        const position = e.target.getBoundingClientRect();
        setEnvVisible(true);
        setEnvObj({
          positionObj: {
            bottom: 312.5,
            inputIndex: getFocus(e.target),
            left: onModal ? 'auto' : position.x,
            top: onModal ? position.y - 125 : position.y,
          },
          secondLastChar,
          text: str,
        });
      } else if (envVisible) {
        setEnvVisible(false);
      }
    } else if (envVisible) {
      setEnvVisible(false);
    }
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
      {envVisible && (
        <EnvVars
          envVisible={envVisible}
          envObj={envObj}
          onCancel={() => {
            setTimeout(() => {
              setEnvVisible(false);
            }, 100);
          }}
          onChange={(val) => {
            onChange(val);
          }}
        ></EnvVars>
      )}
    </>
  );
};

export default AuthInput;
