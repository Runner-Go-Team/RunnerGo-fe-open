export const DEFABLR_SEARCH = {
  name: '',
  task_type: 0,
  updated_time: [],
  created_time:[],
  head_user_name:'',
  created_user_name:'',
}
import i18next from "i18next"

// 性能测试计划的压测模式
export const stressModeList = {
    '1': i18next.t('plan.modeList.1'),
    '2': i18next.t('plan.modeList.2'),
    '3': i18next.t('plan.modeList.3'),
    '4': i18next.t('plan.modeList.4'),
    '5': i18next.t('plan.modeList.5'),
    '6': i18next.t('plan.modeList.6'),
};

// 压测的日志模式
export const stressDebugList = {
  'stop': i18next.t('plan.debugMode-0'),
  'all': i18next.t('plan.debugMode-1'),
  'only_success': i18next.t('plan.debugMode-2'),
  'only_error': i18next.t('plan.debugMode-3')
}