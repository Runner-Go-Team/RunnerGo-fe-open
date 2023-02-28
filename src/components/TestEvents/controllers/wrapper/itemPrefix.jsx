import React from 'react';
import { Menu1 as SvgSort } from 'adesign-react/icons';
import { SortableHandle } from 'react-sortable-hoc';

const ItemPreFix = (props) => {
  const { isRoot = true, rootIndex = 0, eventItemMode, path, prefixIcon } = props;

  const DragHandle = SortableHandle(() => <SvgSort />);

  const singleTestRender = () => {
    return (
      <>
        {isRoot ? (
          <div className="index-icon">{rootIndex + 1}</div>
        ) : (
          <>
            <div className="sort-panel">
              <DragHandle />
            </div>
            <div className="index-panel">{path.map((pIndex) => pIndex + 1).join('-')}</div>
          </>
        )}
      </>
    );
  };

  const combinedTestRender = () => {
    return (
      <>
        {isRoot ? (
          <div className="index-icon">{rootIndex + 1}</div>
        ) : (
          <div className="index-panel">{path.map((pIndex) => pIndex + 1).join('-')}</div>
        )}
      </>
    );
  };

  const executeTestRender = () => {
    return (
      <>
        <div style={{ marginRight: 5 }}>{prefixIcon}</div>
        {isRoot ? (
          <div className="index-icon">{rootIndex + 1}</div>
        ) : (
          <div className="index-panel">{path.map((pIndex) => pIndex + 1).join('-')}</div>
        )}
      </>
    );
  };

  const prefixRender = {
    singleTest: singleTestRender,
    combinedTest: combinedTestRender,
    executeTest: executeTestRender,
  };

  return <>{prefixRender[eventItemMode]()}</>;
};

export default ItemPreFix;
