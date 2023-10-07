import React, { useState } from 'react'
import { Input, Message, Modal, TreeSelect } from '@arco-design/web-react';
import useElementHooks from '@hooks/useFolders/element';
import { ServiceCreateElementFolder,ServiceEditElementFolder } from '@services/UiTestAuto/element';
import './index.less';
import { filterArcoTree } from '@utils';
import { debounce, trim } from 'lodash';
import { lastValueFrom } from 'rxjs';
import Bus from '@utils/eventBus';

const ElementFolderModal = (props) => {
  const { onCancel, folder, parent_id } = props;
  const { elementFolders } = useElementHooks({ filterId: folder?.element_id });
  const [folderData, setFolderData] = useState({
    parent_id: parent_id || folder?.parent_id || '0',
    name: folder?.name || '新建目录'
  })
  // const aaa = filterArcoTree([{key:'1',children:[{key:'1-1'}]}],'1-1');

  const onSubmit = debounce(() => {
    if (trim(folderData.name).length <= 0) {
      Message.error('目录名称不能为空');
      return
    }
    if(folder){
      lastValueFrom(ServiceEditElementFolder({
        "name": trim(folderData.name),
        "team_id": sessionStorage.getItem('team_id'),
        "parent_id": folderData.parent_id,
        element_id:folder.element_id
      })).then((res) => {
        if (res?.code == 0) {
          Message.success('修改目录成功');
          Bus.$emit('element/getElementFolderList');
          onCancel();
        }
      })
      return 
    }
    lastValueFrom(ServiceCreateElementFolder({
      "name": trim(folderData.name),
      "team_id": sessionStorage.getItem('team_id'),
      "parent_id": folderData.parent_id
    })).then((res) => {
      if (res?.code == 0) {
        Message.success('新建目录成功');
        Bus.$emit('element/getElementFolderList');
        onCancel();
      }
    })
  }, 200)

  return (
    <>
      <Modal
        className="runnerGo-element-folder-modal"
        title={folder ? '编辑目录' : '新建目录'}
        visible
        onOk={onSubmit}
        onCancel={onCancel}
        focusLock={false}
      >
        <div className='runnerGo-card-special'>
          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>父级目录</label>
            <div className="content">
              <TreeSelect
                value={folderData.parent_id}
                onChange={(val) => {
                  setFolderData({ ...folderData, parent_id: val })
                }}
                placeholder='根目录'
                getPopupContainer={()=>document.body}
                treeData={[{ key: '0', title: '根目录', children: elementFolders }]}
                style={{ width: '100%' }}
                dropdownMenuStyle={{
                  maxHeight: 270,
                }}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                  </>
                )}
              ></TreeSelect>
            </div>
          </div>
          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>目录名称</label>
            <div className="content">
              <Input maxLength={30} value={folderData.name} onChange={(val) => setFolderData({ ...folderData, name: val })} style={{ width: '100%', height: 38 }} placeholder={'请输入目录名称'} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
export default ElementFolderModal;