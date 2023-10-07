import React, { useState } from 'react'
import { Input, Message, Modal, Select, TreeSelect, Checkbox } from '@arco-design/web-react';
import { v4 as uuidv4 } from 'uuid';
import produce from 'immer';
import useSceneHooks from '@hooks/useFolders/scene';
import { ServiceCreateScene, ServiceSaveScene } from '@services/UiTestAuto/scene';
import './index.less';
import { filterArcoTree } from '@utils';
import { debounce, isArray, isEmpty, isPlainObject, isString, trim } from 'lodash';
import { lastValueFrom } from 'rxjs';
import Bus from '@utils/eventBus';
import { IconDelete, IconPlus } from '@arco-design/web-react/icon';
const Option = Select.Option;

const CreateSceneModal = (props) => {
  const { onCancel, scene, parent_id, plan_id } = props;

  const { sceneFolders } = useSceneHooks({plan_id});
  const [elementData, setElementData] = useState({
    parent_id: parent_id || scene?.parent_id || '0',
    name: scene?.name || '新建场景',
    description:scene?.description || '',
    browsers: isArray(scene?.browsers) ? scene.browsers : [
      {
          browser_type: "chromium",
          headless: false,
          size_type: "default", // set_size
          set_size: {
              x: 0,
              y: 0
          }
      }
  ],
  })

  const onSubmit = debounce(() => {
    if (trim(elementData.name).length <= 0) {
      Message.error('场景名称不能为空');
      return
    }
    let param = {
      "team_id": sessionStorage.getItem('team_id'),
      source: 1,
      ...elementData
    }
    if(isString(plan_id)){
      param.source = 2
      param.plan_id = plan_id
    }
    if (scene) {
      param.scene_id = scene.scene_id;
      lastValueFrom(ServiceSaveScene(param)).then((res) => {
        if (res?.code == 0) {
          Message.success('修改场景成功');
          Bus.$emit('element/getSceneList',{plan_id});
          onCancel();
        }
      })
      return
    }
    lastValueFrom(ServiceCreateScene(param)).then((res) => {
      if (res?.code == 0) {
        Message.success('新建场景成功');
        Bus.$emit('element/getSceneList',{plan_id});
        onCancel();
      }
    })
  }, 200)
  const updateLocator = (id, data) => {
    setElementData(
      produce(elementData, (draft) => {
        let item = draft.locators.find(item => item.id == id)
        if(isPlainObject(data)){
          Object.keys(data).forEach(key=>{
            item[key] = data[key];
          })
        }
      })
    );
  }
  return (
    <>
      <Modal
        className="runnerGo-scene-create-modal"
        title={scene ? '编辑场景' : '新增场景'}
        visible
        onOk={onSubmit}
        onCancel={onCancel}
        maskClosable={false}
      >
        <div className='runnerGo-card-special'>
          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>名称</label>
            <div className="content">
              <Input maxLength={30} value={elementData.name} onChange={(val) => setElementData({ ...elementData, name: val })} style={{ width: '100%', height: 38 }} placeholder={'请输入场景名称'} />
            </div>
          </div>

          <div className='runnerGo-card-special-item'>
            <label><span className='required'>*</span>父级目录</label>
            <div className="content">
              <TreeSelect
                value={elementData.parent_id}
                onChange={(val) => {
                  setElementData({ ...elementData, parent_id: val })
                }}
                getPopupContainer={()=>document.querySelector('body')}
                placeholder='根目录'
                treeData={[{ key: '0', title: '根目录', children: sceneFolders }]}
                style={{ width: '100%' }}
                dropdownMenuStyle={{
                  maxHeight: 500,
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
          <label>描述</label>
            <div className="content">
              <Input maxLength={50} value={elementData.description} onChange={(val) => setElementData({ ...elementData, description: val })} style={{ width: '100%', height: 38 }} placeholder={'请输入场景描述'} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
export default CreateSceneModal;