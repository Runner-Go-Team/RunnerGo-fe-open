import { isArray, isNumber } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';
import produce from 'immer';
import { useMemoizedFn } from 'apt-hooks';
import ItemNode from '../itemNode';

// interface OneOfItemProps {
//   deepIndex: number;
//   nodeValue: any;
//   onChange: (nodeKey: string, val: any) => void;
//   parentModels: React.MutableRefObject<string[]>;
// }

const OneOfItem = (props) => {
  const { deepIndex, nodeValue, onChange, parentModels } = props;

  // 修改数据时，保证能取到最新值
  const refData = useRef(null);
  useEffect(() => {
    refData.current = isArray(nodeValue?.oneOf) ? nodeValue.oneOf : [];
  }, [nodeValue]);

  // 修改内容
  const handleChange = useMemoizedFn((attrName, newVal) => {
    const preData = isArray(nodeValue?.oneOf) ? nodeValue.oneOf : [];
    const newData = produce(preData, (draft) => {
      draft[attrName] = newVal;
    });
    onChange('oneOf', newData);
  });

  // 删除属性
  const handleDeleteNode = useCallback((removeIndex) => {
    if (!isNumber(removeIndex)) {
      return;
    }
    const preData = refData.current;
    const newData = produce(preData, (draft) => {
      draft.splice(removeIndex, 1);
    });
    onChange('oneOf', newData);
  }, []);

  const dataList = isArray(nodeValue?.oneOf) ? nodeValue.oneOf : [];

  const handleAddSiblingNode = useMemoizedFn((nodeKey) => {
    const newData = produce(dataList, (draft) => {
      draft.splice(nodeKey + 1, 0, { type: 'string' });
    });
    onChange('oneOf', newData);
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
            parentModels,
          }}
        />
      ))}
    </>
  );
};

export default React.memo(OneOfItem);
