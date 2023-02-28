import React from 'react';
import ArrayList from './array';
import ObjectList from './object';
import OneOfList from './oneOf';
import AnyOfList from './anyOf';

const NodeList = (props) => {
  const { deepIndex, nodeType, nodeValue, onChange, onMultiChange } = props;

  return (
    <>
      {nodeType === 'array' && <ArrayList {...{ deepIndex, nodeValue, onChange, onMultiChange }} />}
      {nodeType === 'object' && (
        <ObjectList {...{ deepIndex, nodeValue, onChange, onMultiChange }} />
      )}
      {nodeType === 'oneOf' && <OneOfList {...{ deepIndex, nodeValue, onChange, onMultiChange }} />}
      {nodeType === 'anyOf' && <AnyOfList {...{ deepIndex, nodeValue, onChange, onMultiChange }} />}
    </>
  );
};

export default React.memo(NodeList);
