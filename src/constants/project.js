export const defaultItem = {
  is_checked: -1,
  key: '',
  value: '',
  description: '',
};

export const defaultParams = {
  script: {
    pre_script: '',
    pre_script_switch: -1,
    test: '',
    test_switch: -1,
  },
  request: {
    auth: {
      type: 'noauth',
    },
    header: [defaultItem],
    query: [defaultItem],
    body: [defaultItem],
  },
};
