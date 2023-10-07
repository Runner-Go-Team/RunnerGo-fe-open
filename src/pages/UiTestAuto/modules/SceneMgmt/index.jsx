import { Drawer, Input, Message, ResizeBox, Tooltip } from '@arco-design/web-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SceneTree from './sceneTree';
import { useLocation, useParams } from 'react-router-dom'
import SceneContent from './SceneContent';
import { v4 as uuidV4 } from 'uuid';
import SceneContentEmpty from './sceneContentEmpty';
import { STEP_DEFAULT, STEP_NAME } from '@constants/sceneStep';
import { ServiceSceneDetail, ServiceSaveScene, ServiceSceneOperatorList, ServiceCreateSceneOperator, ServiceOperatorSort, ServiceOperatorDelete, ServiceOperatorUpdate, ServiceOperatorSetStatus, ServiceOperatorCopy, ServiceUiSceneSend, ServiceSceneOperatorDetail, ServiceUiSceneStop } from '@services/UiTestAuto/scene';
import {
  OpenPage, ClosePage, SwitchPage, MouseClicking,
  MouseScrolling, MouseMovement, MouseDragging,
  InputOperations, WaitEvents, ForLoop, Assert,
  IfCondition, WhileLoop, SimpleCommon, DataWithdraw,
  CodeOperation
} from './SceneStepTemplate';
import SceneMgmtContext from './context';
import './index.less';
import { arrayToTreeObject } from '@utils';
import Bus,{ useEventBus } from '@utils/eventBus';
import { lastValueFrom } from 'rxjs';
import { cloneDeep, debounce, isArray, isEmpty, isPlainObject, isString } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

