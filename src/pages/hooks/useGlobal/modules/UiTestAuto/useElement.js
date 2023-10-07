import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Bus, { useEventBus } from '@utils/eventBus';
import { ServiceGetElementFolderList, ServiceGetSceneList } from '@services/UiTestAuto/element';
import { ServiceGetReportDetail } from '@services/UiTestAuto/report';
import { lastValueFrom } from 'rxjs';
import { debounce, has, isArray, isPlainObject, isString } from 'lodash';

// 新建接口
const useElement = (props) => {
  const { refGlobal } = props;
  const dispatch = useDispatch();

  const getElementFolderList = debounce(async (team_id) => {
    let temp_team_id = team_id || refGlobal?.current?.CURRENT_TEAM_ID;

    const res = await lastValueFrom(ServiceGetElementFolderList({ team_id: temp_team_id }))
    if (res?.code == 0 && isArray(res?.data?.folders)) {
      // 生成元素redux数据 放入
      let tempElementFolderDatas = {};
      res.data.folders.forEach(element => {
        if (has(element, 'element_id') && has(element, 'parent_id')) {
          tempElementFolderDatas[element.element_id] = element;
        }
      });
      dispatch({
        type: 'uitest_auto/updateElementFolderDatas',
        payload: tempElementFolderDatas,
      })
    }
  }, 200);

  const getSceneList = debounce(async (data = {}) => {
    const { team_id, plan_id } = data;
    let temp_team_id = team_id || refGlobal?.current?.CURRENT_TEAM_ID;
    let params = {
      team_id: temp_team_id,
      source: 1
    }
    if (isString(plan_id)) {
      getPlanSceneList({ plan_id })
      return
    }
    const res = await lastValueFrom(ServiceGetSceneList(params))

    if (res?.code == 0 && isArray(res?.data?.scenes)) {
      // 生成元素redux数据 放入
      let tempSceneDatas = {};
      res.data.scenes.forEach(scene => {
        if (has(scene, 'scene_id') && has(scene, 'parent_id')) {
          tempSceneDatas[scene.scene_id] = scene;
        }
      });
      dispatch({
        type: 'uitest_auto/updateSceneDatas',
        payload: tempSceneDatas,
      })
    }
  }, 200)
  const getPlanSceneList = debounce(async (data = {}) => {
    const { team_id, plan_id } = data;
    let temp_team_id = team_id || refGlobal?.current?.CURRENT_TEAM_ID;
    let params = {
      team_id: temp_team_id,
      source: 2,
      plan_id
    }
    const res = await lastValueFrom(ServiceGetSceneList(params))
    if (res?.code == 0 && isArray(res?.data?.scenes)) {
      // 生成元素redux数据 放入
      let tempSceneDatas = {};
      res.data.scenes.forEach(scene => {
        if (has(scene, 'scene_id') && has(scene, 'parent_id')) {
          tempSceneDatas[scene.scene_id] = scene;
        }
      });
      dispatch({
        type: 'uitest_auto/updatePlanSceneDatas',
        payload: tempSceneDatas,
        plan_id
      })
    }
  }, 200)
  const getReportDetails = debounce(async (data = {}) => {
    const { report_id } = data;
    if (!report_id) {
      return
    }
    let temp_team_id = refGlobal?.current?.CURRENT_TEAM_ID;
    const resp = await lastValueFrom(ServiceGetReportDetail({
      report_id: report_id,
      team_id: temp_team_id || sessionStorage.getItem('team_id')
    }));
    if (resp?.code == 0 && isPlainObject(resp?.data)) {
      dispatch({
        type: 'uitest_auto/seReportDetails',
        payload: resp.data,
        report_id
      })
    }
  }, 200)

  useEventBus("element/getElementFolderList", getElementFolderList);
  useEventBus("element/getSceneList", getSceneList);
  useEventBus("element/getPlanSceneList", getPlanSceneList);
  useEventBus("element/getReportDetails", getReportDetails)
};

export default useElement;
