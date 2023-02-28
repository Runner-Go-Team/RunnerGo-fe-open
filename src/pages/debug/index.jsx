import React, { useEffect, useState } from 'react';
import JsonSchema from '@components/JsonSchema';
import { schemaData } from './test';

const Debug = (props) => {
  const [value, onChange] = useState(null);
  useEffect(() => {
    onChange(schemaData);
  }, [schemaData]);

  return <JsonSchema value={value} onChange={onChange} />;
};

export default Debug;
