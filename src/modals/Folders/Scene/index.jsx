import React, { useState } from 'react'
import { Input, Message, Modal, TreeSelect } from '@arco-design/web-react';
import useSceneHooks from '@hooks/useFolders/scene';
import { ServiceCreateSceneFolder, ServiceEditSceneFolder } from '@services/UiTestAuto/scene';
import './index.less';
import { filterArcoTree } from '@utils';
import { debounce, isString, trim } from 'lodash';
import { lastValueFrom } from 'rxjs';
import Bus from '@utils/eventBus';

const SceneFolderModal = (props) => {
  const { onCancel, folder, plan_id, parent_id } = props;
  const { sceneFolders } = useSceneHooks({ filterId: folder?.element_id, plan_id });

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
    if (folder) {
      lastValueFrom(ServiceEditSceneFolder({
        "name": trim(folderData.name),
        "team_id": sessionStorage.getItem('team_id'),
        "parent_id": folderData.parent_id,
        scene_id: folder.scene_id
      })).then((res) => {
        if (res?.code == 0) {
          Message.success('修改目录成功');
          Bus.$emit('element/getSceneList', { plan_id });
          onCancel();
        }
      })
      return
    }
    let param = {
      "name": trim(folderData.name),
      "team_id": sessionStorage.getItem('team_id'),
      "parent_id": folderData.parent_id,
      source: 1
    }
    if (isString(plan_id)) {
      param.source = 2
      param.plan_id = plan_id
    }
    lastValueFrom(ServiceCreateSceneFolder(param)).then((res) => {
      if (res?.code == 0) {
        Message.success('新建目录成功');
        Bus.$emit('element/getSceneList', { plan_id });
        onCancel();
      }
    })
  }, 200)

  return (
    <>
      <Modal
        className="runnerGo-scene-folder-modal"
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
                getPopupContainer={()=>document.body}
                placeholder='根目录'
                treeData={[{ key: '0', title: '根目录', children: sceneFolders }]}
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
export default SceneFolderModal;