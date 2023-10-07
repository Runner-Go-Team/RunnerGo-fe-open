import { Dropdown, Menu, Message, Tree } from '@arco-design/web-react';
import {
  More as SvgMore,
  Apis as SvgApis,
  Folder as SvgFolder,
} from 'adesign-react/icons';
import SvgUiScene from '@assets/icons/ui_scene.svg';
import { IconDown, IconMore } from '@arco-design/web-react/icon';
import useTreeData from './hooks/useTreeData';
import React, { forwardRef, useEffect, useRef, useState, useImperativeHandle, useMemo } from 'react'
import { useSelector } from 'react-redux';
import contextFuncs from './MenuClickFunc';
import { isArray, isFunction, isUndefined } from 'lodash';
import './index.less';
const MenuItem = Menu.Item;
const ArcoTree = (props, forwardsRef) => {
  const { data, selectedKeys, onSelect, module, filterParams = { keyword: '', fields: ['name'] }, fieldNames = {}, showLine = true, autoExpandParent = false, onNodeDrop, ...options } = props;
  const defaultFieldNames = {
    key: 'target_id',
    title: 'name',
    type: 'target_type',
    ...fieldNames
  }
  const NodeType = {
    api: SvgApis,
    folder: SvgFolder,
    scene: SvgUiScene,
  };
  const [expandedKeys, setExpandedKeys] = useState([]);

  const menuObj = {
    element_folder: [{ action: 'createElement', title: '新建元素' }, { action: 'createChildFolder', title: '新增子目录' }, { action: 'editFolder', title: '编辑目录' }, { action: 'deleteFolder', title: '删除目录' }],
    scene_folder: [{ action: 'createScene', title: '新建场景' }, { action: 'createChildFolder', title: '新增子目录' }, { action: 'editSceneFolder', title: '编辑目录' }, { action: 'deleteSceneFolder', title: '删除目录' }],
    scene_scene: [{ action: 'editScene', title: '编辑场景' }, { action: 'copyScene', title: '复制场景' }, { action: 'deleteScene', title: '删除场景' }],
    plan_scene_folder: [{ action: 'planCreateScene', title: '新建场景' }, { action: 'createChildFolder', title: '新增子目录' }, { action: 'planEditSceneFolder', title: '编辑目录' }, { action: 'planDeleteSceneFolder', title: '删除目录' }],
    plan_scene_scene: [{ action: 'planDeleteScene', title: '删除场景' }],
  }
  const getDroplist = (node) => {
    let type = node?.[defaultFieldNames.type];
    if (isArray(menuObj?.[`${module}_${type}`])) {
      return <Menu onClickMenuItem={(action, e) => {
        e.stopPropagation();
        const funcModule = contextFuncs[module][action];
        if (isFunction(funcModule) === false) {
          Message.error('无效操作')
          return;
        }
        funcModule(node, { ...options });
      }} className='arco-tree-right-menu-list' selectedKeys={[]} style={{ width: 180 }} mode='pop'>
        {menuObj[`${module}_${type}`].map(item => <MenuItem key={item.action}>{item.title}</MenuItem>)}
      </Menu>
    };
  };
  const renderTitle = (node) => {
    let NodeIcon = NodeType?.[node?.[defaultFieldNames.type]];
    if (isUndefined(NodeIcon)) {
      NodeIcon = null;
    } else {
      NodeIcon = <NodeIcon className='arco-icon adesign-to-arco-icon' width={14} style={{ marginRight: 5 }} />
    }
    return <Dropdown
      trigger='contextMenu'
      position='bl'
      droplist={
        getDroplist(node)
      }
    >
      <div className='arco-tree-node-title-group'>{(!showLine || node?.[defaultFieldNames.type] == 'folder') && NodeIcon}<span className='arco-tree-node-title-group-text'>{node?.name}</span></div>
    </Dropdown>
  }
  const renderIcon = (node) => {
    let NodeIcon = NodeType?.[node?.[defaultFieldNames.type]];
    if (isUndefined(NodeIcon)) {
      return { dragIcon: null };
    }
    if (node?.[defaultFieldNames.type] == 'folder') {
      return { dragIcon: null, switcherIcon: isArray(node?.childrenData) && node.childrenData.length > 0 ? <IconDown fontSize={14} width={14} /> : null }
    } else {
      return { dragIcon: null, switcherIcon: <NodeIcon className='arco-icon adesign-to-arco-icon' width={14} style={{ marginRight: 5 }} /> }
    }

  }
  const onDrop = ({ dragNode, dropNode, dropPosition }) => {
    const loop = (data, key, callback) => {
      data.some((item, index, arr) => {
        if (item[defaultFieldNames.key] === key) {
          callback(item, index, arr);
          return true;
        }

        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };

    const data = [...filteredTreeData];
    let dragItem;
    loop(data, dragNode.props._key, (item, index, arr) => {
      arr.splice(index, 1);
      dragItem = item;
      // dragItem.className = 'tree-node-dropover';
    });
    if (dropPosition === 0) {
      // 不是目录禁止拖进去
      if ((dropNode?.props?.scene_type !== 'folder')) {
        return;
      }
      loop(data, dropNode.props._key, (item, index, arr) => {
        let tlist = item.children;
        tlist = tlist.filter((item) => item.target_id !== dragNode.props._key);
        const tData = { ...dragItem, [defaultFieldNames['parentKey']]: dropNode.props._key };
        tlist.splice(0, 0, tData);

        // item.children = item.children || [];
        // item.children.push(dragItem);
        // item.children.forEach((i, index) => {
        //   // item.children[index][defaultFieldNames['parentKey']] = item[defaultFieldNames['parentKey']]
        //   item.children[index].sort = index + 1;
        // })
        onNodeDrop && onNodeDrop(tlist, dragNode, dropNode, dropPosition);
      });
    } else {
      loop(data, dropNode.props._key, (item, index, arr) => {
        arr.splice(dropPosition < 0 ? index : index + 1, 0, dragItem);
        arr.forEach((item, index) => {
          arr[index].sort = index + 1;
          arr[index][defaultFieldNames['parentKey']]= dropNode.props[defaultFieldNames['parentKey']]
        })
        onNodeDrop && onNodeDrop(arr, dragNode, dropNode, dropPosition);
      });
    }
    console.log(data);
    // setTreeData([...data]);
    // setTimeout(() => {
    //   dragItem.className = '';
    //   // setTreeData([...data]);
    // }, 3000);
  }

  const handleExpandAll = (data) => {
    const allKeys = getAllNodeKeys(data || filteredTreeData);
    setExpandedKeys(allKeys);
  };

  const handleCollapseAll = () => {
    setExpandedKeys([]);
  };
  const onExpand = (keys) => {
    setExpandedKeys(keys);
  }
  const getAllNodeKeys = (nodes) => {
    return nodes.reduce((keys, node) => {
      keys.push(node[defaultFieldNames.key]);
      if (node.children && node.children.length > 0) {
        keys.push(...getAllNodeKeys(node.children));
      }
      return keys;
    }, []);
  };
  const { filteredTreeData } = useTreeData({ handleExpandAll, filterParams, treeData: data, fieldNames });
  useImperativeHandle(forwardsRef, () => {
    return {
      handleExpandAll,
      handleCollapseAll,
      getAllNodeKeys,
    };
  });
  return (
    <Tree
      ref={forwardsRef}
      autoExpandParent={autoExpandParent}
      draggable
      icons={renderIcon}
      showLine={showLine}
      onDrop={onDrop}
      blockNode
      fieldNames={defaultFieldNames}
      virtualListProps={
        { height: '100%' }
      }
      defaultSelectedKeys={['0-0-1']}
      treeData={filteredTreeData}
      expandedKeys={expandedKeys}
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      onExpand={onExpand}
      renderTitle={renderTitle}
      renderExtra={(node) => <span className='arco-tree-node-extra'>
        <Dropdown
          triggerProps={{
            autoFixPosition: false,
            autoFitPosition: false,
            alignPoint: false,
            duration: 50,
          }}
          trigger={'click'}
          position='bl'
          droplist={
            getDroplist(node)
          }
        >
          <span className='arco-tree-node-extra-more'>
            <IconMore fontSize={14} />
          </span>
        </Dropdown>
      </span>}
      {...options}
    />
  )
}

export default forwardRef(ArcoTree);
