import { isArray, isNumber } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';
import produce from 'immer';
import ItemNode from '../itemNode';

const AnyOfItem = (props) => {
  const { deepIndex, nodeValue, onChange } = props;

  // 修改数据时，保证能取到最新值
  const refData = useRef(null);
  useEffect(() => {
    refData.current = isArray(nodeValue?.anyOf) ? nodeValue.anyOf : [];
  }, [nodeValue]);

  // 修改内容
  const handleChange = useCallback((attrName, newVal) => {
    const preData = refData.current;
    const newData = produce(preData, (draft) => {
      draft[attrName] = newVal;
    });
    onChange('anyOf', newData);
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
    onChange('anyOf', newData);
  }, []);

  const dataList = isArray(nodeValue?.anyOf) ? nodeValue.anyOf : [];

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
          }}
        />
      ))}
    </>
  );
};

export default React.memo(AnyOfItem);
