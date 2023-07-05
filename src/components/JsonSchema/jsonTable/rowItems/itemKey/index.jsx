import React, { useRef, useEffect, useContext } from 'react';
import { Button, Select, Tooltip } from 'adesign-react';
import { Right as CaretRight, Down as CaretDown } from 'adesign-react/icons';
import cn from 'classnames';
import { useMemoizedFn, useSafeState } from 'apt-hooks';
import ResizeObserver from 'resize-observer-polyfill';
import produce from 'immer';
import { keyWarper } from './style';
import SplitBar from '../SplitBar';
import { ITEM_TYPES } from './constant';
import schemaContext from '../../context';

// export interface ItemKeyProps {
//   nodeType: string;
//   nodeKey: string;
//   deepIndex: number;
//   onNodeKeyChange: (oldKey: string, newKey: string) => void;
//   readOnly: boolean;
//   expand: boolean;
//   setExpand: (val: boolean) => void;
//   onChange: (attr: string, newVal: any) => void;
//   isRequired: boolean;
//   onUpdateRequired: (required: boolean) => void;
//   txtKeyRef: React.LegacyRef<HTMLInputElement>;
//   minWidth?: number;
// }

const ItemKey = (props) => {
  const {
    nodeType,
    nodeKey,
    deepIndex,
    onNodeKeyChange = () => undefined,
    readOnly,
    expand,
    setExpand,
    onChange = () => undefined,
    isRequired = false,
    onUpdateRequired = (required) => void 0,
    txtKeyRef,
    minWidth = 250,
  } = props;

  const { refTable, layouts, setLayouts } = useContext(schemaContext);
  const tdWidth = layouts?.[0]?.width ?? 400;
  const refContainerWarper = useRef(null);

  const handleUpdateRequired = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onUpdateRequired(!isRequired);
  };

  const showArrow = ['object', 'array', 'oneOf', 'anyOf', 'allOf'].includes(nodeType);

  const renderType = (mergedValue, childrenList, selectedText) => {
    return (
      <>
        <div className="sel-title">{selectedText}</div>
        {isRequired && (<Tooltip content="是否必填" placement="top" offset={[-2, 8]}>
          <div
            className={cn({
              'spn-require': true,
              checked: isRequired,
            })}
            onClick={handleUpdateRequired}
          >
            *
          </div>
        </Tooltip>)}
      </>
    );
  };

  const handleUpdateWidth = useMemoizedFn((newWidth) => {
    const newLayouts = produce(layouts, (draft) => {
      draft[0].width = newWidth;
      draft[0].flex = 'unset';
    });
    setLayouts(newLayouts);
  });

  useEffect(() => {
    if (deepIndex !== 0) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (tdWidth < width) {
          handleUpdateWidth(width);
        }
      }
    });
    resizeObserver.observe(refContainerWarper?.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [tdWidth]);

  const [nodeTitle, setNodeTitle] = useSafeState(nodeKey);
  useEffect(() => {
    setNodeTitle(nodeKey);
  }, [nodeKey]);

  const handleChangeKey = (e) => {
    onNodeKeyChange(nodeKey, e.target.value);
    setNodeTitle(e.target.value);
  };

  return (
    <div
      ref={refContainerWarper}
      className={cn('schema-td', 'table-td')}
      style={{ ...layouts?.[0] }}
    >
      <div className={cn('schema-td-warper', keyWarper)}>
        <div className="indent-panel" style={{ width: 10 * deepIndex }}></div>
        {showArrow ? (
          <Button className="expand-btn" size="mini" onClick={setExpand.bind(null, !expand)}>
            {expand ? <CaretDown /> : <CaretRight />}
          </Button>
        ) : (
          <div className="empty-btn "></div>
        )}
        <input
          ref={txtKeyRef}
          spellCheck={false}
          readOnly={readOnly}
          className="schema-text-box"
          placeholder="字段名"
          value={`${nodeTitle}`}
          onChange={handleChangeKey}
        />
        <Select
          value={nodeType}
          size="mini"
          className="item-type"
          onChange={onChange.bind(null, 'type')}
          formatRender={renderType}
        >
          {ITEM_TYPES.map((d) => (
            <Select.Option value={d} key={d}>
              {d}
            </Select.Option>
          ))}
        </Select>
        {deepIndex === 0 && (
          <SplitBar
            minWidth={minWidth}
            refTable={refTable}
            key={layouts?.[0]?.width}
            width={layouts?.[0]?.width}
            onUpdateWidth={handleUpdateWidth}
          />
        )}
      </div>
    </div>
  );
};

export default ItemKey;
