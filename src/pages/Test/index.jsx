import React, { useState } from 'react';
import Form from 'react-jsonschema-form';

const SchemaEditor = () => {
  const [schema, setSchema] = useState({
    type: 'object',
    properties:{}
  });
  const [uiSchema, setUiSchema] = useState({});

  const handleAddChild = () => {
    const childKey = `child_${Object.keys(schema.properties || {}).length + 1}`;
    const newChild = { type: 'object' };
    const updatedSchema = {
      ...schema,
      properties: {
        ...(schema.properties || {}),
        [childKey]: newChild,
      },
    };
    setSchema(updatedSchema);
  };

  const handleSchemaChange = (e) => {
    // setSchema(e.formData);
  };

  const handleUiSchemaChange = (e) => {
    // setUiSchema(e.formData);s
  };
  console.log(schema,"schema",uiSchema);
  return (
    <div>
      <Form schema={schema} uiSchema={uiSchema} onChange={handleSchemaChange} />
      <button type="button" onClick={handleAddChild}>
        Add Child
      </button>
      <Form schema={schema} uiSchema={uiSchema} onChange={handleUiSchemaChange} />
    </div>
  );
};

export default SchemaEditor;
