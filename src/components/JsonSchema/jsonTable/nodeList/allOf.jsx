import { isArray, isNumber } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';
import produce from 'immer';
import { useMemoizedFn } from 'apt-hooks';
import ItemNode from '../itemNode';

// interface AllOfItemProps {
//   deepIndex: number;
//   nodeValue: any;
//   onChange: (nodeKey: string, val: any) => void;
//   linkSchema: 'enable' | 'disable';
//   parentModels: React.MutableRefObject<string[]>;
// }

const AllOfItem = (props) => {
  const { deepIndex, nodeValue, onChange, linkSchema, parentModels } = props;

  // 修改数据时，保证能取到最新值
  const refData = useRef(null);
  useEffect(() => {
    refData.current = isArray(nodeValue?.allOf) ? nodeValue.allOf : [];
  }, [nodeValue]);

  // 修改内容
  const handleChange = useCallback((attrName, newVal) => {
    const preData = refData.current;
    const newData = produce(preData, (draft) => {
      draft[attrName] = newVal;
    });
    onChange('allOf', newData);
  }, []);

  // 删除属性
  const handleDeleteNode = useCallback((removeIndex) => {
    if (!isNumber(removeIndex)) {
      return;
    }
    const preData = refData.current;
    const newData = produce(preData, (draft) => {
      draft.splice(removeIndex, 1);
    });
    onChange('allOf', newData);
  }, []);

  const dataList = isArray(nodeValue?.allOf) ? nodeValue.allOf : [];

  const handleAddSiblingNode = useMemoizedFn((nodeKey) => {
    const newData = produce(dataList, (draft) => {
      draft.splice(nodeKey + 1, 0, { type: 'string' });
    });
    onChange('allOf', newData);
  });

  return (
    <>
      {dataList.map((item, index) => (
        <ItemNode
          key={index}
          {...{
            value: item,
            nodeKey: index,
            readOnly: true,
            deepIndex: deepIndex + 1,
            onNodeKeyChange: () => void 0,
            onChange: handleChange,
            onDeleteNode: handleDeleteNode,
            onAddSiblingNode: handleAddSiblingNode,
            linkSchema,
            parentModels,
          }}
        />
      ))}
    </>
  );
};

export default React.memo(AllOfItem);
