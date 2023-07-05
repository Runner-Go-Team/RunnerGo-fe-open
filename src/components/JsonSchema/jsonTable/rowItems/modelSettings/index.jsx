import React from 'react';
import { Input, Tooltip, Button } from 'adesign-react';
import { Iconeye, Invisible, Link as SvgLink } from 'adesign-react/icons';
import { isPlainObject } from 'lodash';
import cn from 'classnames';
import { itemModelWarper } from './style';

// interface Props {
//   value: any;
//   overrideData: any;
//   onShow: () => void;
//   onHide: () => void;
//   onLinkItem: () => void;
//   onCancelLinkItem: () => void;
//   onChange: (key: string, newVal: string) => void;
// }

const ItemMock = (props) => {
  const { value, overrideData, onShow, onHide, onLinkItem, onCancelLinkItem, onChange } = props;

  const isUnLinkState = isPlainObject(overrideData);

  return (
    <div className={cn('schema-td', 'table-td')}>
      <div className={itemModelWarper}>
        {isUnLinkState ? (
          <>
            <Input
              className="txt-box"
              value={value?.description}
              onChange={onChange.bind(null, 'description')}
            />
            <div className="item-manage">
              <Tooltip content="恢复关联" placement="top-end" offset={[15, 8]}>
                <Button className="btn-item" size="mini" onClick={onLinkItem}>
                  <SvgLink width="16px" height="16px" />
                </Button>
              </Tooltip>
            </div>
          </>
        ) : (
          <>
            <div className="txt-description">{value?.description}</div>
            <div onClick={onCancelLinkItem} className="btn-hide">
              {/* <SvgUnLink /> */}
              <span>解除关联</span>
            </div>
            {overrideData === null ? (
              <div onClick={onShow} className="btn-hide">
                <Iconeye />
                <span>显示字段</span>
              </div>
            ) : (
              <div onClick={onHide} className="btn-hide">
                <Invisible />
                <span>隐藏字段</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ItemMock;
