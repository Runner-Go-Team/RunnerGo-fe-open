import { Modal } from 'adesign-react';

export const asyncModalConfirm = (data) =>
  new Promise((reject) => {
    let obj = {};
    if (data.diyText) {
      obj = {
        title: data.title,
        content: data.content,
        large: true,
        onOk() {
          reject(true);
        },
        onCancel() {
          reject(false);
        },
        onDiy() {
          reject(undefined);
        },
        diyText: data.diyText,
        cancelText: data.cancelText,
        okText: data.okText,
      };
    } else {
      obj = {
        title: data.title,
        content: data.content,
        onOk() {
          reject(true);
        },
        onCancel() {
          reject(false);
        },
        cancelText: data.cancelText,
        okText: data.okText,
      };
    }
    Modal.confirm(obj);
  });

export default { asyncModalConfirm };
