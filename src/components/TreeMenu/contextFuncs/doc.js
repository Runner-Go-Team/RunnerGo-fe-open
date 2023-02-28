import { copyStringToClipboard } from '@utils';
import { Message } from 'adesign-react';
import { getCoverData, getFullData, deleteMultiData } from './common';

export const shareDoc = ({ props, params, showModal }) => {
    props.showModal('createShare', {
        defaultShareName: params.name,
        defaultShareMode: params.target_type,
        project_id: props.project_id,
        target_id: params.target_id,
    });
};

export const copyDoc = async ({ params }) => {
    const localData = await getFullData(params);
    const cpyiedData = getCoverData(localData);
    copyStringToClipboard(JSON.stringify(cpyiedData));
};

export const deleteDoc = async ({ props, params, showModal }) => {
    deleteMultiData(props.project_id, params.target_id);
};

export const cloneDoc = ({ props, params, showModal }) => {
    Bus.$emit('cloneTargetById', params?.target_id);
};

export default {
    shareDoc,
    copyDoc,
    deleteDoc,
    cloneDoc,
};
