import { Message, Modal } from '@arco-design/web-react';
import { ServiceTrashSceneOrFolder, ServiceSaveUiSceneCopy } from '@services/UiTestAuto/scene';
import Bus from '@utils/eventBus';
import { lastValueFrom } from 'rxjs';

const createScene = (node) => {
  Bus.$emit('openModal', 'CreateUiScene', { parent_id: node.scene_id })
}

const editSceneFolder = (node) => {
  Bus.$emit('openModal', 'SceneFolder', { folder: node })
}
const createChildFolder= (node) => {
  Bus.$emit('openModal', 'SceneFolder', { parent_id: node.scene_id })
}
const deleteSceneFolder = (node) => {
  if (node?.scene_id) {
    Modal.confirm({
      title: '注意',
      content: '删除的目录及其全部场景将进入回收站，30 天后自动彻底删除。',
      icon: null,
      closable: true,
      onOk: () => {
        return new Promise((resolve, reject) => {
          lastValueFrom(ServiceTrashSceneOrFolder({ team_id: sessionStorage.getItem('team_id'), scene_id: node.scene_id })).then(res => {
            if (res?.code == 0) {
              Message.success('删除目录成功');
              Bus.$emit('element/getSceneList')
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

const deleteScene = (node) => {
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
              Bus.$emit('element/getSceneList')
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
const editScene = (node) => {
  Bus.$emit('openModal', 'CreateUiScene', { scene: node })
}
const copyScene = async (node) => {
  if (node?.scene_id) {
    const resp = await lastValueFrom(ServiceSaveUiSceneCopy({
      scene_id: node.scene_id,
      team_id: sessionStorage.getItem('team_id')
    }))
    if (resp?.code == 0) {
      Message.success('复制场景成功');
      Bus.$emit('element/getSceneList')
    }
  }

}
export default {
  createScene,
  createChildFolder,
  editSceneFolder,
  deleteSceneFolder,
  deleteScene,
  editScene,
  copyScene,
}