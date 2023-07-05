import React, { useEffect, useState, useMemo } from 'react';
import { Modal, Message } from 'adesign-react';
import './index.less';
import { isUndefined, isObject, isArray, isNumber } from 'lodash';
import MonacoEditor from '@components/MonacoEditor';
import { EditFormat } from '@utils';
import StringModal from './stringModal';
import NumberModal from './numberModal';
import BooleanModal from './booleanModal';
import ArrayModal from './arrayModal';

const MODALPAGES = {
  string: StringModal,
  number: NumberModal,
  integer: NumberModal,
  boolean: BooleanModal,
  array: ArrayModal,
  oneOf: () => null,
  anyOf: () => null,
  allOf: () => null,
  object: () => null,
};

/*
value={value}
onChange={onChange}
modalType={modalType}
setModalType={setModalType}
*/

const ItemSettings = (props) => {
  const { value, onChange, modalType, setModalType } = props;

  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleChange = (attrName, newValue) => {
    const newVal = newValue;
    // if (attrName === 'enum') {
    //   newVal = newValue.split('\n')?.filter((d) => d !== '');
    //   if (['integer', 'number'].includes(tempValue.type)) {
    //     newVal = newVal.map((d) => {
    //       if (d === '-') {
    //         return '-';
    //       }
    //       if (/^-?(\.|\d)+$/.test(d)) {
    //         return Number(d);
    //       }
    //       return '';
    //     });
    //   }
    // }

    const newData = { ...tempValue };
    newData[attrName] = newVal;
    if (attrName === 'apipost_enable_enum' && newVal === false) {
      newData.apipost_enable_enum = undefined;
      newData.enum = undefined;
    }
    if (attrName === 'format' && newValue === '') {
      delete newData.format;
    }

    setTempValue(newData);
  };

  const handleChangeRaw = (val) => {
    let jsonData;
    try {
      jsonData = JSON.parse(val);
    } catch (ex) { }
    if (isObject(jsonData)) {
      setTempValue(jsonData);
    }
  };

  const handleSaveChanges = () => {
    if (value.type === 'integer') {
      if (tempValue?.enum?.some((d) => !isNumber(d))) {
        // fix bug Uncaught TypeError: Cannot read property 'some' of undefined
        Message('error', '枚举参数无效');
        return;
      }
    }
    onChange(tempValue);
    setModalType(null);
  };

  const ModalPage = MODALPAGES[modalType];
  if (isUndefined(ModalPage)) {
    return <></>;
  }

  const beautifyText = isObject(tempValue) ? EditFormat(JSON.stringify(tempValue)).value : '';

  return (
    <Modal
      visible
      title="高级设置"
      onCancel={setModalType.bind(null, null)}
      onOk={handleSaveChanges}
      className='apipost_json_schema_item_editor'
    >
      <div className="modal-schema-settings">
        {/* <ModalPage value={tempValue} onChange={handleChange} /> */}
        <div className="set-title">编辑源码</div>
        <div className="source-setting">
          <div style={{ height: 200 }}>
            <MonacoEditor value={beautifyText} language="json" onChange={handleChangeRaw} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ItemSettings;
