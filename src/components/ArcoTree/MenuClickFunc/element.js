import { Message, Modal } from '@arco-design/web-react';
import { ServiceDeleteElementFolder } from '@services/UiTestAuto/element';
import Bus from '@utils/eventBus';
import { lastValueFrom } from 'rxjs';

const createElement=(node)=>{
  Bus.$emit('openModal','CreateElement',{parent_id:node.element_id})
}

const editFolder=(node)=>{
  Bus.$emit('openModal','ElementFolder',{folder:node})
}

const createChildFolder=(node)=>{
  Bus.$emit('openModal','ElementFolder',{parent_id:node.element_id})
}

const deleteFolder=(node)=>{
  if(node?.element_id){
    Modal.confirm({
      title: '注意',
      content:'是否确定要删除此目录？此操作会将目录下的接口一起删除!',
      icon:null,
      closable:true,
      onOk:()=>{
        return new Promise((resolve,reject)=>{
          lastValueFrom(ServiceDeleteElementFolder({team_id:sessionStorage.getItem('team_id'),element_ids:[node.element_id]})).then(res=>{
            if(res?.code == 0){
              Message.success('删除目录成功');
              Bus.$emit('element/getElementFolderList')
              resolve();
            }
            reject();
          })
        }).catch((e)=>{
          throw e;
        })
      }
    });
  }
}

export default {
  createElement,
  editFolder,
  deleteFolder,
  createChildFolder
}