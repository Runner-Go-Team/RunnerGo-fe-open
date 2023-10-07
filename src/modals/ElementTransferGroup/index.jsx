import React, { useState } from 'react'
import { Message, Modal, Select, TreeSelect } from '@arco-design/web-react';
import useElementHooks from '@hooks/useFolders/element';
import { ServiceMoveElement } from '@services/UiTestAuto/element';
import './index.less';
import { debounce, isArray } from 'lodash';
import { lastValueFrom } from 'rxjs';
import Bus from '@utils/eventBus';
const Option = Select.Option;

const ElementTransferGroupModal = (props) => {
  const { onCancel, ids, setIds } = props;
  

  const { elementFolders } = useElementHooks();
  const [parent_id, setParent_id] = useState('0')

  const onSubmit = debounce(() => {

    lastValueFrom(ServiceMoveElement({
      "team_id": sessionStorage.getItem('team_id'),
      element_ids: ids,
      parent_id
    })).then((res) => {
      if (res?.code == 0) {
        Message.success('转移元素成功');
        // 清空选中的ids
        setIds && setIds([]);
        // 刷新当前元素列表
        Bus.$emit('elementList/debounceGetElementList');
        onCancel();
      }
    })
  }, 200)

  return (
    <>
      <Modal
        className="runnerGo-element-transfer-group-modal"
        title={'转移分组'}
        visible
        onOk={onSubmit}
        onCancel={onCancel}
        autoFocus={false}
        focusLock={false}
        maskClosable={false}
      >
        <div className='runnerGo-transfer-group-content'>
          <label>正在转移{isArray(ids) ? ids.length : 0}个元素,转移至</label>
          <TreeSelect
            value={parent_id}
            onChange={(val) => {
              setParent_id(val)
            }}
            getPopupContainer={()=>document.body}
            placeholder='根目录'
            treeData={[{ key: '0', title: '根目录', children: elementFolders }]}
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
      </Modal>
    </>
  )
}
export default ElementTransferGroupModal;