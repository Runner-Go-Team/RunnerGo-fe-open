import React, { useState } from 'react';
import produce from 'immer';
import {
  isArray,
  isEmpty,
  isNumber,
  isObject,
  isPlainObject,
  isString,
  isUndefined,
  trim,
} from 'lodash';
import { useMemoizedFn } from 'apt-hooks';
import NodeList from '../nodeList';
import { getItemType } from '../common';
import EditRow from './edting';
import EmptyRow from './empty';
import DataModel from './dataModel';

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
    onAddSiblingNode = () => undefined,
    onLinkSchema = () => undefined,
    singleOnly = false,
    onCancelLinkSchema,
    isModelItem,
    onChangeRefs,
    overrideData,
    linkSchema,
    parentModels,
  } = props;
  const [expand, setExpand] = useState(true);

  const nodeType = getItemType(value);

  const txtKeyRef = React.useRef(null);

  // 修改单个属性
  const handleChange = useMemoizedFn((attr, newVal) => {
    const preData = isObject(value) ? value : {};
    const newObject = produce(preData, (draft) => {
      draft[attr] = newVal;
      if (attr === 'type') {
        delete draft.mock;
      }
    });
    onChange(nodeKey, newObject);
  });

  // 修改多个属性
  const handleMultiChange = useMemoizedFn((params) => {
    const preData = isObject(value) ? value : {};
    if (isArray(params) && (isString(nodeKey) || isNumber(nodeKey))) {
      const newObject = produce(preData, (draft) => {
        params.forEach(([key, newVal]) => {
          draft[key] = newVal;
        });
      });
      onChange(nodeKey, newObject);
    }
  });

  // 设置/取消设置必填
  const handleSetRequired = useMemoizedFn((required) => {
    onSetRequired(nodeKey, required);
  });

  const handleSaveChanges = useMemoizedFn((newObject) => {
    onChange(nodeKey, newObject);
  });

  // 删除节点
  const handleDeleteNode = useMemoizedFn(() => {
    onDeleteNode(nodeKey, false);
  });

  // 删除模型引用
  const handleDeleteModel = () => {
    onDeleteNode(nodeKey, true);
  };

  // 添加新节点
  const handleAddNode = useMemoizedFn(() => {
    const preData = isPlainObject(value) ? value : {};
    if (nodeType === 'object') {
      const initData = isPlainObject(preData?.properties)
        ? preData
        : { ...preData, properties: {} };

      // 如果存在已有key为空的项，禁止添加
      if (Object.keys(initData?.properties)?.some((item) => isEmpty(trim(item)))) {
        return;
      }

      const newKey = ``;
      const newObject = produce(initData, (draft) => {
        // const addIndex = newIndex(1);
        draft.properties[newKey] = {
          type: 'string',
          APIPOST_NEW_EMPTY_ROW: true,
        };
      });
      onChange(nodeKey, newObject);
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
      onChange(nodeKey, newObject);
    }
    if (nodeType === 'oneOf') {
      const initData = isArray(preData?.oneOf) ? preData : { ...preData, oneOf: [] };
      const newObject = produce(initData, (draft) => {
        draft.oneOf.push({
          type: 'string',
        });
      });
      onChange(nodeKey, newObject);
    }
    if (nodeType === 'anyOf') {
      const initData = isArray(preData?.anyOf) ? preData : { ...preData, anyOf: [] };
      const newObject = produce(initData, (draft) => {
        draft.anyOf.push({
          type: 'string',
        });
      });
      onChange(nodeKey, newObject);
    }
    if (nodeType === 'allOf') {
      const initData = isArray(preData?.allOf) ? preData : { ...preData, allOf: [] };
      const newObject = produce(initData, (draft) => {
        draft.allOf.push({
          type: 'string',
        });
      });
      onChange(nodeKey, newObject);
    }
    setExpand(true);
  });

  const handleAddSiblingNode = useMemoizedFn(() => {
    onAddSiblingNode(nodeKey);
  });

  const handleEmptyKeyChange = useMemoizedFn((oldKey, newKey) => {
    onNodeKeyChange(oldKey, newKey);
    setTimeout(() => {
      txtKeyRef.current?.focus();
    }, 0);
  });

  const handleLinkSchema = useMemoizedFn((schema) => {
    onLinkSchema(nodeKey, schema);
  });

  const handleCancelLinkSchema = useMemoizedFn(() => {
    onCancelLinkSchema(nodeKey);
  });

  function handleChangeRef(...args) {
    onChangeRefs.apply(null, [nodeKey, ...args]);
  }

  const itemKeyProps = {
    nodeType,
    nodeKey,
    deepIndex,
    onNodeKeyChange,
    readOnly,
    expand,
    setExpand,
    onChange: handleChange,
    isRequired,
    onUpdateRequired: handleSetRequired,
    txtKeyRef,
  };

  if (value === undefined) {
    return <></>;
  }

  if (value.type === 'dataModel') {
    return (
      <DataModel
        {...{
          deepIndex,
          nodeKey,
          nodeValue: value,
          onLinkSchema: handleLinkSchema,
          onDeleteModel: handleDeleteModel,
          onCancelLinkSchema: handleCancelLinkSchema,
          onChangeRefs: handleChangeRef,
          linkSchema,
          parentModels,
        }}
      />
    );
  }

  const renderRowItem = (value) => {
    if (isUndefined(value?.APIPOST_NEW_EMPTY_ROW)) {
      return (
        <EditRow
          {...{
            value,
            nodeKey,
            itemKeyProps,
            handleChange,
            enableDelete,
            handleDeleteNode,
            handleAddNode,
            handleSaveChanges,
            handleAddSiblingNode,
            singleOnly,
            isModelItem,
            onChangeRef: handleChangeRef,
            overrideData,
          }}
        />
      );
    }
    return (
      <EmptyRow
        {...{
          deepIndex,
          nodeKey,
          onNodeKeyChange: handleEmptyKeyChange,
          onDeleteNode: handleDeleteNode,
          onAddSiblingNode: handleAddSiblingNode,
          onLinkSchema: handleLinkSchema,
        }}
      />
    );
  };

  return (
    <>
      {renderRowItem(value)}
      {(expand || value.type === 'dataModel') && (
        <NodeList
          {...{
            deepIndex,
            nodeKey,
            nodeType,
            nodeValue: value,
            onChange: handleChange,
            onMultiChange: handleMultiChange,
            onLinkSchema: handleLinkSchema,
            onDeleteModel: handleDeleteModel,
            onCancelLinkSchema: handleCancelLinkSchema,
            onChangeRefs: handleChangeRef,
            linkSchema,
            parentModels,
          }}
        />
      )}
    </>
  );
};

export default React.memo(ItemNode);
