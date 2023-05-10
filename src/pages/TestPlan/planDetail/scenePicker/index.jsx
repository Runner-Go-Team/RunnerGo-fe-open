import React, { useState, useRef } from 'react';
import { Input, Tree, Drawer, Button, CheckBox } from 'adesign-react';
import { useDispatch, useSelector } from 'react-redux';
// import ApiStatus from '@components/ApiStatus';
import produce from 'immer';
import { cloneDeep, isArray, isObject, isUndefined, sortBy } from 'lodash';
// import { Collection } from '@indexedDB/project';
// import { IApiCollection } from '@models/collection/api';
import {
  Apis as SvgApis,
  Folder as SvgFolder,
  WS as SvgWebSocket,
  Doc as SvgDoc,
} from 'adesign-react/icons';
import Bus from '@utils/eventBus';
import useListData from './hooks/useListData';
import { ApiTreePanel, BtnAddApiItem, ApiPickerStyle } from './style';
import { useParams } from 'react-router-dom';
import './index.less';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@arco-design/web-react';

const NodeType = {
  api: SvgApis,
  doc: SvgDoc,
  websocket: SvgWebSocket,
  folder: SvgFolder,
};

const ScenePicker = (props) => {
  const { onCancel, onAddApiItemsm, from } = props;
  const { t } = useTranslation();

  const refTree = useRef(null);
  const sceneDatas = useSelector((store) => store?.scene?.sceneDatas);
  const { id } = useParams();

  const dispatch = useDispatch();

  const [checkAll, setCheckAll] = useState('unCheck');
  const [checkedApiKeys, setCheckedApiKeys] = useState([]);
  const [filterParams, setFilterParams] = useState({
    key: '',
    status: 'all',
  });

  const id_apis_auto_plan = useSelector((d) => d.auto_plan.id_apis);
  const node_config_auto_plan = useSelector((d) => d.auto_plan.node_config);

  const handleChangeParams = (key, newVal) => {
    setFilterParams(
      produce(filterParams, (draft) => {
        draft[key] = newVal;
      })
    );
    refTree.current?.handleExpandItem(true);
  };

  const { filteredTreeList } = useListData({ filterParams });

  const getApiDataItems = async (sceneDatas, ckdkeys) => {
    // step1.深克隆，防止串数据
    const treeData = cloneDeep(sceneDatas);

    // step2.转树形结构
    const rootData = [];
    Object.entries(treeData).forEach(([key, data]) => {
      const parentNode = treeData[data.parent_id];
      if (data?.parent_id === '0') {
        rootData.push(data);
      }
      if (!isUndefined(parentNode)) {
        if (isUndefined(parentNode?.children)) {
          parentNode.children = [];
        }
        parentNode.children.push(data);
      }
    });

    // step3.将已勾选的数据数组转object
    const checkedData = {};
    checkedApiKeys.forEach((dataKey) => {
      checkedData[dataKey] = true;
    });

    // step4.递归，取出有序勾选的api信息
    const apiIds = [];

    const digTree = (nodeList) => {
      const sortedList = sortBy(nodeList, ['sort']);
      for (const nodeItem of sortedList) {
        if (checkedData[nodeItem.target_id] === true && ['scene', 'folder'].includes(nodeItem.target_type)) {
          apiIds.push({
            id: nodeItem.target_id,
            name: nodeItem.name,
            desc: nodeItem.description,
            type: nodeItem.target_type
          });
        }
        if (nodeItem.target_type === 'folder') {
          digTree(nodeItem.children);
        }
      }
    };
    digTree(rootData);
    // const apiFullDatas = [];
    // for (const targetId of apiIds) {
    //   const fullData = await Collection.get(targetId);
    //   apiFullDatas.push(fullData);
    // }
    return apiIds;
  };

  const handleAddApiItems = async () => {

    if (checkedApiKeys.length === 0) {
      return;
    }

    const dataList = await getApiDataItems(sceneDatas, checkedApiKeys);

    let _dataList = [...dataList];

    dataList.forEach(elem => {
      if (elem.type === 'scene') {
        let fn = (id) => {
          let _ = Object.values(sceneDatas).find(item => `${item.target_id}` === `${id}`);
          if (_dataList.findIndex(_item => `${_item.id}` === `${_.parent_id}`) === -1) {

            if (`${_.parent_id}` !== '0') {
              _dataList.push({
                id: _.parent_id,
                name: _.name,
                desc: _.description,
                type: _.target_type
              });
              fn(_.parent_id);
            }
          }
        }
        fn(elem.id);
      }
    })


    Bus.$emit('importSceneList', _dataList.map(item => item.id), id, 'auto_plan', (scene_id_list, code) => {
      if (scene_id_list.length > 0) {
        dispatch({
          type: 'scene/updateOpenName',
          payload: scene_id_list[0].name,
        })
        dispatch({
          type: 'scene/updateOpenDesc',
          payload: scene_id_list[0].description
        })

        Bus.$emit('addOpenAutoPlanScene', { target_id: scene_id_list[0].target_id });

        dispatch({
          type: 'auto_plan/updateOpenInfo',
          payload: { target_id: scene_id_list[0].target_id }
        })
      }

      if (code === 0) {
        onCancel();
      }
    });
  };

  const renderIcon = (icon) => {
    const NodeIcon = NodeType?.[icon];
    if (isUndefined(NodeIcon)) {
      return '';
    }
    return <NodeIcon width={12} style={{ marginLeft: 5 }} />;
  };
  const renderPrefix = (treeNode) => {
    if (treeNode.target_type !== 'api') {
      return null;
    }
    return <span style={{ marginLeft: 5 }}>{treeNode.method}</span>;
  };

  const renderTreeNode = (nodeItem, { indent, nodeTitle, checkbox }) => {
    return (
      <div className="tree-node-inner">
        {indent}
        {renderIcon(nodeItem.target_type)}
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
    if (checkedApiKeys.includes(itemNode.target_id)) {
      refTree.current?.handleCheckNode({ key: itemNode.target_id, checked: 'uncheck' });
    } else {
      refTree.current?.handleCheckNode({ key: itemNode.target_id, checked: 'checked' });
    }
  };

  const handleCheckAll = (val) => {
    let checkList = [];
    filteredTreeList.forEach(item => {
      checkList.push(item.target_id);
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
      className='api-config-drawer'
      onCancel={onCancel}
      mask={false}
      footer={
        <BtnAddApiItem>
          <Button onClick={handleAddApiItems} disabled={checkedApiKeys.length === 0} className="apipost-blue-btn" type="primary">
            {t('btn.addScene')}
          </Button>
        </BtnAddApiItem>
      }
    >
      <ApiTreePanel>
        <div className="search-box">
          <Input
            value={filterParams?.key}
            placeholder={t('placeholder.searchScene')}
            onChange={handleChangeParams.bind(null, 'key')}
          />
          <div className="check-all-panel">
            <span>{t('btn.selectAll')}</span>
            <CheckBox
              size="small"
              disabled={filteredTreeList.length === 0}
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
            key: 'target_id',
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
