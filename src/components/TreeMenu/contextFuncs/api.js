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

export const cloneApi = ({ target_id }) => {
    Bus.$emit('cloneTargetById', target_id);
};

export const cutApi = ({ props, params, showModal }) => { };

export const deleteApi = ({ target_id }) => {
    Modal.confirm({
        title: i18next.t('modal.look'),
        content: i18next.t('modal.deleteApi'),
        okText: i18next.t('btn.ok'),
        cancelText: i18next.t('btn.cancel'),
        onOk: () => {
            deleteMultiData(target_id);
        }
    })
};

export default {
    shareApi,
    cloneApi,
    copyApi,
    cutApi,
    deleteApi,
};
