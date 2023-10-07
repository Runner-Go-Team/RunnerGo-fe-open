export const ELEMENT_ATTR_METHOD = [{ key: 'playwright_selector', name: '选择器' }, { key: 'playwright_locator', name: '定位器' }];

export const ELEMENT_ATTR_TYPE = {
  // playwright_selector: ['ID', 'className', 'name', 'tagName', 'linkText', 'partialLinkText', 'Css Selector', 'XPath', 'lable', 'value', 'index'],
  playwright_locator: ['role', 'text', 'lable', 'placeholder', 'alt', 'title', 'custom_attr'],
};

export const DEFABLR_SEARCH = {
  name: '',
  locator_value: '',
  locator_method: [],
  locator_type: [],
  updated_time: [],
}