import Bus from '@utils/eventBus';

export const cloneTarget = ({ props, params }) => {
    Bus.$emit('mock/cloneTargetById', params?.target_id);
};

export const closeTarget = ({ params }) => {
    Bus.$emit('mock/removeOpenItem', params?.target_id);
};

export const closeAllTarget = ({ props, params }) => {
    Bus.$emit('mock/closeAllTarget');
};

export const focreCloseAllTarget = ({ props, params }) => {
    Bus.$emit('mock/focreCloseAllTarget');
};

export const closeOtherTarget = ({ props, params }) => {
    Bus.$emit('mock/closeOtherTargetById', params?.target_id);
};

export const focreCloseOtherTarget = ({ props, params }) => {
    Bus.$emit('mock/focreCloseOtherTargetById', params?.target_id);
};

export const saveAllTarget = ({ props, params }) => {
    Bus.$emit('mock/saveAllTarget');
};

export default {
    cloneTarget,
    closeTarget,
    closeAllTarget,
    focreCloseAllTarget,
    closeOtherTarget,
    saveAllTarget,
    focreCloseOtherTarget,
};
