import React, { useState, useRef, useEffect } from 'react';
import { Button, Dropdown } from 'adesign-react';
import {
  Environment as EnvironmentSvg,
  Down as DownSvg,
  Iconeye as SvgIconEye,
} from 'adesign-react/icons';
import { useSelector } from 'react-redux';
import { isObject } from 'lodash';
import EnvAddModal from './envAdd';
import EnvEditForm from './envModify';
import EnviromentList from './envlist';

const Eviroment = (props) => {
  // const currentEnv = useSelector((store) => store?.envs?.currentEnv);
  const workspace = useSelector((store) => store?.workspace);
  const { CURRENT_ENV_ID = '-1' } = workspace;
  const envDatas = useSelector((store) => store.envs.envDatas);

  const dropDownRef = useRef(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editEnvId, setEditEnvId] = useState(null);
  // const [currentEnv, setCurrentEnv] = useState(null);

  const currentEnv = isObject(envDatas) ? envDatas[CURRENT_ENV_ID] : {};

  const handleShowAddForm = () => {
    setShowAddForm(true);
    dropDownRef.current?.setPopupVisible(false);
  };

  // 修改环境信息
  const handleEditEnv = (envId, event) => {
    setShowEditForm(true);
    setEditEnvId(envId);
    dropDownRef.current?.setPopupVisible(false);
    event.preventDefault();
    event.stopPropagation();
  };

  // 修改/查看当前环境
  const handleShowCurrentEnv = () => {
    setShowEditForm(true);
    setEditEnvId(CURRENT_ENV_ID);
    dropDownRef.current?.setPopupVisible(false);
  };

  const handleHideList = () => {
    dropDownRef.current?.setPopupVisible(false);
  };

  return (
    <div className="enviroment-panel">
      {showAddForm && <EnvAddModal onCancel={setShowAddForm.bind(null, false)} />}
      {showEditForm && (
        <EnvEditForm editEnvId={editEnvId} onCancel={setShowEditForm.bind(null, false)} />
      )}
      <Dropdown
        ref={dropDownRef}
        offset={[30, 0]}
        placement="bottom-end"
        content={
          <>
            <EnviromentList
              handleHideList={handleHideList}
              handleAdd={handleShowAddForm}
              handleEditEnv={handleEditEnv}
            />
          </>
        }
        style={{
          margin: 0,
        }}
      >
        <Button
          style={{ width: 'auto' }}
          className="enviroment-title"
          // preFix={<EnvironmentSvg width="12px" height="12px" />}
          afterFix={<DownSvg width="12px" height="12px" />}
        >
          {currentEnv?.name || '默认环境'}
        </Button>
      </Dropdown>
      <Button className="menu-item" size="mini" onClick={handleShowCurrentEnv}>
        <SvgIconEye width="12px" height="12px" />
      </Button>
    </div>
  );
};

export default Eviroment;
