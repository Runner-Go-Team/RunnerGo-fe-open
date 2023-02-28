import React, { useEffect, useRef, useState } from 'react';
import { Input, Select, Dropdown } from 'adesign-react';
import { EXPECT_HTTP_CODE, EXPECT_CONTENT_TYPE } from '@constants/expect';

const Option = Select.Option;
const JsonBasic = (props) => {
  const { onChange, expectInfo } = props;
  const [showCodeList, setShowCodeList] = useState(false);
  const refCodeList = useRef(null);
  const refDropdown = useRef(null);

  useEffect(() => {
    const handleClickOutSide = (e) => {
      // 判断用户点击的对象是否在DOM节点内部
      if (refCodeList.current?.contains(e.target)) {
        return;
      }
      setShowCodeList(false);
    };
    document.body.addEventListener('mousedown', handleClickOutSide);

    return () => {
      document.body.removeEventListener('mousedown', handleClickOutSide);
    };
  }, []);
  const handleExpect = (type, value) => {
    onChange(type, value);
  };

  const handleSetStatusVisible = (val) => {
    refDropdown?.current?.setPopupVisible(val);
  };

  return (
    <>
      <div className="jsonpanel-wrapper-basic">
        <div className="name">
          <span>名称: </span>{' '}
          <Input
            size="mini"
            value={expectInfo?.name || ''}
            onChange={(val) => handleExpect('name', val)}
          />
        </div>
        <div className="code" ref={refCodeList}>
          <span>HTTP 状态码: </span>
          <Dropdown
            trigger=""
            placement="bottom-start"
            offset={[-6, 0]}
            ref={refDropdown}
            content={
              <div className="http-status-code-list">
                {EXPECT_HTTP_CODE.map((item) => (
                  <div
                    className="status-code-item"
                    key={item}
                    onClick={() => {
                      handleExpect('code', item);
                      handleSetStatusVisible(false);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            }
          >
            <div>
              <Input
                size="mini"
                value={expectInfo?.code || ''}
                onChange={(val) => handleExpect('code', val)}
                onFocus={handleSetStatusVisible.bind(null, true)}
                onBlur={() => {
                  setTimeout(() => {
                    handleSetStatusVisible(false);
                  }, 200);
                }}
                // onFocus={() => {
                //   setShowCodeList(true);
                // }}
              />
            </div>
          </Dropdown>
        </div>
        <div className="format">
          <span>内容格式: </span>{' '}
          <Select
            defaultValue={expectInfo?.contentType || 'json'}
            onChange={(val) => handleExpect('contentType', val)}
          >
            {EXPECT_CONTENT_TYPE.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
};

export default JsonBasic;
