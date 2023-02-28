import React, { useState } from 'react';
import { Button } from 'adesign-react';
import { isString, isUndefined } from 'lodash';
import { Setting1, Add, Cancel } from 'adesign-react/icons';
import { getItemType } from '../../common';
import ItemSettings from '../itemSettings';
import './index.less';

const ItemManage = (props) => {
  const { value, onChange, onAddNode, onDeleteNode, enableDelete } = props;

  const [modalType, setModalType] = useState(null);
  const nodeType = getItemType(value);


  const isShowAddBtn=['object', 'oneOf', 'allOf', 'anyOf'].includes(nodeType)|| (nodeType==='array'&&isUndefined(value?.items) )


  return (
    <>
      {isString(modalType) && modalType !== 'null' && modalType !== '' && (
        <ItemSettings
          value={value}
          onChange={onChange}
          modalType={modalType}
          setModalType={setModalType}
        />
      )}

      <div className="item-manage">
        {[
          'string',
          'number',
          'array',
          'object',
          'boolean',
          'integer',
          'oneOf',
          'anyOf',
          'allOf',
        ].includes(nodeType) && (
          <Button size="mini" onClick={setModalType.bind(null, nodeType)}>
            <Setting1 width="16px" height="16px" />
          </Button>
        )}
        {enableDelete === true && (
          <Button size="mini" onClick={onDeleteNode}>
            <Cancel width="16px" height="16px" />
          </Button>
        )}
        {isShowAddBtn && (
          <Button size="mini" onClick={onAddNode}>
            <Add width="16px" height="16px" />
          </Button>
        )}
      </div>
    </>
  );
};

export default ItemManage;
