import Bus from '@utils/eventBus';

export const cloneTarget = ({ props, params }) => {
    Bus.$emit('cloneTargetById', params?.target_id);
};

export const closeTarget = ({ params }) => {
    Bus.$emit('removeOpenItem', params?.target_id);
};

export const closeAllTarget = ({ props, params }) => {
    Bus.$emit('closeAllTarget');
};

export const focreCloseAllTarget = ({ props, params }) => {
    Bus.$emit('focreCloseAllTarget');
};

export const closeOtherTarget = ({ props, params }) => {
    Bus.$emit('closeOtherTargetById', {}, params?.target_id);
};

export const focreCloseOtherTarget = ({ props, params }) => {
    Bus.$emit('focreCloseOtherTargetById', {}, params?.target_id);
};

export const saveAllTarget = ({ props, params }) => {
    Bus.$emit('saveAllTarget');
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
