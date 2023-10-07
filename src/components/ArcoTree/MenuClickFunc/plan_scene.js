import { Message, Modal } from '@arco-design/web-react';
import { ServiceTrashSceneOrFolder } from '@services/UiTestAuto/scene';
import Bus from '@utils/eventBus';
import { lastValueFrom } from 'rxjs';

const createScene = (node, { plan_id }) => {
  Bus.$emit('openModal', 'CreateUiScene', { parent_id: node.scene_id, plan_id })
}

const editSceneFolder = (node) => {
  Bus.$emit('openModal', 'SceneFolder', { folder: node })
}

const createChildFolder=(node)=>{
  Bus.$emit('openModal','SceneFolder',{parent_id:node.scene_id})
}

const deleteSceneFolder = (node, { plan_id }) => {
  if (node?.scene_id) {
    Modal.confirm({
      title: '注意',
      content: '是否确定要删除此目录？此操作会将目录下的场景一起删除!',
      icon: null,
      closable: true,
      onOk: () => {
        return new Promise((resolve, reject) => {
          lastValueFrom(ServiceTrashSceneOrFolder({ team_id: sessionStorage.getItem('team_id'), scene_id: node.scene_id })).then(res => {
            if (res?.code == 0) {
              Message.success('删除目录成功');
              Bus.$emit('element/getSceneList', { plan_id })
              Bus.$emit('scene/deleteScene',node.scene_id)
              resolve();
            }
            reject();
          })
        }).catch((e) => {
          throw e;
        })
      }
    });
  }
}

const deleteScene = (node, { plan_id }) => {
  if (node?.scene_id) {
    Modal.confirm({
      title: '注意',
      content: '是否确定要删除此场景？',
      icon: null,
      closable: true,
      onOk: () => {
        return new Promise((resolve, reject) => {
          lastValueFrom(ServiceTrashSceneOrFolder({ team_id: sessionStorage.getItem('team_id'), scene_id: node.scene_id })).then(res => {
            if (res?.code == 0) {
              Message.success('删除场景成功');
              Bus.$emit('element/getSceneList', { plan_id })
              resolve();
            }
            reject();
          })
        }).catch((e) => {
          throw e;
        })
      }
    });
  }
}

export default {
  planCreateScene: createScene,
  planEditSceneFolder: editSceneFolder,
  planDeleteSceneFolder: deleteSceneFolder,
  planDeleteScene: deleteScene,
  createChildFolder
}