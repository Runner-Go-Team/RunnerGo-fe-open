import React, { useState, useRef } from 'react';
import { Input, Tree, Drawer, Button, CheckBox } from 'adesign-react';
import { useSelector } from 'react-redux';
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
import './index.less';
import { useTranslation } from 'react-i18next';

const NodeType = {
  api: SvgApis,
  doc: SvgDoc,
  websocket: SvgWebSocket,
  folder: SvgFolder,
};

const ApiPicker = (props) => {
  const { onCancel, onAddApiItems, from } = props;

  const refTree = useRef(null);
  const apiDatas = useSelector((store) => store?.apis?.apiDatas);
  const { t } = useTranslation();


  const [checkAll, setCheckAll] = useState('unCheck');
  const [checkedApiKeys, setCheckedApiKeys] = useState([]);
  const [filterParams, setFilterParams] = useState({
    key: '',
    status: 'all',
  });

  const handleChangeParams = (key, newVal) => {
    setFilterParams(
      produce(filterParams, (draft) => {
        draft[key] = newVal;
      })
    );
  };

  const { filteredTreeList } = useListData({ filterParams });

  const getApiDataItems = async (apiDatas, ckdkeys) => {
    // step1.深克隆，防止串数据
    const treeData = cloneDeep(apiDatas);

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
        if (checkedData[nodeItem.target_id] === true && ['api'].includes(nodeItem.target_type)) {
          apiIds.push(nodeItem.target_id);
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

    const dataList = await getApiDataItems(apiDatas, checkedApiKeys);
    Bus.$emit('importCaseApi', dataList);


    onCancel();
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
        {nodeTitle}
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
    if (val === 'checked') {
      const checkKeys = isObject(apiDatas) ? Object.keys(apiDatas) : [];
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
      title={ t('scene.importApiTitle') }
      className='api-config-drawer'
      style={{ 'z-index': 9999 }}
      onCancel={onCancel}
      mask={false}
      footer={
        <BtnAddApiItem>
          <Button onClick={handleAddApiItems} className="apipost-blue-btn" type="primary">
            { t('scene.addApi') }
          </Button>
        </BtnAddApiItem>
      }
    >
      <ApiTreePanel>
        <div className="search-box">
          <Input
            value={filterParams?.key}
            placeholder={ t('placeholder.searchApis') }
            onChange={handleChangeParams.bind(null, 'key')}
          />
          <div className="check-all-panel">
            <span>{ t('btn.selectAll') }</span>
            <CheckBox
              size="small"
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

export default ApiPicker;
