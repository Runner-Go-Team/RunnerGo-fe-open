import React, { useState, useEffect } from 'react';
import { Modal } from 'adesign-react';
import PaymentCon from './index';
import PayAddSuccessModal from '../PayAddSuccessModal';
import { PayModalWrapper } from './style';

const Index = (props) => {
  const {
    onCancel,
    needBuyStation,
    successPer,
    noRegisters,
    groupCode,
    onSuccessCancel,
    setvisible,
    visible,
    spaceUsage,
    // spaceIdArr,
    // setspaceIdArr,
    // ugListHandle,
    // teamInfoAll,
  } = props;
  const [noRegistersPre, setNoRegistersPre] = useState(0);
  const [successPer1, setSuccessPer] = useState(0);
  const [payAddSuccessVisible, setPayAddSuccessVisible] = useState(false);

  useEffect(() => {
    setNoRegistersPre(noRegisters);
  }, [noRegisters]);
  useEffect(() => {
    setSuccessPer(successPer);
  }, [successPer]);
  useEffect(() => {
    if (!visible && needBuyStation && needBuyStation > 0) {
      setPayAddSuccessVisible(true);
    }
  }, [visible]);
  return (
    <div>
      {payAddSuccessVisible && (
        <PayAddSuccessModal
          noRegistersPre={noRegistersPre}
          successPer={successPer1}
          onCancel={onSuccessCancel}
        />
      )}

      {visible && (
        <Modal
          title={null}
          footer={null}
          visible
          onCancel={setvisible}
          className={PayModalWrapper}
          // bodyStyle={
          //   !spaceUsage
          //     ? {
          //         width: 1324,
          //         maxWidth: 1342,
          //         height: 780,
          //       }
          //     : { width: 'max-content' }
          // }
        >
          <PaymentCon
            type="modal"
            needBuyStation={needBuyStation}
            setvisible={setvisible}
            visible={visible}
            setNoRegisters={setNoRegistersPre}
            setSuccessPer={setSuccessPer}
            groupCode={groupCode}
            spaceUsage={spaceUsage}
            // spaceIdArr={spaceIdArr}
            // setspaceIdArr={setspaceIdArr}
            // ugListHandle={ugListHandle}
            // teamInfoAll={teamInfoAll}
          />
        </Modal>
      )}
    </div>
  );
};
export default Index;
