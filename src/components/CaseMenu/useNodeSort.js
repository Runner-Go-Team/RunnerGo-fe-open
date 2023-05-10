import { useSelector, useDispatch } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
// import { Collection } from '@indexedDB/project';
import { of } from 'rxjs';
import { tap, filter, map, switchMap } from 'rxjs/operators';
import isArray from 'lodash/isArray';
import { pushTask } from '@asyncTasks/index';
import Bus from '@utils/eventBus';

const useNodeSort = (props) => {
    // const { treeData } = props;
    const dispatch = useDispatch();
    const data = useSelector((store) => store.case.case_menu);
    const treeData = useSelector((store) => store.case.case_menu);
    const project_id = useSelector((store) => store?.workspace?.CURRENT_PROJECT_ID);

    const flattenNodes = [];
    treeData && Object.entries(treeData).forEach(([case_id, value]) => {
        flattenNodes.push({
            ...value,
            case_id,
        });
    });

    // 获取全部父级id列表
    const getParentKeys = (nodeItem) => {
        const results = [];
        const digAll = (node) => {
            const parent = treeData[node.parent_id];
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
        return Object.values(treeData)
            .filter((d) => d?.parent_id === parent_id)
            .sort((a, b) => a.sort - b.sort);
    };

    const handleNodeDragEnd = (
        sourceKey,
        targetKey,
        mode
    ) => {
        const sourceData = treeData[sourceKey];
        // const sourceData = treeData.filter(item => item.case_id === sourceKey)[0];
        const targetData = treeData[targetKey];
        // const targetData = treeData.filter(item => item.case_id === targetKey)[0];

        let parent_id = '-1';

        let targetList = getChildList(targetData?.parent_id);

        // 禁止父节点拖动到子节点
        const targetParentKeys = getParentKeys(targetData);
        if (targetParentKeys.includes(sourceKey) || sourceKey === targetKey) {
            return;
        }
        // 不是目录禁止拖进去
        if (mode === 'inside' && (targetData?.target_type !== 'folder' && targetData.target_type !== 'group')) {
            return;
        }

        // 插到上面还是插到下面
        if (mode === 'top' || mode === 'bottom') {
            targetList = targetList.filter((item) => `${item.case_id}` !== `${sourceKey}`);
            sourceData.parent_id = targetData.parent_id;
            parent_id = targetData.parent_id;

            // 被拖进目标序号
            let sortIndex = 0;
            targetList.forEach((item, index) => {
                if (`${item.case_id}` === `${targetKey}`) {
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
            tlist = tlist.filter((item) => item.case_id !== sourceKey);
            const tData = { ...sourceData, parent_id: targetKey };
            tlist.splice(0, 0, tData);
            targetList = tlist;
        }

        // 重新生成sort
        targetList = targetList.map((targetInfo, index) => ({
            ...targetInfo,
            sort: index + 1,
        }));

        const result = {
            task_id: `${project_id}/${parent_id}`,
            parent_id,
            project_id,
            sort_target: sourceKey,
            target_info: targetList.map(({ parent_id, sort, case_id }) => ({
                parent_id,
                sort,
                case_id,
            })),
        };



        of('')
            .pipe(
                tap(() => {
                    // 更新redux
                    const newDatas = cloneDeep(data);
                    targetList.forEach((item) => {
                        newDatas[item.case_id] = {
                            ...newDatas[item.case_id],
                            sort: item.sort,
                            parent_id,
                        };

                    });
                    dispatch({
                        type: 'case/updateCaseMenu',
                        payload: { ...newDatas },
                    });

                }),
                tap(() => {
                    const ids = [];
                    for (let i = 0; i < targetList.length; i++) {
                        ids.push(targetList[i].case_id);
                    }

                    Bus.$emit('dragUpdateCase', {
                        ids,
                        targetList
                    })
                })
            )
            .subscribe();
    };

    return {
        handleNodeDragEnd,
    };
};

export default useNodeSort;
