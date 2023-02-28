import React from 'react';
import { cloneDeep, isArray } from 'lodash';
import { SortableList } from './sortable';

const CasesList = (props) => {
  const { expectList, aiExpectList, onChange = (type, value) => undefined } = props;

  const handleDeleteExpect = (index) => {
    if (aiExpectList.length === 1) {
      return;
    }
    const newList = aiExpectList.filter((data, itemIndex) => itemIndex !== index);
    onChange('list', [...newList]);
  };

  const handleSortEnd = (params) => {
    const { oldIndex, newIndex } = params;
    const list = cloneDeep(aiExpectList);
    const sourceData = list[oldIndex];
    list.splice(oldIndex, 1);
    list.splice(newIndex, 0, sourceData);
    onChange('list', [...list]);
  };

  return (
    <>
      {isArray(aiExpectList) && (
        <SortableList
          useDragHandle
          {...{
            aiExpectList,
            expectList,
            handleDeleteExpect,
            onChange,
            lockAxis: 'y',
            onSortEnd: handleSortEnd,
          }}
        />
      )}
    </>
  );
};

export default CasesList;
