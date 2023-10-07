import { useSelector, useDispatch } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
// import { Collection } from '@indexedDB/project';
import { of } from 'rxjs';
import { tap, filter, map, switchMap } from 'rxjs/operators';
import isArray from 'lodash/isArray';
import Bus from '@utils/eventBus';

const useNodeSort = (props) => {
    const { treeData } = props;
    const dispatch = useDispatch();

    // 获取全部父级id列表
    const getParentKeys = (nodeItem) => {
        const results = [];
        const digAll = (node) => {
            const parent = treeData.find(item=>item.operator_id == node.parent_id);
            if (typeof parent !== 'undefined') {
                digAll(parent);
            }
            results.push(node.case_id);
        };
        digAll(nodeItem);
        return results;
    };

    // 获取子节点列表
    const getChildList = (parent_id) => {
        return treeData
            .filter((d) => d?.parent_id === parent_id)
            .sort((a, b) => a.sort - b.sort);
    };

    const handleNodeDragEnd = (
        sourceKey,
        targetKey,
        mode
    ) => {
        const sourceData = treeData.find(item=>item.operator_id == sourceKey);
        // const sourceData = treeData.filter(item => item.case_id === sourceKey)[0];
        const targetData =  treeData.find(item=>item.operator_id == targetKey);
        // const targetData = treeData.filter(item => item.case_id === targetKey)[0];
        let parent_id ='0';
        let targetList = getChildList(targetData?.parent_id);

        // 禁止父节点拖动到子节点
        const targetParentKeys = getParentKeys(targetData);
        if (targetParentKeys.includes(sourceKey) || sourceKey === targetKey) {
            return;
        }

        // 不是目录禁止拖进去
        if (mode === 'inside' && !['wait_events','for_loop','while_loop','if_condition'].includes(targetData.action)) {
            return;
        }

        // 插到上面还是插到下面
        if (mode === 'top' || mode === 'bottom') {
            targetList = targetList.filter((item) => `${item.operator_id}` !== `${sourceKey}`);
            sourceData.parent_id = targetData.parent_id;
            parent_id = targetData.parent_id;

            // 被拖进目标序号
            let sortIndex = 0;
            targetList.forEach((item, index) => {
                if (`${item.operator_id}` === `${targetKey}`) {
                    sortIndex = index;
                }
            });
            if (mode === 'top') {
                targetList.splice(sortIndex, 0, sourceData);
            } else if (mode === 'bottom') {
                targetList.splice(sortIndex + 1, 0, sourceData);
            }
        } else if (mode === 'inside') {
            // 插到里面
            parent_id = targetKey;
            let tlist = getChildList(targetKey);
            tlist = tlist.filter((item) => item.operator_id !== sourceKey);
            const tData = { ...sourceData, parent_id: targetKey };
            tlist.splice(0, 0, tData);
            targetList = tlist;
        }

        // 重新生成sort
        targetList = targetList.map((targetInfo, index) => ({
            ...targetInfo,
            sort: index + 1,
        }));

        return targetList || [];
    };

    return {
        handleNodeDragEnd,
    };
};

export default useNodeSort;
