import React, { useEffect, useState } from 'react';
import { Input, Modal } from 'adesign-react';
import { Doubt as SvgDoubt } from 'adesign-react/icons';

const Textarea = Input.Textarea;
const ModalInput = (props) => {
  const { visible, setVisible, onChange } = props;
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleModalConfirm = () => {
    onChange(value);
    setVisible(false);
  };

  return (
    <Modal
      title={
        <span>备注</span>
      }
      visible={visible}
      onOk={handleModalConfirm}
      onCancel={() => { setVisible(false) }}
    >
      <Textarea value={value} onChange={setValue.bind(null)}></Textarea>
    </Modal>
  );
};

export default ModalInput;
