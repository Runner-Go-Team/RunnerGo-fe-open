import React, { useState, useEffect } from 'react';
import { Input } from 'adesign-react';
import ReactDom from 'react-dom';
import classnames from 'classnames';
import { cloneDeep } from 'lodash';
import { usePopper } from 'react-popper';
// import TextBox from '../TextBox';
import './index.less';

export const SearchInput = (props) => {
  const {
    value,
    onChange = () => undefined,
    onBlur = () => undefined,
    dataList = [],
    placeholder = '请输入',
    listClassName, // 下拉列表class name
    maxPopupHeight = 200, // 下拉项目最大高度
    readonly = false,
    wrapClassName = undefined,
    ...restProps
  } = props;

  const [visible, setVisible] = useState(false);
  const [refInput, setRefInput] = useState(null);
  const [refPopup, setRefPopup] = useState(null);
  const [filterValue, setFilterValue] = useState(value);
  const [activeIndex, setActiveIndex] = useState(-1); // 被选中项
  const filteredList = cloneDeep(dataList).filter(
    (d) => `${d}`.toLowerCase().indexOf(`${filterValue}`.toLowerCase()) !== -1
  );

  const handleArrowKeyEvent = (e) => {
    if (e.which === 13) {
      if (activeIndex >= 0 && activeIndex <= filteredList.length - 1) {
        setActiveIndex(-1);
        setVisible(false);
        onChange(filteredList[activeIndex]);
      }
      return;
    }
    if (e.which === 38) {
      if (activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
        const isScroll =
          refPopup.scrollTop === (activeIndex - 1) * 30 || activeIndex === filteredList.length - 6;
        if (isScroll) {
          refPopup.scrollTop = (activeIndex - 2) * 30 >= 0 ? (activeIndex - 2) * 30 : 0;
        }
      } else {
        setActiveIndex(0);
        refPopup.scrollTop = 0;
      }
    } else if (e.which === 40) {
      if (activeIndex < filteredList.length - 1) {
        setActiveIndex(activeIndex + 1);
        const isScroll = refPopup.scrollTop + 150 < (activeIndex + 1) * 30;
        if (isScroll) {
          refPopup.scrollTop = (activeIndex - 4) * 30;
        }
      } else {
        setActiveIndex(filteredList.length - 1);
      }
    }
  };

  useEffect(() => {
    setFilterValue(value);
    setVisible(false);
  }, [value]);

  const { styles, attributes } = usePopper(refInput, refPopup, {
    placement: 'bottom-start',
  });
  const handleFocus = () => {
    setVisible(true);
  };

  const handleChange = (val) => {
    const searchKey = val;
    setFilterValue(searchKey);
    setVisible(true);
    // updateFilterList(searchKey);
  };

  const handleSelect = (searchKey) => {
    setFilterValue(searchKey);
    setActiveIndex(-1);
    setVisible(false);
    onChange(searchKey);
  };

  const handleInputBlur = () => {
    setActiveIndex(-1);
    setVisible(false);
    onChange(filterValue);
    onBlur(filterValue);
  };

  return (
    <>
      <div className={wrapClassName} ref={setRefInput} style={{ width: '100%' }}>
        <Input
          style={{ width: '100%' }}
          readonly={readonly}
          value={filterValue}
          placeholder={placeholder}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleInputBlur}
          onKeyDown={handleArrowKeyEvent}
          {...restProps}
        />
      </div>
      {visible &&
        filteredList.length > 0 &&
        ReactDom.createPortal(
          <div
            ref={setRefPopup}
            className={classnames({
              'searchInput-list': true,
              [listClassName]: listClassName !== undefined,
            })}
            style={{
              ...styles.popper,
              width: refInput !== null ? refInput.offsetWidth : undefined,
              maxHeight: maxPopupHeight,
            }}
            {...attributes.popper}
          >
            {filteredList.map((text, index) => (
              <div
                key={index}
                className={classnames({
                  'search-item': true,
                  selected: activeIndex === index,
                })}
                onMouseEnter={() => {
                  setActiveIndex(index);
                }}
                onMouseDown={(e) => {
                  handleSelect(text);
                }}
              >
                {text}
              </div>
            ))}
          </div>,
          document.querySelector('body')
        )}
    </>
  );
};

export default SearchInput;
