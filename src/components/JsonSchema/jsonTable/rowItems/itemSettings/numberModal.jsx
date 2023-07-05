import React, { useEffect, useRef } from 'react';
import { Input, InputNumber, Switch, CheckBox } from 'adesign-react';
import { isEmpty, isNumber, isUndefined, trim } from 'lodash';
import { useSafeState } from 'apt-hooks';

const Textarea = Input.Textarea;

const NumberModal = (props) => {
  const { value, onChange } = props;

  const [caseValue, setCaseValue] = useSafeState([]);
  const pressKey = useRef(null);
  const handleKeyPress = (ev) => {
    pressKey.current = ev.code;
  };
  useEffect(() => {
    setCaseValue(value.enum);
  }, [value.enum]);

  const handleChangeEnum = (value, e) => {
    if (
      pressKey.current.indexOf('Digit') === -1 &&
      !['NumpadEnter', 'Enter', 'Backspace'].includes(pressKey.current)
    ) {
      return;
    }

    const newNumArray = isEmpty(value) ? [] : value?.split('\n');
    setCaseValue(newNumArray);
    if (['NumpadEnter', 'Enter'].includes(pressKey.current)) {
      return;
    }
    const numberList = [];
    for (const valItem of newNumArray) {
      const parsedValue = !isEmpty(trim(valItem)) ? Number(valItem) : null;
      if (isNumber(parsedValue) && !isNaN(parsedValue)) {
        numberList.push(parsedValue);
      }
    }
    onChange('enum', numberList);
  };

  return (
    <>
      <div className="set-title">基础设置</div>
      <div className="base-setting">
        <div className="item-line">
          <div className="case-title">默认值:</div>
          <InputNumber
            size="mini"
            min={-Infinity}
            className="case-value"
            value={isNumber(value?.default) ? value?.default : 0}
            onChange={onChange.bind(null, 'default')}
          />
        </div>
        <div className="item-line">
          <div className="case-title">exclusiveMinimum:</div>
          <div className="case-value">
            <Switch
              size="small"
              checked={value?.exclusiveMinimum}
              onChange={onChange.bind(null, 'exclusiveMinimum')}
            />
          </div>
          <div className="case-title">exclusiveMaximum:</div>
          <div className="case-value">
            <Switch
              size="small"
              checked={value?.exclusiveMaximum}
              onChange={onChange.bind(null, 'exclusiveMaximum')}
            />
          </div>
        </div>
        <div className="item-line">
          <div className="case-title">最小值:</div>
          <div className="case-value">
            <InputNumber
              size="mini"
              min={0}
              value={isNumber(value?.minimum) ? value?.minimum : 0}
              onChange={onChange.bind(null, 'minimum')}
            />
          </div>
          <div className="case-title">最大值:</div>
          <div className="case-value">
            <InputNumber
              size="mini"
              min={0}
              value={isNumber(value?.maximum) ? value?.maximum : 0}
              onChange={onChange.bind(null, 'maximum')}
            />
          </div>
        </div>
        <div className="item-line">
          <div className="case-title">
            <span style={{ paddingRight: 5 }}>枚举</span>
            <CheckBox
              checked={value?.apipost_enable_enum === true ? 'checked' : 'uncheck'}
              onChange={onChange.bind(null, 'apipost_enable_enum', !value?.apipost_enable_enum)}
            />
            <span>:</span>
          </div>
          <div className="case-value">
            <Textarea
              readonly={value?.apipost_enable_enum !== true}
              size="mini"
              height={40}
              autoSize={false}
              value={isUndefined(caseValue) ? '' : caseValue?.join('\n')}
              onKeyDown={handleKeyPress}
              onChange={handleChangeEnum}
            />
          </div>
        </div>
        <div className="item-line">
          <div className="case-title">备注:</div>
          <div className="case-value">
            <Textarea
              size="mini"
              height={40}
              autoSize={false}
              value={value?.enumDesc}
              onChange={onChange.bind(null, 'enumDesc')}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NumberModal;
