import { Input, Tooltip } from '@arco-design/web-react';
import React, { useContext, useRef, useState } from 'react'
import cn from 'classnames';
import ArcoTree from '@components/ArcoTree';
import { ServiceUiSceneSort } from '@services/UiTestAuto/scene';
import { IconDelete, IconDownload, IconMenuFold, IconMenuUnfold, IconSearch, IconSort } from '@arco-design/web-react/icon';
import {
  NewFolder as SvgNewFolder,
  Folder as SvgFolder,
} from 'adesign-react/icons';
import SvgElementMgmt from '@assets/icons/element_management';
import SceneContextMgmt from './context';
import { t } from 'i18next';
import { isArray, isFunction } from 'lodash';
import { useSelector } from 'react-redux';
import Bus from '@utils/eventBus';
import { lastValueFrom } from 'rxjs';

const ElementTree = (props) => {
  const { selectKey, setSelectKey, treeData, plan_id } = props;

  const { createScene, createSceneFolder } = useContext(SceneContextMgmt);

  const [isExpandAll, setIsExpandAll] = useState(false);
  const [filterParams, setFilterParams] = useState({
    keyword: '',
    fields: ['name'],
  });
  const treeRef = useRef(null);
  const handleExpandAll = () => {
    const newExpandStatus = !isExpandAll;
    setIsExpandAll(newExpandStatus);
    if (treeRef?.current && isFunction(treeRef.current?.handleExpandAll) && isFunction(treeRef.current?.handleCollapseAll)) {
      newExpandStatus ? treeRef.current?.handleExpandAll() : treeRef.current?.handleCollapseAll()
    }
  };
  return (
    <>
      <div className="tree-header">
        <Input value={filterParams.keyword} onChange={(val) => setFilterParams({ ...filterParams, keyword: val })} style={{ width: '100%', height: 28 }} prefix={<IconSearch />} placeholder={'搜索场景/目录'} />
        <div className='operation-btns'>
          <div className='operation-btn' onClick={() => createScene()}>
            <Tooltip position='top' trigger='hover' content={t('elements.createScene')}>
              <SvgElementMgmt className="arco-icon arco-icon-robot" />
            </Tooltip>
          </div>
          <div className="line"></div>
          <div className='operation-btn' onClick={() => createSceneFolder()}>
            <Tooltip position='top' trigger='hover' content={t('apis.createFolder')}>
              <SvgNewFolder className="arco-icon arco-icon-robot" />
            </Tooltip>
          </div>
          {plan_id && (<>
            <div className="line"></div>
            <div className='operation-btn' onClick={() => {
              Bus.$emit('ui_plan/showScenePicker')
            }}>
              <Tooltip position='top' trigger='hover' content={t('plan.importScene')}>
                <IconDownload />
              </Tooltip>
            </div>
          </>)}

          <div className="line"></div>
          <div className='operation-btn' onClick={handleExpandAll}>
            <Tooltip position='top' trigger='hover' content={t('apis.expand')}>
              {isExpandAll ? (
                <IconMenuFold fontSize={16} />
              ) : (
                <IconMenuUnfold fontSize={16} />
              )}
            </Tooltip>
          </div>
        </div>
      </div>

      <ArcoTree
        ref={treeRef}
        data={treeData}
        autoExpandParent={true}
        fieldNames={{
          key: 'scene_id',
          parentKey: 'parent_id',
          title: 'name',
          type: 'scene_type'
        }}
        filterParams={filterParams}
        module={plan_id ? 'plan_scene' : 'scene'}
        plan_id={plan_id}
        selectedKeys={[selectKey]}
        onSelect={(keys, extra) => {
          const { selectedNodes } = extra;
          if (isArray(selectedNodes) && selectedNodes.length > 0) {
            if (selectedNodes[0]?.props?.scene_type == 'folder') {
              return
            }
          }
          if (isArray(keys) && keys.length > 0) {
            setSelectKey(keys[0]);
          } else {
            setSelectKey('');
          }
        }}
        onNodeDrop={async (arr) => {
          await lastValueFrom(ServiceUiSceneSort({ scenes: arr }))
          // 刷新左侧目录列表
          Bus.$emit('element/getSceneList')
        }}
      />
      {!plan_id && <div className='tree-footer'>
        <div className="recycle-bin-btn" onClick={() => Bus.$emit('openModal', 'RecycleBin')}>
          <IconDelete fontSize={16} />
          回收站
        </div>
      </div>}
    </>
  )
}

export default ElementTree;
