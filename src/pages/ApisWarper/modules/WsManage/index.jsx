import React, { useState, useEffect, useRef } from "react";
import './index.less';
import WsHeader from "./WsHeader";
import WsRequest from "./WsRequest";
import WsResponse from "./WsResponse";
import ScalePanelTwoItem from "@components/ScalePanelTwoItem";

const WsManage = (props) => {
    const { data = {}, onChange } = props;
    const scaleRef = useRef(null);
    const wrapperRef = useRef(null);

    return (
        <div className="ws-manage">
            <WsHeader data={data} onChange={onChange} />
            <div style={{ flex: 1, overflow: 'overlay' }} ref={wrapperRef}>
                <ScalePanelTwoItem
                    ref={scaleRef}
                    direction={-1}
                    refWrapper={wrapperRef}
                    leftMin={<></>}
                    left={
                        <WsRequest data={data} onChange={onChange} />
                    }
                    rightMin={<></>}
                    right={
                        <WsResponse />
                    }
                />
            </div>
        </div>
    )
};

export default WsManage;