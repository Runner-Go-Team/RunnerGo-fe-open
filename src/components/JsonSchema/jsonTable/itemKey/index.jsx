import React from 'react';
import { Button, Input } from 'adesign-react';
import { CaretRight, CaretDown } from 'adesign-react/icons';
import './index.less';

const ItemKey = (props) => {
  const {
    nodeType,
    nodeKey,
    deepIndex,
    onNodeKeyChange = () => undefined,
    readOnly,
    expand,
    setExpand,
    style,
  } = props;
  return (
    <div className="item-name" style={{ flex: '1', display: 'flex', ...style }}>
      <div className="indent-panel" style={{ paddingLeft: 30 * deepIndex }}>
        <div style={{ width: 40 }}>
          {['object', 'array', 'oneOf', 'anyOf', 'allOf'].includes(nodeType) && (
            <Button size="mini" onClick={setExpand.bind(null, !expand)}>
              {expand ? (
                <CaretDown width="12px" height="12px" />
              ) : (
                <CaretRight width="12px" height="12px" />
              )}
            </Button>
          )}
        </div>
      </div>
      <Input
        style={{ flex: 1 }}
        size="mini"
        spellCheck={false}
        readonly={readOnly}
        className="schema-text-box"
        value={`${nodeKey}`}
        onChange={onNodeKeyChange.bind(null, nodeKey)}
      />
    </div>
  );
};

export default ItemKey;
