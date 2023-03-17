export const INPUTTYPELIST = ['Text', 'File', 'FileUrl'];

export const HEADERTYPELIST = [
  'Boolean',
  'Date',
  'Function',
  'NaN',
  'Number',
  'Integer',
  'RegExp',
  'String',
  'Undefined',
  'Null',
];
export const BODYTYPELIST = ['Object', 'Array', 'File', ...HEADERTYPELIST];

export const BODYTYPELISTMAPVARTYPES = {
  Float: 'Number',
  Double: 'Number',
  File: 'Object',
  DateTime: 'Date',
  TimeStamp: 'Date',
};

export const VARTYPES = [
  'Array',
  'Boolean',
  'Date',
  'Function',
  'NaN',
  'Number',
  'Integer',
  'Object',
  'RegExp',
  'String',
  'Undefined',
  'Null',
];
