import React, { useContext, useEffect } from 'react';
import SearchInput from '@components/SearchInput';
import { Tooltip } from 'adesign-react';
import cn from 'classnames';
import { isNumber, isString } from 'lodash';
import produce from 'immer';
import { useMemoizedFn } from 'apt-hooks';
import { keyWarper } from './style';
import './index.less';
import schemaContext from '../../context';
import SplitBar from '../SplitBar';

// interface Props {
//   disabled: boolean;
//   value: any;
//   onChange: (key: string, newVal: any) => void;
//   isModelItem: boolean;
//   deepIndex: number;
// }

const ItemMock = (props) => {
  const { disabled, value, onChange, isModelItem, deepIndex } = props;

  const { refTable, layouts, setLayouts } = useContext(schemaContext);
  const currentLayout = layouts?.[1];
  const tdWidth = currentLayout?.width ?? 400;

  const handleChange = (val) => {
    onChange('mock', {
      mock: val,
    });
  };


  const handleChangeAllowNull = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    onChange('apipiost_allow_null', !value?.apipiost_allow_null);
  };

  const handleUpdateWidth = useMemoizedFn((newWidth) => {
    const newLayouts = produce(layouts, (draft) => {
      draft[1].width = newWidth;
      draft[1].flex = 'unset';
    });

    setLayouts(newLayouts);
  });

  useEffect(() => {
    if (deepIndex !== 0) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;

        let newWidth = 0;
        if (isNumber(layouts[0]?.width)) {
          newWidth = (width - layouts[0]?.width) / 2;
        } else {
          newWidth = width / 3;
        }
        if (!isNumber(currentLayout.width) && newWidth > 100) {
          handleUpdateWidth(newWidth);
        }
      }
    });
    resizeObserver.observe(refTable.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [refTable, layouts]);

  return (
    <div className={cn('schema-td', 'table-td')} style={{ ...currentLayout }}>
      <div
        className={cn('schema-td-warper', keyWarper, {
          'is-model-item': isModelItem,
        })}
      >
        <SearchInput
          size="mini"
          wrapClassName="item-mock"
          placeholder="Mock变量"
          disabled={disabled}
          value={isString(value?.mock?.mock) ? value?.mock?.mock : ''}
          onChange={handleChange}
          dataList={[]}
          afterFix={
            <>
              <Tooltip content="允许NULL" placement="top" offset={[-2, 8]}>
                <div
                  className={cn({
                    'spn-require': true,
                    checked: value?.apipiost_allow_null === true,
                  })}
                  onClick={handleChangeAllowNull}
                >
                  *
                </div>
              </Tooltip>
            </>
          }
        />
        {deepIndex === 0 && (
          <SplitBar
            minWidth={200}
            refTable={refTable}
            key={tdWidth}
            width={tdWidth}
            onUpdateWidth={handleUpdateWidth}
          />
        )}
      </div>
    </div>
  );
};

export default ItemMock;
