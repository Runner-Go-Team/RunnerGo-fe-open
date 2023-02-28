import i18next from "i18next";

// IF 比较方式
export const COMPARE_IF_TYPE = [
  { type: 'eq', title: i18next.t('apis.compareSelect.eq') },
  { type: 'uneq', title: i18next.t('apis.compareSelect.uneq') },
  { type: 'gt', title: i18next.t('apis.compareSelect.gt') },
  { type: 'gte', title: i18next.t('apis.compareSelect.gte') },
  { type: 'lt', title: i18next.t('apis.compareSelect.lt') },
  { type: 'lte', title: i18next.t('apis.compareSelect.lte') },
  { type: 'includes', title: i18next.t('apis.compareSelect.includes') },
  { type: 'unincludes', title: i18next.t('apis.compareSelect.unincludes') },
  { type: 'null', title: i18next.t('apis.compareSelect.null') },
  { type: 'notnull', title: i18next.t('apis.compareSelect.notnull') },
];

// While 比较方式
export const COMPARE_WHILE_TYPE = [
  { type: 'eq', title: '等于' },
  { type: 'uneq', title: '不等于' },
  { type: 'gt', title: '大于' },
  { type: 'gte', title: '大于或等于' },
  { type: 'lt', title: '小于' },
  { type: 'lte', title: '小于或等于' },
  { type: 'includes', title: '包含' },
  { type: 'unincludes', title: '不包含' },
  { type: 'null', title: '等于空' },
  { type: 'notnull', title: '不等于空' },
];
