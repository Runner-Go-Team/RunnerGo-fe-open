import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import { Scale } from 'adesign-react';
import GenerateCode from '@pages/components/GenerateCode';
import ResquestPanel from '@busModules/Request/requestPanel';
import ResponsePanel from '@busModules/response/responsePanel';
import InfoPanel from './infoPanel';
import UrlPanel from './urlPanel';
import BottomPanel from './bottomPanel';
import './index.less';

const { ScaleItem, ScalePanel } = Scale;
const defaultLayouts = {
    0: {
        width: 312,
        height: 200,
    },
    1: {
        flex: 1,
    },
};

const ApiExample = (props) => {
    const { APIS_TAB_DIRECTION } = useSelector((store) => store?.user?.config);

    const { data } = props;
    const refPanel = useRef(null);

    // 修改默认layouts
    const setDefaultLayouts = () => {
        const panelWidth = refPanel.current?.offsetWidth;
        const panelHeight = refPanel.current?.offsetHeight - 104;
        if (APIS_TAB_DIRECTION > 0) {
            defaultLayouts[0].width = panelWidth / 2;
            delete defaultLayouts[0].height;
        } else {
            defaultLayouts[0].height = panelHeight / 2;
            delete defaultLayouts[0].width;
        }
    };

    const [apiLayouts, setApiLauouts] = useState(defaultLayouts);
    const [showMiniReqScreen, setShowMiniReqScreen] = useState(false);
    const [showMiniResScreen, setShowMiniResScreen] = useState(false);
    const resetScreen = () => {
        setApiLauouts(cloneDeep(defaultLayouts));
        setShowMiniReqScreen(false);
        setShowMiniResScreen(false);
    };

    useEffect(() => {
        setDefaultLayouts();
        resetScreen();
    }, [APIS_TAB_DIRECTION]);

    // 调整scale
    const handleLayoutsChange = (layouts, panelOffset) => {
        setApiLauouts(layouts);
        const panelWidth = panelOffset.width || 0;
        const panelHeight = panelOffset.height || 0;
        const itemWidth = layouts[0].width || 0;
        const itemHeight = layouts[0].height || 0;
        if (APIS_TAB_DIRECTION > 0 && itemWidth) {
            // 左右分屏
            const rightWidth = panelWidth - itemWidth;
            // 左侧screen
            if (itemWidth <= 40) {
                if (!showMiniReqScreen) setShowMiniReqScreen(true);
            } else if (showMiniReqScreen) setShowMiniReqScreen(false);
            // 右侧screen
            if (rightWidth <= 40) {
                if (!showMiniResScreen) setShowMiniResScreen(true);
            } else if (showMiniResScreen) setShowMiniResScreen(false);
        } else {
            // 上下分屏
            const bottomHeight = panelHeight - itemHeight;
            // 上部screen
            if (itemHeight <= 40) {
                if (!showMiniReqScreen) setShowMiniReqScreen(true);
            } else if (showMiniReqScreen) setShowMiniReqScreen(false);
            // 底部screen
            if (bottomHeight <= 40) {
                if (!showMiniResScreen) setShowMiniResScreen(true);
            } else if (showMiniResScreen) setShowMiniResScreen(false);
        }
    };
    const [codeVisible, setCodeVisible] = useState(false);

    return (
        <div ref={refPanel} style={{ height: '100%' }}>
            <div className="api-manage-header">
                <InfoPanel
                    data={data}
                    showGenetateCode={() => {
                        setCodeVisible(true);
                    }}
                />
                <UrlPanel data={data} />
            </div>
            <div className="api-manage-content">
                <ScalePanel
                    onLayoutsChange={handleLayoutsChange}
                    layouts={apiLayouts}
                    direction={APIS_TAB_DIRECTION > 0 ? 'horizontal' : 'vertical'}
                >
                    <ScaleItem minWidth={40} minHeight={40}>
                        {showMiniReqScreen ? (
                            <div
                                className={cn('scale-toggle-box', { vertical: APIS_TAB_DIRECTION })}
                                onClick={resetScreen}
                            >
                                请求区
                            </div>
                        ) : (
                            <ResquestPanel isExample />
                        )}
                    </ScaleItem>
                    <ScaleItem enableScale={false} minWidth={40} minHeight={40}>
                        {showMiniResScreen ? (
                            <div
                                className={cn('scale-toggle-box', { vertical: APIS_TAB_DIRECTION })}
                                onClick={resetScreen}
                            >
                                响应区
                            </div>
                        ) : (
                            <ResponsePanel />
                        )}
                    </ScaleItem>
                </ScalePanel>
            </div>
            <BottomPanel />
            {codeVisible && (
                <GenerateCode
                    onCancel={() => {
                        setCodeVisible(false);
                    }}
                ></GenerateCode>
            )}
        </div>
    );
};

export default ApiExample;
