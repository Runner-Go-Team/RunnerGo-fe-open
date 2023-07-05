import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import cloneDeep from 'lodash/cloneDeep';
import { Tabs as TabComponents } from 'adesign-react';
import { ApiItemProps } from './interface';

const { TabPan } = TabComponents;

const TabPanList = (props) => {
  const { apiList, setApiList } = props;

  const SortableItem = SortableElement(({ item }) => (
    <TabPan
      removable
      key={item.id}
      id={item.id}
      style={{ width: '150px', height: '30px' }}
      title={
        <>
          {item.ifChanged > 0 && <div className="newicon" />}
          <span>{item.method}</span>
          {item.title}
        </>
      }
      className="api-tab-item"
    >
      {item.content}
    </TabPan>
  ));

  const SortableList = SortableContainer(({ apiList }) => {
    return (
      <div>
        {apiList.map((item, index) => (
          <SortableItem item={item} key={`item-${item.id}`} index={index} />
        ))}
      </div>
    );
  });

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    const newList = cloneDeep(apiList);
    const sourceData = newList[oldIndex];
    newList.splice(oldIndex, 1);
    newList.splice(newIndex, 0, sourceData);
    setApiList([...newList]);
  };

  return <SortableList axis="x" pressDelay={150} apiList={apiList} onSortEnd={handleSortEnd} />;
};

export default TabPanList;
