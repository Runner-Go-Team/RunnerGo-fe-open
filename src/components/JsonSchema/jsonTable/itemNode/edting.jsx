import React from 'react';
import cn from 'classnames';
import { merge } from 'lodash';
import { useMemoizedFn } from 'apt-hooks';
import produce from 'immer';
import ItemKey from '../rowItems/itemKey';
import ItemMock from '../rowItems/itemMock';
import ItemDescription from '../rowItems/itemDescription';
import ModelSettings from '../rowItems/modelSettings';

// type Props = {
//   value: IDataModel;
//   nodeKey: string;
//   itemKeyProps: ItemKeyProps;
//   handleChange: (attr: string, newVal: any) => void;
//   enableDelete: boolean;
//   handleDeleteNode: () => void;
//   handleAddNode: () => void;
//   handleSaveChanges: (attr: string, newVal: any) => void;
//   handleAddSiblingNode: () => void;
//   singleOnly: boolean;
//   isModelItem?: boolean;
//   onChangeRef: (newVal: any) => void;
//   overrideData: any;
// };

const EditItem = (props) => {
  const {
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
    onChangeRef,
    overrideData,
  } = props;

  // 隐藏字段
  const handleHide = () => {
    onChangeRef(null);
  };

  // 显示字段
  const handleShow = () => {
    onChangeRef(undefined);
  };

  // 解除关联
  const handleCancelLinkItem = () => {
    onChangeRef(value);
  };

  // 解除关联
  const handleLinkItem = () => {
    onChangeRef(undefined);
  };

  const mergedValue = merge(overrideData, value);

  const handleChangeRefValue = useMemoizedFn((key, value) => {
    const newData = produce(mergedValue, (draft) => {
      draft[key] = value;
    });
    onChangeRef(newData);
  });

  return (
    <div
      className={cn({
        'table-tr': true,
        'data-item': true,
        'is-hidden': overrideData === null,
      })}
    >
      <ItemKey {...itemKeyProps} />
      <ItemMock
        disabled={
          ['object', 'array', 'oneOf', 'anyOf', 'allOf'].includes(itemKeyProps.nodeType) ||
          itemKeyProps.deepIndex === 0
        }
        deepIndex={itemKeyProps.deepIndex}
        isModelItem={isModelItem}
        value={mergedValue}
        onChange={isModelItem ? handleChangeRefValue : handleChange}
      />
      {isModelItem ? (
        <ModelSettings
          value={mergedValue}
          onChange={handleChangeRefValue}
          overrideData={overrideData}
          onHide={handleHide}
          onShow={handleShow}
          onCancelLinkItem={handleCancelLinkItem}
          onLinkItem={handleLinkItem}
        />
      ) : (
        <ItemDescription
          enableDelete={enableDelete}
          onDeleteNode={handleDeleteNode}
          onAddNode={handleAddNode}
          value={value}
          onChange={handleChange}
          onManageChange={handleSaveChanges}
          onAddSiblingNode={handleAddSiblingNode}
          singleOnly={singleOnly}
        />
      )}
    </div>
  );
};

export default React.memo(EditItem);
