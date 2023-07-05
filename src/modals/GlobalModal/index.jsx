import React, { useState, useEffect } from 'react';
import Bus from '@utils/eventBus';
import Notice from '../Notice';


const GlobalModal = () => {
  const modalsDom = {
    Notice: Notice, // 通知弹窗
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
