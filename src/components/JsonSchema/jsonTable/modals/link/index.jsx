import React, { useEffect, useMemo } from 'react';
import { Tree, Input, Modal, CheckBox } from 'adesign-react';
import { useSelector } from 'react-redux';
import { useSafeState } from 'apt-hooks';
import { isEmpty, isPlainObject, isString, isUndefined } from 'lodash';
import cn from 'classnames';
import { Folder as SvgFolder } from 'adesign-react/icons';
// import SvgModel from '@assets/icons/model.svg';
import useListData from './hooks/useListData';

import { linkWarper } from './style';

// type Props = {
//   onLinkSchema: (modelInfo: IDataModel) => void;
//   default_model_id?: string;
// };

const LinkPanel = (props) => {
  const { onLinkSchema, default_model_id } = props;

  const simpleModels = useSelector((store) => store?.dataModel?.simpleModels);
  const [value, setValue] = useSafeState(null);
  const [filterName, setFilterName] = useSafeState('');

  useEffect(() => {
    if (isEmpty(default_model_id)) {
    }

    const defaultValue = simpleModels?.[default_model_id];

    if (isPlainObject(defaultValue)) {
      setValue(defaultValue);
    }
  }, [simpleModels, default_model_id]);

  const menuList = useMemo(() => {
    return Object.values(simpleModels || {});
  }, [simpleModels]);
  const { filteredTreeList } = useListData({ menuList, filterName });

  const handleConfirm = () => {
    // todo 检查是否循环引用

    onLinkSchema(value);
  };

  const handleClose = () => {
    onLinkSchema(null);
  };

  const checkNodeLeaf = (node) => {
    if (isString(node?.model_type) && node.model_type === 'folder') {
      return false;
    }
    return true;
  };

  const onNodeClick = async (data) => {
    if (data.model_type !== 'model') {
      return;
    }
    return;
    // const nodeData = await getModelItem(data?.model_id);
    // if (isUndefined(nodeData)) {
    //   return;
    // }
    if (nodeData?.model_id === value?.model_id) {
      setValue(null);
    } else {
      setValue(nodeData);
    }
  };

  const renderTreeNode = (nodeItem, { indent, nodeTitle, itemCount }) => {
    return (
      <div
        className={cn('tree-node-inner', {
          active: false,
        })}
      >
        {indent}
        {nodeItem.model_type === 'model' && (
          <CheckBox
            onChange={onNodeClick.bind(null, nodeItem.data)}
            checked={
              !isUndefined(value?.model_id) && nodeItem.data.model_id === value?.model_id
                ? 'checked'
                : 'uncheck'
            }
          />
        )}
        {nodeItem.model_type === 'folder' ? (
          <SvgFolder className="icon-svg" />
        ) : (
          <></>
          // <SvgModel className="icon-svg" />
        )}
        <div className="apipost-tree-node-title">
          {!isEmpty(nodeItem.data?.display_name)
            ? nodeItem.data?.display_name
            : nodeItem.data?.name}
        </div>
      </div>
    );
  };

  return (
    <Modal width={420} title="导入数据模型" visible onCancel={handleClose} onOk={handleConfirm}>
      <div className={linkWarper}>
        <Input value={filterName} onChange={setFilterName} placeHolder="搜索模型名称" />

        {filteredTreeList.length === 0 ? (
          <div className="empty-list">暂无数据</div>
        ) : (
          <Tree
            showLine
            showIcon={false}
            className="tree-panel"
            nodeSort={(pre, after) => {
              return pre.sort - after.sort;
            }}
            fieldNames={{
              key: 'model_id',
              title: 'name',
              parent: 'parent_id',
            }}
            enableCheck
            dataList={filteredTreeList}
            render={renderTreeNode}
            onNodeClick={onNodeClick}
            checkLeafNode={checkNodeLeaf}
            rootFilter={(item) => item.parent_id === '0'}
          ></Tree>
        )}
      </div>
    </Modal>
  );
};

export default LinkPanel;
