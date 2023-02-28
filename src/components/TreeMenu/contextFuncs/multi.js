import { copyStringToClipboard } from '@utils';
import Bus from '@utils/eventBus';
import { getFullData, getCoverData, deleteMultiData } from './common';

export const multiCopyData = async ({ params, props }) => {
    const localData = await getFullData(props.selectedNewTreeData);
    const copiedData = await getCoverData(localData);
    copyStringToClipboard(JSON.stringify(copiedData));
};

export const multiShareApi = ({ props, params }) => {
    Bus.$emit('openModal', 'CreateShare', {
        defaultShareMode: 'diy',
        project_id: props.project_id,
        target_ids: props.selectedKeys,
    });

    // props.showModal('createShare', {
    //   defaultShareMode: 'diy',
    //   project_id: props.project_id,
    //   target_ids: props.selectedKeys,
    // });
};

export const deleteApis = async ({ props, params, showModal }) => {
    deleteMultiData(props.project_id, props.selectedKeys);
};

export default {
    multiCopyData,
    multiShareApi,
    deleteApis,
};
