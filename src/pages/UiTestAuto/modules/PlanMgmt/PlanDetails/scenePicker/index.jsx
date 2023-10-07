import React, { useState, useRef, useEffect } from 'react';
import { Input, Tree, Button, CheckBox, Message } from 'adesign-react';
import { useDispatch, useSelector } from 'react-redux';
// import ApiStatus from '@components/ApiStatus';
import produce from 'immer';
import { cloneDeep, isArray, isObject, isUndefined, sortBy } from 'lodash';
// import { Collection } from '@indexedDB/project';
// import { IApiCollection } from '@models/collection/api';
import { ServiceImportSceneToPlan } from '@services/UiTestAuto/plan';
import {
  Apis as SvgApis,
  Folder as SvgFolder,
  WS as SvgWebSocket,
  Doc as SvgDoc,
  Search as SvgSearch,
} from 'adesign-react/icons';
import Bus from '@utils/eventBus';
import useListData from './hooks/useListData';
import { ApiTreePanel, BtnAddApiItem, ApiPickerStyle } from './style';
import { useParams } from 'react-router-dom';
import './index.less';
import { useTranslation } from 'react-i18next';
import { Tooltip, Drawer, Select } from '@arco-design/web-react';
import { lastValueFrom } from 'rxjs';

const NodeType = {
  api: SvgApis,
  doc: SvgDoc,
  websocket: SvgWebSocket,
  folder: SvgFolder,
};
const Option = Select.Option
const ScenePicker = (props) => {
  const { onCancel, treeData, taskType, plan_id } = props;
  const { t } = useTranslation();

  const refTree = useRef(null);
  const planMenu = useSelector((store) => store.plan.planMenu);
  const [syncMode, setSyncMode] = useState(1);
  const { id } = useParams();

  const [checkAll, setCheckAll] = useState('unCheck');
  const [checkedApiKeys, setCheckedApiKeys] = useState([]);
  const [filterParams, setFilterParams] = useState({
    key: '',
    status: 'all',
  });
  const [canImport, setCanImport] = useState(true);

  useEffect(() => {
    let checkData = [];
    checkedApiKeys.forEach(item => {
      checkData.push(treeData[item]);
    })
    if (Object.values(planMenu).filter(item => item.scene_type === 'scene').length + checkData.filter(item => item.scene_type === 'scene').length > 1 && taskType === 2) {
      setCanImport(false);
    } else {
      setCanImport(true);
    }
  }, [planMenu, taskType, checkedApiKeys, treeData]);

  const handleChangeParams = (key, newVal) => {
    setFilterParams(
      produce(filterParams, (draft) => {
        draft[key] = newVal;
      })
    );
    refTree.current?.handleExpandItem(true);
  };

  const { filteredTreeList } = useListData({ filterParams, treeData });

  const handleAddApiItems = async () => {
    if (checkedApiKeys.length === 0) {

      return;
    }

    if (!canImport) {
      Message('error', t('message.cantCreateScene'));
      return;
    }

    let param = {
      plan_id,
      "team_id": sessionStorage.getItem('team_id'),
      "sync_mode": syncMode || 1, // 状态：1-实时，2-手动
      "scene_ids": checkedApiKeys
    }
    const resp= await lastValueFrom(ServiceImportSceneToPlan(param))
    if(resp?.code == 0){
      Message('success','导入场景成功!');
       // 刷新左侧目录列表
       Bus.$emit('element/getSceneList', { plan_id })
       onCancel();
    }
  };

  const renderIcon = (icon) => {
    const NodeIcon = NodeType?.[icon];
    if (isUndefined(NodeIcon)) {
      return '';
    }
    return <NodeIcon width={12} style={{ marginLeft: 5 }} />;
  };
  const renderPrefix = (treeNode) => {
    if (treeNode.scene_type !== 'api') {
      return null;
    }
    return <span style={{ marginLeft: 5 }}>{treeNode.method}</span>;
  };

  const renderTreeNode = (nodeItem, { indent, nodeTitle, checkbox }) => {
    return (
      <div className="tree-node-inner">
        {indent}
        {renderIcon(nodeItem.scene_type)}
        {renderPrefix(nodeItem)}
        {
          <Tooltip content={nodeTitle.props.children}>
            {nodeTitle}
          </Tooltip>
        }
        {checkbox}
      </div>
    );
  };

  const handleNodeClick = (itemNode) => {
    if (refTree.current === null) {
      return;
    }
    if (checkedApiKeys.includes(itemNode.scene_id)) {
      refTree.current?.handleCheckNode({ key: itemNode.scene_id, checked: 'uncheck' });
    } else {
      refTree.current?.handleCheckNode({ key: itemNode.scene_id, checked: 'checked' });
    }
  };

  const handleCheckAll = (val) => {
    let checkList = [];
    filteredTreeList.forEach(item => {
      checkList.push(item.scene_id);
    })
    if (val === 'checked') {
      const checkKeys = checkList.length ? checkList : [];
      setCheckedApiKeys(checkKeys);
    }
    if (val === 'uncheck') {
      setCheckedApiKeys([]);
    }
    setCheckAll(val);
  };

  return (
    <Drawer
      visible
      title={t('plan.importScene')}
      className='ui-plan-add-scene-drawer'
      onCancel={onCancel}
      footer={
        <>
          <div className="sync-mode">
            <label>同步方式：</label>
            <Select value={syncMode || 1} onChange={(val) => {
              setSyncMode(val);
            }}>
              <Option key={1} value={1}>自动同步</Option>
              <Option key={2} value={2}>手动同步</Option>
            </Select>
          </div>
          <BtnAddApiItem>
            <Button onClick={handleAddApiItems} disabled={checkedApiKeys.length === 0} className="apipost-blue-btn" type="primary">
              {t('btn.addScene')}
            </Button>
          </BtnAddApiItem>
        </>
      }
    >
      <ApiTreePanel>
        <div className="search-box">
          <Input
            beforeFix={<SvgSearch width="16px" height="16px" />}
            value={filterParams?.key}
            placeholder={t('placeholder.searchScene')}
            onChange={handleChangeParams.bind(null, 'key')}
          />
          <div className="check-all-panel">
            <span>{t('btn.selectAll')}</span>
            <CheckBox
              size="small"
              disabled={(taskType === 2 ? filteredTreeList.length + Object.keys(planMenu).length > 1 : false) || filteredTreeList.length === 0}
              checked={checkAll}
              onChange={(val) => {
                handleCheckAll(val);
              }}
            ></CheckBox>
          </div>
        </div>
        <Tree
          enableCheck
          ref={refTree}
          checkedKeys={checkedApiKeys}
          onCheck={setCheckedApiKeys}
          onNodeClick={handleNodeClick}
          onCheckAll={(val) => {
            setCheckAll(val);
          }}
          enableVirtualList
          render={renderTreeNode}
          dataList={filteredTreeList}
          fieldNames={{
            key: 'scene_id',
            title: 'name',
            parent: 'parent_id',
          }}
          nodeSort={(pre, after) => pre.sort - after.sort}
          rootFilter={(item) => item.parent_id === '0'}
        />
      </ApiTreePanel>
    </Drawer>
  );
};

export default ScenePicker;
