import isObject from 'lodash/isObject';
import React, { useCallback } from 'react';
import ItemNode from '../itemNode';

// interface ArrayItemProps {
//   deepIndex: number;
//   nodeValue: any;
//   onChange: (nodeKey: string, val: any) => void;
//   linkSchema: 'enable' | 'disable';
//   parentModels: React.MutableRefObject<string[]>;
// }

const ArrayItem = (props) => {
  const { deepIndex, nodeValue, onChange, linkSchema, parentModels } = props;

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
            singleOnly: true,
            linkSchema,
            parentModels,
          }}
        />
      )}
    </>
  );
};

export default React.memo(ArrayItem);
