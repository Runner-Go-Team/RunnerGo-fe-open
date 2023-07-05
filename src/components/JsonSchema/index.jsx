import React from 'react';
import JsonTable from './jsonTable';
import HeaderAction from './headerAction';

// type Props = {
//   value: any;
//   onChange: (newVal: any) => void;
//   onBeforeLink?: (refKeys: string[]) => boolean;
//   model_id?: string;
// };

const JsonSchema = (props) => {
  return (
    <>
      <HeaderAction {...props}></HeaderAction>
      <JsonTable {...props} />
    </>
  );
};

export default JsonSchema;
