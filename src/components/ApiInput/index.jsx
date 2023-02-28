import React, { useState } from 'react';
import { Input } from 'adesign-react';
import cn from 'classnames';
import { iGetFieldPos, getFocus } from '@utils';
import EnvVars from '../EnvVars';
import { metionWrapper } from './style';

const Textarea = Input.Textarea;

const ApiInput = (props) => {
  const { value, onChange, placeholder, readonly = false, afterFix, onBlur, onModal, disabled = false } = props;

  const [envVisible, setEnvVisible] = useState(false);
  const [envObj, setEnvObj] = useState({});

  const inputChange = (str, e) => {
    const atChar = str.charAt(iGetFieldPos(e.target));
    // if (atChar !== '{') {
    //   const lastChar = str.charAt(iGetFieldPos(e.target) - 1);
    //   const secondLastChar = str.charAt(iGetFieldPos(e.target) - 2);
    //   const thirdLastChar = str.charAt(iGetFieldPos(e.target) - 3);
    //   if (
    //     atChar !== '{' &&
    //     ((lastChar === '{' && secondLastChar !== '{') ||
    //       (lastChar === '{' && secondLastChar === '{' && thirdLastChar !== '{'))
    //   ) {
    //     const position = e.target.getBoundingClientRect();
    //     // const p = getInputPositon(e.target);
    //     setEnvVisible(true);
    //     setEnvObj({
    //       positionObj: {
    //         bottom: 312.5,
    //         inputIndex: getFocus(e.target),
    //         left: onModal ? 'auto' : position.x,
    //         top: onModal ? position.y - 125 : position.y,
    //       },
    //       secondLastChar,
    //       text: str,
    //     });
    //   } else if (envVisible) {
    //     setEnvVisible(false);
    //   }
    // } else if (envVisible) {
    //   setEnvVisible(false);
    // }
    onChange(str);
  };

  return (
    <div
      className={cn(metionWrapper, {
        onModal,
      })}
    >
      <Textarea
        value={value}
        placeholder={placeholder}
        readonly={readonly}
        onChange={(val, e) => {
          inputChange(val, e);
        }}
        onBlur={onBlur}
        height={24}
        bordered={false}
        disabled={disabled}
        onKeyDown={(e) => {
          // 38上 40下 13回车
          const keyCode = e.keyCode || e.which;
          if (envVisible && (keyCode === 38 || keyCode === 40 || keyCode === 13)) {
            e.preventDefault();
          }
        }}
        style={{ wordBreak: 'break-all' }}
      ></Textarea>
      {afterFix !== undefined && afterFix}
      {/* {envVisible && (
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
      )} */}
    </div>
  );
};

export default ApiInput;
