import React, { useRef } from 'react';
import { Button, Dropdown } from 'adesign-react';
import { Desc as DescSvg } from 'adesign-react/icons';
import DropContent from './dropContent';
import './dropContent.less';

const DescChoice = (props) => {
  const { onChange, filterKey = '' } = props;
  const refDropdown = useRef(null);

  const handleSelect = () => {
    refDropdown.current?.setPopupVisible(false);
  };
  return (
    <div>
      <Dropdown
        ref={refDropdown}
        placement="bottom-end"
        content={
          <>
            <div className="params-desc-wrapper">
              <DropContent
                handleSelect={handleSelect}
                onChange={onChange}
                filterKey={filterKey}
              ></DropContent>
            </div>
          </>
        }
        style={{ zIndex: 1050 }}
      >
        <Button>
          <DescSvg />
        </Button>
      </Dropdown>
    </div>
  );
};

export default DescChoice;
