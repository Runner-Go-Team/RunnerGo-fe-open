import React, { useState, useEffect } from 'react';
import Bus from '@utils/eventBus';
import Notice from '../Notice';
import ElementFolder from '../Folders/Element';
import SceneFolder from '../Folders/Scene';
import CreateElement from '../CreateElement';
import CreateUiScene from '../CreateUiScene';
import ElementTransferGroup from '../ElementTransferGroup';
import RecycleBin from '../RecycleBin';
import CreateUiPlan from '../CreateUiPlan';
import UiPlanTask from '../UiPlanTask';
import UiSceneRunConfig from '../UiSceneRunConfig'
import { isFunction } from 'lodash';


const GlobalModal = () => {
  const modalsDom = {
    Notice: Notice, // 通知弹窗
    ElementFolder: ElementFolder,
    SceneFolder : SceneFolder,
    CreateElement: CreateElement,
    CreateUiScene : CreateUiScene,
    ElementTransferGroup: ElementTransferGroup,
    RecycleBin:RecycleBin, //d回收站
    CreateUiPlan:CreateUiPlan, //创建ui计划
    UiPlanTask:UiPlanTask, // ui计划任务配置
    UiSceneRunConfig:UiSceneRunConfig , //ui场景任务配置
  }

  const [modals, setModals] = useState([]);
  // 移除弹窗
  const removeModal = (modalName) => {
    setModals((prevModals) => prevModals.filter((modal) => modal.name !== modalName));
  }
  useEffect(() => {
    // 打开全局弹窗
    Bus.$on('openModal', (ModalName, ModalProps) => {
      if (modalsDom.hasOwnProperty(ModalName)) {
        if (isFunction(ModalProps?.onCancel)) {
          ModalProps.onCancel = ModalProps.onCancel.bind(null, removeModal.bind(null, ModalName));
        }
        const newModal = {
          name: ModalName,
          ModalProps: ModalProps || {},
        };
        setModals((prevModals) => [...prevModals, newModal]);
      }
    });
    return () => {
      Bus.$off('openModal');
    };
  }, []);
  return (
    <>
      {modals.map((modal) => {
        const ModalTag = modalsDom[modal?.name];
        return (
          <ModalTag
            key={modal?.name}
            onCancel={() => {
              removeModal(modal?.name);
            }}
            {...modal?.ModalProps}
          ></ModalTag>
        )
      })}
    </>
  );
};
export default GlobalModal;
