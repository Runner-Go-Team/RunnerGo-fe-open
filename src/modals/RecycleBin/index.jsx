import React, { useEffect, useState } from 'react'
import { Input, Message, Modal, Popconfirm } from '@arco-design/web-react';
import { ServiceSceneTrashList, ServiceUiSceneRecall, ServiceUiSceneDelete } from '@services/UiTestAuto/scene';
import './index.less';
import { debounce, isArray } from 'lodash';
import { lastValueFrom } from 'rxjs';
import Bus from '@utils/eventBus';
import { IconDelete, IconSearch, IconUndo } from '@arco-design/web-react/icon';

const RecycleBinModal = (props) => {
  const { onCancel } = props;
  const [recycleList, setRecycleList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const initRecycleList = async () => {
    const resp = await lastValueFrom(ServiceSceneTrashList({ page: 1, size: 9999, team_id: sessionStorage.getItem('team_id'), keyword }));
    if (resp?.code == 0 && isArray(resp?.data?.trash_list)) {
      setRecycleList(resp.data.trash_list);
    }
  }
  useEffect(() => {
    initRecycleList();
  }, [keyword]);
  const recycleDelte =async (scene_id)=>{
    const resp = await lastValueFrom(ServiceUiSceneDelete({ team_id: sessionStorage.getItem('team_id'), scene_ids:[scene_id] }));
    if (resp?.code == 0) {
      Message.success('彻底删除成功');
      initRecycleList();
    }
  }
  const recycleRecall =async (scene_id)=>{
    const resp = await lastValueFrom(ServiceUiSceneRecall({ team_id: sessionStorage.getItem('team_id'), scene_ids:[scene_id] }));
    if (resp?.code == 0) {
      Message.success('恢复成功');
      initRecycleList();
      Bus.$emit('element/getSceneList')
    }
  }
  return (
    <>
      <Modal
        className="runnerGo-recycle-bin-modal"
        title={'回收站'}
        visible
        onCancel={onCancel}
        footer={null}
        maskClosable={false}
      >
        <div className="runnerGo-recycle-bin-modal-header">
          <Input value={keyword} onChange={(val) => setKeyword(val)} style={{ width: '100%', height: 28 }} prefix={<IconSearch />} placeholder={'搜索场景/目录'} />
        </div>
        <div className='recycle-bin-list'>
          {isArray(recycleList) && recycleList.map(item => (
            <div className='recycle-bin-list-item' key={item?.scene_id}>
              <div className="left">{item?.name || '未命名名称'}</div>
              <div className="right">
                <div className="delete">
                  <Popconfirm
                    focusLock
                    title={`你确定彻底删除该${item?.scene_type == 'folder' ? '目录' : '场景'}吗?彻底删除后无法恢复!`}
                    onOk={() => {
                      recycleDelte(item?.scene_id)
                    }}
                    getPopupContainer={()=>document.querySelector('body')}
                    onCancel={() => {}}
                  >
                    <IconDelete />彻底删除{item?.scene_type == 'folder' ? '目录' : '场景'}
                  </Popconfirm>
                </div>
                <div className="recover">
                <Popconfirm
                    focusLock
                    title={`你确定恢复该${item?.scene_type == 'folder' ? '目录' : '场景'}吗?${item?.scene_type == 'folder' ? '目录下的场景都会恢复' : ''}`}
                    onOk={() => {
                      recycleRecall(item?.scene_id)
                    }}
                    getPopupContainer={()=>document.querySelector('body')}
                    onCancel={() => {}}
                  >
                    <IconUndo />恢复{item?.scene_type == 'folder' ? '目录' : '场景'}
                  </Popconfirm>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}
export default RecycleBinModal;