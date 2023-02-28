import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CheckBox } from 'adesign-react';
import produce from 'immer';
import { isArray, isFunction, isNumber, isObject, isString, isUndefined } from 'lodash';
import ItemKey from '../itemKey';
import NodeList from '../nodeList';
import { getItemType } from '../../common';
import ItemType from '../itemType';
import ItemMock from '../itemMock';
import ItemDescription from '../itemDescription';
import ItemManage from '../itemManage';

const ItemNode = (props) => {
  const {
    value,
    nodeKey,
    onChange = () => undefined,
    onNodeKeyChange = () => undefined,
    deepIndex,
    readOnly,
    isRequired,
    onSetRequired = () => undefined,
    onDeleteNode,
    enableDelete = true,
  } = props;
  const [expand, setExpand] = useState(false);

  const nodeType = getItemType(value);

  const refKey = useRef(null);
  useEffect(() => {
    refKey.current = nodeKey;
  }, [nodeKey]);

  const refData = useRef(null);
  useEffect(() => {
    refData.current = value;
  }, [value]);

  // 修改单个属性
  const handleChange = (attr, newVal) => {
    const preData = isObject(refData?.current) ? refData.current : {};
    const newObject = produce(preData, (draft) => {
      draft[attr] = newVal;
    });
    const preKey = refKey.current;
    onChange(preKey, newObject);
  };

  // 修改多个属性
  const handleMultiChange = (params) => {
    const preKey = refKey.current;
    const preData = isObject(refData?.current) ? refData.current : {};
    if (isArray(params) && (isString(preKey) || isNumber(preKey))) {
      const newObject = produce(preData, (draft) => {
        params.forEach(([key, newVal]) => {
          draft[key] = newVal;
        });
      });
      onChange(preKey, newObject);
    }
  };

  // 设置/取消设置必填
  const handleSetRequired = () => {
    onSetRequired(nodeKey, !isRequired);
  };

  const handleSaveChanges = (newObject) => {
    const preKey = refKey.current;
    onChange(preKey, newObject);
  };

  // 删除节点
  const handleDeleteNode = () => {
    const preKey = refKey.current;
    onDeleteNode(preKey);
  };

  // 添加新节点
  const handleAddNode = () => {
    const preKey = refKey.current;
    const preData = isObject(refData?.current) ? refData?.current : {};
    if (nodeType === 'object') {
      const initData = isObject(preData?.properties) ? preData : { ...preData, properties: {} };
      const newObject = produce(initData, (draft) => {
        const newIndex = (index) => {
          if (isUndefined(draft.properties[`filed${index}`])) {
            return index;
          }
          return newIndex(index + 1);
        };
        const addIndex = newIndex(1);
        draft.properties[`filed${addIndex}`] = {
          type: 'string',
        };
      });
      onChange(preKey, newObject);
    }
    if (nodeType === 'array') {
      if (!isUndefined(preData?.items)) {
        return;
      }
      const newObject = produce(preData, (draft) => {
        draft.items = {
          type: 'string',
          title: 'Items',
        };
      });
      onChange(preKey, newObject);
    }
    if (nodeType === 'oneOf') {
      const initData = isArray(preData?.oneOf) ? preData : { ...preData, oneOf: [] };
      const newObject = produce(initData, (draft) => {
        draft.oneOf.push({
          type: 'string',
        });
      });
      onChange(preKey, newObject);
    }
    if (nodeType === 'anyOf') {
      const initData = isArray(preData?.anyOf) ? preData : { ...preData, anyOf: [] };
      const newObject = produce(initData, (draft) => {
        draft.anyOf.push({
          type: 'string',
        });
      });
      onChange(preKey, newObject);
    }
    if (nodeType === 'allOf') {
      const initData = isArray(preData?.allOf) ? preData : { ...preData, allOf: [] };
      const newObject = produce(initData, (draft) => {
        draft.allOf.push({
          type: 'string',
        });
      });
      onChange(preKey, newObject);
    }
    setExpand(true);
  };

  return (
    <>
      <div className="data-item" style={{ width: '100%' }}>
        <ItemKey
          {...{
            nodeType,
            nodeKey,
            deepIndex,
            onNodeKeyChange,
            readOnly,
            expand,
            setExpand,
          }}
          style={{ flex: 3 }}
        />
        <CheckBox
          checked={isRequired === true ? 'checked' : 'uncheck'}
          disabled={readOnly === true}
          className="ckb-require"
          onChange={handleSetRequired}
        />
        <ItemType value={nodeType} onChange={handleChange.bind(null, 'type')} />
        <ItemMock
          disabled={['object', 'array', 'oneOf', 'anyOf', 'allOf'].includes(nodeType)}
          value={value?.mock?.mock}
          onChange={handleChange.bind(null, 'mock')}
        />
        <ItemDescription
          value={value?.description}
          onChange={handleChange.bind(null, 'description')}
        />
        <ItemManage
          enableDelete={enableDelete}
          value={value}
          onChange={handleSaveChanges}
          onDeleteNode={handleDeleteNode}
          onAddNode={handleAddNode}
        />
      </div>

      {expand && (
        <NodeList
          {...{
            deepIndex,
            nodeType,
            nodeValue: value,
            onChange: handleChange,
            onMultiChange: handleMultiChange,
          }}
        />
      )}
    </>
  );
};

export default React.memo(ItemNode);