const StepTempalte = {
  open_page: OpenPage,
  close_page: ClosePage,
  toggle_window: SwitchPage,
  mouse_clicking: MouseClicking,
  mouse_scrolling: MouseScrolling,
  mouse_movement: MouseMovement,
  mouse_dragging: MouseDragging,
  input_operations: InputOperations,
  wait_events: WaitEvents,
  for_loop: ForLoop,
  while_loop: WhileLoop,
  assert: Assert,
  if_condition: IfCondition,
  forward: SimpleCommon,
  back: SimpleCommon,
  refresh: SimpleCommon,
  data_withdraw: DataWithdraw,
  code_operation:CodeOperation
}
const SceneMgmt = (props) => {
  const { treeData, plan_id } = props;
  const location = useLocation();
  const { id } = useParams();
  const defaultSelectKey = () => {
    if (location.pathname.startsWith('/uiTestAuto/scene') && id) {
      return id
    } else if (!plan_id) {
      let lastKey = sessionStorage.getItem(`team_id:${sessionStorage.getItem('team_id')}:scene_id`)
      if (lastKey && lastKey != undefined && isString(lastKey)) {
        return lastKey == 'null' ? null : lastKey
      }
    }
    return null
  }
  const [selectKey, setSelectKey] = useState(defaultSelectKey());
  const sceneRunResult = useSelector((store) => store?.uitest_auto?.sceneRunResult);
  const [openScene, setOpenScene] = useState(null);
  const [stepList, setStepList] = useState([]);
  const { Provider } = SceneMgmtContext;
  const [visible, setVisible] = useState(false);
  const [newStep, setNewStep] = useState(null);
  const [openStep, setOpenStep] = useState(null);
  const [openResponse, setOpenResponse] = useState(null);

  const [runLodaing, setRunLodaing] = useState()

  const [selectedIds, setSelectedIds] = useState([]);
  const dispatch = useDispatch();
  const deleteScene=(deleteId)=>{
    if(selectKey == deleteId){
      setOpenStep(null);
      setOpenResponse(null);
      setSelectKey(null);
    }
  }
  useEventBus('scene/deleteScene',deleteScene,[selectKey])
  useEffect(() => {
    // 初始化场境列表
    if (isString(plan_id)) {
      Bus.$emit('element/getPlanSceneList', { plan_id })
    } else {
      Bus.$emit('element/getSceneList', { plan_id })
    }
  }, [])

  // 用于在树中查找元素
  const searchInTree = (treeData, targetId) => {
    for (const key in treeData) {
      let node = treeData[key]
      if (node.scene_id === targetId) {
        return true; // 找到目标元素
      }
    }

    return false; // 没有找到目标元素
  }

  useEffect(() => {
    if (isPlainObject(treeData) && !isEmpty(treeData) && openScene) {
      let findOpen = searchInTree(treeData, openScene?.scene_id);
      if (!findOpen) {
        // setOpenScene(null);
        setSelectKey(null);
      }
    }
  }, [treeData])
  useEffect(() => {
    console.log(1111);
    if (selectKey && selectKey != 'null') {
      setOpenStep(null);
      setOpenResponse(null);
      getSceneDetail(selectKey);
      getSceneOperatorList(selectKey);
    }
    // 记录当前团队场景管理选择的场景id
    if (!plan_id) {
      sessionStorage.setItem(`team_id:${sessionStorage.getItem('team_id')}:scene_id`, selectKey)
    }
  }, [selectKey])

  const createScene = () => {
    Bus.$emit('openModal', 'CreateUiScene', { plan_id })
  }

  const createSceneFolder = () => {
    Bus.$emit('openModal', 'SceneFolder', { plan_id })
  }

  const getStepDetail = async (operator_id) => {
    const resp = await lastValueFrom(ServiceSceneOperatorDetail({ team_id: sessionStorage.getItem('team_id'), scene_id: selectKey, operator_id }));
    if (resp?.code == 0 && isPlainObject(resp?.data?.operator)) {
      setOpenStep(resp.data.operator)
      setOpenResponse(null);
    }
  }

  const getSceneDetail = async (scene_id) => {
    if (!scene_id || !isString(scene_id) || scene_id == null || scene_id == 'null') {
      return;
    }
    const resp = await lastValueFrom(ServiceSceneDetail({ team_id: sessionStorage.getItem('team_id'), scene_id }))
    if (resp?.code == 0 && isPlainObject(resp?.data?.scene)) {
      setOpenScene(resp.data.scene)
    }else{
      setOpenScene(null);
    }
  }

  const getSceneOperatorList = async (scene_id) => {
    try {
      const resp = await lastValueFrom(ServiceSceneOperatorList({ team_id: sessionStorage.getItem('team_id'), scene_id }))
      if (resp?.code == 0 && isArray(resp?.data?.operators)) {
        setStepList(resp.data.operators)
        if ((openStep == null || selectKey != openScene?.scene_id) && resp.data.operators.length > 0 && isString(resp.data.operators[0]?.operator_id)) {
          // getStepDetail(resp.data.operators[0].operator_id);
        }
        return
      }
      setStepList([]);
    } catch (error) {
      setStepList([]);
    }
  }

  const saveScene = useCallback(debounce(async (scene) => {
    const temp_scene = scene || openScene;
    const resp = await lastValueFrom(ServiceSaveScene({ ...temp_scene }))
    if (resp?.code == 0) {
      // Message.success('保存场景信息成功!')
      // 刷新左侧目录列表
      Bus.$emit('element/getSceneList', { plan_id })
    }
  }, 300), [])

  // 调试场景
  const runScene = useCallback(debounce(async (scene_id, operator_ids = []) => {
    // 自动关闭打开的步骤
    setOpenStep(null);
    try {
      const resp = await lastValueFrom(ServiceUiSceneSend({
        scene_id,
        team_id: sessionStorage.getItem('team_id'),
        operator_ids,
        plan_id:plan_id || ''
      }))
      if (resp?.code == 0 && isString(resp?.data?.run_id)) {
        // 开启调试成功 
        dispatch({
          type: 'uitest_auto/setSceneRunResult',
          payload: {
            run_id: resp.data.run_id,
            scene_id,
            status: 'running'
          },
        })
        // Message.success('保存场景信息成功!')
        // Bus.$emit('element/getSceneList')
      }else{
        dispatch({
          type: 'uitest_auto/setSceneRunResult',
          payload: {
            scene_id,
            status: 'over'
          },
        })
      }
    } catch (error) {
      dispatch({
        type: 'uitest_auto/setSceneRunResult',
        payload: {
          scene_id,
          status: 'over'
        },
      })
    }
  }, 200), []);

  const stopScene = async (scene_id, run_id) => {
    try {
      const resp = await lastValueFrom(ServiceUiSceneStop({
        scene_id,
        team_id: sessionStorage.getItem('team_id'),
        run_id
      }))
    } catch (error) {}
    dispatch({
      type: 'uitest_auto/setSceneRunResult',
      payload: {
        scene_id,
        status: 'over'
      },
    })
  }

  console.log(newStep, "newStep12321");

  const createStep = useCallback(debounce((action, option = {}) => {
    if (option.hasOwnProperty('sort')) {
      option.sort = parseInt(option.sort);
    }
    console.log(option?.sort, typeof option?.sort);
    if (STEP_DEFAULT?.[action]) {
      setNewStep({ ...cloneDeep(STEP_DEFAULT[action]), ...option });
      setVisible(true);
    } else {
      Message.error('敬请期待')
    }
  }, 200), [])

  const saveStep = async (step) => {
    console.log('保存前step',step);
    let data = {};
    if(step?.action == "assert" ){
         data = step?.action_detail?.assert || {};
         switch (data?.type) {
          case "variable_assertion":
            if(!isString(data?.variable_assertion?.actual_value) || data.variable_assertion.actual_value.length <= 0){
              Message.error('实际值不能为空')
              return 
            }else if(!isString(data?.variable_assertion?.expected_value) || data.variable_assertion.expected_value.length <= 0){
              Message.error('期望值不能为空')
              return 
            }
            break;
            case "page_attribute_assertion":
              if(!isString(data?.page_attribute_assertion?.expected_value) || data.page_attribute_assertion.expected_value.length <= 0){
                Message.error('期望值不能为空')
                return 
              }
              break;
          default:
            break;
         }
    }
    if (!step?.team_id) {
      step.scene_id = selectKey;
      step.team_id = sessionStorage.getItem('team_id');
      step.parent_id = step?.parent_id || '0'
    }
    const resp = await lastValueFrom(ServiceCreateSceneOperator({ ...step }))
    if (resp?.code == 0) {
      getSceneOperatorList(selectKey);
      Message.success('保存成功')
      setVisible(false);
    }
  }

  const stepSort = async (steps) => {
    const resp = await lastValueFrom(ServiceOperatorSort({ operators: steps }))
    if (resp?.code == 0) {
      getSceneOperatorList(selectKey);
      Message.success('操作成功')
    }
  }

  const stepDelete = async (steps) => {
    const resp = await lastValueFrom(ServiceOperatorDelete({ team_id: sessionStorage.getItem('team_id'), operator_ids: steps, scene_id: selectKey }))
    if (resp?.code == 0) {
      Message.success('删除成功')
      if (isArray(steps) && steps.includes(openStep?.operator_id)) {
        setOpenStep(null);
      }
      getSceneOperatorList(selectKey);
    }
  }

  const stepForbidden = async (steps, status) => {
    const resp = await lastValueFrom(ServiceOperatorSetStatus({ team_id: sessionStorage.getItem('team_id'), operator_ids: steps, scene_id: selectKey, status }))
    if (resp?.code == 0) {
      Message.success(status == 1 ? ' 恢复成功' : '禁用成功')
      getSceneOperatorList(selectKey);
    }
  }

  const stepCopy = async (step_id) => {
    const resp = await lastValueFrom(ServiceOperatorCopy({ operator_id: step_id, scene_id: selectKey }))
    if (resp?.code == 0) {
      Message.success('复制成功')
      getSceneOperatorList(selectKey);
    }
  }

  const updateStep = debounce(async () => {
    const resp = await lastValueFrom(ServiceOperatorUpdate(openStep))
    if (resp?.code == 0) {
      Message.success('保存成功')
      // 关闭打开
      setOpenStep(null);
      getSceneOperatorList(selectKey);
    }
  }, 150)
  const sceneResponse = sceneRunResult?.[openScene?.scene_id] ? sceneRunResult?.[openScene?.scene_id] : null
  const StepComponent = StepTempalte?.[newStep?.action] ? StepTempalte[newStep.action] : null;
  const treeList = arrayToTreeObject(stepList, 'operator_id')?.sort((pre, after) => pre.sort - after.sort);
  const handleNodeSelect = (node, isChecked) => {
    const newSelectIds = cloneDeep(selectedIds);
    const findAllChildren = (item, ids) => {
      if (isChecked) {
        ids.push(item?.operator_id)
      } else {
        let index = ids.indexOf(item?.operator_id);
        if (index > -1) {
          ids.splice(index, 1);
        }
      }
      if (isArray(item?.children) && item.children.length > 0) {
        item.children.forEach(child => {
          findAllChildren(child, ids);
        });
      }
    }
    findAllChildren(node, newSelectIds);
    console.log("newids", newSelectIds);
    setSelectedIds(newSelectIds);
  };
  console.log(treeData, "treeData111");
  return (
    <Provider value={{
      selectKey,
      setSelectKey,
      openScene,
      setOpenScene,
      saveScene,
      stepList,
      createStep,
      stepSort,
      stepDelete,
      stepForbidden,
      stepCopy,
      runScene,
      stopScene,
      openStep,
      setOpenStep,
      getStepDetail,
      updateStep,
      selectedIds,
      setSelectedIds,
      treeList,
      handleNodeSelect,
      createScene,
      createSceneFolder,
      getSceneDetail,
      plan_id,
      sceneResponse,
      openResponse,
      setOpenResponse,
      getSceneOperatorList
    }}>
      <div className='runnerGo-scene-mgmt'>
        <ResizeBox
          directions={['right']}
          className='runnerGo-scene-mgmt-left'
          resizeTriggers={{
            right: <div className='resizebox-ustom-trigger-vertical'></div>,
          }}
        >
          <SceneTree plan_id={plan_id} selectKey={selectKey} setSelectKey={setSelectKey} treeData={treeData} />
        </ResizeBox>
        <div className="right">
          {selectKey ? <SceneContent /> : <SceneContentEmpty />}
        </div>
        <Drawer
          width={500}
          title={STEP_NAME?.[newStep?.action] || '未定义标题'}
          visible={visible}
          onOk={() => {
            saveStep(newStep);
          }}
          okText='保存'
          onCancel={() => {
            setVisible(false);
          }}
          className={'runnergo-ui-test-scene-drawer'}
        >
          {StepComponent && <StepComponent data={newStep} onChange={setNewStep} />}
        </Drawer>
      </div>
    </Provider>
  )
}
export default SceneMgmt;