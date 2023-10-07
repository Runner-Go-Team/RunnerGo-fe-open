import { Input, Tooltip } from '@arco-design/web-react';
import React, { useRef, useState } from 'react'
import cn from 'classnames';
import ArcoTree from '@components/ArcoTree';
import { ServiceElementFolderSort } from '@services/UiTestAuto/element';
import { IconMenuFold, IconMenuUnfold, IconSearch, IconSort } from '@arco-design/web-react/icon';
import {
  NewFolder as SvgNewFolder,
  Folder as SvgFolder,
} from 'adesign-react/icons';
import SvgElementMgmt from '@assets/icons/element_management';
import { t } from 'i18next';
import { isArray, isFunction } from 'lodash';
import { useSelector } from 'react-redux';
import Bus from '@utils/eventBus';
import { lastValueFrom } from 'rxjs';

const ElementTree = (props) => {
  const { selectKey, setSelectKey } = props;
  const [isExpandAll, setIsExpandAll] = useState(false);
  const treeRef = useRef(null);
  const [filterParams,setFilterParams] = useState({
    keyword:'',
    fields:['name'],
  });
  const treeData = useSelector((store) => store?.uitest_auto?.elementFolderDatas);
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
        <Input value={filterParams.keyword} onChange={(val)=>setFilterParams({...filterParams,keyword:val})} style={{ width: '100%', height: '28px' }} prefix={<IconSearch />} placeholder={'搜索目录'} />
        <div className='operation-btns'>
          <div className='operation-btn' onClick={() => Bus.$emit('openModal', 'CreateElement')}>
            <Tooltip position='top' trigger='hover' content={t('elements.createElement')}>
              <SvgElementMgmt className="arco-icon arco-icon-robot" />
            </Tooltip>
          </div>
          <div className="line"></div>
          <div className='operation-btn' onClick={() => Bus.$emit('openModal', 'ElementFolder')}>
            <Tooltip position='top' trigger='hover' content={t('apis.createFolder')}>
              <SvgNewFolder className="arco-icon arco-icon-robot" />
            </Tooltip>
          </div>
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

        <div onClick={() => setSelectKey('-1')} className={cn('other-tree-node', {
          "active": selectKey == '-1'
        })}><span className='icon'><IconSort /></span><span className='text'>全部元素</span></div>
        <div onClick={() => setSelectKey('0')} className={cn('other-tree-node', {
          "active": selectKey == '0'
        })}><span className='icon'><SvgFolder /></span><span className='text'>根目录元素</span></div>
      </div>

      <ArcoTree
        ref={treeRef}
        data={treeData}
        fieldNames={{
          key: 'element_id',
          parentKey: 'parent_id',
          title: 'name',
          type: 'element_type'
        }}
        filterParams={filterParams}
        module='element'
        selectedKeys={[selectKey]}
        onSelect={(keys) => {
          if (isArray(keys) && keys.length > 0) {
            setSelectKey(keys[0]);
          } else {
            setSelectKey('');
          }
        }}
        onNodeDrop={async (arr) => {
          await lastValueFrom(ServiceElementFolderSort({ elements: arr }))
          // 刷新左侧目录列表
          Bus.$emit('element/getElementFolderList')
        }}
      />
    </>
  )
}

export default ElementTree;
