import React from 'react';
import { Message, Modal } from 'adesign-react';
import { useDispatch } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Bus from '@utils/eventBus';
import cloneDeep from 'lodash/cloneDeep';
import { isArray } from 'lodash';
import TabItem from './tabItem';
import { global$ } from '@hooks/useGlobal/global';
import { useTranslation } from 'react-i18next';

const SortableItem = SortableElement(({ activeTabId, onTabChange, item, handleCloseItem }) => {
    return <TabItem {...{ activeTabId, onTabChange, item, handleCloseItem }} />;
});

const SortableList = SortableContainer(
    ({ tabItemList, activeTabId, onTabChange, handleCloseItem }) => {
        return (
            <div className="api-sortable-warper">
                {tabItemList?.map((item, index) => (
                    <SortableItem
                        key={item.id}
                        {...{
                            item,
                            index,
                            activeTabId,
                            onTabChange,
                            handleCloseItem,
                        }}
                    />
                ))}
            </div>
        );
    }
);

const HeadTabs = (props) => {
    const { tabItemList, activeTabId, onTabChange, onRemoveTabItem } = props;
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleCloseItem = (item, e) => {
        e.stopPropagation();
        if (item?.ifChanged && item?.ifChanged > 0) {
            Modal.confirm({
                title: t('apis.tips'),
                content: t('apis.closeConfirm'),
                okText: t('apis.saveAndClose'),
                diyText: t('apis.notSave'),
                cancelText: t('btn.cancel'),
                onDiy: async () => {
                    onRemoveTabItem(item.id);
                },
                onOk: () => {
                    Bus.$emit('saveTargetById', {
                        id: item.id,
                        callback: (code, id) => {
                            console.log(id);
                            onRemoveTabItem(id, id);
                        },
                    }, {}, (code) => {
                        if (code === 0) {
                            Message('success', t('message.saveSuccess'));
                        } else {
                            Message('error', t('message.saveError'));
                        }
                    });
                },
            });
        } else {
            onRemoveTabItem(item.id);
        }
    };

    const handleItemSortEnd = (params) => {
        console.log(params, tabItemList);
        const { oldIndex, newIndex } = params;
        const tempList = cloneDeep(tabItemList);
        const sourceData = tempList[oldIndex];
        console.log(sourceData, oldIndex, newIndex);
        tempList.splice(oldIndex, 1);
        console.log(tempList);
        tempList.splice(newIndex, 0, sourceData);
        console.log(tempList);

        const newOpenApiData = {};

        if (isArray(tempList)) {
            tempList.forEach((item) => {
                newOpenApiData[item.id] = item?.data;
            });
        }
        console.log(newOpenApiData);
        dispatch({
            type: 'opens/coverOpenApis',
            payload: newOpenApiData,
        });
    };

    return (
        <>
            <SortableList
                {...{
                    tabItemList,
                    axis: 'x',
                    lockAxis: 'x',
                    distance: 2,
                    onSortEnd: handleItemSortEnd,
                    helperClass: 'is-sorting',
                    activeTabId,
                    onTabChange,
                    handleCloseItem,
                }}
            />
        </>
    );
};

export default HeadTabs;
