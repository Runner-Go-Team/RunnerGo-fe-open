import React, { useState, useRef } from 'react';
import { Input, Tree, Drawer, Button, CheckBox, Message } from 'adesign-react';
import { useSelector, useDispatch } from 'react-redux';
// import ApiStatus from '@components/ApiStatus';
import produce from 'immer';
import { cloneDeep, isArray, isObject, isPlainObject, isUndefined, sortBy } from 'lodash';
// import { Collection } from '@indexedDB/project';
// import { IApiCollection } from '@models/collection/api';
import {
  Apis as SvgApis,
  Folder as SvgFolder,
  WS as SvgWebSocket,
  Search as SvgSearch,
  Doc as SvgDoc,
} from 'adesign-react/icons';
import useListData from './hooks/useListData';
import { ApiTreePanel, BtnAddApiItem, ApiPickerStyle } from './style';
import './index.less';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@arco-design/web-react';

const NodeType = {
  api: SvgApis,
  doc: SvgDoc,
  websocket: SvgWebSocket,
  folder: SvgFolder,
};

const ApiPicker = (props) => {
  const { onCancel, data, onSubmit, title } = props;
  const treeDatas = isPlainObject(data) ? data : useSelector((store) => store.apis.apiDatas);
  const refTree = useRef(null);
  const { t } = useTranslation();

  console.log(treeDatas);

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
    refTree.current?.handleExpandItem(true);
  };

  const { filteredTreeList } = useListData({ filterParams, treeData: treeDatas });

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

  console.log(filteredTreeList);

  return (
    <Drawer
      className='add-api-drawer'
      visible
      title={title || t('scene.importApiTitle')}
      onCancel={onCancel}
      mask={false}
      footer={
        <BtnAddApiItem>
          <Button onClick={() => {
            if (checkedApiKeys.length === 0) {
              Message('error', t('message.importEmpty'));
              return;
            }
            onSubmit(checkedApiKeys, treeDatas)
          }} disabled={checkedApiKeys.length === 0} className="apipost-blue-btn" type="primary">
            {t('scene.addApi')}
          </Button>
        </BtnAddApiItem>
      }
    >
      <ApiTreePanel>
        <div className="search-box">
          <Input
            beforeFix={<SvgSearch width="16px" height="16px" />}
            value={filterParams?.key}
            placeholder={t('placeholder.searchApis')}
            onChange={handleChangeParams.bind(null, 'key')}
          />
          <div className="check-all-panel">
            <span>{t('btn.selectAll')}</span>
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
