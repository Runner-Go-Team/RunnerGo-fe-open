import React, { useState, useRef, useMemo, useCallback } from 'react';
import './index.less';
import { Button, Tabs as TabComponents } from 'adesign-react';
import {
    CaretLeft as SvgCaretLeft,
    CaretRight as SvgCaretRight,
    Mock as SvgMock,
} from 'adesign-react/icons';
import { isFunction, isUndefined } from 'lodash';
import Bus from '@utils/eventBus';
import AddMenu from './addMenu';
import MoreMenu from './moreMenu';
import HeadTabs from './headTabs';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

const { Tabs, TabPan } = TabComponents;
const ApiTabs = (props) => {
    const {
        defaultTabId,
        apiList = [],
        setApiList = () => undefined,
        onChange = () => undefined,
        onRemoveTab = () => undefined,
        contentRender = () => undefined,
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [activeId, setActiveId] = useState(defaultTabId);
    const mergedActiveId = 'defaultTabId' in props ? defaultTabId : activeId;
    const activeIndex = useMemo(() => {
        let newIndex = -1;
        apiList.forEach((item, index) => {
            if (item.id === parseInt(mergedActiveId)) {
                newIndex = index;
            }
        });
        return newIndex;
    }, [mergedActiveId, apiList.length]);

    const handleRemoveTabItem = (id, api_now) => {
        if (isFunction(onRemoveTab)) {
            onRemoveTab(id, api_now);
        } else {
            const newList = apiList.filter((d) => d.id !== id);
            let newActiveId = '';
            const tabIndex = apiList.reduce(
                (a, b, index) => (b.id === id ? index : a),
                -1
            );
            if (tabIndex === -1) {
                return;
            }
            if (id === mergedActiveId) {
                if (tabIndex < apiList.length - 1) {
                    // 如果tabindex不是最后一个，则把下一个设为选中态
                    newActiveId = apiList.find((d, index) => index === tabIndex + 1)?.id || '';
                } else {
                    // 前一个设为选中态
                    newActiveId = apiList.find((d, index) => index === tabIndex - 1)?.id || '';
                }
                setActiveId(newActiveId);
                onChange(newActiveId);
            }
            setApiList([...newList]);
        }
    };

    const apiTabsRef = useRef(null);

    const handleMoveLeft = () => {
        apiTabsRef.current.handleMoveLeft();
    };

    const handleMoveRight = () => {
        apiTabsRef.current.handleMoveRight();
    };

    const handleTabChange = useCallback((newActiveId) => {
        onChange(newActiveId);
    }, []);

    const HeadTabsList = (
        <HeadTabs
            {...{
                tabItemList: apiList,
                activeTabId: mergedActiveId,
                onTabChange: handleTabChange,
                onRemoveTabItem: handleRemoveTabItem,
            }}
        />
    );

    const renderHeaderPanel = ({ renderScrollItems = () => { }, handleMouseWheel }) => {
        return (
            apiList.length ? <div className="apipost-tabs-header" onWheel={handleMouseWheel}>
                {renderScrollItems(HeadTabsList)}
                <div className="extra-panel">
                    <AddMenu />
                    <MoreMenu />
                    <Button size="mini" onClick={handleMoveLeft}>
                        <SvgCaretLeft width="16px" height="16px" />
                    </Button>
                    <Button size="mini" onClick={handleMoveRight}>
                        <SvgCaretRight width="16px" height="16px" />
                    </Button>
                </div>
            </div> : <></>
        );
    };

    const emptyContent = (
        <div className="welcome-page">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="newTarget" style={{ justifyContent: 'flex-start' }}>
                    <Button
                        type="primary"
                        onClick={() => {
                            Bus.$emit('mock/addOpenItem');
                        }}
                    >
                        <SvgMock />
                        <h3>{t('mock.createMock')}</h3>
                    </Button>
                </div>
            </div>
        </div>
    );
    return (
        <>
            <Tabs
                type="card"
                ref={apiTabsRef}
                activeIndex={parseInt(activeIndex)}
                className="mock-service-api-manage-wrapper"
                headerAutoScroll
                onChange={handleTabChange}
                onRemoveTab={handleRemoveTabItem}
                activeId={mergedActiveId}
                headerRender={renderHeaderPanel}
                itemWidth={150}
                emptyContent={emptyContent}
                contentRender={contentRender}
            >
                {apiList.map((item) => (
                    <TabPan key={item.id} id={item.id} {...item} removable></TabPan>
                ))}
            </Tabs>
            {/* <FooterToolbar /> */}
        </>
    );
};

export default ApiTabs;
