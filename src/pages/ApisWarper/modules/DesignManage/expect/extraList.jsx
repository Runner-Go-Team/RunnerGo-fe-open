import React, { useState, useContext } from 'react';
import { Button, Switch, Modal } from 'adesign-react';
import { Delete as DeleteSvg, Setting1 as Setting1Svg } from 'adesign-react/icons';
import AddExpect from './modal/addExpect';
import AiExpect from './modal/aiExpect';
import Context from '../designContext';

const ExtraList = (props) => {
  const { data, onChange } = useContext(Context);
  const { expectList, handleAddExpect, handleDeleteExpect } = props;
  const [modalType, setModalType] = useState('');

  return (
    <>
      {modalType === 'expect' && (
        <AddExpect handleAddExpect={handleAddExpect} onCancel={setModalType.bind(null, '')} />
      )}
      {modalType === 'ai_expect' && (
        <AiExpect expectList={expectList} onCancel={setModalType.bind(null, '')} />
      )}

      <div className="extra-panel">
        <div className="extra-panel-left">
          <Button
            size="mini"
            className="apipost-blue-btn"
            onClick={setModalType.bind(null, 'expect')}
          >
            新建期望
          </Button>
          <Button
            className="extra-del"
            onClick={() => {
              Modal.confirm({
                title: '是否删除当前期望',
                content: '确认删除',
                onOk: handleDeleteExpect,
              });
            }}
          >
            <DeleteSvg /> 删除期望
          </Button>
        </div>
        <div className="extra-panel-right">
          <Button className="extra-smart" onClick={setModalType.bind(null, 'ai_expect')}>
            <Setting1Svg />
            智能期望
          </Button>
          <Switch
            size="small"
            checked={data.ai_expect?.isEnable > 0}
            onChange={(checked) => {
              onChange('ai_expect.isEnable', checked ? 1 : -1);
            }}
          ></Switch>
        </div>
      </div>
    </>
  );
};

export default ExtraList;
