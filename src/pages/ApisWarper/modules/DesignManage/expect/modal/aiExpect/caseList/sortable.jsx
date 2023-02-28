import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import CaseItem from './caseItem';

export const SortableItem = SortableElement(
  ({ item, rowIndex, expectList, handleDeleteExpect, onChange }) => {
    return <CaseItem {...{ item, index: rowIndex, expectList, handleDeleteExpect, onChange }} />;
  }
);

export const SortableList = SortableContainer(
  ({ aiExpectList, expectList, handleDeleteExpect, onChange }) => {
    return (
      <div>
        {aiExpectList.map((item, index) => (
          <SortableItem
            key={item.id}
            {...{
              item,
              index,
              rowIndex: index,
              expectList,
              handleDeleteExpect,
              onChange,
            }}
          />
        ))}
      </div>
    );
  }
);
