import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ResizeObserver from 'resize-observer-polyfill';
import { Collapse as Col, Scale } from 'adesign-react';
import cn from 'classnames';
import ResquestPanel from '@components/Request/requestPanel';
import ResponsePanel from '@components/response/responsePanel';
import MockExpectPanel from '@components/MockExpectPanel'

import { ApisContentWarper } from './style';
import { useTranslation } from 'react-i18next';

const { ScaleItem, ScalePanel } = Scale;
const { CollapseItem, Collapse } = Col;
const MIN_SIZE = 40; // 最小化宽度或高度
const MIN_CONTENT_SIZE = 200; // 内容区域宽度不足时最小化

const ApisContent = (props) => {
    const { data, onChange, from = 'apis', showAssert } = props;

    // 展示方向 1.水平 -1 上下
    const { APIS_TAB_DIRECTION } = useSelector((store) => store?.user?.config);
    const open_res = useSelector((store) => store?.mock?.open_res) || {};
    const open_api_now = useSelector((store) => store?.mock?.open_api_now);
    const refContainer = useRef(null);

    const [contentLayouts, setContentLayouts] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        refContainer.current = null;
        const resizeObserver = new ResizeObserver((entries, observer) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (refContainer.current === null) {
                    if (APIS_TAB_DIRECTION > 0) {
                        setContentLayouts({
                            0: { width: width / 2, flex: 1 },
                            1: { flex: 1, width: 0 },
                        });
                    } else {
                        setContentLayouts(height > 0 ? {
                            0: { height: height / 2 },
                            1: { height: height / 2, },
                        } : {
                            0: { height: 300 },
                            1: { flex: 1 },
                        });
                    }
                }
                refContainer.current = { width, height };
            }
        });
        resizeObserver.observe(refWrapper?.current);
        return () => {
            resizeObserver.disconnect();
        };
    }, [APIS_TAB_DIRECTION]);



    const refWrapper = useRef(null);

    const handleLayoutsChange = (newLayouts) => {
        // 水平方向
        if (APIS_TAB_DIRECTION > 0) {
            if (newLayouts[0].width < MIN_CONTENT_SIZE) {
                // 宽度被压缩时
                setContentLayouts({
                    0: { width: MIN_SIZE },
                    1: { flex: 1, width: 0 },
                });
            } else if (newLayouts[0].width > refContainer.current.width - MIN_CONTENT_SIZE) {
                // 宽度超出剩余内容时
                setContentLayouts({
                    0: { flex: 1, width: 0 },
                    1: { width: MIN_SIZE },
                });
            } else {
                setContentLayouts({
                    0: { width: newLayouts[0].width },
                    1: { flex: 1, width: 0 },
                });
            }
        }

        // 上下方向
        if (APIS_TAB_DIRECTION !== 1) {
            if (newLayouts[0].height < MIN_CONTENT_SIZE) {
                // 高度被压缩时
                setContentLayouts({
                    0: { height: MIN_SIZE },
                    1: { height: refContainer.current.height - MIN_SIZE },
                });
            } else if (newLayouts[0].height > refContainer.current.height - MIN_CONTENT_SIZE) {
                // 宽度超出剩余内容时
                setContentLayouts({
                    0: { height: refContainer.current.height - MIN_SIZE },
                    1: { height: MIN_SIZE },
                });
            } else {
                setContentLayouts({
                    0: { height: newLayouts[0].height },
                    1: { height: refContainer.current.height - newLayouts[0].height },
                });
            }
        }
    };

    const handleResetLayouts = () => {
        if (APIS_TAB_DIRECTION > 0) {
            setContentLayouts({
                0: { width: refContainer.current.width / 2 },
                1: { flex: 1, width: 0 },
            });
        } else {
            setContentLayouts({
                0: { height: refContainer.current.height / 2 },
                1: { height: refContainer.current.height / 2 },
            });
        }
    };

    const leftMiniMode =
        (APIS_TAB_DIRECTION > 0 && contentLayouts?.[0]?.width === MIN_SIZE) ||
        (APIS_TAB_DIRECTION !== 1 && contentLayouts?.[0]?.height === MIN_SIZE);

    const rightMiniMode =
        (APIS_TAB_DIRECTION > 0 && contentLayouts?.[1]?.width === MIN_SIZE) ||
        (APIS_TAB_DIRECTION !== 1 && contentLayouts?.[1]?.height === MIN_SIZE);


    return (
        <ApisContentWarper ref={refWrapper} style={{ marginTop: '2px' }}>

            <Collapse defaultActiveKey={["request", 'expects', "response"]} style={{ height: '100%', width: '100%', border: 'none' }}>
                <CollapseItem name="request" header="请求区">
                    <ResquestPanel from={from} data={data || {}} onChange={onChange} showAssert={showAssert} />
                </CollapseItem>

                <CollapseItem name="expects" header="Mock响应期望  ">
                    <MockExpectPanel
                        value={data?.expects || []}
                        onChange={(val) => onChange('expects', val)}
                    />
                </CollapseItem>

                <CollapseItem headerClassName='mock-response' name="response" header="响应区">
                    <ResponsePanel
                        data={data || {}}
                        resData={open_res?.[open_api_now] || {}}
                        from='mock'
                        showAssert={showAssert}
                        onChange={()=>{}}
                    />
                </CollapseItem>
            </Collapse>

        </ApisContentWarper>
    );
};

export default ApisContent;
