import React, { useState } from 'react'
import { Button, Input, InputNumber, Message, Modal, Select } from '@arco-design/web-react';
import produce from 'immer';
import { ServiceCreatePlan, ServiceUpdatePlan } from '@services/UiTestAuto/plan';
import { BROWSER_TYPES } from '@constants/sceneStep';
import SelectMachine from '@components/SelectMachine';
import './index.less';
import { debounce, isArray, isObject, trim } from 'lodash';
import { lastValueFrom } from 'rxjs';
import Bus from '@utils/eventBus';
import { useSelector } from 'react-redux';

const Option = Select.Option;
const CreateUiPlanModal = (props) => {
  const { onCancel, plan, parent_id } = props;

  const userInfo = useSelector((store) => store?.user?.userInfo);
  const teamMember = useSelector((store) => store?.teams?.teamMember);
  const user_id = useSelector((store) => store?.user?.userInfo?.user_id) || '';
  const [planData, setPlanData] = useState({
    parent_id: parent_id || plan?.parent_id || '0',
    name: plan?.name || '新建计划',
    description: plan?.description || '',
    head_user_ids: plan?.head_user_ids || [user_id],
    init_strategy: plan?.init_strategy || 1,
    task_type: plan?.task_type || 1,
    ui_machine_key: plan?.ui_machine_key || '',
    browsers: isArray(plan?.browsers) ? plan.browsers : [
      {
        browser_type: "chromium",
        headless: false,
        size_type: "default", // set_size
        set_size: {
          x: 0,
          y: 0
        }
      }
    ],
  })

  const [step, setStep] = useState(1);

  const browser = isObject(planData?.browsers?.[0]) ? planData?.browsers?.[0] : {};
  const onSubmit = debounce(() => {
    if (trim(planData.ui_machine_key).length <= 0) {
      Message.error('运行设备不能为空');
      return
    }
    if (trim(planData.name).length <= 0) {
      Message.error('计划名称不能为空');
      return
    }
    if (plan) {
      lastValueFrom(ServiceUpdatePlan({
        "team_id": sessionStorage.getItem('team_id'),
        plan_id: plan?.plan_id,
        ...planData
      })).then((res) => {
        if (res?.code == 0) {
          Message.success('修改计划成功');
          // 刷新当前计划详情
          Bus.$emit('PlanDetails/getPlanDetails');
          onCancel();
        }
      })
      return
    }
    lastValueFrom(ServiceCreatePlan({
      "team_id": sessionStorage.getItem('team_id'),
      ...planData
    })).then((res) => {
      if (res?.code == 0) {
        Message.success('新建计划成功');
        Bus.$emit('planList/debounceGetPlanList');
        onCancel();
      }
    })
  }, 200)

  const strategyOptions = {
    1: '计划执行前重启浏览器',
    2: '场景执行前重启浏览器',
    3: '无初始化',
  }

  return (
    <>
      <Modal
        className="runnerGo-ui-plan-create-modal"
        title={plan ? '编辑计划' : '新增计划'}
        visible
        onOk={onSubmit}
        onCancel={onCancel}
        maskClosable={false}
        footer={<>
          <Button onClick={onCancel}>
            {'关闭'}
          </Button>
          {step == 1 ? <Button type="primary" onClick={()=>setStep(2)}>
            {'下一步'}
          </Button> : <Button onClick={()=>setStep(1)}>
            {'上一步'}
          </Button>}
          {step != 1 && <Button type="primary" onClick={onSubmit}>
            保存
          </Button>}
        </>}
      >
        {step == 1 ? (<div className='runnerGo-card-special'>
          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>名称</label>
            <div className="content">
              <Input maxLength={30} value={planData.name} onChange={(val) => setPlanData({ ...planData, name: val })} style={{ width: '100%', height: 38 }} placeholder={'请输入计划名称'} />
            </div>
          </div>

          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>浏览器</label>
            <div className="content">
              <Select onChange={(val) => {
                browser.browser_type = val
                setPlanData({ ...planData, browsers: [browser] });
              }} value={browser?.browser_type || 'chromium'}>
                {Object.keys(BROWSER_TYPES).map(key => (
                  <Option key={key} value={key}>
                    {BROWSER_TYPES[key]}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>运行模式</label>
            <div className="content">
              <Select onChange={(val) => {
                browser.headless = val == 'behind'
                setPlanData({ ...planData, browsers: [browser] });
              }} value={browser?.headless ? 'behind' : 'frond'}>
                <Option key={'behind'} value={'behind'}>
                  后台运行
                </Option>
                <Option key={'frond'} value={'frond'}>
                  前台运行
                </Option>
              </Select>
            </div>
          </div>

          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>窗口大小</label>
            <div className="content">
              <Select onChange={(val) => {
                browser.size_type = val;
                setPlanData({ ...planData, browsers: [browser] });
              }} value={browser?.size_type || 'default'}>
                <Option key='default' value={'default'}>默认(1280 x 720)</Option>
                <Option key={'max'} value={'max'}>
                  窗口最大化
                </Option>
                <Option key={'set_size'} value={'set_size'}>
                  指定像素
                </Option>
              </Select>
            </div>
          </div>
          {browser?.size_type == 'set_size' && (
            <div className='runnerGo-card-special-item'>
              <label><span className='required'>*</span>尺寸</label>
              <div className="content">
                <div className="size-input-group">
                  <InputNumber min={0} value={browser?.set_size?.x || 0} onChange={(val) => {
                    browser.set_size.x = val
                    setPlanData({ ...planData, browsers: [browser] });
                  }} /> <InputNumber min={0} value={browser?.set_size?.y || 0} onChange={(val) => {
                    browser.set_size.y = val
                    setPlanData({ ...planData, browsers: [browser] });
                  }} />
                </div>
              </div>
            </div>
          )}
          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>初始化策略</label>
            <div className="content">
              <Select onChange={(val) => {
                setPlanData({ ...planData, init_strategy: val });
              }} value={planData?.init_strategy || 1}>
                {Object.keys(strategyOptions).map(key => (
                  <Option key={parseInt(key)} value={parseInt(key)}>
                    {strategyOptions[key]}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>负责人</label>
            <div className="content">
              <Select
                mode='multiple'
                maxTagCount={5}
                placeholder='负责人'
                style={{ minWidth: '100px', height: 40 }}
                value={planData?.head_user_ids || []}
                onChange={(val) => {
                  setPlanData({ ...planData, head_user_ids: val });
                }}
                allowClear
                getPopupContainer={()=>document.body}
              >
                {teamMember.map((item) => (
                  <Option key={item?.user_id} value={item?.user_id}>
                    {item?.nickname}
                  </Option>
                ))}
              </Select>
            </div>
          </div>


          <div className='runnerGo-card-special-item'>
            <label>描述</label>
            <div className="content">
              <Input maxLength={50} value={planData.description} onChange={(val) => setPlanData({ ...planData, description: val })} style={{ width: '100%', height: 38 }} placeholder={'请输入计划描述'} />
            </div>
          </div>
        </div>) : (
          <div className='runnerGo-card-special'>
            <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>选择设备</label>
            <div className="content">
            <SelectMachine maxHeight={'63vh'} selectKey={planData?.ui_machine_key} setSelectKey={(val) => {
                setPlanData({ ...planData, ui_machine_key: val })
              }} />
            </div>
          </div>
          </div>
        )}
      </Modal>
    </>
  )
}
export default CreateUiPlanModal;