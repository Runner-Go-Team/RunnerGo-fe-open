import React, { useEffect, useState } from 'react';
import { Input, Message, Button } from 'adesign-react';
import {
  Addcircle as AddcircleSvg,
  Search as SearchSvg,
  Clone as CloneSvg,
  Iconeye as IconeyeSvg,
  Delete as DeleteSvg,
} from 'adesign-react/icons';
import './index.less';
// import { IEnv } from '@models/project/env';
import { useSelector, useDispatch } from 'react-redux';
// import { Envs } from '@indexedDB/project';
// import { User } from '@indexedDB/user';
import isObject from 'lodash/isObject';
import { v4 as uuidV4 } from 'uuid';
import { getLocalEnvsDatas } from '@rxUtils/env';
import useEnvs from './hooks/useEnv';

const EnviromentList = (props) => {
  const dispatch = useDispatch();
  const { handleAdd, handleEditEnv, handleHideList } = props;

  const { saveEnvs, deleteEnvs } = useEnvs({});

  const project_id = useSelector((store) => store?.workspace?.CURRENT_PROJECT_ID);
  const currentEnvId = useSelector((store) => store?.workspace?.CURRENT_ENV_ID);
  const envDatas = useSelector((store) => store.envs.envDatas);

  const envList = isObject(envDatas) ? Object.values(envDatas) : [];

  // const [envList, setEnvList] = useState<Array<IEnv>>([]);
  const [filterValue, setFilterValue] = useState('');

  const filteredList = React.useMemo(() => {
    const newList = envList.filter((item) => {
      return (
        filterValue === '' || item.name.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
      );
    });

    return newList.sort((a, b) => a.env_id.localeCompare(b.env_id));
  }, [envList, filterValue]);

  const refreshEnvs = async () => {
    const envDatas = await getLocalEnvsDatas(project_id);
    dispatch({
      type: 'envs/setEnvDatas',
      payload: envDatas,
    });
  };

  // 复制环境
  const handleCopyEnv = (envId, event) => {
    if (envId === '-2') {
      Message('error', 'Mock环境不可复制');
      return;
    }

    const oldEnvGuid = `${project_id}/${envId}`;
    Envs.get(oldEnvGuid).then((data) => {
      if (isObject(data)) {
        const newEnvId = uuidV4();
        saveEnvs({
          envData: {
            ...data,
            env_id: newEnvId,
            name: `${data.name}副本`,
            id: `${project_id}/${newEnvId}`,
          },
          envList: Object.keys(data.list).map((k) => {
            return { ...data.list[k], key: k };
          }),
          env_id: newEnvId,
        });
        refreshEnvs();
      }
    });
    event.preventDefault();
    event.stopPropagation();
  };

  // 切换环境
  const handleSwitchEnv = async (env_id) => {
    dispatch({
      type: 'workspace/updateWorkspaceState',
      payload: {
        CURRENT_ENV_ID: env_id,
      },
    });

    const uuid = localStorage.getItem('uuid');

    User.update(uuid, {
      'workspace.CURRENT_ENV_ID': env_id,
    });
    handleHideList();
  };

  const handleDeleteEnv = (envId, event) => {
    if (envId === '-1' || envId === '-2') {
      Message('error', '默认环境和Mock环境不可删除');
      return;
    }
    const delId = `${project_id}/${envId}`;
    Envs.delete(delId);
    deleteEnvs({ env_id: envId });
    refreshEnvs();
    // 当前环境被删除则切到默认环境
    if (currentEnvId === envId) {
      handleSwitchEnv('-1');
    }

    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="enviroment-list">
      <div className="env-button" onClick={handleAdd}>
        <AddcircleSvg width="12px" height="12px" />
        <span>新建环境</span>
      </div>
      <Input
        value={filterValue}
        size="mini"
        onChange={(val) => {
          setFilterValue(val);
        }}
        beforeFix={<SearchSvg width="12px" height="12px" />}
      />
      <div className="envlist">
        {filteredList?.map((envItem) => (
          <div
            className={envItem.env_id !== currentEnvId ? 'env-li' : 'env-li active'}
            onClick={handleSwitchEnv.bind(null, envItem.env_id)}
            key={envItem.env_id}
          >
            <div className="etitle text-ellips2" title={envItem.name}>
              {envItem.name}
            </div>
            <div className="btns">
              <Button onClick={handleCopyEnv.bind(null, envItem.env_id)}>
                <CloneSvg width={16} />
              </Button>
              <Button onClick={handleEditEnv.bind(null, envItem.env_id)}>
                <IconeyeSvg width={16} />
              </Button>
              <Button onClick={handleDeleteEnv.bind(null, envItem.env_id)}>
                <DeleteSvg width={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnviromentList;
