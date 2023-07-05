import React from 'react';
import { cloneDeep, isUndefined } from 'lodash';

const useMenuTreeData = (props) => {
    const { filterParams, selectedKeys, treeData } = props;

    // 被过滤后的目录菜单列表，平级结构，不带children，parent属性
    const filteredTreeList = React.useMemo(() => {
        // return treeData instanceof Array ? treeData : [];
        if (treeData === undefined) {
            return [];
        }
        const { key, status = 'all' } = filterParams;
        const sourceData = cloneDeep(treeData);
        const newList = {};
        Object.entries(sourceData).forEach(([target_id, data]) => {
            const includeUrl = `${data?.url}`.toLowerCase().indexOf(key.toLowerCase()) !== -1;
            const includeName =
                key === '' || `${data?.name}`.toLowerCase().indexOf(key.toLowerCase()) !== -1;
            if (
                (includeName === true || includeUrl === true) &&
                (data.mark === status || status === 'all')
            ) {
                newList[target_id] = data;
                let parent = sourceData[data.parent_id];
                while (parent !== undefined && newList[parent.target_id] !== parent) {
                    newList[parent.target_id] = parent;
                    parent = sourceData[parent.parent_id];
                }
            }
        });
        const dataList = [];
        Object.entries(newList).forEach(([target_id, data]) => {
            dataList.push({
                ...data,
                target_id,
            });
        });

        return dataList;
    }, [treeData, filterParams]);

    // 被过滤后的树形菜单对象，带children
    const filteredTreeData = React.useMemo(() => {
        const newTreeData = {};
        const dataList = cloneDeep(filteredTreeList);
        dataList && dataList.forEach((item) => {
            if (!isUndefined(item.target_id)) {
                newTreeData[item.target_id] = item;
            }
        });
        for (const item of dataList) {
            const parent = newTreeData[item.parent_id];
            if (parent !== undefined) {
                if (isUndefined(parent?.children)) {
                    parent.children = [];
                }
                parent.children.push(item);
            }
        }
        return newTreeData;
    }, [filteredTreeList]);

    // 根据含有children属性的数组，获取几点本身及下级全部target_id列表
    const getSelfNodeAndChildKeys = (treeData, nodeKey) => {
        const list = [];
        const digAllNodes = (treeNode) => {
            list.push(treeNode.target_id);
            if (treeNode.target_type === 'folder' && Array.isArray(treeNode.children)) {
                const childList = treeNode.children.sort((a, b) => a.sort - b.sort);
                for (const childItem of childList) {
                    digAllNodes(childItem);
                }
            }
        };
        digAllNodes(treeData[nodeKey]);
        return list;
    };

    // 当前被选中的节点列表
    const selectedNewTreeData = React.useMemo(() => {
        const newTree = [];
        let sort = 0;
        for (const itemKey of selectedKeys) {
            const selectedItem = filteredTreeData[itemKey];
            if (isUndefined(selectedItem)) {
                continue;
            }
            let parent = filteredTreeData[selectedItem?.parent_id];

            // 父对象不为空，并且父对象target_id未在selectedKeys中
            while (
                !isUndefined(parent?.target_id) &&
                !selectedKeys.includes(parent?.target_id) &&
                parent !== filteredTreeData[parent.parent_id]
            ) {
                parent = filteredTreeData[parent.parent_id];
            }
            const { children, ...newItem } = selectedItem;

            // item为最顶层
            if (isUndefined(parent)) {
                newTree.push({ ...newItem, parent_id: '0', sort });
            } else {
                newTree.push({ ...newItem, parent_id: parent.target_id, sort });
            }
            sort++;
        }
        return newTree;
    }, [selectedKeys, filteredTreeData]);

    return {
        filteredTreeList,
        filteredTreeData,
        getSelfNodeAndChildKeys,
        selectedNewTreeData,
    };
};
export default useMenuTreeData;
