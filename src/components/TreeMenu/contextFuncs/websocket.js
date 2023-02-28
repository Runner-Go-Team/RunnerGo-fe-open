import { copyStringToClipboard } from '@utils';
import { Message } from 'adesign-react';
import Bus from '@utils/eventBus';
import { getCoverData, getFullData, deleteMultiData } from './common';

export const copyWebSocket = async ({ props, params, showModal }) => {
    const localData = await getFullData(params);
    const cpyiedData = await getCoverData(localData);
    copyStringToClipboard(JSON.stringify(cpyiedData));
};

export const cloneWebSocket = async ({ props, params, showModal }) => {
    Bus.$emit('cloneTargetById', params?.target_id);
};

export const shareWebSocket = async ({ props, params, showModal }) => {
    Bus.$emit('openModal', 'CreateShare', {
        defaultShareName: params.name,
        defaultShareMode: params.target_type,
        project_id: props.project_id,
        target_id: params.target_id,
    });
};

export const deleteWebSocket = async ({ props, params, showModal }) => {
    deleteMultiData(props.project_id, params.target_id);
};

export default {
    copyWebSocket,
    cloneWebSocket,
    deleteWebSocket,
    shareWebSocket,
};
