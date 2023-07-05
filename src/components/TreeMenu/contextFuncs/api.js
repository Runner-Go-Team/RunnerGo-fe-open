import { copyStringToClipboard } from '@utils';
import { Message, Modal } from 'adesign-react';
import Bus from '@utils/eventBus';
import { getCoverData, getFullData, deleteMultiData } from './common';
import i18next from 'i18next';

export const shareApi = ({ props, params, showModal }) => {
    Bus.$emit('openModal', 'CreateShare', {
        defaultShareName: params.name,
        defaultShareMode: params.target_type,
        project_id: props.project_id,
        target_id: params.target_id,
    });
};

export const copyApi = async ({ target_id }) => {
    Bus.$emit('copyApi', target_id);
};

export const cloneApi = ({ target_id }, props) => {
    if (props?.from == 'mock') {
        Bus.$emit('mock/cloneTargetById', target_id, 'folder-open-tag');
        return
    }
    Bus.$emit('cloneTargetById', target_id);
};

export const cutApi = ({ params, showModal }) => { };

export const deleteApi = ({ target_id }, props) => {
    Modal.confirm({
        title: i18next.t('modal.look'),
        content: i18next.t('modal.deleteApi'),
        okText: i18next.t('btn.ok'),
        cancelText: i18next.t('btn.cancel'),
        onOk: () => {
            if (props?.from == 'mock') {
                Bus.$emit('mock/deleteMockItem',target_id,()=>{
                    Message('success', '删除成功!');
                });
                return;
            }
            deleteMultiData(target_id);
        }
    })
};

const updateApiStatus=({ target_id,is_mock_open }, props)=>{
    if (props?.from == 'mock') {
        Bus.$emit('mock/updateTreeData', {
            target_id,
            data:{
                is_mock_open:is_mock_open == 2 ? 1 : 2,
            }
        }, ()=>{
            Message('success', is_mock_open == 2 ? '开启Mock成功!' : '关闭Mock成功!');
        });
    }
}

export default {
    shareApi,
    cloneApi,
    copyApi,
    cutApi,
    deleteApi,
    updateApiStatus,
};
