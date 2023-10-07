import React, { useEffect, useState } from "react";
import './index.less';
import produce from 'immer';
import { Modal, Button, Radio, Tooltip, Message } from 'adesign-react';
import { useTranslation } from 'react-i18next';
import SvgClose from '@assets/logo/close';
import dayjs from "dayjs";
import SvgExplain from '@assets/icons/Explain';
import { DatePicker, Input, Select } from '@arco-design/web-react';
import { ServicGetPlanTaskConfig, ServicSavePlanTaskConfig } from '@services/UiTestAuto/plan';
import { useParams } from 'react-router-dom';
import { lastValueFrom } from "rxjs";
import { debounce, isPlainObject } from "lodash";

const { Group } = Radio;
const { Option } = Select;

const UiPlanTask = (props) => {
  const { onCancel, plan_id } = props;
  const { t } = useTranslation();
  const [timeText, setTimeText] = useState('');
  const [config, setConfig] = useState({
    task_type: 1,
    task_mode: 1,
    scene_run_order: 1, // 场景执行方式
    test_case_run_order: 1, // 用例执行方式
    frequency: 0, //频次
    task_exec_time: 0, // 开始时间
    task_close_time: 0, // 结束时间
    fixed_interval_time_type: 0, // 固定间隔时间单位
    fixed_interval_start_time: 0,// 固定间隔开始时间
    fixed_interval_time: 1, // 固定间隔时间执行时间
    fixed_run_num: 1 // 固定间隔时间执行次数
  });
  const updateConfig = (key, newVal) => {
    setConfig(
      produce(config, (draft) => {
        if (isPlainObject(key)) {
          Object.keys(key).forEach(item => {
            draft[item] = key[item];
          })
        } else {
          draft[key] = newVal;
        }
      })
    );
  }

  const onTimeStart = (dateString, date) => {
    let start_time = new Date(dateString).getTime();

    if ((config.task_exec_time && config.task_close_time) && (config.task_close_time - (start_time / 1000) > 365 * 24 * 60 * 60)) {
      Message('error', t('message.dateRangeError'));
    } else if ((config.task_exec_time && config.task_close_time) && (config.task_close_time < (start_time / 1000))) {
    } else {
      updateConfig('task_exec_time', start_time / 1000)
    }
  }

  const onTimeEnd = (dateString, date) => {
    let end_time = new Date(dateString).getTime();

    if ((config.task_exec_time && config.task_close_time) && ((end_time / 1000) - config.task_exec_time > 365 * 24 * 60 * 60)) {
      Message('error', t('message.dateRangeError'));
    } else if ((config.task_exec_time && config.task_close_time) && ((end_time / 1000) < config.task_exec_time)) {

    } else {
      updateConfig('task_close_time', end_time / 1000)
    }
  }

  const onChangefixed_interval_timeStart = (dateString, date) => {
    let start_time = new Date(dateString).getTime();
    updateConfig('fixed_interval_start_time', start_time / 1000)
  }

  const initConfig = async (id) => {
    const resp = await lastValueFrom(ServicGetPlanTaskConfig({ plan_id: id, team_id: sessionStorage.getItem('team_id') }));
    if (resp?.code == 0 && isPlainObject(resp?.data)) {
      setConfig({ 
        ...config, 
        ...resp.data,
        fixed_interval_time:resp?.data?.fixed_interval_time ? resp?.data?.fixed_interval_time : 1,
        fixed_run_num:resp?.data?.fixed_run_num ? resp?.data?.fixed_run_num : 1,
      })
    }
  }
  // console.log(config, "config111");
  useEffect(() => {
    if (plan_id) {
      initConfig(plan_id);
    }
  }, [plan_id]);

  useEffect(() => {
    let start = dayjs(config.task_exec_time * 1000).format('YYYY-MM-DD HH:mm');
    let start_time = dayjs(config.task_exec_time * 1000).format('HH:mm');
    let end = dayjs(config.task_close_time * 1000).format('YYYY-MM-DD HH:mm');
    let fixed_start = dayjs(config.fixed_interval_start_time * 1000).format('YYYY-MM-DD HH:mm');
    if (config.frequency === 1) {
      setTimeText(`自${start}起, 每天的${start_time}该场景将自动执行一次, 直至${end}结束`);
    } else if (config.frequency === 2) {
      let week = new Date(config.task_exec_time * 1000).getDay();
      let weekList = {
        0: '周日',
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六'
      };
      setTimeText(`自${start}起, 每${weekList[week]}的${start_time}该场景将自动执行一次, 直至${end}结束`);
    } else if (config.frequency === 3) {
      let day = new Date(config.task_exec_time).getDate();
      setTimeText(`自${start}起, 每月${day}日的的${start_time}该场景将自动执行一次, 直至${end}结束`);
    } else if (config.frequency === 4) {
      setTimeText(`自${fixed_start}起, 每隔${config.fixed_interval_time}${config.fixed_interval_time_type === 0 ? '分钟' : '小时'}，该场景将自动执行一次，直至执行${config.fixed_interval_time}次后结束。`)
    } else {
      setTimeText('');
    }

    if (config.frequency === 4) {
      if (!config.fixed_interval_start_time || !config.fixed_interval_time || !config.fixed_interval_time) {
        setTimeText('');
      }
    } else {
      if (!config.task_exec_time || !config.task_close_time) {
        setTimeText('');
      }
    }
  }, [config.task_exec_time, config.task_close_time, config.frequency, config.fixed_interval_start_time, config.fixed_interval_time, config.fixed_interval_time, config.fixed_interval_time_type]);

  const save = debounce(async () => {
    if (config.task_type === 2) {
      // 固定间隔
      if (config.frequency === 4) {
        if (!config.fixed_interval_start_time || !config.fixed_interval_time || !config.fixed_interval_time) {
          Message('error', t('message.taskConfigEmpty'));
          return;
        }
      } else {
        // 固定时间间隔
        if (config.frequency === 4) {
          if (!config.fixed_interval_start_time || !config.fixed_interval_time || !config.fixed_interval_time) {
            Message('error', t('message.taskConfigEmpty'));
            return;
          }
        } else {
          if (config.frequency === 0 && config.task_exec_time === 0) {
            Message('error', t('message.taskConfigEmpty'));
            return;
          } else if (config.frequency !== 0 && (config.task_exec_time === 0 || config.task_close_time === 0)) {
            Message('error', t('message.taskConfigEmpty'));
            return;
          }

          if (config.frequency !== 0 && config.task_close_time <= config.task_exec_time) {
            Message('error', t('message.endGTstart'));
            return;
          }
        }
      }
    }
    const resp = await lastValueFrom(ServicSavePlanTaskConfig({
      plan_id,
      team_id: sessionStorage.getItem('team_id'),
      ...config,
      task_close_time: config.frequency === 0 ? config.task_exec_time + 120 : config.task_close_time
    }))
    if (resp?.code == 0) {
      Message('success', t('message.saveSuccess'));
      onCancel();
    }
  }, 200);
  return (
    <div>
      <Modal
        className="runngerGo-ui-plan-task-modal"
        visible
        closable={false}
        title={null}
        okText={t('btn.save')}
        cancelText={t('btn.cancel')}
        onCancel={onCancel}
        onOk={save}
        maskClosable={false}
      >
        <div className="top">
          <p className="title">{t('plan.taskConfig')}</p>
          <Button className='close-btn' onClick={onCancel}><SvgClose /></Button>
        </div>
        <div className="container">
          <div className="item">
            <p className="label">{t('report.taskType')}：</p>
            <Group value={config?.task_type || 1} onChange={(e) => updateConfig('task_type', e)}>
              <Radio value={1}>{t('plan.taskList.commonTask')}</Radio>
              {/* <Radio value={2}>{t('plan.taskList.cronTask')}</Radio> */}
            </Group>
          </div>
          {
            config.task_type === 2 ? <div className='item time-select'>
              <div className='explain'>
                <div className='explain-left'>
                  <p>{t('btn.add')}</p>
                  <Tooltip content={<div>{t('plan.explain')}</div>}>
                    <div>
                      <SvgExplain />
                    </div>
                  </Tooltip>
                </div>
                <div className='explain-right'>
                  <p>{t('plan.frequency')}</p>
                  <Select value={config.frequency} onChange={(e) => {
                    updateConfig({ frequency: e, task_exec_time: 0, task_close_time: 0 })
                  }}>
                    <Option value={0}>{t('plan.frequencyList.0')}</Option>
                    <Option value={1}>{t('plan.frequencyList.1')}</Option>
                    <Option value={2}>{t('plan.frequencyList.2')}</Option>
                    <Option value={3}>{t('plan.frequencyList.3')}</Option>
                    <Option value={4}>{t('plan.frequencyList.4')}</Option>
                  </Select>
                </div>
              </div>
              {
                config.frequency === 4 ? <div className="fixed-time-interval">
                  <p className='label'><span className="must-input">*</span> <span>{t('plan.runNum')}：</span></p>
                  <DatePicker
                    value={config.fixed_interval_start_time * 1000}
                    placeholder={t('placeholder.startTime')}
                    showTime
                    format='YYYY-MM-DD HH:mm'
                    onChange={onChangefixed_interval_timeStart}
                    disabledDate={(current) => current.isBefore(new Date().getTime() - 86400000)}
                  />
                  <div className='item'>
                    <Input className='time-input' value={config.fixed_interval_time} onChange={(e) => {
                      if (parseInt(e) > 0) {
                        updateConfig('fixed_interval_time', parseInt(e));
                      } else {
                        updateConfig('fixed_interval_time', undefined);
                      }
                    }} onBlur={(e) => {
                      const value = e.target.value;
                      if (parseInt(value) > 0) {
                        updateConfig('fixed_interval_time', parseInt(value));
                      } else {
                        updateConfig('fixed_interval_time', 1);
                      }
                    }} placeholder={t('placeholder.intervalTime')} />
                    <Select value={config.fixed_interval_time_type} onChange={(e) => {
                      updateConfig('fixed_interval_time_type', e)
                    }}>
                      <Option value={0}>{t('plan.minute')}</Option>
                      <Option value={1}>{t('plan.hour')}</Option>
                    </Select>
                    <Input className='num-input' value={config.fixed_run_num} onChange={(e) => {
                      if (parseInt(e) > 0) {
                        if (parseInt(e) > 100) {
                          updateConfig('fixed_run_num', 100)
                        } else {
                          updateConfig('fixed_run_num', parseInt(e))
                        }
                      } else {
                        updateConfig('fixed_run_num', undefined)
                      }
                    }} onBlur={(e) => {
                      const value = e.target.value;
                      if (parseInt(value) > 0) {
                        if (parseInt(value) > 100) {
                          updateConfig('fixed_run_num', 100)
                        } else {
                          updateConfig('fixed_run_num', parseInt(value))
                        }
                      } else {
                        updateConfig('fixed_run_num', 1)
                      }
                    }} placeholder={t('placeholder.runNumMax')} />
                    <span style={{ margin: '0 10px' }}>{t('apis.unit')}</span>
                  </div>
                </div> : <div className='select-date'>
                  <div className='select-date-right'>
                    <div className='time-item'>
                      <p className='label'>{t('index.startTime')}:</p>
                      <DatePicker
                        value={config.task_exec_time * 1000}
                        placeholder={t('placeholder.startTime')}
                        style={{ marginTop: '10px', marginRight: '6px' }}
                        showTime
                        format='YYYY-MM-DD HH:mm'
                        onChange={onTimeStart}
                        disabledDate={(current) => current.isBefore(new Date().getTime() - 86400000)}
                      />

                    </div>
                    <div className='time-item'>
                      <p className='label'>{t('index.endTime')}:</p>
                      <DatePicker
                        value={config.task_close_time * 1000}
                        disabled={config.frequency === 0}
                        placeholder={t('placeholder.endTime')}
                        style={{ marginTop: '10px' }}
                        showTime
                        format='YYYY-MM-DD HH:mm'
                        onChange={onTimeEnd}
                        disabledDate={(current) => current.isBefore(dayjs(config.task_exec_time * 1000).format('YYYY-MM-DD HH:mm:ss'))}
                      />
                    </div>
                  </div>
                </div>
              }
              <p className='time-explain'>{timeText}</p>
            </div> : <></>
          }
          {/* <div className="item">
                        <p className="label">{t('autoReport.runMode')}：</p>
                        <Group className="flex-column" value={taskMode} onChange={(e) => setTaskMode(e)}>
                            <Radio value={1}>{t('autoReport.taskMode.1')}</Radio>
                        </Group>
                    </div> */}
          <div className="item">
            <p className="label">{t('autoReport.scene')}：</p>
            <div>
              <Group value={config.scene_run_order} onChange={(e) => {
                updateConfig('scene_run_order', e);
              }}>
                <Radio value={1}>{t('autoReport.testCaseRunOrder.1')}</Radio>
                <Radio value={2}>{t('autoReport.testCaseRunOrder.2')}</Radio>
              </Group>
            </div>
          </div>
          {/* <div className="item">
            <p className="label">{t('autoReport.case')}：</p>
            <div>
              <Group value={caseRunOrder} onChange={(e) => setCaseRunOrder(e)}>
                <Radio value={1}>{t('autoReport.sceneRunOrder.1')}</Radio>
              </Group>
            </div>
          </div> */}
        </div>
      </Modal>
    </div>
  )
};

export default UiPlanTask;