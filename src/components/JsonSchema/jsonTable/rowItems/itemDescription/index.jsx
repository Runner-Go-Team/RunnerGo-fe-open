import React, { useState } from 'react';
import { Button, Input, Tooltip } from 'adesign-react';
import cn from 'classnames';
import { isUndefined, isString } from 'lodash';
import { Setting1, Add, Delete as SvgDelete } from 'adesign-react/icons';
import { itemWrapper, itemModel } from './style';
import ItemSettings from '../itemSettings';
import { getItemType } from '../../common';

// interface Props {
//   value: any;
//   onChange: (key: string, val: any) => void;
//   onDeleteNode: () => void;
//   onAddNode: () => void;
//   enableDelete: boolean;
//   onManageChange: (newObj: any) => void;
//   onAddSiblingNode: () => void;
//   singleOnly: boolean;
// }

const ItemMock = (props) => {
  const {
    value,
    onChange,
    onAddNode,
    onDeleteNode,
    enableDelete,
    onManageChange,
    onAddSiblingNode = () => undefined,
    singleOnly = false,
  } = props;

  const [modalType, setModalType] = useState(null);
  const nodeType = getItemType(value);

  const showSetting = [
    'string',
    'number',
    'array',
    'object',
    'boolean',
    'integer',
    'oneOf',
    'anyOf',
    'allOf',
  ].includes(nodeType);

  const isShowAddBtn =
    ['object', 'oneOf', 'allOf', 'anyOf'].includes(nodeType) ||
    (nodeType === 'array' && isUndefined(value?.items));

  const showSiblingAdd =
    ['string', 'number', 'boolean', 'integer', 'null'].includes(nodeType) &&
    !singleOnly &&
    !isShowAddBtn;

  return (
    <div className={cn('schema-td', 'table-td')}>
      {isString(modalType) && modalType !== 'null' && modalType !== '' && (
        <ItemSettings
          value={value}
          onChange={onManageChange}
          modalType={modalType}
          setModalType={setModalType}
        />
      )}

      <div className={cn('schema-td-warper', itemWrapper)}>
        <Input
          className="txt-description"
          size="mini"
          placeholder="字段描述"
          value={value?.description}
          onChange={onChange.bind(null, 'description')}
        />
        <div className="item-manage">
          {showSetting && (
            <Button className="btn-item" size="mini" onClick={setModalType.bind(null, nodeType)}>
              <Setting1 width="16px" height="16px" />
            </Button>
          )}
          {enableDelete === true && (
            <Button className="btn-item" size="mini" onClick={onDeleteNode}>
              <SvgDelete width="16px" height="16px" />
            </Button>
          )}
          {isShowAddBtn && (
            <Tooltip content="添加子节点" placement="top-end" offset={[15, 8]}>
              <Button className="btn-item" size="mini" onClick={onAddNode}>
                <Add width="16px" height="16px" />
              </Button>
            </Tooltip>
          )}
          {showSiblingAdd && (
            <Tooltip content="添加相邻节点" placement="top-end" offset={[15, 8]}>
              <Button className="btn-item" size="mini" onClick={onAddSiblingNode}>
                <Add width="16px" height="16px" />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemMock;
