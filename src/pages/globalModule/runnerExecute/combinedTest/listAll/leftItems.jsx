import React from 'react';
import cn from 'classnames';
import { Right as RightSvg } from 'adesign-react/icons';
import { useSelector } from 'react-redux';
import { LeftListPanel, LeftListItem } from './style';

const LeftItems = (props) => {
  const currentTest = useSelector((store) => store.runner?.currentTest);

  const { activeTestId, setActiveTestId } = props;
  return (
    <LeftListPanel>
      {currentTest?.testList?.map((item, index) => (
        <LeftListItem
          key={index}
          className={cn({
            active: activeTestId === item.test_id,
          })}
        >
          <div className="root-index">{index + 1}</div>
          <div className="node-name">{item?.name}</div>
          <div className="combination-bar-wrapper">
            <div className="combination-bar">
              <div className="bar" style={{ width: '30%' }}></div>
            </div>
            <div className="pass-number error">20%</div>
          </div>
          <div className="svg-box" onClick={setActiveTestId.bind(null, item.test_id)}>
            <RightSvg width={16} />
          </div>
        </LeftListItem>
      ))}
    </LeftListPanel>
  );
};

export default LeftItems;
