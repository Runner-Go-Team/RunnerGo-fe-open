import React from 'react';
import { isArray } from 'lodash';
import { ITestEvents } from '@models/runner/testEvents';
import ItemNode from './itemNode';
import './index.less';

const RootItem = (props) => {
  const { childEvents, path } = props;

  const eventPath = isArray(path) ? path : [];
  const nodeSort = (pre, after) => pre.sort - after.sort;
  const sortedChildEvents = isArray(childEvents) ? childEvents.sort(nodeSort) : childEvents;

  return (
    <>
      {sortedChildEvents?.map((item, index) => (
        <ItemNode key={index} item={item} path={eventPath} index={index} />
      ))}
    </>
  );
};

export default RootItem;
