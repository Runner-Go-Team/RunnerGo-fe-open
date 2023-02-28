import produce from 'immer';
import isObject from 'lodash/isObject';
import React, { useCallback } from 'react';
import ItemNode from '../itemNode';

const ArrayItem = (props) => {
  const { deepIndex, nodeValue, onChange } = props;

  // 删除属性
  const handleDeleteNode = useCallback((keyRemove) => {
    onChange('items', undefined);
  }, []);

  return (
    <>
      {isObject(nodeValue?.items) && (
        <ItemNode
          {...{
            value: nodeValue.items,
            nodeKey: 'items',
            isRequired: false,
            readOnly: true,
            deepIndex: deepIndex + 1,
            onNodeKeyChange: () => undefined,
            onDeleteNode: handleDeleteNode,
            onChange,
            enableDelete: true,
          }}
        />
      )}
    </>
  );
};

export default React.memo(ArrayItem);
