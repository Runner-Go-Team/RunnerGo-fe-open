import React from 'react';
import ArrayList from './array';
import ObjectList from './object';
import OneOfList from './oneOf';
import AnyOfList from './anyOf';
import AllOfList from './allOf';

// interface NodeListProps {
//   deepIndex: number;
//   nodeKey: string;
//   nodeValue: any;
//   onChange: (nodeKey: string, newVal: any) => void;
//   nodeType: string;
//   onMultiChange: (params: any) => void;
//   onLinkSchema: (model: IDataModel) => void;
//   onDeleteModel: () => void;
//   onCancelLinkSchema: () => void;
//   onChangeRefs: (modelKey: string, newVal: any) => void;
//   linkSchema: 'enable' | 'disable';
//   parentModels: React.MutableRefObject<any[]>;
// }

const NodeList = (props) => {
  const { deepIndex, nodeType, nodeValue, onChange, onMultiChange, linkSchema, parentModels } =
    props;

  // console.log(nodeKey, nodeValue, '1======nodeValue==============');
  // console.log(linkSchema, '=====1111');
  return (
    <>
      {nodeType === 'array' && (
        <ArrayList
          {...{ deepIndex, nodeValue, onChange, onMultiChange, linkSchema, parentModels }}
        />
      )}
      {nodeType === 'object' && (
        <ObjectList
          {...{ deepIndex, nodeValue, onChange, onMultiChange, linkSchema, parentModels }}
        />
      )}
      {nodeType === 'oneOf' && (
        <OneOfList
          {...{ deepIndex, nodeValue, onChange, onMultiChange, linkSchema, parentModels }}
        />
      )}
      {nodeType === 'anyOf' && (
        <AnyOfList
          {...{ deepIndex, nodeValue, onChange, onMultiChange, linkSchema, parentModels }}
        />
      )}
      {nodeType === 'allOf' && (
        <AllOfList
          {...{ deepIndex, nodeValue, onChange, onMultiChange, linkSchema, parentModels }}
        />
      )}
    </>
  );
};

export default React.memo(NodeList);
